# Product Reseller API Readme

Welcome to the Product Reseller API! This API provides a platform for reselling various products. It is built using Express and TypeScript, and it uses Docker Compose to containerize the database and the RabbitMQ message broker.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Running with Docker Compose](#running-with-docker-compose)
  - [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

To run this project, you need to have the following tools installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (or [Yarn](https://yarnpkg.com/) as an alternative)

### Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/fernanduandrade/product-reseller.git
```


2. Navigate to the project directory:

```bash
cd product-reseller
```


3. Install the required dependencies:
```bash
npm install
```


## Usage

### Running with Docker Compose

To run the API and its dependencies using Docker Compose, follow these steps:

1. Make sure you have Docker and Docker Compose installed and running on your system.

2. Build and start the Docker containers for the API, the database, and the RabbitMQ broker:



The API will be accessible at `http://localhost:3000`.

### Running Locally

To run the API locally without Docker Compose, follow these steps:

1. Make sure you have Node.js and npm (or Yarn) installed on your system.

2. Start the database container using Docker Compose:


