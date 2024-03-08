const express = require("express");
const path = require("path");
require("dotenv").config();
const Location = require('./models/Location'); // Adjust the path according to your structure


const routes = require("./controllers");
const sequelize = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Use routes defined in the "controllers" directory
app.use(routes);

// Sync Sequelize models to the database, then start the Express server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(
      `\nServer running on port ${PORT}. Visit http://localhost:${PORT} !`
    )
  );
});
