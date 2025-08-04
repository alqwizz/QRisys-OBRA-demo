import Rol from '../models/rol.model';

export default async function seed() {
    console.log('ROL SEED')

    var roles = [
        {
            nombre: 'DIOS',
            permisos: []
        }, {
            nombre: 'EJECUTOR',
            permisos: []
        },
        {
            nombre: 'JEFE',
            permisos: []
        },
        {
            nombre: 'SUPERVISOR',
            permisos: []
        }
    ];
    await Rol.deleteMany({});

    for (var i = 0; i < roles.length; i++) {
        const rol = roles[i];
        var err, res = await new Rol({ ...rol, updated_for: null }).save()
        if (err) throw err;
        if (!res) throw Error("No se ha podido crear el rol " + rol.nombre);
    }

    console.log('ROL SEED ENDED')
}