# Streamverse Backend

## Introduction

This is the backend application for Streamverse - a web-based video call socialising application with some game elements. The codebase is based off an example project from https://github.com/Azure-Samples/communication-services-contoso-med-app which demonstrates how to integrate Azure services.

### This backend service provides APIs for the following
### General APIs
- User authentication
- Chat management

### Additional services
- Gamestate sharing

### Azure Communication Service specific APIs
- User ID and token generation
- Chat thread initialization

Starting the backend server requires having 
[NodeJs](https://nodejs.org/en/) installed.

### Configuration
Follow the steps below before running the solution
 
Fill configuration information in the `config.json` file

```JSON
{
    "mongodbConnection":"<COSMOS_DB_OR_MONGODB_CONNECTION_STRING>",
    "dbName": "<DATABASE_NAME>",
    "connectionString": "<AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING>",
    "jwtPrivateKey": "<JWT_PRIVATE_KEY_FOR_AUTHENTICATION>",
    "endpoint": "<AZURE_COMMUNICATION_SERVICES_ENDPOINT>",
    "smsLogicAppEndpoint": "<AZURE_COMMUNICATION_SERVICES_SMS_LOGIC_APP_HTTP_TRIGGER_ENDPOINT>",
    "qnaMakerEndpoint": "<QNA_MAKER_ENDPOINT_URL>",
    "qnaMakerEndpointKey": "<QNA_MAKER_ENDPOINT_KEY>"
}

```


After you have configured everything, run

```
npm install
```

and then,

```
npm run start
```
