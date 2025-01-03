from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from .routers.survey import router as surveys_router
from .routers.response import router as responses_router
from .routers.auth import router as auth_router, authentication, \
    create_admin_user, admin
from .routers.user import router as user_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        create_admin_user()
        yield
    finally:
        pass

app = FastAPI(
    title="Servey Portal API",
    description="API for surveys web application.",
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

app.include_router(surveys_router, dependencies=[Depends(authentication)])
app.include_router(auth_router)
app.include_router(user_router, dependencies=[Depends(admin)])
app.include_router(responses_router)

def main():
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        # log_level="info",
        log_level="debug",
        reload=True,
    )


if __name__ == "__main__":
    main()
