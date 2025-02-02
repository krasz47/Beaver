@echo off
python -m venv .venv && .\.venv\Scripts\activate && pip install -r requirements.txt && uvicorn index:app --reload --host 0.0.0.0 --port 5000