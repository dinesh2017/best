const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const routes = require('./routes')
const publicRoutes = require('./routes/public.route')
const bodyParaser = require("body-parser");
const cors = require('cors');
require("./config/initialFolders")
const multer = require('multer');

connectDb.connect();

const app = express();

app.use(express.static('public'));

const port = process.env.PORT || 3000;

app.use(bodyParaser.json({ limit: '50mb' }));
app.use(bodyParaser.urlencoded({ limit: '50mb', extended: true }))

app.use(cors());



app.use("/api/v1", routes)
app.use("/", publicRoutes)

app.use(errorHandler.handler);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});