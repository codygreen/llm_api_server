# LLM API Lab - Objective 6

In this lab session, we will delve into the intricacies of leveraging our AI Model's API for inference, capitalizing on the groundwork laid in previous steps with the implementation of API rate-limiting and authorization. By harnessing the power of our model's API, we aim to streamline the inference process, enabling seamless integration of our AI capabilities into diverse applications and workflows.

Through hands-on exploration, participants will gain insights into optimizing inference performance, handling API rate limits effectively, and enforcing authorization policies to ensure secure and efficient utilization of our model's capabilities.

This lab represents a pivotal moment in our deployment journey, where we bridge the gap between model development and real-world application, unlocking new opportunities for innovation and impact in the AI landscape.

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

This dynamic process entails fine-tuning our model, a task easily undertaken by data scientists directly within the Jupyter Notebook, culminating in the production of an improved model ready for redeployment via our API. Iterations of this tuning and redeployment cycle persist until the model's performance reaches an acceptable threshold of accuracy and reliability.

This iterative train-and-redeploy model closely mirrors the iterative approach modern application developers take when deploying initial microservices, followed by leveraging telemetry to enhance services and redeploy them. Incorporating progressive deployment patterns not only benefits our contemporary application developers but also extends its advantages to our AI-Ops teams and data scientists, fostering collaboration and driving continuous improvement in our AI-driven initiatives.

## Teardown

Clean up your environment by running the following command:

```shell
docker compose down
```

## Conclusion

Throughout this lab, we've traversed a comprehensive journey, navigating through an example problem statement from inception to execution. Beginning with the discovery and testing of an AI model, we proceeded to craft, deploy, and fortify our models through an API, culminating in the pivotal step of conducting inference with real-time data.

As we stand at this juncture, the possibilities for further exploration and enhancement abound. By expanding our repertoire of models, we can extend our capabilities by incorporating additional NGINX locations, facilitating the testing and integration of diverse AI solutions. Moreover, we can elevate the accessibility and interoperability of our APIs by generating an OpenAPI Spec, fostering standardization and ease of integration across platforms.

Additionally, by fortifying our API infrastructure with a Web Application Firewall (WAF), we can proactively shield our AI models from potential threats and attacks, ensuring the integrity and security of our systems.

As we embark on the next phase of our journey, these avenues for expansion and optimization promise to enrich our AI deployment process, empowering us to unlock new realms of innovation and impact in the ever-evolving landscape of artificial intelligence.

[^1]: https://research.ibm.com/blog/AI-inference-explained
