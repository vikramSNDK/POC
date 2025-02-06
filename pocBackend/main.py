from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import db
import modals

app=FastAPI()

# origins = [
#     "http://localhost:4200",
#     "http://localhost",
# ]

#CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],#origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/")
# def getData():
#     # print("Get Students with page no. : ${pageno} and page size : ${pageSize}")
#     return db.getAll()


@app.get("/")
def get_data():
    return db.getAll()


@app.post("/create")
async def create(data:modals.student):
    data=dict(data)
    print(data)
    id=db.create(data)
    return {"inserted":"true","inserted_id":id}

@app.delete("/delete")
def delete(student_list: List[modals.student]):
    print(student_list)
    student_dict=[dict(stu) for stu in student_list]
    response=db.delete(student_dict)
    return {"Response":response}

@app.put("/update/{roll_no}")
def update(roll_no: int,data: modals.student):
    return db.update(roll_no,data)
