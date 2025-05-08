import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import sqlite3

DATABASE_URL = "tasks.db"

def create_db_table():
    conn = sqlite3.connect(DATABASE_URL)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL
                    )
    """)
    conn.commit()
    conn.close()

create_db_table()

def get_db():
    db = sqlite3.connect(DATABASE_URL)
    db.row_factory = sqlite3.Row
    try:
        yield db
    finally:
        db.close()

class Task(BaseModel):
    name: str

class Tasks(BaseModel):
    tasks: List[Task]

class TaskIndex(BaseModel):
    index: int

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.get("/tasks",response_model=Tasks)
def get_tasks(db:sqlite3.Connection=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT id,name FROM tasks ORDER BY id")
    tasks = [Task(id=row["id"], name=row["name"]) for row in cursor.fetchall()]
    return Tasks(tasks = tasks)

@app.post("/addtasks", response_model=Task)
def add_task(task: Task, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO tasks(name) VALUES (?)", (task.name,))
    db.commit()
    task_id = cursor.lastrowid
    return Task(id=task_id,name=task.name)

@app.post("/removetasks")
def remove_task(task_index: TaskIndex,  db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT id FROM tasks ORDER BY id")
    task_ids = [row["id"] for row in cursor.fetchall()]
    if 1 <= task_index.index <= len(task_ids):
        task_id_to_delete = task_ids[task_index.index - 1]
        cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id_to_delete,))
        db.commit()
        return {"message": f"Task at user index {task_index.index} removed successfully"}
    else:
        return {"message": f"Task at user index {task_index.index} not found"}
if __name__ == "__main__":
    uvicorn.run(app,host="0.0.0.0",port=8000)
