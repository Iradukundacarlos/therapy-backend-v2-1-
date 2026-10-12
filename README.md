# Therapy Backend v2 (Express + Sequelize + PostgreSQL)

Quick start (full explanation in GUIDE.md):

1. pgAdmin: create an EMPTY database called `therapy_db_v2`
2. `npm install`
3. copy `.env.example` to `.env` and put your Postgres password
4. `npm run db-sync`   (creates the 13 tables + sample data)
5. `npm run dev`       (starts the server on http://localhost:5000)
6. open http://localhost:5000/docs  (Swagger page) or use Postman

Test logins (password for all: `Test123`):
admin@therapy.com, amina@therapy.com, jean@therapy.com, grace@therapy.com,
eric@therapy.com, aline@therapy.com, patrick@therapy.com, diane@therapy.com
