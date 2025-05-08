# -------- Stage 1: Testing --------
    FROM python:3.9 AS test

    WORKDIR /code
    
    COPY / /code/
    COPY requirements.txt /code/
    
    RUN pip install --no-cache-dir -r requirements.txt
    
    # Run tests
    WORKDIR /code/
    RUN pytest -v
    
    # -------- Stage 2: Final --------
    FROM python:3.9 AS final
    
    WORKDIR /code
    
    # Copy only if tests succeeded
    COPY --from=test /code /code
    
    EXPOSE 8000
    
    CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    