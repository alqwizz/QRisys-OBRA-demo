import mongoose from 'mongoose';
import permisoSeed from './permiso.seeds'
import usuarioSeed from './usuario.seeds'
import rolSeed from './rol.seeds'
require('dotenv').config();
seeds();
async function seeds() {
    const uri = "mongodb+srv://infoqrisys:NB55NpdAe7AtTAa@";
    await mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
    // Descomentar para borrar todos los roles y crear los roles por defecto
    await rolSeed();
    await permisoSeed();
    //Descomentar para borrar todos los usuarios y crear los usuarios por defecto
    await usuarioSeed();

    mongoose.disconnect()
}
