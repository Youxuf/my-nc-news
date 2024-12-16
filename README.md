# Northcoders News API

NC News API

Welcome to the NC News API, a RESTful API providing data and functionality for articles, topics, users, and comments. This project allows users to interact with articles by reading, commenting, voting, and more.

The API is built using Node.js and Express, with a PostgreSQL database.

Hosted Version

You can access the hosted version of the API [here](https://my-nc-news-65s0.onrender.com/api).
Summary

Getting Started

Clone the Repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

Install Dependencies

npm install

Environment Variables
You need to create two .env files in the root directory: .env.test and .env.development.

.env.test
PGDATABASE=<your_test_db_name>
.env.development
PGDATABASE=<your_dev_db_name>
Replace <your_test_db_name> and <your_dev_db_name> with the appropriate database names.

Database Setup

Create the Databases
Ensure PostgreSQL is running locally and create the required databases:
npm run setup-dbs
Seed the Development Database
Populate the development database with seed data:
npm run seed

Running Tests

Run the test suite to ensure everything is working as expected:
npm test

Minimum Requirements

Node.js: v16.x or higher
PostgreSQL: v12.x or higher
Endpoints Overview

Refer to the /api endpoint for a full list of available endpoints and their usage.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
