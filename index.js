const express = require('express');

const { PORT } = require('./config');
const databaseConfig = require('./config/database');
const expressConig = require('./config/express');
const routesConfig = require('./config/routes');


start();

async function start() {
    const app = express();
    const port = process.env.PORT || PORT;

    await databaseConfig(app);
    expressConig(app);
    routesConfig(app);


    app.listen(port, () => {
        console.log(`Application started at ${process.env.PORT || PORT}`);
    });
}