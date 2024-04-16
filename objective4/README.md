# LLM API Lab - Objective 4

In this lab session, we will enhance the security and reliability of our model API by implementing rate limiting using NGINX.

Rate limiting is a critical measure to prevent abuse and ensure the smooth operation of our API by restricting the number of requests a client can make within a specified timeframe. Leveraging NGINX we will explore techniques to configure and fine-tune rate limits tailored to the requirements of our application.

By implementing rate limiting we can effectively safeguard our model API against potential denial-of-service attacks while optimizing resource utilization and ensuring a consistent user experience for our application's consumers.

## Docker Compose

Since we already have a container image for our AI model API we can leverage a docker compose file to deploy our api and nginx containers.

We will leverage the _docker-compose.yml_ file in the _objective4_ folder with the contents below:

```dockerfile
version: "3.8"
services:
  llmapi:
    image: llmapi
    ports:
      - "8080:80"
  nginx:
    image: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - llmapi
```

Lets break down what is happening in this file:

- deploying two services: llmapi and nginx
- llmapi service will deploy on tcp port 8080 for the host an port 80 in the container
- nginx service will deploy on tcp port 80 for the host and container
- the _nginx.conf_ file will be mounted from the host into the NGINX container

## NGINX Configuration

To configure NGINX, we will leverage the _nginx.conf_ in the _objective4_ folder with the following configuration:

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
            proxy_pass http://llmapi;
        }
    }
}
```

In this configuration, we are telling NGINX to leverage the _llmapi_ service as our upstream and to pass all traffic on port 80 to the llmapi upstream.

## Deploy Containers

Now that we have our _docker-compose_ file and our NGINX configuration ready, we can run the following command to deploy our containers:

```shell
docker compose up -d
```

You should now be able to access the AI Model API on port [http://localhost](http://localhost), through NGINX, and on port [http://localhost:8080](http://localhost:8080) directly.

## Testing with K6

[K6](https://k6.io/docs/get-started/running-k6/) is a modern, developer-friendly performance testing tool used to assess the scalability and reliability of web services and APIs. Offering a user-centric approach, K6 enables developers to write tests using JavaScript, providing flexibility and familiarity for those already proficient in the language.

For this lab, a test script has already been created for you. The _script.js_ file code is displayed below:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function() {

  const data = {text: "Igor Sysoev originally wrote NGINX to solve the C10K problem, a term coined in 1999 to describe the difficulty that existing web servers experienced in handling large numbers (the 10K) of concurrent connections (the C). With its event‑driven, asynchronous architecture, NGINX revolutionized how servers operate in high‑performance contexts and became the fastest web server available. After open sourcing the project in 2004 and watching its use grow exponentially, Sysoev co‑founded NGINX, Inc. to support continued development of NGINX and to market NGINX Plus as a commercial product with additional features designed for enterprise customers. NGINX, Inc. became part of F5, Inc. in 2019. Today, NGINX and NGINX Plus can handle hundreds of thousands of concurrent connections, and power more of the Internet’s busiest sites than any other server."}
  const res = http.post('http://host.docker.internal/summarize/', JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  check(res, {
    'status is 200 or 503': (r) => r.status === 200 || r.status === 503,
    'body includes NGINX': (r) => r.body.includes('NGINX'),
    'body includes C10K': (r) => r.body.includes('C10K'),
    'body includes Igor Sysoev': (r) => r.body.includes('Igor Sysoev'),
  });
  sleep(1);
}

```

Lets examine what is happening in this code:

- set our virtual users and duration
- set a sample text to be summarized
- make a request to the docker host's localhost interfaces with /summarize/ endpoint
- check if the HTTP response code is 200 (OK) or 503 (rate limited)
- check if the HTTP response body includes the word 'NGINX'
- check if the HTTP response body includes the word 'C10K'
- check if the HTTP response body includes the words 'Igor Sysoev'

Now, run the following command to test our API using K6; this will take a few minutes:

```shell
docker run --rm -i grafana/k6 run - <script.js
```

You can also watch your docker CPU ulitization by opening a new shell and running the following command while the test is running:

```shell
docker stats
```

Once K6 finishes it's test, you will noticed that your docker CPU utilization skyrocketed and several of the tests failed.  The output will include something similar to the example below:

```shell
running (40.0s), 000/100 VUs, 5 complete and 96 interrupted iterations
constant_request_rate ✓ [ 100% ] 096/100 VUs  10s  10.00 iters/s
```

This tells us that the AI model cannot handle the simple load K6s is applying to the API.  To fix this, we will configure NGINX to rate limit our API.

## NGINX Rate Limit Configuration

Open your _nginx.conf_ file and modify it to match the configuration below:

```nginx
events {
    worker_connections 1024;
}
http {
    upstream llmapi {
        server llmapi:80;
    }

    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=2r/s;

    server {
        listen 80;
        location / {
            limit_req zone=mylimit;
            proxy_pass http://llmapi;
        }
    }
}
```

In this configuration, we are rate limiting the API to 2 requests per second per unique remote address.

Now, verify that your NGINX config file is correct and reload the configuration with the following commands:

```shell
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

> _**Note:**_ for more information on rate limiting works and advance configuration examples check out the [NGINX Blog by Amir Rawdat](https://www.nginx.com/blog/rate-limiting-nginx/).

## New Test

Now that we have NGINX configured for rate limiting, let's test our API again with the following command:

```shell
docker run --rm -i grafana/k6 run - <script.js
```

```shell
default ↓ [ 100% ] 10 VUs  30s

     ✓ status is 200 or 503
     ✗ body includes NGINX
      ↳  19% — ✓ 12 / ✗ 50
     ✗ body includes C10K
      ↳  19% — ✓ 12 / ✗ 50
     ✗ body includes Igor Sysoev
      ↳  19% — ✓ 12 / ✗ 50
```

In the example above, you'll notice that all requests returned a response code of 200 or 503, but only 19% of the requests returned a text summarization about the creation of NGINX.  This is ideal, and informs the requestor to try their request again after a random backoff period.

> _**Note:**_ if your response percentage is 0%, then you may have crashed your llmapi container.  Restart the container and test again.

## Teardown

Clean up your environment by running the following command:

```shell
docker compose down
```

## Conclusion

In this lab, we've delved into the crucial task of enhancing the security and reliability of our AI model's API by implementing rate limiting through NGINX, thereby fortifying it against potential denial-of-service (DoS) attacks. By constraining the frequency and volume of incoming requests, we've taken proactive measures to safeguard the availability and performance of our model, ensuring uninterrupted service for legitimate users.

However, as we prepare to transition to the next stage, it's evident that further security measures are required. In the upcoming section, we will focus on implementing authorization mechanisms to restrict access to the AI model API, ensuring that only authenticated and authorized users can leverage its capabilities.

[objective 5 lab guide](../objective5/README.md)
