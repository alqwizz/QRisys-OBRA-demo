export default class Utils {

    static hasPermission = (permisosCodes: string | [string], user): boolean => {
        let bool = false;
        if (user && user.permisos)
            bool = user.permisos.find(x => {
                if (Array.isArray(permisosCodes)) return permisosCodes.includes(x.codigo);
                else if (typeof permisosCodes === 'string') return x.codigo === permisosCodes;
            }) ? true : false;
        return bool;
    }
}