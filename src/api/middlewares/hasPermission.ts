const hasPermission = (permisosCodes) => (req, res, next) => {
    if (!req.isAuthenticated())
        return res.status(401).json({
            'status': 401,
            'message': 'No ha iniciado sesión o su sesión ha expirado.'
        });
    let bool = false;
    if (req.isAuthenticated() && req.user.permisos)
        bool = req.user.permisos.find(x => {
            if (Array.isArray(permisosCodes)) return permisosCodes.includes(x.codigo);
            else if (typeof permisosCodes === 'string') return x.codigo === permisosCodes;
        }) ? true : false;
    if (bool)
        return next();
    return res.status(403).json({
        'status': 403,
        'message': 'No tiene el permiso requerido para realizar esta acción.'
    });
}
export default hasPermission;
