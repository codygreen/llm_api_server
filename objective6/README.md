# LLM API Lab - Objective 6

In this lab, we'll explore how to use our AI Model's API for inference, building on the earlier steps of adding API rate-limiting and authorization. By leveraging our model's API, our goal is to make the inference process easier, integrating our AI capabilities seamlessly into various applications and workflows.

## What is AI Inference

IBM Research states "inference is an AI model’s moment of truth, a test of how well it can apply information learned during training to make a prediction or solve a task... training and inference can be thought of as the difference between learning and putting what you learned into practice"[^1].

Granting access to the AI model through an API opens the door to leveraging a spectrum of progressive deployment patterns, empowering us to optimize model delivery effectively:

- Blue-Green Deployments: Facilitate seamless transitions between different versions of the model, ensuring uninterrupted service availability.
- Canary Releases: Safely introduce new model versions to a subset of users for validation before full-scale deployment.
- A/B Testing: Compare the performance of different model versions in real-world scenarios to inform decision-making.
- Feature Flags: Enable the selective activation of new model features, providing flexibility and control over functionality rollout.
- Observability: Gain insights into model performance and behavior through comprehensive monitoring and analysis.

This approach streamlines the iterative process of model development and delivery for both application developers and data scientists, fostering collaboration and enabling rapid iteration towards improved model versions. As an evolution beyond Continuous Delivery, progressive delivery allows for the evaluation of new model iterations in terms of correctness and performance, ensuring a seamless transition to enhanced AI capabilities.

## Inference API via Jupyter Notebooks

So far, we have interacted with the model API as a NetOps or developer would.  However, the data scientists on our team prefer to access the model API using the same tooling they leverage for model training and research, such as Jupyter Notebooks.  

Let's combine everything from objectives 1 - 5 together to achieve this outcome!

## Deploy Environment

We will leverage our _docker-compose.yml_ file from _objective5_ with the addition of a Jupyter Notebook container.  This file is included in the _objective6_ folder and it's contents are displayed below:

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

Open a browser and access the Jupyter Notebook at: [http://localhost:8888](http://localhost:8888), the token is: _nginxrocks!_

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

Lets examine what is happening in this file:

- a sample text of the [founding of F5](https://my.f5.com/manage/s/article/K245).
- static JWT to authorization the API call.
- post to the _/summarize/_ API endpoint.

To execute the python code, click _shift + enter_ in each cell or click the &#x23e9; icon to restart the kernel and run all cells.

## Outcome

The results of this request are interesting.  The [Falcon AI text summarization model](https://huggingface.co/Falconsai/text_summarization) to this point has worked very well, but now we see the summary contains no information about F5.  

```json
{'summary': "Mike Almquist was a summer intern at the HIT lab . In 1992, he created a virtual environment demo for the lab's virtual retinal display (VRD) project . The project with UW did not materialize, and he had to live in his basement office with only a couch ."}
```

Our testing results help us understand this model may need additional tunning. This process involves refining our model, a task that data scientists can easily handle directly within the Jupyter Notebook. This results in an improved model ready for redeployment via our API. We repeat this tuning and redeployment cycle until the model's performance meets our standards for accuracy and reliability.

This cycle mirrors how modern application developers deploy initial microservices, then use telemetry to improve and redeploy them. By adopting progressive deployment patterns, we not only benefit our application developers but also extend these advantages to our AI-Ops teams and data scientists. This fosters collaboration and drives continuous improvement in our AI-driven projects.

## Teardown

Clean up your environment by running the following command:

```shell
docker compose down
```

## Conclusion

Throughout this lab, we've traversed a comprehensive journey, navigating through an example problem statement from inception to execution. Beginning with the discovery and testing of an AI model, we proceeded to deploy and secure our model through an API, culminating in the pivotal step of conducting inference with real-time data.

Where to go from here?

- By adding more models and NGINX locations, we can expand our capabilities and test various AI solutions. Additionally, creating an OpenAPI Spec will enhance the accessibility and compatibility of our APIs across platforms.

- Enhancing our API security with a Web Application Firewall (WAF) will proactively protect our AI models from potential threats, ensuring system integrity and security.

These examples are great problem statements to tackle leveraging your NGINX experience.  If you are new to NGINX, then check out some of our other [NGINX lab](https://clouddocs.f5.com/training/community/nginx/html/) to learn more!

[^1]: https://research.ibm.com/blog/AI-inference-explained
