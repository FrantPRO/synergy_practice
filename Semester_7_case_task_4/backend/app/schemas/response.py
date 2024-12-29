from datetime import datetime
from typing import List

from pydantic import BaseModel


class ResponseSchema(BaseModel):
    response: List[dict]

    class Config:
        from_attributes = True
