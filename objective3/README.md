# LLM API Lab - Objective 3

In this lab, we'll take the next step in deploying our AI model by adding an API to our locally deployed text summarization model. This enhancement will make it easy to use our model in applications, allowing access from different platforms and enabling scalability.

## FastAPI

[FastAPI](https://fastapi.tiangolo.com/) is a modern, high-performance web framework for building APIs with Python. Leveraging asynchronous programming techniques, FastAPI offers lightning-fast execution speeds, making it ideal for high-throughput applications. With its intuitive and easy-to-use interface, developers can rapidly create robust APIs with automatic interactive documentation generation, based on the OpenAPI standard.

FastAPI's built-in support for data validation, serialization, and dependency injection streamlines development, while its seamless integration with popular Python data science libraries like [Pydantic](https://docs.pydantic.dev/latest/) and [SQLAlchemy](https://www.sqlalchemy.org/) further enhances its capabilities. With FastAPI, developers can efficiently build scalable, production-ready APIs with minimal effort, making it a go-to choice for projects requiring speed, reliability, and ease of development.

We will leverage the FastAPI quickly and effectively build an API prototype for our AI model.  

To take advantage of FastAPI's data validation via Pydantic, we need to provide the model with text that we want to summarize, so this will be our only input for the API.

 Examine the _api.py_ file in the _objective3/app_ directory.  The code is displayed below:

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

Some quick highlights on what this code does:

- load the text_summarization model from the _/code/app/model/text_summarization_ folder in the container; we will cover this in the _Dockerfile_.
- builds a model to ensure our API post body contains a JSON element named _text_ and of class string.
- provides a new API endpoint _/summarize/_ that we can POST _text_ that we want summarized.
- passes the supplied text to the model.
- returns a summary of the supplied text.

## Build Container

To build the API container with our AI model, we will leverage the _Dockerfile_ in the _objective3_ directory:

>_**Note:**_ it is highly recommended to clone this [repository](https://github.com/codygreen/llm_api_server) and use your local version versus trying to recreate the files and folder structure yourself.  

```dockerfile
FROM alpine as cloner

RUN apk add git-lfs
RUN git lfs install
RUN git clone https://huggingface.co/Falconsai/text_summarization /tmp/model/text_summarization

FROM unit:python

WORKDIR /code/app

COPY requirements.txt app/api.py .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY --from=cloner /tmp/model /code/app/model
RUN chown -R unit:unit .

COPY unitconf.json /docker-entrypoint.d/
```

Lets examine what is happening in this Dockerfile:

- create a _cloner_ container
- install git-lfs so we can download the model
- downloads our text summarization model
- create a new container from the NGINX Unit Python base
- install our required python dependencies
- copy our FastAPI application code to the container
- copy our model from the _cloner_ container
- copy the NGINX Unit configuration to start the FastAPI application

With our _Dockerfile_ created and our code ready for deployment, we can create our API container using the following command:

```shell
docker build -t llmapi .
```

This will create a new container image named _llmapi_.

## Launch API Container

Now that we have our API container created, we can launch our container with the following command:

```shell
docker run -d --name llmapi -p 80:80 llmapi
```

This will deploy our new container and provide access on TCP port 80, [http://localhost:80](http://localhost:80).

## Test the API

With our API now deployed and running, we can run the following command to test that our AI model is working correctly:

```shell
ARTICLE="Igor Sysoev originally wrote NGINX to solve the C10K problem, a term coined in 1999 to describe the difficulty that existing web servers experienced in handling large numbers (the 10K) of concurrent connections (the C). With its event‑driven, asynchronous architecture, NGINX revolutionized how servers operate in high‑performance contexts and became the fastest web server available.\
After open sourcing the project in 2004 and watching its use grow exponentially, Sysoev co‑founded NGINX, Inc. to support continued development of NGINX and to market NGINX Plus as a commercial product with additional features designed for enterprise customers. NGINX, Inc. became part of F5, Inc. in 2019. Today, NGINX and NGINX Plus can handle hundreds of thousands of concurrent connections, and power more of the Internet's busiest sites than any other server."

curl -id"{\"text\":\"$ARTICLE\"}" -H "Content-Type: application/json" http://127.0.0.1/summarize/
```

Lets breakdown what this script does:

- The first part of this command stores the history of NGINX as an environment variable called _ARTICLE_.
- The `curl` command constructs a simple JSON payload from _ARTICLE_ and sends it to the API endpoint for _summarize_.

Once you run this code, you should see a summarization about the creation of NGINX like the output below:

```shell
{"summary":"Igor Sysoev originally wrote NGINX to solve the C10K problem . With its eventdriven, asynchronous architecture, NGINx revolutionized how servers operate in highperformance contexts and became the fastest web server available ."}
```

## Teardown

Now that we have proven our API works, we can stop and delete our API container by running the following commands:

```shell
docker stop llmapi
docker rm llmapi
```

## Conclusion

Now that we have a basic API for our AI model, we've achieved an important step toward integrating it into our production application smoothly. However, because the API doesn't have any protection measures yet, it's vulnerable to potential abuse, like denial-of-service (DoS) attacks. So, the next important task is to add rate limiting to ensure the model's availability and performance are safeguarded.

[objective 4 lab guide](../objective4/README.md)
