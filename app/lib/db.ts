import pgPromise from 'pg-promise';

const pgp = pgPromise({/* Initialization Options */ });

const globalPgp = global as unknown as { client: any }

const getPgpClient = () => {

    if (globalPgp.client) {
        return globalPgp.client;
    }

    const Config = {
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DATABASE,
    }

    // Preparing the connection details:
    const cn = `postgres://${Config.user}:${Config.password}@${Config.host}:${Config.port}/${Config.database}`;
    // Creating a new database instance from the connection details:
    globalPgp.client = pgp(cn);
    // This only prints on the first api call as it should
    console.log("NEW TEMPORAL CLIENT CREATED");

    // return { pgp, client: globalPgp.client }
    return globalPgp.client;

}

export {
    pgp,
    getPgpClient
}