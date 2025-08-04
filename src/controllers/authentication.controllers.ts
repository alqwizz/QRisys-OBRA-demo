import AuthenticationService from '../services/authentication.services';
import { Request, Response, NextFunction } from 'express';
import Logger from '../loaders/logger'

export default class AuthenticationController {
    private authenticationService: AuthenticationService;
    constructor() {
        this.authenticationService = new AuthenticationService();
    }
    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            Logger.debug('Inicio proceso de login')
            const { email, password } = req.body;
            if (email && password) {
                const { user, correct } = await this.authenticationService.login(email, password);
                if (correct) {
                    req.login(user, function (err) {
                        if (err) throw err;
                        Logger.debug('Logueado correctamente.')
                        return res.status(200).json({ status: 200, user: user, message: "Inicio de sesión correcto." });
                    })
                } else
                    return res.status(401).json({ status: 400, message: 'Los datos introducidos no son correctos.' });
            } else
                return res.status(400).json({ status: 400, message: 'Datos incorrectos.' });
        } catch (e) {
            Logger.debug('ERROR EN EL LOGIN')
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.logout()
            res.status(200).json({ status: 200, message: 'Logout correcto' });
        } catch (e) {
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public check = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).json({ status: 200, user: req.user });
        } catch (e) {
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
}