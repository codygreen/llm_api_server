# LLM API Lab - Objective 1

In this lab, we will discovery a text summarization model in Hugging Face and test it out using the Hugging Face inference API (Serverless).

To get started, we will need to install a Jupyter Notebook.

An [interactive demo](https://app.revel.vivun.com/demos/2258dcce-cf99-45e7-8dc1-29b6437de242/paths/94f47199-14a8-4779-8f1c-4c0a812dee46) has been provided to demonstrate the Hugging Face model page and the Jupyter Notebook steps if this is your first time using either. 

## Deploy Jupyter Server

For this step, we will leverage a pre-built Jupyter Notebook container.  Run the following commands to start the container:

```shell
docker container run -it --rm -p 8888:8888 quay.io/jupyter/base-notebook
```

To access the Jupyter server, you will need to look for the the output that contains the access FQDN and token, it will look something like this:

```shell
Or copy and paste one of these URLs:
        http://4aae967c71b1:8888/lab?token=c325f331fc9fae368ded4f12ddb53d5457e219cfeacfa55e
        http://127.0.0.1:8888/lab?token=c325f331fc9fae368ded4f12ddb53d5457e219cfeacfa55e
```

Copy the url into your browser of choice.

## Create a Notebook

Now that we have the Jupyter server up and running, we can now create a new Notebook using the URL from our previous step.

In the Launcher window, click the _Python 3_ button under the Notebook section.  You should now see a new window with the title _Untitled.ipynb_.  Click the _Save_ button and call your file _text_summarization.ipynb_.

## Hugging Face Model

Now that we have our Notebook ready, we can examine the model we will be leveraging for this lab.  Open a new browser tab and enter the following URL: [https://huggingface.co/Falconsai/text_summarization](https://huggingface.co/Falconsai/text_summarization)

Hugging Face provides you with a model description, intended uses, and examples.  The model page also provides a example summarization via the Hugging Face Inference API; you should play with this and see the computed output.

After researching the model, you decide this is a good fit for the project you're building and decide to perform some tests via your Jupyter Notebook.

## Test Text Summarization Model

With a model selected, we can not test the model to determine if it fits our intended use case.

> **_Note:_** this will require that you have created a Hugging Face access token which will not be covered in this lab, but is well documented in the [Hugging Face documentation](https://huggingface.co/docs/hub/en/security-tokens). 

In your Jupyter Notebook browser tab, add the following code to your _text_summarization.ipynb_ window and ensure you replace _your_hugging_face_api_key_ with your actual access key:

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

If everything executed successfully, you should see a summarization about the Eiffel Tower.  

> **_Note:_** The Hugging Face Inference API may not have the model loaded when you make your request.  If you receive an error, this is most likely the issue.  Wait a minute and try your request again.

## Teardown

You can down shutdown your docker container by pressing _ctrl+c_ in the terminal you ran the _docker run_ command in.  This will terminate the Jupyter server.

## Conclusion

In this section, you learned how to discover models in Hugging Face and how to test them remotely using the Hugging Face Inference API.

Next, we will deploy the model locally.

[objective 2 lab guide](../objective2/README.md)