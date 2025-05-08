import pytest

def test_create_and_get_task(test_client):
    """Test creating a task and then retrieving it"""
    # 1. Create a new task
    response = test_client.post(
        "/addtasks",
        json={"name": "Test task"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert data["name"] == "Test task"

    response = test_client.get("/tasks")
    assert response.status_code == 200
    data = response.json()
    assert "tasks" in data
    assert len(data["tasks"]) == 1
    assert data["tasks"][0]["name"] == "Test task"

def test_remove_task(test_client):
    test_client.post("/addtasks", json={"name": "Task to delete"})
    
    response = test_client.get("/tasks")
    assert response.status_code == 200
    assert len(response.json()["tasks"]) == 1

    response = test_client.post("/removetasks", json={"index": 1})
    assert response.status_code == 200
    assert "message" in response.json()
    assert "removed successfully" in response.json()["message"]
    
    response = test_client.get("/tasks")
    assert response.status_code == 200
    assert len(response.json()["tasks"]) == 0

def test_remove_nonexistent_task(test_client):
    response = test_client.post("/removetasks", json={"index": 999})
    assert response.status_code == 200
    assert "message" in response.json()
    assert "not found" in response.json()["message"]


def test_empty_tasks_list(test_client):
    response = test_client.get("/tasks")
    assert response.status_code == 200
    assert response.json() == {"tasks": []}