import dotenv from 'dotenv';

const envFound = dotenv.config();
if (!envFound) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    //URL DE ACCESSO A MONGODB
    ATLAS_URI: "mongodb+srv://infoqrisys:NB55NpdAe7AtTAa@qrisys.oxead.mongodb.net/QRiSYS?retryWrites=true&w=majority",
    //
    secret: "secretqrisys",

    //
    password_secret: "secretqrisysvalue",
    //
    SESS_NAME: process.env.SESS_NAME,
    //
    SESS_SECRET: process.env.SESS_SECRET,
    //
    SESS_LIFETIME: process.env.SESS_LIFETIME,
    //
    CLIENT_URL: process.env.CLIENT_URL,
    URL: process.env.URL,

    port: 5000,
    api: {
        prefix: '/api'
    },
    upload_dir: process.env.upload_dir,
    mode: process.env.mode
}