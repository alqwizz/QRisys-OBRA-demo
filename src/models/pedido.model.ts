import { IPedido } from '../interfaces/IPedido';
import mongoose from 'mongoose';
import mongooseHistory from 'mongoose-history'

var Schema = mongoose.Schema;
var pedidoSchema = new Schema({
    adquisiciones: [{
        _id: {
            type: String,
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            enum: ['MATERIAL', 'MANO DE OBRA', 'MAQUINA', 'OTROS'],
            required: true
        },
        precio: {
            type: Number,
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        },
        unidad: {
            type: String,
            required: true
        },
        estadosMaquinas: [{
            type: String,
            required: true,
            default: 'PENDIENTE',
            enum: ['ENTREGADO', 'EN USO', 'PENDIENTE', 'PROBLEMA']
        }],
        estadoMaterial: {
            type: String,
            required: true,
            default: 'PENDIENTE',
            enum: ['ENTREGADO', 'ACOPIADO', 'PENDIENTE']
        },
        reportes: [{
            estado: {
                type: String,
                enum: ['ENTREGADO', 'ACOPIADO', 'EN USO', 'PROBLEMA']
            },
            geolocalizacion: { lat: Number, lng: Number },
            files: [String],
            numeroMaquina: Number,
            horaInicio: Date
        }]
    }],
    pagare: {
        type: String,
        enum: ['0 DÍAS', '30 DÍAS', '60 DÍAS', '90 DÍAS', '120 DÍAS', '150 DÍAS', '180 DÍAS']
    },
    empresaSubcontrata: {
        type: Schema.Types.ObjectId,
        ref: 'EmpresaSubcontrata'
    },
    fechaPedido: {
        type: Date,
        default: new Date()
    },
    description: {
        solicitar: String,
        anular: String,
        recibir: String,
        rechazar: String,
    },
    files: {
        solicitar: [String],
        anular: [String],
        recibir: [String],
        rechazar: [String],
    },
    fechaRecepcion: Date,
    fechaEsperada: Date,
    fechaVencimiento: Date,
    retencion: Number,
    updated_for: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    proyecto: {
        type: Schema.Types.ObjectId,
        ref: 'Proyecto',
        required: true
    },
    estado: {
        type: String,
        required: true,
        default: 'PENDIENTE',
        enum: ['ENTREGADO', 'RECHAZADO', 'ACOPIADO', 'EN USO', 'PENDIENTE', 'ANULADO']
    }
}, { versionKey: '_version' });
pedidoSchema.plugin(mongooseHistory);

export default mongoose.model<IPedido & mongoose.Document>('Pedido', pedidoSchema);
