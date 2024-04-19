// const { Pool } = require('pg');
import pgPromise from 'pg-promise';
const pgp = pgPromise({/* Initialization Options */ });

const dbConfig = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
}
// Creating the database instance with extensions:
const db = pgp(dbConfig);

//Bunch of code...
/* (async function () {
    if (!conn) {
        await conn.connect();
    }
})(); */

export default db ;
// module.exports = db;
