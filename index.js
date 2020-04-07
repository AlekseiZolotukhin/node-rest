const express = require('express');
const app = express();
const path = require('path');
const apiRoutes = require('./routes/tasks');
const APP_PORT = process.env.PORT || 3000; // process.env.PORT we use for prod environment
const sequilize = require('./utils/database');

app.use(express.static(path.join(__dirname, 'public')));

// for get json data from request
app.use(express.json());

// add router for api
app.use('/api/tasks', apiRoutes);

//middleware for our index.html file inside publuc folder
app.use((req,res, next) => {
    res.sendFile('/index.thml');
});

async function start() {
    try {
        await sequilize.sync(); // {force: true} for recreate scheme
        app.listen(APP_PORT);
    } catch (e) {
        console.log(e)
    }
}

start();
