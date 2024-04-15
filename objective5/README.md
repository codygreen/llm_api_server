# LLM API Lab - Objective 5

In this lab, we will add authorization to our model API using NGINX Plus.

While there are a few ways to implement API Authorization via the NGINX OSS implementation, for this lab we will leverage one of the more prominent API authentication methods using JSON Web Tokens (JWT), which requires NGINX Plus.

> _**Note**_: if you are new to JWT, check out a great introduction by Auth0 [here](https://jwt.io/introduction) and the [NGINX documentation](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-jwt-authentication/).

In this lab, we will leverage static tokens, but in a production environment, you would leverage an authentication provider, like Azure Entra ID or Okta, to create the token.  Fore more information, please check out the [Authenticating API Clients with JWT and NGINX Plus blog](https://www.nginx.com/blog/authenticating-api-clients-jwt-nginx-plus/).

## Obtain NGINX License

To leverage NGINX Plus, we will need access to the NGINX private registry, which requires a license SSL certificate and private key files or JSON Web Token file.  If you do not have an NGINX Plus License, please request a [free trial](https://www.nginx.com/free-trial-request/).  If you are an F5 employee, please use the internal trial mechanisms to generate a temporary license.

## Access NGINX Private Registry

Now that you have the required license and access files, please follow the [NGINX documentation](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-docker/#myf5-download) to pull the correct NGINX Plus docker image, for this lab we will leverage the NGINX Plus image w/o Agent.

```shell
NGINX_JWT=`cat nginx-repo-12345abc.jwt`
docker login private-registry.nginx.com --username=$NGINX_JWT --password=none
```

You should see a _Login Succeeded_ message.

Now that we have access to the NGINX private registry, lets pull the NGINX Plus container we need for this lab:

```shell
docker pull private-registry.nginx.com/nginx-plus/base:debian
```

## NGINX Configuration

We will extend the NGINX configuration from _objective4_ to enable JWT authorization for our root path.  An updated version of the _nginx.conf_ file is provided in the _objective5_ directory as well as below:

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
    }
}
```

There are two new directives in this file:

- _auth_jwt_: defines the authentication realm
- _auth_jwt_key_file_: tells NGINX Plus how to validate the signature element of the JWT

For this lab, we will leverage the JWK file used in the [Authenticating API Clients with JWT and NGINX Plus blog](https://www.nginx.com/blog/authenticating-api-clients-jwt-nginx-plus/).  This file has been saved in the _objective5_ directory as _llmapi.jwk_ and it's code is also provided below:

```jwt
{"keys":
    [{
        "k":"ZmFudGFzdGljand0",
        "kty":"oct",
        "kid":"0001"
    }]
}
```

For more information about the JWK file and each attribute, please reference the [previously mentioned blog post](https://www.nginx.com/blog/authenticating-api-clients-jwt-nginx-plus/).

> _**Note:**_ do not use this JWK file in production as it is leveraged for training and blog posts and the key should be considered compromised.

## Deploy Containers

Our Docker compose file will look every similar to the compose file in _objective4_, with the addition of an extra volume to map the _llmapi.jkw_ file.  An updated version is provided in the _objective5_ directory with the below contents:

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
```

Now that we have our _docker-compose_ file and our NGINX configuration ready, we can run the following command to deploy our containers:

```shell
docker compose up -d
```

You should now be able to access the AI Model API on port 80, through NGINX, and on port 8080 directly.

## Testing

Our first test is to validate that a request to the root URI _/_ requires authentication:

```shell
curl http://localhost/
```

You should see output like the text below indicating authentication is required:

```shell
<html>
<head><title>401 Authorization Required</title></head>
<body>
<center><h1>401 Authorization Required</h1></center>
<hr><center>nginx/1.25.3</center>
</body>
</html>
```

For the next step, we will need to build our authorization header using data from our JWK file.  Again, we are leveraging the example from the [Authenticating API Clients with JWT and NGINX Plus blog](https://www.nginx.com/blog/authenticating-api-clients-jwt-nginx-plus/) so please reference that post for more details.

```shell
export HEADER_PAYLOAD=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjAwMDEifQ.eyJuYW1lIjoiUXVvdGF0aW9uIFN5c3RlbSIsInN1YiI6InF1b3RlcyIsImlzcyI6Ik15IEFQSSBHYXRld2F5In0.ggVOHYnVFB8GVPE-VOIo3jD71gTkLffAY0hQOGXPL2I
```

This command contains 3 components seperated by a period (_._):

1. _header:_ sets the algorithm and type of token
1. _payload:_ claim
1. _signature:_ signature used to verify message integrity

With our JWT prepared, we can now issue a new request with the JWT supplied as a _Bearer_ token in an _Authorization_ header:

```shell
curl -H "Authorization: Bearer ${TEST_HEADER}" http://localhost/
```
This should produce a JSON payload with a message of "Hello World", like below.  If you receive 401, please check ensure that your JWT matches the example above.

```shell
{"message":"Hello World"}
```

Now that we know authorization is working, lets test our LLM API with an authorization header:

```shell
read -r -d '' ARTICLE << 'EOF'
Igor Sysoev originally wrote NGINX to solve the C10K problem, a term coined in 1999 to describe the difficulty that existing web servers experienced in handling large numbers (the 10K) of concurrent connections (the C). With its event‑driven, asynchronous architecture, NGINX revolutionized how servers operate in high‑performance contexts and became the fastest web server available.

After open sourcing the project in 2004 and watching its use grow exponentially, Sysoev co‑founded NGINX, Inc. to support continued development of NGINX and to market NGINX Plus as a commercial product with additional features designed for enterprise customers. NGINX, Inc. became part of F5, Inc. in 2019. Today, NGINX and NGINX Plus can handle hundreds of thousands of concurrent connections, and power more of the Internet’s busiest sites than any other server.
EOF

PAYLOAD=$(jq -c -n --arg text "$ARTICLE" '$ARGS.named')

curl -i \
-H "Accept:application/json" \
-H "Content-Type:application/json" \
-H "Authorization: Bearer ${TEST_HEADER}" \
-X POST --data "$PAYLOAD" http://localhost/summarize/
```

You should see a summarization about NGINX being created to solve the C10K problem.

## Teardown

Clean up your environment by running the following command:

```shell
docker compose down
```

## Conclusion

In this lab, we examined how to leverage NGINX to provide authorization for our AI model's API to limit access to only our intended users.  Now that we have rate limiting and authorization implemented to protect our model, we are ready to perform inference training.

In the next section, we will examine how to leverage our AI Model's API to make inference training easier.

[objective 6 lab guide](../objective6/README.md)