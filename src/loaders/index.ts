import expressLoader from './express';
import mongooseLoader from './mongoose';
import passportLoader from './passport';
import Logger from './logger';


export default async ({ expressApp }) => {

    const mongoConnection = await mongooseLoader();
    Logger.info('MongoDB inicializado');
    await passportLoader();
    await expressLoader({ app: expressApp, connection: mongoConnection });
    Logger.info('Express inicializado');


    // ... more loaders can be here

    // ... Initialize agenda
    // ... or Redis, or whatever you want
}