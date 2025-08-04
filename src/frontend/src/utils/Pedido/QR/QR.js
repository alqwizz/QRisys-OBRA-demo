import { URL } from '../../../config/config'
export const QRGenerator = (pedido) => {
    if (pedido) return URL + 'QR/' + pedido._id;
    return '';
}