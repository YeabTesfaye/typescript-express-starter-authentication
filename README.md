[![LinkedIn](https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yeabisera-tesefaye)

<br />
<div align="center">
  <a href="https://github.com/YeabTesfaye/typescript-express-starter-authentication"></a>

<h3 align="center">[Express Server With TS & Authentication]</h3>

  <p align="center">
    A robust authentication and authorization system built with TypeScript, providing secure user registration, email verification, role-based access control, and password management. The project utilizes industry-standard security practices, including password hashing, email verification with code-based activation, and user role management
    <br />
    <a href="http://localhost:3000/api-docs/"><strong>Explore the docs »</strong></a>
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Features](#features)
- [Getting Started & Installation](#getting-started)
- [Environment Variables](#environment-variables)
- [Routes](#routes)
- [Usage](#usage)

## Features

Built with:

- Typescript
- Node.JS
- Express.JS
- Prisma ORM (PostgreSQL)
- JWT (JSON Web Tokens)
- Cloudinary [For Image Uploading]
- Mailsender [For Receiving Order Confirmation Messages]

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Getting Started

```sh
git clone https://github.com/YeabTesfaye/typescript-express-starter-authentication.git
npm install
npx prisma init
npx prisma migrate dev --name init
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
SERVICE= your service
EMAIL_HOST= your gmail service
EMAIL_PORT=465
EMAIL_ADDRESS=hereisyeab@gmail.com
EMAIL_PASSWORD=yeab@web12
NODE_ENV=development
JWT_SECRET=THIS IS NOT A SECRET
JWT_LIFETIME=3000000
CLIENT_URL=localhost:3000/api/v1/auth
CLOUD_NAME=dggbxwbzw
CLOUD_API_KEY=956232134621998
CLOUD_API_SECRET=rpcyi86oXyPdeYor6MKDxEEX4gk
```

## Routes

> [!NOTE]

- [ ] Authentication:

```sh
POST `/api/v1/auth/register`- Register a new user
GET `/api/v1/auth/verifyEmail/token`- Verifying your email address
POST `/api/v1/auth/resetpassword/token `- Reset password
POST `/api/v1/auth/login`- Login a user
GET `/api/v1/auth/logout` - Logout a user
```

- [ ] Users:

```sh
GET `/api/v1/users` - Get all users
GET `/api/v1/users/:id` - Get User By ID
PATCH `/api/v1/users/:id` - Update user data
PATCH `/api/v1/users/:id/updatePassword` - Update user password
PATCH `/api/v1/users/:id/updateRole` - Update user role
DELETE `/api/v1/users/:id` - Delete user
```

## Usage

After creating .env with all [Environment Variables](#environment-variables) :

1. Run the server using:

```sh
npm run dev
```

2. Register a new user.
   > [!TIP]
   > Use your real email, you'll need it for confirmation code
   > First registered account role will automatically set to => admin

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
