# LLM API Lab - Objective 7

In this lab session, we will explore the utilization of NGINX Plus as a reverse proxy for public LLM APIs, demonstrating how companies can seamlessly grant applications access to SaaS-based LLM models without the overhead of generating unique API tokens for each application.  

## Groq

[Groq](https://groq.com/) is unique in the AI space due to the fact they build their own AI chips that provide some of the highest tokens per second rates in the industry, which is outstanding for AI inference.  Groq states on their website:

>"We created the LPU™ Inference Engine - the first and fastest of its kind - serving the real-time AI market. Our solution for inference (not training) makes us the AI performance leader, in regards to speed and precision, in the compute center.  
Unlike other providers, we aren't brokering a cloud service. We built our own chip, compiler and software, systems, and GroqCloud™. Our first-gen GroqChip™, a Language Processing Unit™ (LPU), is a new processor category. That's one part of our secret sauce."

As of this April 2024, Groq provides free API access to popular models like:

- Mixtral 8x7b
- Llama2 70b
- Gemma 7b

We will leverage the Groq API to complete this portion of the lab.

Create a Groq account by heading over to [https://console.groq.com/login](https://console.groq.com/login).  Once you are logged in, select the _API Keys_ menu option and create a new API Key named _nginx_.

## Open AI API

Groq, and many other LLM SaaS providers leverage the Open AI API Spec due to it's popularity and wide use in the market.  This makes it easy for developers to switch their applications from Open AI to other providers.

For this lab, we will need to configure NGINX to handle a new API path: _/openai/v1/chat/completions_.

## NGINX Configuration

Our NGINX configuration will build upon our previous objectives with the addition of a new
location that leverages proxy_pass to send our API requests to the Groq cloud.

You will need to edit the _nginx.conf_ file and replace _your_groq_token_ with the token you created in the previous step.

```nginx
events {
    worker_connections 1024;
}
http {
    upstream llmapi {
        server llmapi:80;
    }

    server {
        listen 80;
        location / {
            auth_jwt "LLM API";
            auth_jwt_key_file /etc/nginx/llmapi.jwk;
            proxy_pass http://llmapi;
        }

        location /openai/v1/chat/completions {
            auth_jwt "LLM API";
            auth_jwt_key_file /etc/nginx/llmapi.jwk;
            proxy_pass https://api.groq.com;
            proxy_ssl_server_name on;
            proxy_set_header Authorization "Bearer your_groq_token";
        }
    }

}
```

Lets take a look at what our new configuration is doing:

- _proxy_pass_: sends the traffic to the Groq cloud API
- _proxy_ssl_server_name_: tells NGINX to honor the SNI in the TLS handshake
- _proxy_set_header_: inserts the Groq API bearer token

> _**Note:**_ the Groq API bearer token is never exposed to the end user

## Authorization

In this example we continue to leverage the JSON Web Token from previous objectives.  This simulates a JWT that would be provided by the users identify provider.  This makes it easy to validate that the user should have access to the Groq API without the need to create a unique token with every LLM provider for each user/service.

## Deploy Environment

We will leverage the contents of the _docker-compose.yml_ file from _objective6_.  and deploy our environment with the command below:

```shell
docker compose up -d
```

You should now have the following containers running:

- Jupyter Notebook
- NGINX Plus
- LLMAPI (our local LLM application)

## Testing

Now that our environment is up and running, we can leverage our Jupyter Notebook to test NGINX as an API proxy to the Groq Cloud.

Open a browser and access the Jupyter Notebook at: [http://localhost:8888](http://localhost:8888), the token is: _nginxrocks!_

In your Jupyter Notebook, you notice a directory called _notebooks_ in your explorer window with a notebook called _groq.ipynb_.  Open the _groq.ipynb_ file.

The objective of this code is very similar to what we saw in _objective6_, supply a brief except from a book that discusses the founding of F5 and we ask the model for a summary.  Let's test if the Mixtral model perform better than our local summarization model.

To execute the python code, click _shift + enter_ in each cell or click the &#x23e9; icon to restart the kernel and run all cells.

## Outcome

Yes, the outcome was way better than our previous test! Not only was the inference faster, but the text summary includes information about F5 and the BIG-IP.  

This is a much better result than our local text summarization model provided.  However, to be fair, there is a significant difference in the training size between the two so it was an unfair comparison &#x1F601;.

## Teardown

Clean up your environment by running the following command:

```shell
docker compose down
```

## Conclusion

I hope these labs have helped prove the effectiveness of using NGINX Plus as a reverse proxy for your AI initiatives.

This is just the start as F5 will continue to publish more content, trainings and capabilities on AI so make sure to check [F5.com](https://f5.com) for more details or talk with your F5 solutions engineer to learn about training in your region.

Thank you for taking the lab!
