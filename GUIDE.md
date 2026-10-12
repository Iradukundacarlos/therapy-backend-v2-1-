# GUIDE: run it, understand it, present it

Open this file in VS Code and press **Ctrl + Shift + V** to read it formatted.

**How to use this guide**
- Part 1 = run the project (do it first, about 15 minutes).
- Part 2 = understand it in simple words (this is what you missed on Friday).
- Part 3 = test it in Postman.
- Part 4 = the questions your lecturer may ask, with answers.
- Part 5 to 7 = how to add things, common errors, and a study plan.

---

# PART 1. RUN THE PROJECT (step by step)

### Step 1. Create an empty database in pgAdmin
1. Open pgAdmin and log in.
2. Right-click **Databases** > **Create** > **Database...**
3. Name: `therapy_db_v2` > **Save**.
4. Leave it empty. Do NOT run any SQL in it. Sequelize will create the tables.

### Step 2. Open the project in VS Code
1. Extract the zip. A folder called `therapy-backend-v2` appears.
2. In VS Code: **File > Open Folder** and choose that folder.
3. Look at the left panel: you must see `package.json`, `index.js` and a `src` folder **directly** (not inside another folder). If you see only one more folder inside, open that one instead.

### Step 3. Open the terminal
Press **Ctrl + `** (the key above Tab). The terminal path must end with `therapy-backend-v2`.

### Step 4. Install the libraries
```
npm install
```
Wait until it ends. A `node_modules` folder appears. (If it prints warnings, that is normal. Red `npm error` is not.)

### Step 5. Create the `.env` file
1. In the left panel, hover over the project name and click the **New File** icon.
2. Name it exactly `.env` (it must sit next to `package.json`).
3. Paste this, then change the password to YOUR Postgres password (the one you use in pgAdmin):
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=therapy_db_v2
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=write_any_long_random_text_here
```
4. Save with **Ctrl + S**. No quotes, no spaces around `=`.

### Step 6. Create the tables AND the sample data
```
npm run db-sync
```
You should see lines like:
```
Database connection established successfully
users table created or already exists
therapist table created or already exists
... (13 tables)
users seeded
administrators seeded
... 
TEST LOGINS (all passwords are  Test123)
database synced successfully
```
Check in pgAdmin: right-click `therapy_db_v2` > **Refresh** > Schemas > public > Tables. You will see **13 tables**. Right-click `users` > **View/Edit Data** > **All Rows**: you will see the 8 seeded users.

### Step 7. Start the server
```
npm run dev
```
You should see:
```
Your Database connected successfully
Your Server is running on port 5000
```
Leave this terminal running. (Stop it with **Ctrl + C**.)

### Step 8. Check it in the browser
- `http://localhost:5000/api/health` shows `{"status":"ok"}`
- `http://localhost:5000/docs` shows the **Swagger** documentation page of all 51 endpoints.

### Test logins (all passwords are `Test123`)
| Role | Email |
|---|---|
| Admin | admin@therapy.com |
| Therapist (verified) | amina@therapy.com, jean@therapy.com |
| Therapist (pending) | grace@therapy.com |
| Clients | eric@therapy.com, aline@therapy.com, patrick@therapy.com, diane@therapy.com |

### Handy commands
| Command | What it does |
|---|---|
| `npm run db-sync` | creates the tables + inserts sample data |
| `npm run db-seed` | inserts the sample data only (tables must exist) |
| `npm run db-reset` | **deletes everything** and recreates empty tables. Then run `npm run db-seed` |
| `npm run dev` | starts the server and restarts it when you save a file |

---

# PART 2. UNDERSTAND IT (in simple words)

## 2.1 The restaurant picture
| In a restaurant | In this project | Folder |
|---|---|---|
| Customer order | The request from Postman | |
| Waiter who takes the order to the right place | **Route** | `src/routes` |
| Security guard at the door | **Middleware** (is the token valid? is the role allowed?) | `src/middleware` |
| Chef who cooks | **Controller** (the real logic) | `src/controllers` |
| Recipe / list of ingredients | **Model** (describes one table) | `src/database/models` |
| Builder of the kitchen | **Migration** (creates one table) | `src/database/migrations` |
| Free sample dishes to show the customer | **Seed** (sample data) | `src/database/seeds` |
| The pantry | **PostgreSQL** database | pgAdmin |

**Routes and controllers are separate** because a route only says "this URL goes to this function", while the controller does the work. If you mix them, one file becomes huge and hard to read.

## 2.2 The folder structure
```
therapy-backend-v2/
|-- index.js                  <- starts the server
|-- package.json              <- project card: libraries + scripts
|-- .env                      <- secrets (YOU create it, never share it)
`-- src/
    |-- config/db.js          <- the connection to PostgreSQL
    |-- database/
    |   |-- index.js          <- loads all models
    |   |-- models/           <- 13 files, one per table (+ index.js with the relationships)
    |   |-- migrations/       <- 13 files, each creates one table
    |   `-- seeds/            <- 13 files, each inserts sample data (+ index.js runner)
    |-- controllers/          <- 14 files: the logic
    |-- routes/               <- 14 files: URL -> controller
    |-- middleware/auth.js    <- Protect and AllowedRoles
    |-- utils/                <- small helpers
    |-- docs/                 <- Swagger documentation
    `-- scripts/              <- db-sync.js, db-seed.js, db-reset.js
```
This is the same structure as your lecturer's `dev-sale` project (config, controllers, routes, middleware, database/models, migrations, seeds, scripts, docs).

## 2.3 The journey of ONE request
Example: a client books an appointment: `POST /api/bookAppointment`
```
Postman
  |
  v  1. index.js          express.json() reads the JSON body into req.body
  v  2. routes/appointment.js
  |        AppointmentRoutes.post("/api/bookAppointment", Protect, AllowedRoles("client"), bookAppointment)
  v  3. Protect           token valid?  -> saves the user in req.user
  v  4. AllowedRoles      is the role "client"?
  v  5. controllers/appointment.js -> bookAppointment()
  |        uses the models Availability, Appointment, Therapist, Notification
  v  6. Sequelize turns that into SQL and talks to PostgreSQL
  v  7. res.status(201).json({ message, appointment })  -> Postman shows it
```
If something goes wrong, the `catch` block of the controller sends the error.

## 2.4 `index.js`, line by line
```js
import "dotenv/config";            // load the .env file first (password, secret)
import express from "express";     // the web framework
import cors from "cors";           // lets a frontend on another address call us
import swaggerUi from "swagger-ui-express";   // the /docs page
import sequelize from "./src/config/db.js";   // the database connection
import "./src/database/index.js";  // loads all models + relationships
import AuthRoutes from "./src/routes/auth.js"; // ...and the other route files

const app = express();             // create the app
app.use(express.json());           // read JSON bodies -> req.body
app.use(cors({ origin: [...], methods: [...] }));  // who may call us
app.use(AuthRoutes);               // plug in the routes
...
sequelize.authenticate()           // 1) connect to the database
  .then(() => sequelize.sync())    // 2) create any missing table
  .then(() => app.listen(PORT, ...)) // 3) start listening
  .catch((error) => console.log(...)); // if a step fails, print why
```
`.then(...)` means "when the previous step has succeeded, do this".

## 2.5 How the backend is connected to the database
1. `.env` holds the database name, user, password, host and port.
2. `src/config/db.js` reads them with `process.env.DB_NAME` etc. and creates `new Sequelize(...)`. This is THE connection.
3. Every model imports that connection (`import sequelize from "../../config/db.js"`).
4. `index.js` calls `sequelize.authenticate()` to check the connection before starting the server.

## 2.6 A MODEL (`src/database/models/user.js`)
```js
class User extends Model {}            // a class that represents the "users" table
User.init(
  { first_name: { type: DataTypes.STRING(100), allowNull: false }, ... },   // the columns
  { sequelize, modelName: "User", tableName: "users", timestamps: false }   // settings
);
export default User;
```
- One model = one table. One line = one column.
- `allowNull: false` = required. `unique: true` = no duplicates. `defaultValue` = used when nothing is given.
- `primaryKey: true, autoIncrement: true` = an id that counts 1, 2, 3 by itself.
- Methods you get for free: `create`, `findAll`, `findOne`, `findByPk`, `update`, `destroy`, `count`, `bulkCreate`.

## 2.7 The RELATIONSHIPS (`src/database/models/index.js`)
They are the lines of your ERD:
```js
User.hasOne(Therapist, { foreignKey: "user_id" });      // a user HAS ONE therapist profile
Therapist.belongsTo(User, { foreignKey: "user_id" });   // a therapist BELONGS TO a user
Therapist.hasMany(Availability, { foreignKey: "therapist_id" });  // one therapist, MANY slots
```
- The table that holds the **foreign key** (the column that links to the other table) is the one that `belongsTo`.
- Thanks to this, a controller can do `include: [User]` to also load the user's name (a SQL JOIN).
- Your lecturer's dev-sale models have no relationships. Yours do, because your ERD has them.

## 2.8 A MIGRATION (`src/database/migrations/user.js`)
```js
export const createUserTable = async () => {
    await sequelize.authenticate();       // check the connection
    await User.sync({ logging: false });  // CREATE TABLE users (...) if it does not exist
    console.log("users table created or already exists");
};
```
In this course, a migration = **a function that creates one table**.
`sync()` vs `sync({ alter: true })` vs `sync({ force: true })`:
| Option | What it does | Safe? |
|---|---|---|
| `sync()` | creates the table only if missing | yes (what we use) |
| `alter: true` | also changes existing tables to match the model (lecturer uses it) | can pile up duplicate constraints on PostgreSQL if you run it many times |
| `force: true` | **drops** the table and recreates it | deletes data (used only in `db-reset`) |

## 2.9 A SEED (`src/database/seeds/user.js`), the part you missed
A **seed** = a script that inserts **sample data** so your tables are not empty (for demos and testing).
```js
export const seedUsers = async () => {
    const hashPassword = await bcrypt.hash("Test123", 8);   // hash the password first
    const users = [ { first_name: "System", ..., password: hashPassword, role: "admin" }, ... ];
    await User.bulkCreate(users, { ignoreDuplicates: true });
};
```
- Build an **array of objects** that match the model's columns.
- `bulkCreate` inserts all of them in one go.
- `ignoreDuplicates: true` skips a row that would break a unique rule (so you can run it twice).
- **Order matters:** the seeds run in this order (`seeds/index.js`): users, administrators, therapists, clients, availability, appointments, sessions, notes, feedback, assessments, messages, notifications, reports. A row that points to another row needs that other row to exist first.
- **Never guess ids.** The database creates the ids. So seeds like `therapist.js` look the user up (`getUserId("amina@therapy.com")`) and use the real id. (Your lecturer's order/payment seeds hard-code ids, so their data does not really match the users. Yours does.)
- Seeds for tables without a unique column (availability, appointments...) start with `if ((await Model.count()) > 0) { skip }` so running them twice does not copy the data.

**`db-sync.js`** runs: connect, create the 13 tables (migrations, in order), then `runAllSeeds()`.
**`db-seed.js`** runs only the seeds. **`db-reset.js`** wipes everything.

## 2.10 A ROUTE (`src/routes/appointment.js`)
```js
AppointmentRoutes.post("/api/bookAppointment", Protect, AllowedRoles("client"), bookAppointment);
//                      ^ the URL               ^ guard 1  ^ guard 2             ^ the controller
```
Read it as: "On a POST to /api/bookAppointment: check the token, check the role is client, then run bookAppointment."
The full URL is written inside the route file (like your lecturer does), and `index.js` plugs each route file in with `app.use(...)`.
Routes use **GET** (read), **POST** (create), **PUT** (update), **DELETE** (delete).

## 2.11 A CONTROLLER (`src/controllers/availability.js`)
```js
export const createAvailability = async (req, res) => {
    try {
        const { available_date, start_time, end_time } = req.body;       // 1. read the data
        if (!available_date || ...) return res.status(400).json({ message: "...required" });  // 2. validate
        const therapist = await getTherapist(req.user.user_id);          // 3. who is logged in?
        const slot = await Availability.create({ ... });                 // 4. save in the database
        res.status(201).json({ message: "availability created successfully", slot });  // 5. answer
    } catch (error) {
        handleError(res, error);                                         // if anything fails
    }
};
```
- `req` = what comes in (`req.body`, `req.params`, `req.user`). `res` = what we send back.
- `async/await` = wait for the database before the next line.
- `try/catch` = if any line in `try` fails, jump to `catch` (same as your lecturer).
- `handleError` (in `src/utils`) does what the lecturer does (`res.status(500).json({ error })`) but first turns the common database errors (duplicate, bad id, invalid value) into friendly 400/409 messages.
- **Transaction** (`sequelize.transaction`): several saves that succeed together or fail together. Example: booking creates the appointment AND marks the slot as booked AND notifies the therapist.

## 2.12 MIDDLEWARE (`src/middleware/auth.js`), same names as your lecturer
- `Protect`: reads `Authorization: Bearer <token>`, verifies it with `jwt.verify`, saves `{ user_id, role, ... }` in `req.user`. No or bad token = **401**.
- `AllowedRoles("admin")`: checks `req.user.role`. Wrong role = **403**.
- `next()` = "this guard is happy, continue".

## 2.13 How login works
1. **Register:** the password is **hashed** with bcrypt (`$2a$10$...`) before it is saved. Nobody can read it back.
2. **Login:** `bcrypt.compare(typed, stored)` checks the password.
3. If correct, the server makes a **JWT token** (a signed ticket with the user id and role, valid 2 days).
4. Postman sends that token on every later request. Nobody can fake it without `JWT_SECRET`.

## 2.14 Status codes
200 OK | 201 Created | 400 Bad request (wrong data) | 401 Not logged in | 403 Not allowed | 404 Not found | 409 Conflict (duplicate / slot already booked) | 500 Server error

## 2.15 What your lecturer's project has, and what this one has
| Topic | Lecturer (dev-sale) | This project |
|---|---|---|
| Structure | config, controllers, routes, middleware, database (models, migrations, seeds), scripts, docs | **the same** |
| Routes | full path inside the file (`/api/getAllUsers`) | **the same** style |
| Controllers | `try/catch` in every function | **the same** |
| Middleware | `Protect`, `AllowedRoles` | **the same names** |
| Seeds + `db-sync` + `db-seed` | yes (his `db-seed.js` file is missing) | yes, both scripts exist |
| Swagger at `/docs` | yes | yes (all 51 endpoints) |
| Database | MySQL | **PostgreSQL** (only the `pg` package and `dialect: "postgres"` change) |
| IDs / names | UUID, camelCase | INT, snake_case (your ERD says INT and snake_case) |
| Relationships | none | yes, from your ERD |
| Password library | `bcrypt` | `bcryptjs` (same functions, easier to install on Windows) |
| Updates | `PUT` | `PUT` (so CORS `GET/POST/PUT/DELETE` is enough) |

---

# PART 3. TEST IN POSTMAN (or in the Swagger page)

Base URL: `http://localhost:5000`. For POST and PUT: **Body > raw > JSON**. For every request except register and login: **Authorization > Bearer Token** and paste the token.

**Tip:** make one Postman tab per person (admin, Amina, Eric) so you don't mix tokens.

The ids below are right on a fresh database (admin user 1, Amina user 2, Jean 3, Grace 4, Eric 5...; therapists: Amina 1, Jean 2, Grace 3; availability 1 to 9; appointments 1 to 4; sessions 1 to 2). If a number does not match, look at the ids in the responses.

### A. Login (get a token)
`POST /api/login` with `{"email":"admin@therapy.com","password":"Test123"}` > copy `token`. Do the same for `amina@therapy.com` and `eric@therapy.com`.

### B. Admin tests (admin token)
| Request | Body | Expect |
|---|---|---|
| `GET /api/getAllUsers` | | 8 users, no passwords |
| `GET /api/getAllTherapists` | | 3 therapists (admin sees all) |
| `PUT /api/verifyTherapist/3` | `{"verification_status":"verified"}` | Grace is now verified |
| `GET /api/getAllReports` | | 2 reports |
| `PUT /api/updateReportStatus/1` | `{"status":"resolved"}` | `resolved_at` filled |

### C. Client tests (Eric's token)
| Request | Body | Expect |
|---|---|---|
| `GET /api/getMyClientProfile` | | his profile |
| `PUT /api/updateMyClientProfile` | `{"preferred_language":"French"}` | updated |
| `GET /api/getAllTherapists` | | verified therapists only |
| `GET /api/getTherapist/1` | | Amina with `avg_rating` 5.00 |
| `GET /api/getTherapistAvailability/1` | | open slots (3, 4, 5) |
| `POST /api/bookAppointment` | `{"availability_id":3,"reason":"Follow-up"}` | 201, appointment 5 |
| `POST /api/bookAppointment` (again) | same | **409** already booked |
| `GET /api/getMyAppointments` | | his appointments |
| `POST /api/createAssessment` | `{"main_concern":"Stress","preferred_therapy":"CBT"}` | 201 |
| `GET /api/getSessionFeedback/1` | | his 5-star feedback |

### D. Therapist tests (Amina's token)
| Request | Body | Expect |
|---|---|---|
| `GET /api/getMyTherapistProfile` | | her profile |
| `POST /api/createAvailability` | `{"available_date":"2030-01-15","start_time":"10:00","end_time":"11:00"}` | 201 |
| `GET /api/getMyAvailability` | | all her slots |
| `GET /api/getMyNotifications` | | includes "New appointment request" |
| `PUT /api/updateAppointmentStatus/5` | `{"status":"confirmed"}` | confirmed |
| `POST /api/createSession` | `{"appointment_id":5,"session_type":"video","meeting_link":"https://meet.example.com/x"}` | 201, session 3 |
| `PUT /api/startSession/3` | | `in_progress` |
| `POST /api/addSessionNote/3` | `{"note_content":"First follow-up session."}` | 201 |
| `GET /api/getSessionNotes/1` | | the 2 seeded notes |
| `PUT /api/endSession/3` | | `completed` |

Then, as Eric: `POST /api/addFeedback/3` with `{"rating":4,"comment":"Good session"}` and `GET /api/getTherapistFeedback/1` (count and average).

### E. Messages
As Eric: `POST /api/sendMessage` `{"receiver_id":2,"message_text":"Hello Dr Amina"}`
As Amina: `GET /api/getInbox`, `GET /api/getConversation/5`, `PUT /api/markMessageRead/1`.

### F. Tests that SHOULD fail (they prove the protection works)
| Test | Expect |
|---|---|
| Any request without a token | **401** |
| Eric calls `GET /api/getAllUsers` | **403** |
| Eric calls `PUT /api/updateAppointmentStatus/5` with `{"status":"confirmed"}` | **403** clients can only cancel |
| Eric books slot 3 again | **409** |
| Amina creates an overlapping slot (`10:30` to `11:30` on a day she has `10:00` to `11:00`) | **409** |
| Eric sends feedback with `{"rating":6}` | **400** |
| Eric calls `GET /api/getSessionNotes/1` | **403** (notes are private) |
| Register with `"role":"admin"` | **400** |
| Register with an email that exists | **409** |

---

# PART 4. QUESTIONS YOUR LECTURER MAY ASK

**What is a controller?** A file with the functions that hold the logic. A route calls it. Example: `bookAppointment` checks the slot is free, creates the appointment, marks the slot booked and notifies the therapist.

**What is a route?** A link between an HTTP method + URL and a controller function, with the middlewares that protect it.

**Why separate routes and controllers?** So each file has one job: routes decide WHERE a request goes, controllers decide WHAT happens. Easier to read, change and test.

**What is a model?** A class that represents one table: its columns and rules, plus ready-made methods (`create`, `findAll`...).

**What is a migration?** Code that creates (or changes) tables in the database. Here, one function per table.

**What is a seed?** Code that inserts sample data into the tables, for development and demos.

**What is middleware?** A function that runs between the request and the controller, like `express.json()` (reads the body), `Protect` (checks the token) and `AllowedRoles` (checks the role).

**How did you connect the backend to the database?** `.env` stores the credentials, `src/config/db.js` creates a Sequelize connection with them (dialect postgres), the models use it, and `index.js` calls `sequelize.authenticate()` before starting the server.

**Why Sequelize?** It is an ORM: it maps tables to JavaScript classes, so we write `User.findAll()` instead of SQL, and it helps against SQL injection.

**What does `npm run db-sync` do?** Connects, creates all tables (migrations, in dependency order), then inserts the sample data (seeds).

**Why does the order of migrations and seeds matter?** Foreign keys: a table or row that points to another needs that other one to exist first.

**What is a foreign key?** A column that stores the id of a row in another table, e.g. `appointment.client_id` points to `client.client_id`.

**What is `bulkCreate` and `ignoreDuplicates`?** `bulkCreate` inserts many rows at once; `ignoreDuplicates` skips rows that would break a unique rule.

**What is a transaction?** A group of database actions that all succeed or all fail together.

**What is JWT?** A signed token given at login, so the user does not send the password every time.

**Why hash passwords?** So a leaked database does not reveal real passwords. Hashing is one-way.

**Why `"type": "module"`?** It lets us use `import` / `export` instead of `require`.

**What is nodemon?** A tool that restarts the server every time you save.

**Why PostgreSQL and not MySQL?** The code is the same; only the driver (`pg` instead of `mysql2`) and `dialect` change.

---

# PART 5. HOW TO ADD A NEW FEATURE (same recipe every time)
Example: a new table `Payment`.
1. **Model:** `src/database/models/payment.js` (copy another model and change the columns).
2. **Relationship:** in `src/database/models/index.js` import it, add `hasMany` / `belongsTo`, and add it to the `db` object.
3. **Migration:** `src/database/migrations/payment.js` with `createPaymentTable` (copy another).
4. **Register it:** import and call `createPaymentTable()` in `src/scripts/db-sync.js` (after the tables it depends on).
5. **Seed:** `src/database/seeds/payment.js` and add `seedPayments()` in `src/database/seeds/index.js`.
6. **Controller:** `src/controllers/payment.js`.
7. **Route:** `src/routes/payment.js`, then in `index.js` import it and add `app.use(PaymentRoutes)`.
8. **Docs:** add the endpoints to `src/docs/endpoints.js`.
9. Run `npm run db-sync` and test.

**Starting a project from zero in CMD** (what your lecturer did; practice it once):
```
mkdir my-demo
cd my-demo
npm init -y
npm install express sequelize pg dotenv
npm install nodemon
code .
```
Then in `package.json` add `"type": "module"` and the scripts `"dev": "nodemon index.js"`; create the folders `src\config`, `src\controllers`, `src\routes`, `src\middleware`, `src\database\models`, `src\database\migrations`, `src\database\seeds`, `src\scripts`, and the files `index.js`, `.env`, `.gitignore`.

---

# PART 6. COMMON ERRORS
| Error | Meaning / fix |
|---|---|
| `Could not read package.json` | The terminal is in the wrong folder. `cd` into the folder that directly contains `package.json`. |
| `Cannot find package 'express'` (or another) | Run `npm install` in the right folder. |
| `client password must be a string` | `.env` is missing or not next to `package.json`. |
| `password authentication failed for user "postgres"` | `DB_PASSWORD` in `.env` is not your real Postgres password. |
| `database "therapy_db_v2" does not exist` | Create it in pgAdmin (Part 1, Step 1). |
| `relation "users" does not exist` | You did not run `npm run db-sync`. |
| `Seed problem: user ... not found` | Run `npm run db-sync` (not only `db-seed`) on a fresh database. |
| `EADDRINUSE: address already in use` | Another server uses that port. Change `PORT` in `.env`, or stop the other terminal with Ctrl + C. |
| `Cannot use import statement outside a module` | `"type": "module"` is missing in `package.json`. |
| `401 No token provided` | In Postman: Authorization > Bearer Token > paste the token. |
| `403 access denied` | You used another person's token (wrong role). |
| After changing `.env` nothing changes | Stop the server (Ctrl + C) and run `npm run dev` again. |
| You want a clean start | `npm run db-reset` then `npm run db-seed`. |

---

# PART 7. A PLAN FOR YOUR TIME
| Time | Do this |
|---|---|
| 30 min | Part 1: run the project until `npm run dev` works. |
| 45 min | Part 2.1 to 2.5. Then open `index.js` and `src/config/db.js` and read them while looking at 2.4 and 2.5. |
| 45 min | Part 2.6 to 2.9: models, relationships, migration, seed. Open `models/user.js`, `migrations/user.js`, `seeds/user.js`, `scripts/db-sync.js`. |
| 45 min | Part 2.10 to 2.13: route, controller, middleware, login. Open `routes/auth.js`, `controllers/auth.js`, `middleware/auth.js`. |
| 45 min | Part 3: test in Postman or in `/docs`. |
| 60 min | **Practice from zero** (Part 5, the CMD recipe): rebuild a tiny version with only the User model, one migration, one seed, one controller and one route. |
| 30 min | Say Part 4 out loud without reading. |

**If you are asked something you do not know:** say "I followed the structure from the course project," open the file, and read it line by line. Reading your own code calmly is much better than guessing.
