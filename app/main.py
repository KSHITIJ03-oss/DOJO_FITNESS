from fastapi import FastAPI

app = FastAPI(title="Dojo_Fitness Api")

@app.get("/")
def greet():
    return {"Dojo APi running"}