import { URL } from '../../../config/config'

export const QRGenerator = (pedido, adquisicion, number) => {
    if (adquisicion && pedido && number !== undefined) {
        const str = URL + 'QR/' + (pedido._id ? pedido._id : pedido) + '/' + (adquisicion._id ? adquisicion._id : adquisicion) + '/' + number;
        return str;
    }
}