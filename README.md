# DocuSign eSignature API utils

This app creates a TypeScript server for interacting with the DocuSign eSignature API.

## Features

- TypeScript support
- Express web framework
- Jest for testing
- ESLint and Prettier for code quality

## Getting Started

1. Clone the repository
2. Install dependencies
3. Start the development server

```bash
git clone https://github.com/your-username/docusign-utils.git
cd docusign-utils
pnpm install
pnpm dev
```

## Endpoints

### GET /ds/code
Get the DocuSign eSignature API consent code.

This endpoint initiates the OAuth2 authorization flow by redirecting the user to the DocuSign login page. Upon successful login, the user is redirected back to your application with a consent code.

### GET /ds/callback
The callback endpoint is called by DocuSign after the user has logged in and consented to the application. It receives the consent code and exchanges it for an access token.

### GET /jwt-token

Get the JSON Web Token (JWT) for accessing the DocuSign eSignature API.

This endpoint exchanges the access token for a JWT, which can be used to authenticate API requests.
