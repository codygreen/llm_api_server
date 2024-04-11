# LLM API Lab

This lab will walk you through the creation of an API for a locally downloaded AI model.  Then you will step through the process of adding essential security measure to help protect the model's API.

To complete this lab, you will need:

- access to a container runtime environment, such as [Podman](https://podman.io/) or [Docker](https://docker.com).
- A [Hugging Face](https://huggingface.co/) account.

 [Interactive demos](https://app.revel.vivun.com/demos/collections/5b350f9b-a933-442f-b0f9-bba421b81b6c) have been provided for some of the steps if you are new to technology like Jupyter Notebooks.

## Objective 1 - Test Model in Hugging Face

Test a text summarization model using a Jupyter Notebook and the Hugging Face inference API.

[lab guide](./objective1/README.md)

## Objective 2 - Deploy Model Locally

Deploy the text summarization model locally and test using a Jupyter Notebook.

[lab guide](./objective2/README.md)

## Objective 3 - Build API for Local Model

Build and deploy a docker container which hosts your local model and API server.

[lab guide](./objective3/README.md)

## Objective 4 - Deploy Model API with NGINX

Add NGINX to objective 3 so we can add basic rate limiting.

[lab guide](./objective4/README.md)

## Objective 5 - Authorization

Extend objective 4 with API authorization to limit who has access to your model.

[lab guide](./objective5)

## Objective 6 - API Security

Add API security measures to ensure your API is protected against common API-based attacks.

[lab guide](./objective6)