'''FastAPI server that will be used to serve the summarization model.'''
from transformers import pipeline
from fastapi import FastAPI
from pydantic import BaseModel

summarizer = pipeline("summarization", model="Falconsai/text_summarization")

app = FastAPI()

@app.get("/")
async def root():
    '''Root endpoint that returns a simple message.'''
    return {"message": "Hello World"}


class Text(BaseModel):
    '''Pydantic model that will be used to validate the incoming request.'''
    text: str


@app.post("/summarize/")
async def summarize(text: Text):
    '''Endpoint that will take a text input and return a summarized version of it.'''
    summary = summarizer(text.text, max_length=100, min_length=5, do_sample=False)
    return {"summary": summary[0]["summary_text"]}
