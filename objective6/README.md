# LLM API Lab - Objective 6

In this lab, we will examine how to leverage our AI Model's API for inference.

## What is AI Inference

IBM Research states "inference is an AI model’s moment of truth, a test of how well it can apply information learned during training to make a prediction or solve a task... training and inference can be thought of as the difference between learning and putting what you learned into practice"[^1].

By providing access to the AI model via an API, we can take advantage of various progressive deployment patterns and apply them to model delivery:

- Blue-Green Deployments
- Canary Releases
- A/B Testing
- Feature Flags
- Observability

This makes it easier for both application developers and data sciences to iterate and delivery new versions of the model.

"Progressive Delivery is the next step after Continuous Delivery, where new versions are deployed to a subset of users and are evaluated in terms of correctness and performance [^2]".

## Inference API via Jupyter Notebooks

So far, you have interacted with the model API as a NetOps or developer would.  However, the data scientists on your team will prefer to access the model API using the same tooling they leverage for model training and research, such as Jupyter Notebooks.  

Let's combine everything from objectives 1 - 5 together to achieve this outcome!

## Deploy Environment

We will leverage our docker compose file from before with the addition of a Jupyter Notebook container.  This file is included in the _objective6_ folder and it's contents are displayed below:

```docker
version: "3.8"
services:
  llmapi:
    image: llmapi
    ports:
      - "8080:80"
  nginx:
    image: private-registry.nginx.com/nginx-plus/base:debian
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./llmapi.jwk:/etc/nginx/llmapi.jwk
    depends_on:
      - llmapi
  jupyter:
    image: quay.io/jupyter/pytorch-notebook:latest
    ports:
      - "8888:8888"
    volumes:
      - ./notebooks:/home/jovyan/notebooks
    command: start-notebook.sh --NotebookApp.token='nginxrocks!'
    depends_on:
      - llmapi
      - nginx
```

Now we will deploy our containers:

```shell
docker compose up -d
```

## Testing

Now that our model is up and running via an API, we can leverage our Jupyter Notebook to perform inference using data the model has not seen before.

Open a browser and access the Jupyter Notebook at: [http://localhost:8888], then token is: _nginxrocks!_

In your Jupyter Notebook, you notice a directory called _notebooks_ in your explorer window with a notebook called _text_summarization.ipynb_.  Open the _text_summarization.ipynb_ file.

The contents of this notebook include: 

```python
import json, requests

token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjAwMDEifQ.eyJuYW1lIjoiUXVvdGF0aW9uIFN5c3RlbSIsInN1YiI6InF1b3RlcyIsImlzcyI6Ik15IEFQSSBHYXRld2F5In0.ggVOHYnVFB8GVPE-VOIo3jD71gTkLffAY0hQOGXPL2I"
headers = {"Authorization": f"Bearer {token}"}
payload = {"text": text}

response = requests.post("http://nginx/summarize/", headers=headers, data=json.dumps(payload))
response.json()
```

- a sample text of the [founding of F5](https://my.f5.com/manage/s/article/K245).
- static JWT to authorization the API call.
- post to the _/summarize/_ API endpoint.

To execute the python code, click _shift + enter_ in each cell or click the &#x23e9; icon to restart the kernel and run all cells.

## Outcome

The results of this request are interesting.  The [Falcon AI text summarization model](https://huggingface.co/Falconsai/text_summarization) to this point has worked very well, but now we see the summary contains no information about F5.  

```json
{'summary': "Mike Almquist was a summer intern at the HIT lab . In 1992, he created a virtual environment demo for the lab's virtual retinal display (VRD) project . The project with UW did not materialize, and he had to live in his basement office with only a couch ."}
```

This means that our model may need additional tuning which the data scientist can do directly in the Jupyter Notebook to produce a new model that we would then re-deploy via our API.  This tuning and re-deployment process continues until the the result tolerance meets an acceptable level.

This train and re-deploy model mimic the same patter application developers face today as they deploy their initial micro-services and then leverage telemetry to determine how to enhance the service and re-deploy.  This is where progressive deployment patterns can be helpful to not only our modern application developers but also to our AI-Ops and data scientists!

## Teardown

Clean up your environment by running the following command:

```shell
docker compose down
```

## Conclusion

In this lab, we have worked our way through an example problem statement starting with finding and testing an AI model, to creating, deploying and securing the models via an API, and finally performing inference on the model with fresh data.

From here, you can test new models by adding addition NGINX location and/or paths. We can also produce an OpenAPI Spec for our APIs and add a WAF to protect the API from attack.

[^1]: https://research.ibm.com/blog/AI-inference-explained
[^2]: https://blog.csanchez.org/2019/01/22/progressive-delivery-in-kubernetes-blue-green-and-canary-deployments/