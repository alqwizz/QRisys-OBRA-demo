const isAuth = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    return res.status(403).json({
        'status': 403,
        'message': 'Para entrar aquí tienes que iniciar sesión.'
    });
}
export default isAuth;
