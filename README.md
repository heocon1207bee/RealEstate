# RealEstate API

API for websites to post real estate for sale and rent.

## User Operations

### 1. Sign Up

- Endpoint: `/api/v1/user/signup`
- Method: `POST`
- Request Body:
  ```json
  {
    "email": "String",
    "password": "String",
    "name": "String",
    "phone": {
      "country": "String",
      "number": "String"
    }
  }
  ```
- Password: min 6 digits, max 50 digits
- Name: max 250 digits
- Country Enum: ["vietnam", "laos", "cambodia"]

### 2. Log in

- Endpoint: `/api/v1/user/login`
- Method: `POST`
- Request Body:
  ```json
  {
    "email": String,
    "password": String,
  }
  ```

### 3. Get user by email:

- Endpoint: `/api/v1/user?email=<email>`
- Method: GET
