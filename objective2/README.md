# LLM API Lab - Objective 2

In this lab, we will deploy our text summarization model from Hugging Face locally and test via our Jupyter Notebook.

Now that we have tested the FalconAI/text_summarization model and like the results, we will download the model locally so we can use it with our application.

An [interactive demo](https://app.revel.vivun.com/demos/dda72454-437d-41fa-a59a-3c5fb08d612c/paths/29d5532c-d50c-4f56-9f9e-07bc6b1c0fcc) has been provided to demonstrate the Jupyter Notebook steps if this is your first time using a notebook.


## Build Jupyter Docker Image with Model

For this lab, we will create a new Jupyter Notebook container based on the [PyTorch container image](https://quay.io/repository/jupyter/pytorch-notebook) but with our model already downloaded.

You can either use the Dockerfile in this repository under the _objective2_ folder or create the Dockerfile yourself:

```docker
FROM python:3.11 as builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    git-lfs \
    && git lfs install \
    && git clone https://huggingface.co/Falconsai/text_summarization /tmp/model/text_summarization \
    && rm -rf /tmp/model/.git \
    && rm -rf /var/lib/apt/lists/*

FROM quay.io/jupyter/pytorch-notebook

COPY --from=builder /tmp/model /home/jovyan/model
```

To build the container, run the following command below in the directory containing the Dockerfile. 

```shell
docker build -t llmapi_obj2 .
```

To access the Jupyter server, you will need to look for the the output that contains the access FQDN and token, it will look something like this:

```shell
Or copy and paste one of these URLs:
        http://4aae967c71b1:8888/lab?token=c325f331fc9fae368ded4f12ddb53d5457e219cfeacfa55e
        http://127.0.0.1:8888/lab?token=c325f331fc9fae368ded4f12ddb53d5457e219cfeacfa55e
```

Copy the url into your browser of choice.

## Deploy Jupyter Server

For this step, we will run the Jupyter Notebook container you just built.  Run the following commands to start the container:

```shell
docker container run -it --rm -p 8888:8888 llmapi_obj2
```

## Install Dependencies

Now that we have the Jupyter server up and running, we can now create a new Notebook using the URL from our previous step.

In the Launcher window, click the _Python 3_ button under the Notebook section.  You should now see a new window with the title _Untitled.ipynb_.  Click the _Save_ button and call your file _text_summarization.ipynb_.

Enter the following code and press _shift + enter_ to install dependencies:

```shell
!pip install transformers
```

## Local Text Summarization Model

With our notebook now created and our dependencies installed, we can add the following code to test our local version of the text summarization model.
Press _shift + enter_ inside the code block to execute the code. The AI model response may take up to 1 minute.

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

You can down shutdown your docker container by pressing _ctrl+c_ in the terminal you ran the _docker run_ command in.  This will terminate the Jupyter server.

## Conclusion

In this lab, you have examined the process to deploy a model locally and utilize it to summarize text.  However, this is only usable through the Jupyter Notebook.  To make this more usable for our production applications, we need to expose this model via an API.  We will evaluate this process in Object 3.

[objective 3 lab guide](../objective3/README.md)