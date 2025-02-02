from fastapi import FastAPI, HTTPException, File, UploadFile
import openai
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
import base64

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

class CodeRequest(BaseModel):
    nodes: str
    edges: str

@app.post("/generate-code")
async def generate_code(request: CodeRequest):
    try:
        prompt = """
const prompt = `
You are a highly advanced AI trained in software engineering and structured programming. 
Your task is to generate high-quality, well-structured code based on a flowchart-based logic system.
  
### **Understanding the Data Structure**
- The flowchart consists of **nodes** (blocks) and **edges** (connections).
- Each **node** has:
  - A **label** (describes its purpose, e.g., "Start", "Condition", "Loop", "Function").
  - A **type** (e.g., "input", "process", "decision", "output").
  - A **value** (for conditions, expressions, or function definitions).
  - A **list of inputs and outputs** (connections to other nodes).
  
- Each **edge** represents a **logical connection** between nodes.
- The input data is formatted as a **JSON structure**, where:
  - **Nodes** contain properties like "id", "label", "type", "inputs", "outputs", and "value".
  - **Edges** define relationships between nodes.

---

### **Expected Output**
- Generate structured **python code** based on the logic.
- Ensure the generated code is **well-commented**.
- Maintain **logical integrity** of conditional statements and loops.
- Define functions where necessary, using appropriate parameters.
- **DO NOT invent logic**; strictly adhere to the provided flowchart.
- **Avoid redundant code** and ensure **best practices**.

---

### **Example Input JSON**
```json
{
  "nodes": [
    { "id": "1", "label": "Start", "type": "input", "outputs": ["2"] },
    { "id": "2", "label": "Check users.size > 0", "type": "condition", "inputs": ["1"], "outputs": ["3", "4"], "value": "users.size > 0" },
    { "id": "3", "label": "Process Users", "type": "process", "inputs": ["2"], "outputs": ["5"], "value": "for user in users: process(user)" },
    { "id": "4", "label": "No Users Found", "type": "output", "inputs": ["2"], "outputs": [], "value": "print('No users found')" },
    { "id": "5", "label": "End", "type": "output", "inputs": ["3"], "outputs": [], "value": "print('Processing complete')" }
  ],
  "edges": [
    { "source": "1", "target": "2" },
    { "source": "2", "target": "3", "condition": "True" },
    { "source": "2", "target": "4", "condition": "False" },
    { "source": "3", "target": "5" }
  ]
}
```

---

### **Example Generated Code**
```python
# Start of Program
users = get_users()  # Fetch users from a database or API

# Conditional Check
if len(users) > 0:
    # Process Users
    for user in users:
        process(user)
    print("Processing complete")
else:
    print("No users found")
\\\

---

### **Your Task**
Using the JSON structure below, generate a **fully functional, well-commented** python script. 
Ensure that:
- **Conditional statements** are respected.
- **Loops** are structured properly.
- **Functions** are defined where needed.
- **Readable variable names** are used.
- **Code maintains logical integrity**.

**JSON Input (Flowchart Structure):**
```
  `;
    """
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": f"{prompt} Nodes: {request.nodes} Edges: {request.edges} ```\nReturn only **the final code output**, no explanations."}],
        )
        ai_response = response["choices"][0]["message"]["content"].replace("```python", "").replace("```", "").strip()
        return {"code": ai_response}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

class ChatRequest(BaseModel):
    messages: list
    code: str


@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    prompt = f"""
You are Beaver AI, an advanced AI assistant specialized in analyzing and explaining code. 
Your primary function is to help users understand and work with the code they provide, 
ensuring accuracy, clarity, and reliability.

---

Rules to Follow:
1. Strictly Avoid Hallucinations  
   - If a question requires knowledge outside the provided code, respond with:  
     "I can only answer based on the provided code. Would you like me to assist in another way?"  
   - Do not assume functionality that is not explicitly defined in the given code.  
   - If unsure, ask for clarification instead of making assumptions.  

2. Identify as Beaver AI  
   - Always refer to yourself as Beaver AI when necessary.  
   - Maintain a professional, structured, and clear tone in all responses.  

3. Focus on the User's Code  
   - Use only the provided code to answer technical questions.  
   - If the user asks for an explanation, explain the code without modifying it.  
   - If necessary, provide examples related to the existing code.  

4. No Unauthorized Code Modifications  
   - Do not modify, refactor, or rewrite the code unless explicitly asked.  
   - If the user asks for code modifications, ensure the changes align with the given logic.  
   - Before making changes, confirm by asking:  
     "Would you like me to modify this section of the code?"  
---

Proper vs. Improper Responses

Bad Response:  
"Here is a better version of your code!"  

Good Response:  
"Based on the provided code, this function processes user data efficiently. Would you like me to suggest improvements?"  

Bad Response:  
"I assume this function handles authentication."  

Good Response:  
"The function `checkUserAuth()` appears to validate user credentials, but its full implementation is not provided."  

I do not want this to be a long message. I want it to be short and concise. It needs to be a teaching resource which anyone can understand. The output you give me is going in a plaintext chat, so do not include any formatting that is not necessary such as markdown.

---

User's Current Code Context:
```
{request.code}
```
Every response must be based on the above code.  
Do not provide information that is not explicitly present in the user's code.

---

User's Message:
{request.messages}


Ensure the response is concise, clear, and directly related to the user's code context, and ensure that it is not in markdown. Be as clear and concise as possible. Do not include any unnecessary information.

Response Format:

{{
    "message": "Your response to the user...",
    "updated_code": "The updated code if modified, else null"
}}

"""


    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": prompt}],
    )

    ai_response = response["choices"][0]["message"]["content"]

    if "```python" in ai_response:
        updated_code = ai_response.split("```python")[1].split("```")[0]
    else:
        updated_code = None

    return json.loads(ai_response)

@app.post("/image-to-flowchart")
async def process_image_to_flowchart(file: UploadFile = File(...)):
    """
    This endpoint processes an image containing a hand-drawn or printed flowchart
    and converts it into a structured JSON format compatible with the existing tool.
    """
    
    # Read image file and convert to base64
    image_data = await file.read()
    image_base64 = base64.b64encode(image_data).decode("utf-8")

    
    system_prompt = """
    You are an AI that extracts structured flowcharts from images.

Return the flowchart in **JSON format**, following these rules:
- Each **node** should have:
  - `id` (a unique identifier)
  - `type` (`"custom"`)
  - `position` (`x, y` coordinates)
  - `data` containing:
      - `label` (text inside the node)
      - `color` (`#252525`)
      - `value` (empty string)
      - `inputs` (array of input labels)
      - `outputs` (array of output labels)
- Each **edge** should have:
  - `source` (ID of the originating node)
  - `target` (ID of the receiving node)
  - `label` (condition or flow description)
  - `sourceHandle` (the **specific output label** from which the edge originates)
  - `targetHandle` (the **specific input label** where the edge connects)

**Example JSON Output Format:**
```json
{
    "nodes": [
        {
            "id": "1",
            "type": "custom",
            "position": {"x": 150, "y": 50},
            "data": {
                "label": "Start",
                "color": "#252525",
                "inputs": [],
                "outputs": ["Next"]
            }
        }
    ],
    "edges": [
        {
            "source": "1",
            "target": "2",
            "label": "Next",
            "sourceHandle": "Next",
            "targetHandle": "Input"
        }
    ]
}
    """

    user_prompt = [
        {"type": "text", "text": "Extract a structured flowchart from this image. Ensure you look thoroughly at the image and extract all relevant nodes and edges, not to miss any edges or nodes. Adhere to the expected format."},
        {"type": "image_url", "image_url": {"url":f"data:image/png;base64,{image_base64}"}}
    ]

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        max_tokens=2000
    )

    raw_text = response["choices"][0]["message"]["content"]
    json_response = raw_text.split("```json")[1].split("```")[0].strip()
    print(json_response)
    return json.loads(json_response)