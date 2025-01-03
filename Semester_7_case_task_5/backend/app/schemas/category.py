from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str


class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class CategoryUpdate(CategoryBase):
    pass
