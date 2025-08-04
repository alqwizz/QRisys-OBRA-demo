import Permiso from '../models/permiso.model';
import Rol from '../models/rol.model'

export default async function seed() {
    console.log('PERMISOS SEED')

    var permisosAdministracion = [
        {
            codigo: 'VEP',
            nombre: 'Ver todas las empresas y proyectos',
            tipo: 'Administración'
        },
        {
            codigo: 'VEPU',
            nombre: 'Ver todas las empresas y proyectos del usuario',
            tipo: 'Administración'
        },
        {
            codigo: 'CE',
            nombre: 'Crear nueva empresa',
            tipo: 'Administración'
        },
        {
            codigo: 'EE',
            nombre: 'Editar empresa',
            tipo: 'Administración'
        },
        {
            codigo: 'IP',
            nombre: 'Importar datos del proyecto',
            tipo: 'Administración'
        },
        {
            codigo: 'CP',
            nombre: 'Crear nuevo proyecto',
            tipo: 'Administración'
        },
        {
            codigo: 'EP',
            nombre: 'Editar proyecto',
            tipo: 'Administración'
        },
        {
            codigo: 'GR',
            nombre: 'Gestionar roles',
            tipo: 'Administración'
        },
        {
            codigo: 'GU',
            nombre: 'Gestionar usuarios',
            tipo: 'Administración'
        },
        {
            codigo: 'ECI',
            nombre: 'Editar constante CI',
            tipo: 'Administración'
        },
        {
            codigo: 'EAI',
            nombre: 'Editar activo inicial',
            tipo: 'Administración'
        }
    ];
    var permisosPantallas = [
        {
            codigo: 'VTO',
            nombre: 'Ver lista de tareas ordenadas',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VAT',
            nombre: 'Ver todas las tareas',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VG',
            nombre: 'Ver gantt',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VTRP',
            nombre: 'Ver reportes de producción de una tarea',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VTP',
            nombre: 'Ver pedidos de una tarea',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VP',
            nombre: 'Ver detalle de un pedido',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VRP',
            nombre: 'Ver detalle de un reporte de producción',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VGCP',
            nombre: 'Ver proveedores en gestor de compras',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VGCPE',
            nombre: 'Ver pedidos en gestor de compras',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VGPE',
            nombre: 'Ver empresas en gestor de personal',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VGPPT',
            nombre: 'Ver partes de trabajo en gestor de personal',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VPT',
            nombre: 'Ver detalle de un parte de trabajo',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VDH',
            nombre: 'Ver dashboard',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VCO',
            nombre: 'Ver comparativo de ofertas',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VMR',
            nombre: 'Ver mapa de recursos',
            tipo: 'Acceso a pantallas'
        },
        {
            codigo: 'VM',
            nombre: 'Ver detalle de una maquina',
            tipo: 'Acceso a pantallas'
        }
    ]

    var permisosReportes = [
        {
            codigo: 'CR',
            nombre: 'Realizar un reporte de producción',
            tipo: 'Reportes'
        },
        {
            codigo: 'CMR',
            nombre: 'Marcar como completado un reporte de producción',
            tipo: 'Reportes'
        },
        {
            codigo: 'PR',
            nombre: 'Reportar un problema en producción',
            tipo: 'Reportes'
        },
        {
            codigo: 'CP',
            nombre: 'Realizar un pedido',
            tipo: 'Reportes'
        },
        {
            codigo: 'AP',
            nombre: 'Anular un pedido',
            tipo: 'Reportes'
        },
        {
            codigo: 'RRP',
            nombre: 'Recibir o rechazar un pedido',
            tipo: 'Reportes'
        },
        {
            codigo: 'CPT',
            nombre: 'Crear un parte de trabajo',
            tipo: 'Reportes'
        },
        {
            codigo: 'CTF',
            nombre: 'Certificar',
            tipo: 'Reportes'
        },
        {
            codigo: 'CA',
            nombre: 'Crear un aviso',
            tipo: 'Reportes'
        }
    ];

    var permisosAportes = [
        {
            codigo: 'CC',
            nombre: 'Añadir un contradictorio',
            tipo: 'Aportes'
        },
        {
            codigo: 'CPV',
            nombre: 'Añadir un proveedor',
            tipo: 'Aportes'
        },
        {
            codigo: 'CTB',
            nombre: 'Añadir personal',
            tipo: 'Aportes'
        }
    ]

    var permisosEspeciales = [
        {
            codigo: 'CT',
            nombre: 'Cancelar una tarea',
            tipo: 'Especiales'
        },
        {
            codigo: 'DDPE',
            nombre: 'Descargar documentos asociados a un pedido',
            tipo: 'Especiales'
        },
        {
            codigo: 'SP',
            nombre: 'Solicitar presupuesto a un proveedor',
            tipo: 'Especiales'
        },
        {
            codigo: 'DDP',
            nombre: 'Descargar contenido de un proyecto',
            tipo: 'Especiales'
        }
    ]

    var permisosExportacion = [
        {
            codigo: 'EPT',
            nombre: 'Exportar partes de trabajo',
            tipo: 'Exportación'
        },
        {
            codigo: 'EPUM',
            nombre: 'Exportar partes de uso de una máquina',
            tipo: 'Exportación'
        },
        {
            codigo: 'EP',
            nombre: 'Exportar producción',
            tipo: 'Exportación'
        },
        {
            codigo: 'EPUM',
            nombre: 'Exportar compras',
            tipo: 'Exportación'
        }
    ]
    var permisosEdiciones = [
        {
            codigo: 'ET',
            nombre: 'Editar una tarea',
            tipo: 'Edición'
        },
        {
            codigo: 'ERP',
            nombre: 'Editar reportes de producción',
            tipo: 'Edición'
        },
        {
            codigo: 'EPR',
            nombre: 'Editar un proveedor',
            tipo: 'Edición'
        }
    ]
    var permisos = [
        ...permisosAdministracion,
        ...permisosPantallas,
        ...permisosReportes,
        ...permisosAportes,
        ...permisosEspeciales,
        ...permisosExportacion,
        ...permisosEdiciones
    ];
    //await Permiso.deleteMany({});
    var err, rolDios = await Rol.findOne({ nombre: 'DIOS' });
    if (err) throw err;
    if (!rolDios) throw Error("No se ha encontrado el rol DIOS")
    const permisosIds = []
    for (var i = 0; i < permisos.length; i++) {
        const permiso = permisos[i];
        var err, res = await Permiso.findOneAndUpdate({ codigo: permiso.codigo }, { ...permiso, updated_for: null });
        if (err) throw err;
        if (!res) {
            var err, res = await new Permiso({ ...permiso, updated_for: null }).save();
            if (err) throw err;
            if (!res) throw Error("No se ha creado el permiso " + permiso.codigo)
            permisosIds.push(res._id)
        } else
            permisosIds.push(res._id)

        var err, rolRes = await Rol.findOneAndUpdate({ nombre: 'DIOS', updated_for: null }, {
            $set: { permisos: permisosIds as unknown as [string] }
        });
        if (err) throw err;
        if (!rolRes) throw Error("No se ha editado el rol.");
    }

    console.log('PERMISOS SEED ENDED')
}