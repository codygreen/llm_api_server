# LLM API Lab - Objective 1

In this lab session, participants will delve into the exploration of a text summarization model hosted by the [Hugging Face Inference API](https://huggingface.co/docs/api-inference/en/index).  This experience aims to equip participants with a practical understanding of discovering and testing AI models.

To get started, we will need to install a Jupyter Notebook.

An [interactive demo](https://app.revel.vivun.com/demos/2258dcce-cf99-45e7-8dc1-29b6437de242/paths/94f47199-14a8-4779-8f1c-4c0a812dee46) has been provided to demonstrate the Hugging Face model page and the Jupyter Notebook steps if this is your first time using either.

## Deploy Jupyter Server

For this step, we will leverage a pre-built Jupyter Notebook container hosted by the official [Jupyter container registry](https://quay.io/organization/jupyter).

Run the following commands to start the container:

```shell
docker container run -it --rm -p 8888:8888 quay.io/jupyter/base-notebook
```

Lets examine what this command is doing:

- _docker container run -it_: run a container in interactive mode
- _--rm_: delete the container when exited
- _-p 8888:8888_: map the container host port 88888 to the host port 88888
- _quay.io/jupyter/base-notebook_: pull the jupyter/base-notebook image from quay.io registry

To access the Jupyter server, you will need to look for the the output that contains the access FQDN and token, it will look something like this:

```shell
Or copy and paste one of these URLs:
        http://4aae967c71b1:8888/lab?token=c325f331fc9fae368ded4f12ddb53d5457e219cfeacfa55e
        http://127.0.0.1:8888/lab?token=c325f331fc9fae368ded4f12ddb53d5457e219cfeacfa55e
```

Copy the url into your browser of choice.

## Create a Notebook

Now that we have the Jupyter server up and running, we can now create a new Notebook using the URL from our previous step.

In the Launcher window, click the _Python 3_ button under the Notebook section.  You should now see a new window with the title _Untitled.ipynb_.  Click the _Save_ button (&#x1F4BE;) and call your file _text_summarization.ipynb_.  

You can also follow along with the [interactive demo](https://app.revel.vivun.com/demos/2258dcce-cf99-45e7-8dc1-29b6437de242/paths/94f47199-14a8-4779-8f1c-4c0a812dee46) if the steps above are confusing.

## Hugging Face Model

Hugging Face was founded in 2016 and is one of the key sources to find AI and download AI models.  Hugging Face leverages a Git-based version control for the models with additional community tooling for collaboration, model sharing, and fine-tuning, thus facilitating seamless integration into diverse projects and workflows.

For this lab, we will leverage the [Falcons AI Text Summarization model](https://huggingface.co/Falconsai/text_summarization) hosted in Hugging Face.  This model is a fine-tuned version of the [T5](https://huggingface.co/docs/transformers/en/model_doc/t5) transformer model with a focus on text summarization.  This model was chosen for it's small size and ability to run performant on a generic CPU.

Take a few minutes to examine the Hugging Face model page for [Falconsai/text_summarization](https://huggingface.co/Falconsai/text_summarization).  It provides you with a model description, intended uses, and examples.  The model page also provides a example summarization via the Hugging Face Inference API; you should play with this and see the computed output.

After researching the model, you decide this is a good fit for the project you're building and decide to perform some tests via your Jupyter Notebook.

## Test Text Summarization Model

With the text_summarization model selected, we can now test the model to determine if it fits our intended use case.

> **_Note:_** this will require that you have created a Hugging Face access token which will not be covered in this lab, but is well documented in the [Hugging Face documentation](https://huggingface.co/docs/hub/en/security-tokens).

In your Jupyter Notebook browser tab, add the following code to your _text_summarization.ipynb_ window and ensure you replace _your_hugging_face_api_key_ with your actual access key.  To execute the code, press _shift + enter_:

```python
import requests

API_URL = "https://api-inference.huggingface.co/models/Falconsai/text_summarization"
headers = {"Authorization": "Bearer your_hugging_face_api_key"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

output = query({
    "inputs": "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.",
})

print(output[0]['summary_text'])
```

If everything executed successfully, you should see a summarization about the Eiffel Tower like the example below:

```text
Hugging Face was founded in 2016 by Clément Delangue, Julien Chaumond, and Thomas Wolf . The name was chosen to reflect the company's mission of making AI models more accessible and friendly to humans, much like a comforting hug .
```

> **_Note:_** The Hugging Face Inference API may not have the model loaded when you make your request.  If you receive an error, this is most likely the issue.  Wait a minute, click in text block where the code is and try your request again.

## Teardown

You can shutdown your docker container by pressing _ctrl+c_ in the terminal you ran the _docker run_ command in.  This will terminate the Jupyter server.

## Conclusion

In summary, this section has provided you with valuable knowledge about finding models in Hugging Face and testing them remotely using the Hugging Face Inference API. With these skills, you can now explore a wide range of advanced AI models and easily incorporate them into your projects and applications.

Next, we will walk through the process of deploying the text-summarization model locally and the advantages this provides.

[objective 2 lab guide](../objective2/README.md)
