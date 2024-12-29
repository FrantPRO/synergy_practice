from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .auth import get_user_id, admin
from ..database import get_db
from ..models.response import Response
from ..models.survey import Survey
from ..schemas.response import ResponseSchema
from ..schemas.survey import SurveyCreate, SurveyUpdate, SurveyOut

router = APIRouter(prefix="/surveys", tags=["Surveys"])


@router.get("/", response_model=List[SurveyOut], dependencies=[Depends(admin)])
def read_surveys(db: Session = Depends(get_db)):
    surveys = db.query(Survey).all()
    return surveys


@router.post("/", dependencies=[Depends(admin)])
def create_survey(data: SurveyCreate, db: Session = Depends(get_db)):
    survey = Survey()
    survey.name = data.name,
    survey.description = data.description,
    survey.questions = data.questions

    db.add(survey)
    db.commit()
    db.refresh(survey)
    return survey


@router.get("/{survey_id}", response_model=SurveyOut)
def get_survey(survey_id: int, db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    return survey


@router.put("/{survey_id}", response_model=SurveyOut, dependencies=[Depends(admin)])
def update_survey(survey_id: int, survey_data: SurveyUpdate,
                  db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    for key, value in survey_data.dict(exclude_unset=True).items():
        setattr(survey, key, value)

    db.commit()
    db.refresh(survey)

    return survey


@router.delete("/{survey_id}", status_code=204, dependencies=[Depends(admin)])
def delete_survey(survey_id: int, db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    db.delete(survey)
    db.commit()
    return


@router.get("/{survey_id}/responses", response_model=List[ResponseSchema])
def read_survey_responses(survey_id: int, db: Session = Depends(get_db),
                          user_id: int = Depends(get_user_id)):
    survey_responses = (
        db.query(Response.response)
        .filter(Response.survey_id == survey_id)
        .filter(Response.user_id == user_id)
        .all()
    )
    return [r[0] for r in survey_responses]


@router.get("/{survey_id}/responses/{response_id}",
            response_model=ResponseSchema)
def read_survey_responses(survey_id: int, response_id: int,
                          db: Session = Depends(get_db)):
    response = db.query(Response).filter(Response.id == response_id).first()
    return response


@router.post("/{survey_id}/responses", response_model=ResponseSchema)
def create_survey_responses(
    survey_id: int,
    response_data: ResponseSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id)
):
    response = Response()
    response.survey_id = survey_id
    response.user_id = user_id
    response.response = response_data.model_dump(exclude_unset=True)

    db.add(response)
    db.commit()
    db.refresh(response)
    return response
