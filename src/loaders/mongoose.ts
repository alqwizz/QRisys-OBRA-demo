import mongoose from 'mongoose';
//var mongoose = require('mongoose');
import { Db } from 'mongodb';
import config from '../config';

export default async () => {
    const uri = config.ATLAS_URI;
    await mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
    return mongoose.connection;
};