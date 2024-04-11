# LLM API Lab - Objective 3

In this lab, we will add an API to our local AI model deployment. 

## FastAPI

For this lab, we will leverage the Python FastAPI framework to quickly build an API prototype for our LLM.  For this exercise, we need to provide the model with text that we want to summarize, so this will be our only input.

Create a new file call _api.py_ add add the following code:

```python
'''FastAPI server that will be used to serve the summarization model.'''
from transformers import pipeline
from fastapi import FastAPI
from pydantic import BaseModel

summarizer = pipeline("summarization", model="/code/app/model/text_summarization")

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
```

This code provides a new API endpoint _/summarize/_ that we can POST _text_ to that we want summarized.

## Build Container

To build our API container with our AI model, we need to create a new _Dockerfile_ with the following code:

```dockerfile
FROM python:3.11 as builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    git-lfs \
    && git lfs install \
    && git clone https://huggingface.co/Falconsai/text_summarization /tmp/model/text_summarization \
    && rm -rf /tmp/model/.git \
    && rm -rf /var/lib/apt/lists/*

FROM python:3.11

WORKDIR /code

COPY requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

RUN mkdir -p /code/app

COPY ./app /code/app

COPY --from=builder /tmp/model /code/app/model

CMD ["uvicorn", "app.api:app", "--host", "0.0.0.0", "--port", "80"]
```

In this file, we create a _builder_ container that downloads our text summarization model, then we create a new container with our API code and copy the AI model to our api container.

## Build API Container

With our _Dockerfile_ created and our code ready for deployment, we can create our API container with the following command:

```shell
docker build -t llmapi .
```

## Launch API Container

Now that we have our API created, we can launch our container with the following command:

```shell
docker run -d --name llmapi -p 80:80 llmapi
```

## Test the API

With our API now deployed and running, we can run the following command to test that our AI model is working correctly:

```shell
read -r -d '' ARTICLE << 'EOF'
Igor Sysoev originally wrote NGINX to solve the C10K problem, a term coined in 1999 to describe the difficulty that existing web servers experienced in handling large numbers (the 10K) of concurrent connections (the C). With its event‑driven, asynchronous architecture, NGINX revolutionized how servers operate in high‑performance contexts and became the fastest web server available.

After open sourcing the project in 2004 and watching its use grow exponentially, Sysoev co‑founded NGINX, Inc. to support continued development of NGINX and to market NGINX Plus as a commercial product with additional features designed for enterprise customers. NGINX, Inc. became part of F5, Inc. in 2019. Today, NGINX and NGINX Plus can handle hundreds of thousands of concurrent connections, and power more of the Internet’s busiest sites than any other server.
EOF

PAYLOAD=$(jq -c -n --arg text "$ARTICLE" '$ARGS.named')

curl -i \
-H "Accept:application/json" \
-H "Content-Type:application/json" \
-X POST --data "$PAYLOAD" http://127.0.0.1:80/summarize/

```

You should see a summarization about the creation of NGINX.

## Teardown

Now that we have proven our API works, we can stop and delete our API container:

```shell
docker stop llmapi
docker rm llmapi
```

## Conclusion

Now that we have a basic API for our AI model, we can easily integration the model with our production application.  However, the API is currently wide open and not protected.  The next step will be to implement rate limiting to help prevent DoS of the model. 