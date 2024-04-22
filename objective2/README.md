# LLM API Lab - Objective 2

In this lab session, we will transition from testing the FalconAI/text_summarization model remotely to deploying it locally, offering several advantages:

1. **Privacy and Security**: By running the model locally, you maintain full control over your data and ensure that sensitive information remains on your own systems, reducing the risk of data breaches or leaks.

2. **Reduced Latency**: Local execution typically results in lower latency compared to running the model on remote servers, as there is no need to transmit data over the internet. This is particularly important for real-time or interactive applications where responsiveness is crucial.

3. **Offline Availability**: Running the model locally allows your application to function even without an internet connection, ensuring uninterrupted service and enabling deployment in environments with limited or intermittent connectivity.

4. **Cost Efficiency**: Local execution eliminates the need for continuous access to cloud-based resources, potentially reducing operational costs, especially for applications with high inference frequency or large-scale deployment.

5. **Customization and Control**: Local deployment provides greater flexibility for customization and optimization of the model according to specific requirements or constraints of your application, without being limited by the constraints of remote server configurations.

6. **Compliance**: For applications that require adherence to regulatory compliance or data sovereignty requirements, running AI models locally ensures compliance with local laws and regulations governing data handling and processing.

An [interactive demo](https://app.revel.vivun.com/demos/dda72454-437d-41fa-a59a-3c5fb08d612c/paths/29d5532c-d50c-4f56-9f9e-07bc6b1c0fcc) has been provided to demonstrate the Jupyter Notebook steps if this is your first time using a notebook.

## Build Jupyter Docker Image with Model

For this lab, we will create a new Jupyter Notebook container based on the [PyTorch container image](https://quay.io/repository/jupyter/pytorch-notebook), but with our model already downloaded.

We will use the Dockerfile in this repository under the _objective2_ folder with the contents below:

```docker
FROM alpine as cloner

RUN apk add git-lfs
RUN git lfs install
RUN git clone https://huggingface.co/Falconsai/text_summarization /tmp/model/text_summarization

FROM quay.io/jupyter/pytorch-notebook
COPY --from=cloner /tmp/model /home/jovyan/model
```

A more detailed overview of the Dockerfile will be provided in _objective3_.

To build the container, run the following command below in the _objective2_ directory containing the Dockerfile.

```shell
docker build -t llmapi_obj2 .
```

> **NOTE:** The resulting Docker image will be very large (7-8GB)

## Deploy Jupyter Server

For this step, we will run the Jupyter Notebook container you just built.  Run the following commands to start the container:

```shell
docker container run -it --rm -p 8888:8888 llmapi_obj2
```

To access the Jupyter server, you will need to look for the the output that contains the access FQDN and token, it will look something like this:

```shell
Or copy and paste one of these URLs:
        http://4aae967c71b1:8888/lab?token=c325f331fc9fae368ded4f12ddb53d5457e219cfeacfa55e
        http://127.0.0.1:8888/lab?token=c325f331fc9fae368ded4f12ddb53d5457e219cfeacfa55e
```

Copy the url into your browser of choice.

## Install Dependencies

Now that we have the Jupyter server up and running, we can now create a new Notebook.

In the Launcher window, click the _Python 3_ button under the Notebook section.  You should now see a new window with the title _Untitled.ipynb_.  Click the _Save_ button (&#x1F4BE;) and call your file _text_summarization.ipynb_.

Enter the following code and press _shift + enter_ to install dependencies:

```shell
!pip install transformers
```

## Local Text Summarization Model

With our notebook now created and our dependencies installed, we can add the following code to test our local version of the text summarization model.

Copy the code below into a new code block and press _shift + enter_ to execute the code. The AI model response may take up to 1 minute.

```python
import torch
from transformers import pipeline

summarizer = pipeline("summarization", model="model/text_summarization")

ARTICLE = """ 
Hugging Face: Revolutionizing Natural Language Processing
Introduction
In the rapidly evolving field of Natural Language Processing (NLP), Hugging Face has emerged as a prominent and innovative force. This article will explore the story and significance of Hugging Face, a company that has made remarkable contributions to NLP and AI as a whole. From its inception to its role in democratizing AI, Hugging Face has left an indelible mark on the industry.
The Birth of Hugging Face
Hugging Face was founded in 2016 by Clément Delangue, Julien Chaumond, and Thomas Wolf. The name "Hugging Face" was chosen to reflect the company's mission of making AI models more accessible and friendly to humans, much like a comforting hug. Initially, they began as a chatbot company but later shifted their focus to NLP, driven by their belief in the transformative potential of this technology.
Transformative Innovations
Hugging Face is best known for its open-source contributions, particularly the "Transformers" library. This library has become the de facto standard for NLP and enables researchers, developers, and organizations to easily access and utilize state-of-the-art pre-trained language models, such as BERT, GPT-3, and more. These models have countless applications, from chatbots and virtual assistants to language translation and sentiment analysis.
Key Contributions:
1. **Transformers Library:** The Transformers library provides a unified interface for more than 50 pre-trained models, simplifying the development of NLP applications. It allows users to fine-tune these models for specific tasks, making it accessible to a wider audience.
2. **Model Hub:** Hugging Face's Model Hub is a treasure trove of pre-trained models, making it simple for anyone to access, experiment with, and fine-tune models. Researchers and developers around the world can collaborate and share their models through this platform.
3. **Hugging Face Transformers Community:** Hugging Face has fostered a vibrant online community where developers, researchers, and AI enthusiasts can share their knowledge, code, and insights. This collaborative spirit has accelerated the growth of NLP.
Democratizing AI
Hugging Face's most significant impact has been the democratization of AI and NLP. Their commitment to open-source development has made powerful AI models accessible to individuals, startups, and established organizations. This approach contrasts with the traditional proprietary AI model market, which often limits access to those with substantial resources.
By providing open-source models and tools, Hugging Face has empowered a diverse array of users to innovate and create their own NLP applications. This shift has fostered inclusivity, allowing a broader range of voices to contribute to AI research and development.
Industry Adoption
The success and impact of Hugging Face are evident in its widespread adoption. Numerous companies and institutions, from startups to tech giants, leverage Hugging Face's technology for their AI applications. This includes industries as varied as healthcare, finance, and entertainment, showcasing the versatility of NLP and Hugging Face's contributions.
Future Directions
Hugging Face's journey is far from over. As of my last knowledge update in September 2021, the company was actively pursuing research into ethical AI, bias reduction in models, and more. Given their track record of innovation and commitment to the AI community, it is likely that they will continue to lead in ethical AI development and promote responsible use of NLP technologies.
Conclusion
Hugging Face's story is one of transformation, collaboration, and empowerment. Their open-source contributions have reshaped the NLP landscape and democratized access to AI. As they continue to push the boundaries of AI research, we can expect Hugging Face to remain at the forefront of innovation, contributing to a more inclusive and ethical AI future. Their journey reminds us that the power of open-source collaboration can lead to groundbreaking advancements in technology and bring AI within the reach of many.
"""
print(summarizer(ARTICLE, max_length=512, min_length=30, truncation=True, do_sample=False))
```

You should see a summary of the article like the example below:

```shell
[{'summary_text': 'Hugging Face was founded in 2016 by Clément Delangue, Julien Chaumond, and Thomas Wolf . The name "Hugging Face" was chosen to reflect the company\'s mission of making AI models more accessible and friendly to humans, much like a comforting hug . It is best known for its open-source contributions, particularly the "Transformers Library"'}]
```

## Teardown

You can now shutdown your docker container by pressing _ctrl+c_ in the terminal you ran the _docker run_ command in.  This will terminate the Jupyter server.

## Conclusion

In conclusion, this lab has provided a comprehensive exploration of deploying a text summarization model locally, offering valuable insights into the intricate process of model deployment and utilization within the confines of a Jupyter Notebook environment. However, while the local deployment is suitable for testing and experimentation, for production-grade applications, it's imperative to expose the model via an API for broader accessibility and scalability.

Object 3 will delve into this crucial aspect, evaluating the process of transforming our locally deployed model into a robust API service, thereby bridging the gap between experimentation and real-world deployment, and unlocking the full potential of our text summarization solution for production environments.

[objective 3 lab guide](../objective3/README.md)
