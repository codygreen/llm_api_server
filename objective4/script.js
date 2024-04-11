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
