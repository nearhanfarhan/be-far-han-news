# Northcoders News API

# Link to hosted version:

https://far-han-news.onrender.com/api/users

# About this project:

This is a custom News API built and tested from scratch (pretty much) by Farhan. It currently has 9 or more endpoints, which is loads!
There are still quite a few features to come, and I'm most looking forward to building a front-end for it, watch this space 0_0

# Setting up environment variables:

To set up environment variables, use the .env-example template to assign PGDATABASE to the correct database location.

for testing: nc_news_test
for dev: nc_news

# Installing dependencies:

Dependency requirements can be found under devDependencies and dependencies in package.json.
If using npm as your package manager, run the command "npm install" in the terminal.

# Seeding a local database

With PSQL running on your computer, run "npm setup-dbs" to setup the database, and "npm run seed" to run the seed and insert data into the database.

# Minimum version requirements

Node: v18.16.1
Postgres v15.2
