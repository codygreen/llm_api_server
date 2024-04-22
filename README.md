# LLM API Lab

## Overview

This lab series is tailored to provide participants with a comprehensive journey into the world of AI model identification, deployment, and management, with a specific focus on text summarization models. 

Beginning with the first objective, attendees will be introduced to testing the model using Hugging Face's inference API within a Jupyter Notebook. This hands-on session offers participants the opportunity to interact directly with the model, allowing them to optimize its performance and gain a deeper understanding of its capabilities within real-world contexts.

Moving forward, the series progresses to the second and third objectives, where participants will learn to deploy the text summarization model locally and create an API for it using Docker. These sessions are designed to equip participants with the skills needed to set up environments locally and containerize applications for efficient and scalable deployment.

In the latter part of the series, objectives four through six delve into more advanced topics such as integrating NGINX for API rate limiting and authorization using NGINX Plus, along with hands-on inference training. 

## Who is this lab for?

This lab is intended for consumers who are new to AI model access and inference.

## Prerequisites

To fully benefit from this training, it's advisable to have a basic understanding of generative AI and the model training life cycle. Practical experience with Docker or similar container runtimes is also essential for seamless implementation of the concepts covered.

A [list](training_recommendations.md) of recommended videos and articles has been provided if you need a quick primer on the prerequisite topics.

## Requirements

To complete this lab, you will need:

- [git](https://git-scm.com/downloads/guis) client, you will need to clone this repository
- access to a container runtime environment, such as [Podman](https://podman.io/) or [Docker](https://docker.com).
- bash or ZSH shell.
- [jq](https://jqlang.github.io/jq/)
- A [Hugging Face](https://huggingface.co/) account.

## Usage

The labs are intended to be take in sequential order. If you skip ahead, you may run into missing dependencies.

[Interactive demos](https://app.revel.vivun.com/demos/collections/5b350f9b-a933-442f-b0f9-bba421b81b6c) have been provided for some of the steps if you are new to technology like Jupyter Notebooks.

## Objective 1 - Test Model in Hugging Face

In this phase, participants dive into the practical side of AI by using a Jupyter Notebook to test a text summarization model via the Hugging Face inference API. Through hands-on exercises, attendees will not only run the model but also evaluate its summarization quality. 

This objective is designed to immerse participants in the real-world challenges of AI model delivery, offering them valuable insights into its practical implications.

[lab guide](./objective1/README.md)

## Objective 2 - Deploy Model Locally

Here, participants learn the ropes of deploying a text summarization model on their local machines. Using a Jupyter Notebook for testing and interaction, attendees will gain firsthand experience in setting up the environment, running the model, and assessing its performance. 

Through this objective, participants acquire practical knowledge of model deployment and local testing processes, setting the stage for more advanced objectives.

[lab guide](./objective2/README.md)

## Objective 3 - Build API for Local Model

This objective delves into the realm of containerization as participants learn to build and deploy a Docker container encapsulating a locally deployed AI model and an API server.

With this objective, participants gain the ability to package their AI model and API into a Docker container, ensuring consistent deployment and scalability across different environments.

[lab guide](./objective3/README.md)

## Objective 4 - Deploy Model API with NGINX

Building upon the previous objectives, this phase focuses on enhancing the deployed model's accessibility and security. Participants learn to integrate NGINX into their Docker container setup, enabling efficient API rate limiting.

This objective provides an introduction to NGINX as a reverse proxy, participants not only serve the API but also implement crucial rate limiting measures to protect and optimize the model's accessibility in various operational scenarios.

[lab guide](./objective4/README.md)

## Objective 5 - Authorization

Continuing the theme of security, this objective introduces participants to NGINX Plus for managing both API rate limiting and authorization. Participants learn to configure NGINX Plus as a reverse proxy, enforcing strict security measures such as rate limiting to prevent abuse and authorization controls to restrict access to authorized users only. 

This phase help participants learn the minimum requirements to deploy AI-driven applications securely in real-world environments.

[lab guide](./objective5/README.md)

## Objective 6 - Inference Training

In this final objective, participants engage in practical AI inference tasks, processing real-time data through the API to generate predictions. 

By completing this training, attendees gain the skills necessary to implement, secure, and operate AI-driven applications efficiently in controlled environments, preparing them for real-world challenges.

[lab guide](./objective6/README.md)

## Bonus Objective - Internal API for SaaS LLMs

 Expanding upon the foundational objectives, this bonus phase introduces a new internal API endpoint for the Gorq Cloud infrastructure. By integrating more advanced AI models such as Mixtral, this objective aims to enhance the platform's AI-driven capabilities, providing users with access to cutting-edge models for improved performance and innovation.

[lab guide](./objective7/README.md)

>_**Note:**_ generative AI was used to help enhance the content of this lab guide.  While all information in this guide has been factually validated, I cannot guarantee the authenticity of each statement and do not declare all text as my original work.  Content sources have been provided when know and/or appropriate.
