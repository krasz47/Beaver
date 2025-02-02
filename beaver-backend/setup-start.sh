python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

uvicorn index:app --reload --host 0.0.0.0 --port 5000