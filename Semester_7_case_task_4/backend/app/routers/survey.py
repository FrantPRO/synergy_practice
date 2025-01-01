from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .auth import admin
from ..database import get_db
from ..models.survey import Survey
from ..schemas.survey import SurveyCreate, SurveyUpdate, SurveyOut

router = APIRouter(prefix="/surveys", tags=["Surveys"])


@router.get("/", response_model=List[SurveyOut])
def read_surveys(db: Session = Depends(get_db)):
    surveys = db.query(Survey).all()
    return surveys


@router.post("/", dependencies=[Depends(admin)], response_model=SurveyOut, status_code=201)
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
