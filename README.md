# LLM API Lab

## Overview

This lab series was crafted to guide participants through the complex journey of identifying, deploying, and managing AI models, specifically focusing on a text summarization model. The first objective introduces attendees to testing the model using Hugging Face's inference API in a Jupyter Notebook, offering a hands-on opportunity to engage with the model's functionalities and optimize its performance. This foundational stage sets the groundwork for understanding the nuances of AI application in real-world scenarios.

Progressing to the second and third objectives, participants will deploy the text summarization model locally and build an API for it using Docker, fostering skills in both local environment setup and containerization for scalable deployment. These sessions are designed to provide practical experience in managing the lifecycle of an AI model from a local setup to a containerized deployment, ensuring consistency and efficiency across different environments.

The latter part of the series, encompassing objectives four through six, advances into more sophisticated territory with the integration of NGINX for API rate limiting and authorization via NGINX Plus, followed by hands-on inference training. Participants will delve into securing and optimizing API accessibility and conclude with real-time data processing to generate AI-driven predictions. Each step is aimed at enhancing the participant's ability to deploy, secure, and utilize AI models effectively, culminating in a comprehensive skill set that addresses the full spectrum of AI application challenges.

## Prerequisites

To fully benefit from this training, it's advisable to have a basic understanding of generative AI and the model training life cycle. Practical experience with Docker or similar container runtimes is also essential for seamless implementation of the concepts covered.

A [list](training_recommendations.md) of recommended videos and articles has been provided if you need a quick primer on the prerequisite topics.

## Requirements

To complete this lab, you will need:

- access to a container runtime environment, such as [Podman](https://podman.io/) or [Docker](https://docker.com).
- bash or ZSH shell.
- A [Hugging Face](https://huggingface.co/) account.

## Usage

The labs are intended to be take in sequential order. If you skip ahead, you may run into missing dependencies.

[Interactive demos](https://app.revel.vivun.com/demos/collections/5b350f9b-a933-442f-b0f9-bba421b81b6c) have been provided for some of the steps if you are new to technology like Jupyter Notebooks.

## Objective 1 - Test Model in Hugging Face

This objective involves using a Jupyter Notebook to test a text summarization model via the Hugging Face inference API, providing a practical framework for participants to engage with the model's functionalities. Attendees will learn to execute the model, assess its summarization quality, and explore performance optimizations, thereby gaining a deeper understanding of real-world AI application challenges.

[lab guide](./objective1/README.md)

## Objective 2 - Deploy Model Locally

This objective entails deploying a text summarization model on a local machine and using a Jupyter Notebook for testing and interaction. Participants will learn how to set up the environment, run the model locally, and evaluate its performance through hands-on exercises, thus gaining practical insights into model deployment and local testing processes.

[lab guide](./objective2/README.md)

## Objective 3 - Build API for Local Model

This objective focuses on building and deploying a Docker container that encapsulates a locally deployed AI model along with an API server for model access. Participants will gain practical experience in containerization techniques, learning how to package their AI model and API into a Docker container to ensure consistent deployment and scalability across different environments.

[lab guide](./objective3/README.md)

## Objective 4 - Deploy Model API with NGINX

This objective centers on building and deploying a Docker container that hosts a locally developed AI model and an API server, with the addition of NGINX to manage API rate limiting. Participants will learn to integrate NGINX as a reverse proxy to not only serve the API but also to implement essential rate limiting to protect and optimize the model's accessibility across diverse operational scenarios.

[lab guide](./objective4/README.md)

## Objective 5 - Authorization

This objective involves building and deploying a Docker container that hosts a locally developed AI model and an API server, incorporating NGINX Plus to manage both API rate limiting and authorization. Participants will learn how to configure NGINX Plus as a reverse proxy to enforce security measures, including rate limiting to prevent abuse and authorization controls to ensure that only authorized users can access the API.

[lab guide](./objective5/README.md)

## Objective 6 - Inference Training

This objective extends upon previous goals by having participants engage in AI inference tasks, learning how to effectively process real-time data through the API to generate predictions. This comprehensive approach will empower attendees to implement, secure, and operate AI-driven applications efficiently in a controlled environment.

[lab guide](./objective6/README.md)

## Bonus Objective - Internal API for SaaS LLMs

This objective builds upon previous goals by introducing a new internal API endpoint for the Gorq Cloud infrastructure, enabling seamless integration with more advanced AI models such as Mixtral. By expanding the API capabilities, we aim to enhance the platform's AI-driven functionalities, providing users with access to state-of-the-art models for enhanced performance and innovation.

[lab guide](./objective7/README.md)

>_**Note:**_ generative AI was used to help enhance the content of this lab guide.  While all information in this guide has been factually validated, I cannot guarantee the authenticity of each statement and do not declare all text as my original work.  Content sources have been provided when know and/or appropriate.
