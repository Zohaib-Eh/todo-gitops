import os
import pytest
import sqlite3
from fastapi.testclient import TestClient
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

TEST_DATABASE_URL = "test_tasks.db"

@pytest.fixture(scope="function")
def test_db():
    conn = sqlite3.connect(TEST_DATABASE_URL)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
                )
    """)
    conn.commit()
    conn.close()

    yield TEST_DATABASE_URL
 
    if os.path.exists(TEST_DATABASE_URL):
        os.remove(TEST_DATABASE_URL)

@pytest.fixture(scope="function")
def test_client(monkeypatch, test_db):
    from main import app, get_db
    
    def override_get_db():
        db = sqlite3.connect(test_db)
        db.row_factory = sqlite3.Row
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    
    client = TestClient(app)
    return client