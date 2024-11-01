# ubiodiscoveryservice

### Welcome to Ubio Discovery Service!

This is a web application consisting of a backend built with Node.js and TypeScript and a frontend built with React and TypeScript. The service monitors client applications by tracking their heartbeats and managing their instance statuses. Below are the instructions for setting up and running the app on your local machine.

## Getting Started

### Prerequisites

Node.js and npm (Node Package Manager) must be installed on your machine. You can download the latest version from the official Node.js website: https://nodejs.org

#### Installation

Clone this repository to your local machine using the following command:

```
git clone git@github.com:winterborn/ubiodiscoveryservice.git
```

Navigate to the backend folder:

Install the backend dependencies:

```
npm install
```

Configure environment variables:

Open .env.example and update the values as needed. For example:

```
# Expiration Age:
# 30 seconds: The default time in milliseconds after which an instance is considered expired if no heartbeat is received.
# Adjust based on how frequently instances are expected to send updates.
# Lower values may be more suitable for services that require close monitoring of instance activity.
EXPIRATION_AGE=30000

# Cleanup Interval:
# 10 seconds: The frequency in milliseconds at which expired instances are removed from the system.
# Lower intervals result in more frequent cleanup, which can help keep the system lean.
# Higher intervals may be better suited for systems where expired instances do not need immediate removal.
CLEANUP_INTERVAL=10000
```

Configure EXPIRATION_AGE and CLEANUP_INTERVAL in the environment settings to control how frequently the service cleans up expired instances.
If not set, the backend service will use default values of EXPIRATION_AGE=30000 and CLEANUP_INTERVAL=10000.

Compile and start the backend server:

For development and / or to compile:

```
npm run dev
```

For production (after compilation):

```
npm run start
```

The backend service should now be running.

In a separate terminal window, navigate to the frontend folder:

Install the frontend dependencies:

```
npm install
```

Configure environment variables:

Update REACT_APP_POLLING_INTERVAL=10000 in the .env file to your preferred polling interval. This has a default value of REACT_APP_POLLING_INTERVAL=10000 if none is provided.

```
# Recommended Polling Intervals:
# 10 seconds: If near real-time updates are desired and backend can handle frequent requests.
# 15-30 seconds: For most dashboards where minute-by-minute updates are ok.
# 60+ seconds: If the data doesn't change very often or if it's acceptable to have less frequent updates.
REACT_APP_POLLING_INTERVAL=10000
```

Start the frontend server (after the backend is running):

```
npm start
```

The frontend will be accessible at http://localhost:3000 and should automatically open in your default browser.

## API Requests

- **Import the Postman Collection**: Import the collection file located in the `postman` folder to quickly access and test API endpoints.

### Sample API Requests

- **POST** to create or update a group and instance:

  ```
    POST http://localhost:8080/{group}/{id}

    Example body:
    {
        "meta": {
            "foo": "bar"
        }
    }

  ```

Other supported endpoints include /test, /instances, /metrics and specific requests for groups and instances.

## Tests

To run tests for the backend, navigate to the backend folder and execute the following command:

```

npm test

```

## Acknowledgments

Special thanks for the contributions and inspiration behind the design from Ubio.
