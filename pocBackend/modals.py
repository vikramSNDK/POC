from pydantic import BaseModel

class student(BaseModel):
    Roll_no: int
    Name: str
    Age: int
    Year: int
