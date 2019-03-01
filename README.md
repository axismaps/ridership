# Ridership Visualization

## Installation

To install all the dependencies for the project, run:

```sh
npm install
```

## Building

The project is built using webpack. Start a development server with:

```sh
npm run dev
```

Or build the full application for deployment using:

```sh
npm run build
```

The deploy script builds the application and automatically deploys it to S3 (requires the `aws-cli` and proper credentials stored in path):

```sh
npm run deploy
```

## Creating Datasets

All of the data in the project is built directly from sources downloaded from:

* NTD Website
* The Census API
* Transit.land

