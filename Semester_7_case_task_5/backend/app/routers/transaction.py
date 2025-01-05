import csv
import io
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from .auth import get_user_id
from ..database import get_db
from ..models.transaction import Transaction
from ..schemas.transaction import TransactionCreate, TransactionOut, \
    TransactionUpdate

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)


@router.post("/", response_model=TransactionOut)
def create_transaction(transaction: TransactionCreate,
                       db: Session = Depends(get_db)):
    db_transaction = Transaction(**transaction.model_dump())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


@router.get("/export")
def export_transactions(db: Session = Depends(get_db),
                        user_id: int = Depends(get_user_id)):
    transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == user_id)
        .all()
    )

    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found")

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(
        ["id", "amount", "category_id", "description", "type", "date"]
    )

    for transaction in transactions:
        writer.writerow([
            transaction.id,
            transaction.amount,
            transaction.category_id,
            transaction.description,
            transaction.type,
            transaction.date.isoformat(),
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=transactions.csv"}
    )


@router.post("/import")
def import_transactions(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id)
):
    content = file.file.read().decode("utf-8")
    csv_reader = csv.DictReader(io.StringIO(content))

    transactions = []
    for row in csv_reader:
        try:
            transaction = Transaction(
                amount=float(row["amount"]),
                category_id=int(row["category_id"]),
                description=row["description"],
                type=row["type"],
                date=datetime.fromisoformat(row["date"]),
                user_id=user_id,
            )
            transactions.append(transaction)
        except (KeyError, ValueError) as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid CSV data: {str(e)}"
            )

    db.add_all(transactions)
    db.commit()

    return {
        "message": f"{len(transactions)} transactions imported successfully"
    }


@router.get("/", response_model=List[TransactionOut])
def get_transactions(db: Session = Depends(get_db),
                     user_id: int = Depends(get_user_id)):
    return db.query(Transaction).filter(Transaction.user_id == user_id).all()


@router.get("/{transaction_id}", response_model=TransactionOut)
def get_transaction_by_id(transaction_id: int, db: Session = Depends(get_db),
                          user_id: int = Depends(get_user_id)):
    return (db.query(Transaction)
            .filter(Transaction.id == transaction_id)
            .filter(Transaction.user_id == user_id)
            .first())


@router.put("/{transaction_id}", response_model=TransactionOut)
def update_transaction(
    transaction_id: int, transaction_data: TransactionUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id)
):
    transaction = (db.query(Transaction)
                   .filter(Transaction.id == transaction_id)
                   .filter(Transaction.user_id == user_id)
                   .first())
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    for key, value in transaction_data.model_dump(exclude_unset=True).items():
        setattr(transaction, key, value)

    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=204)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    response = db.query(Transaction).filter(
        Transaction.id == transaction_id).first()
    if not response:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(response)
    db.commit()
    return
