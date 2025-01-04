from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from .routers.auth import router as auth_router, create_first_user, \
    authentication
from .routers.user import router as user_router

from .routers.category import router as category_router
from .routers.transaction import router as transaction_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        create_first_user()
        yield
    finally:
        pass


app = FastAPI(
    title="MoneyFlow API",
    description="API for accounting expenses and income app.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router, dependencies=[Depends(authentication)])
app.include_router(category_router, dependencies=[Depends(authentication)])
app.include_router(transaction_router, dependencies=[Depends(authentication)])

def main():
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        log_level="info",
        # log_level="debug",
        reload=True,
    )


if __name__ == "__main__":
    main()
