import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import Usuario from '../models/usuario.model';
import Rol from '../models/rol.model';

export default async function seed() {
    console.log('USUARIO SEED')

    const salt1 = randomBytes(32);
    const hashedPassword1 = await argon2.hash('admin', { salt: salt1 });
    const salt2 = randomBytes(32);
    const hashedPassword2 = await argon2.hash('admin', { salt: salt2 });
    const salt3 = randomBytes(32);
    const passworEjecutor = await argon2.hash('ejecutor', { salt: salt3 });
    const salt4 = randomBytes(32);
    const passworJefe = await argon2.hash('jefe', { salt: salt4 });
    const salt5 = randomBytes(32);
    const passworSupervisor = await argon2.hash('supervisor', { salt: salt5 });
    const rolDios = await Rol.findOne({ nombre: 'DIOS' })
    const roleje = await Rol.findOne({ nombre: 'EJECUTOR' })
    const rolJefe = await Rol.findOne({ nombre: 'JEFE' })
    const rolSupervisor = await Rol.findOne({ nombre: 'SUPERVISOR' })
    /*
    usuarios:{
        DIOS:[{
            email: admin@admin.com,
            username: admin1,
            password: admin
        },{
            email: dios@dios.com,
            username: admin2,
            password: admin
        }],
        EJECUTOR: [{
            email: ejecutor@ejecutor.com,
            username: ejecutor,
            password: ejecutor
        }],
        JEFE: [{
            email: jefe@jefe.com,
            username: jefe,
            password: jefe
        }],
        SUPERVISOR: [{
            email: supervisor@supervisor.com,
            username: supervisor,
            password: supervisor
        }]
    }
    */
    var users = [
        {
            email: 'admin@admin.com',
            nombre: 'Pablo',
            username: 'admin1',
            apellidos: 'Escobar Garibia',
            telefono: '656611851',
            rol: rolDios._id,
            password: hashedPassword1,
            salt: salt1,
        }, {
            email: 'dios@dios.com',
            nombre: 'Karim',
            username: 'admin2',
            apellidos: 'Benzema',
            telefono: '755123451',
            rol: rolDios._id,
            password: hashedPassword2,
            salt: salt2,
        }, {
            email: 'ejecutor@ejecutor.com',
            nombre: 'Karim',
            username: 'ejecutor',
            apellidos: 'Benzema',
            telefono: '755123451',
            rol: roleje._id,
            password: passworEjecutor,
            salt: salt3,
        }, {
            email: 'jefe@jefe.com',
            nombre: 'Felix',
            username: 'jefe',
            apellidos: 'Salguero',
            telefono: '755123451',
            rol: rolJefe._id,
            password: passworJefe,
            salt: salt4,
        }, {
            email: 'supervisor@supervisor.com',
            nombre: 'Ramón',
            username: 'supervisor',
            apellidos: 'Fernandez',
            telefono: '755123451',
            rol: rolSupervisor._id,
            password: passworSupervisor,
            salt: salt5,
        }
    ];
    await Usuario.deleteMany({});
    for (var i = 0; i < users.length; i++) {
        const user = users[i];
        var err, res = await new Usuario({ ...user, updated_for: null }).save();
        if (err) throw err;
        if (!res) throw Error("No se ha podido crear el usuario " + user.email);
    }
    console.log('USUARIO SEED ENDED')
}