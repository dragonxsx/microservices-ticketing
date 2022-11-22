# microservices-ticketing

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/dragonxsx/microservices-ticketing">
    <img src="docs/images/logo.png" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">Ticketing</h3>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#techniques">Techniques</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#project-structure">Project structure</a></li>
        <li><a href="#presentation">Presentation</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#common-issues">Common issues</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

[![UI][product-screenshot]](https://github.com/dragonxsx/microservices-ticketing)

This project is created from scratch to evaluate the possibility of microservices architecture.

### Features:
* Authentication
* Product management (Create and Sell ticket)
* View and purchase product
* Stripe integration for payment

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Techniques
* Event-Driven Architecture using NATS Streaming Server as Event bus
* Optimistic Concurrency Control (OCC) for handling concurrency issues
* Implement worker service using Bull Queue
* JWT Authentication
* Server side rendering with Next.js

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With
List of major frameworks/libraries used to bootstrap the project.
* [ExpressJS](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [NATS Streaming Server](https://nats.io/)
* [Bull Queue](https://github.com/OptimalBits/bull)
* [Next.js](https://nextjs.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Project structure
| Folder       | Detail                                                                        |
| ------------ | ----------------------------------------------------------------------------- |
| auth         | Service to handle authentication (signup/signin/signout)                      |
| client       | The client application (Next.js)                                              |
| common       | The commmon service that used in every service and it's uploaded to npmjs.com |
| infra        | Kubernetes infrastucture for this application                                 |
| nats-test    | Testing to NATS Streaming Server                                              |
| orders       | Order service                                                                 |
| tickets      | Ticket service                                                                |
| payments     | Service for handling payment processes                                        |
| expiration   | Expiration worker for locking ticket during payment waiting                   |
| skaffold.yml | Skaffold configuration for this project                                       |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Presentation
For more information, please refer
* [Microservices introduction](docs/slide/Microservices.pdf)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started
This is an instruction on setting up the project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites
* Docker
* Kubernetes
* Skaffold

### Installation
1. Get a free Stripe API Key at [https://stripe.com](https://stripe.com/)
2. Clone the repo
   ```sh
   git clone https://github.com/dragonxsx/microservices-ticketing.git
   ```
3. Install NGINX Ingress Controller
   ```sh
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml
   ```
4. Generate ssl certificate and create tls secret
   ```sh
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl-key.key -out ssl-cert.cert -subj "/CN=ticketing.dev/O=ticketing.dev"
   kubectl create secret tls ticketing --key ssl-key.key --cert ssl-cert.cert
   ```
5. Create secret environment variables
    ```sh
    kubectl create secret generic jwt-secret --from-literal=JWT_KEY=${YOUR_JWT_KEY}
    kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=${YOUR_STRIPE_KEY}
    ```
6. Change local environment hosts file

    Edit hosts file
    * For Windows: C:\Windows\System32\drivers\etc\hosts
    * For Mac/Linux: /etc/hosts

    Add new line
    ```
    127.0.0.1 ticketing.dev
    ```
7. Bootstrap the application
    ```sh
    skaffold dev
    ```

### Common issues
<details>
<summary>Error: mongo can't be pulled</summary>

  Try pulling the image manually from outside of Skaffold:
  ```sh
  docker pull mongo
  ```
  If this is successful, it should cache it locally and the problem will no longer persist.
</details>

<details>
<summary>secret "jwt-secret" not found</summary>

  ```sh
  kubectl create secret generic jwt-secret --from-literal=JWT_KEY=${YOUR_JWT_KEY}
  ```
</details>

<details>
<summary>503 service temporarily unavailable</summary>

  Delete and re-install ingress controller

  1. Get the namespace which your ingress controller installed in
      ```sh
      kubectl get ns
      ```
      for example : ingress-nginx
  2. Remove all resources in this namespace
      ```sh
      kubectl delete all  --all -n ingress-nginx
      ```
      If your ingress controller is not installed in a dedicated namespace so you will have to remove resources one by one.
      ```sh
      kubectl delete ingress ingress-nginx
      kubectl delete deployment ingress-nginx
      kubectl delete service ingress-nginx
      ```
  3. Install ingress controller
      ```sh
      kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml
      ```
</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Nguyen Thanh Long - [@dragonxsx](https://github.com/dragonxsx)

Project Links: 
* [https://github.com/dragonxsx/microservices-ticketing](https://github.com/dragonxsx/microservices-ticketing)
* [https://github.com/dragonxsx/microservices-ticketing-common](https://github.com/dragonxsx/microservices-ticketing-common)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: docs/images/ui.png