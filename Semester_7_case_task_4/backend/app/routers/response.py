from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .auth import get_user_id, admin, is_user_admin, authentication
from ..database import get_db
from ..models.response import Response
from ..models.survey import Survey
from ..schemas.response import ResponseOut, ResponseCreate

router = APIRouter(
    prefix="/responses",
    tags=["Responses"],
    dependencies=[Depends(authentication)],
)


@router.get("/", response_model=List[ResponseOut])
def read_responses(
    survey_id: Optional[int] = None,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id)
):
    query = db.query(Response)

    if survey_id is not None:
        query = query.filter(Response.survey_id == survey_id)

    if not is_user_admin(user_id, db):
        query = query.filter(Response.user_id == user_id)

    responses = query.all()
    return responses


@router.get("/{response_id}", response_model=ResponseOut)
def read_response(
    response_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id)
):
    resp = db.query(Response).filter(Response.id == response_id).first()
    if not resp:
        raise HTTPException(status_code=404, detail="Response not found")

    if not is_user_admin(user_id, db) and resp.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this response"
        )

    return resp


@router.post("/{survey_id}", response_model=ResponseOut)
def create_survey_responses(
    survey_id: int,
    response_data: ResponseCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id)
):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    existing_response = db.query(Response).filter(
        Response.survey_id == survey_id,
        Response.user_id == user_id
    ).first()
    if existing_response:
        raise HTTPException(status_code=400,
                            detail="User has already responded to this survey")

    response = Response(
        survey_id=survey_id,
        user_id=user_id,
        response=response_data.model_dump()["responses"]
    )
    try:
        db.add(response)
        db.commit()
        db.refresh(response)
        return response
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{response_id}", status_code=204, dependencies=[Depends(admin)])
def delete_response(response_id: int, db: Session = Depends(get_db)):
    response = db.query(Response).filter(Response.id == response_id).first()
    if not response:
        raise HTTPException(status_code=404, detail="Response not found")
    db.delete(response)
    db.commit()
    return
