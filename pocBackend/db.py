from fastapi import HTTPException
import pymongo

mongoURI="mongodb://mongo:27017"#"mongodb://localhost:27017"

client=pymongo.MongoClient(mongoURI)

db=client["studentDb"]

collection=db["students"]

collection.create_index([('Roll_no', 1)], unique=True)

def get_last_roll_no():
    last_document = collection.find_one({}, sort=[("Roll_no", -1)])
    return last_document["Roll_no"] if last_document else 0

def create(data: dict):
    roll=get_last_roll_no()
    data["Roll_no"]=roll+1
    print(data)
    response=collection.insert_one(data)
    print(data)
    return str(response.inserted_id)

def getAll():
    # skip_count=page*size
    data=[]
    response=collection.find({})#.skip(skip_count).limit(size)
    for i in response:
        i["_id"]=str(i["_id"])
        data.append(i)
    return data

def delete(student_list):
    delete_count=0
    for stu in student_list:
        res=collection.delete_many({"Roll_no": stu["Roll_no"]})
        delete_count+=res.deleted_count
    return f"Deletion Completed for {delete_count} documents"

def update(roll_no, data):
    print(roll_no)
    print(data)
    data=dict(data)
    result=collection.update_one({"Roll_no": roll_no}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {"Data updated for Roll no.":roll_no}