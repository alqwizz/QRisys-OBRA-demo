import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../../Modal/Modal';
import { TareaForm } from '../Form/TareaForm';
import { cancelar } from "../../../utils/TareasUtils";
import { navigate } from 'hookrouter'
import PedidoForm from "../../GestorCompras/PedidoForm";

const cancelContent = (taskActive, actions) => {
    const cancelTask = () => {
        cancelar(taskActive.current._id).then(() => {
            actions.close.call();
        });
    };
    return {
        header: 'Cancelar tarea',
        body: <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            <p style={{ fontWeight: 'bold', width: '100%', textAlign: 'center' }}>¿Está seguro de que quiere cancelar {(taskActive.current && taskActive.current.childrens && taskActive.current.childrens.length > 0) ? 'este capítulo' : 'esta tarea'}?</p>
            {taskActive.current && taskActive.current.childrens && taskActive.current.childrens.length > 0 && < p >Se trata de un capítulo, si lo cancela, se cancelarán todas las tareas pertenecientes a este.</p>
            }
            <button onClick={cancelTask} className="btn green" style={{ marginRight: '8px' }}>Sí</button>
            <button onClick={actions.goBack} className="btn red">No</button>
        </div >
    }
};

const actionsContent = (tarea, actions) => {
    const containerStyles = {
        fontSize: '2em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    };
    const iconStyles = {
        marginBottom: '8px'
    };
    const spanStyles = {
        fontSize: '.3em',
        fontWeight: 'bold',
        color: 'darkgrey',
        textTransform: 'uppercase'
    };

    return {
        header: 'Selecciona la acción a realizar',
        body: <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={Object.assign({}, containerStyles, { color: 'var(--red)' })} onClick={actions.goTo}>
                <i className={'fas fa-search'} style={iconStyles} />
                <span style={spanStyles}>Ver tarea</span>
            </div>
            <div style={Object.assign({}, containerStyles, { color: 'var(--red)' })} onClick={actions.goCancel}>
                <i className={'fas fa-times-circle'} style={iconStyles} />
                <span style={spanStyles}>Cancelar tarea</span>
            </div>
            <div style={Object.assign({}, containerStyles, { color: 'var(--green-lighter)' })}>
                <i className={'fas fa-user-plus'} style={iconStyles} />
                <span style={spanStyles}>Asignar usuario</span>
            </div>
            <div style={Object.assign({}, containerStyles, { color: 'var(--blue)' })} onClick={actions.goEdit}>
                <i className={'fas fa-edit'} style={iconStyles} />
                <span style={spanStyles}>Editar tarea</span>
            </div>
            <div style={Object.assign({}, containerStyles, { color: 'var(--orange)' })}>
                <i className="fas fa-bullhorn" style={iconStyles} />
                <span style={spanStyles}>Hacer reporte</span>
            </div>
            <div style={Object.assign({}, containerStyles, { color: 'var(--green)' })} onClick={() => actions.goPedido(tarea)}>
                <i className="fas fa-truck-loading" style={iconStyles} />
                <span style={spanStyles}>Hacer pedido</span>
            </div>
        </div>
    }
};

const editContent = (taskActive, actions, options) => {
    return {
        header: "Editando una tarea",
        body: <TareaForm tarea={taskActive} options={options} close={actions.close} subHeader={"Introduzca los datos de la tarea."} />
    }
};



export default function ModalActionsTarea({ tarea, doCargar, modalOpen, setModalOpen, options }) {

    const [subHeader, setSubHeader] = useState('');
    const taskActive = useRef(tarea);


    const close = () => {
        doCargar();
        setModalOpen(false);
    };

    function handleCancel() {
        setModalContent({header:cancelModal.header,body:cancelModal.body});
    }
    function changeContent(modalContent){
        setModalContent({header:modalContent.header,body:modalContent.body});
    }

    const pedidoContent = (taskActive,actions,options) => {
        if(taskActive.current){
            return {
                header:'Realizar pedido',
                body:<PedidoForm idProyecto={taskActive.current.proyecto}  adquisiciones={[]} setModalContent={setModalContent} callbackPedido={close}/>
            }
        }
    }

    const handlePedido = () => {
        let content = pedidoContent(taskActive);
        setModalContent({header:content.header,body:content.body});
    }

    const handleVerTarea = () => {
        if (taskActive && taskActive.current._id)
            navigate('/tareas/' + taskActive.current._id)
    }
    function handleEdit() {
        setModalContent({header:editModal.header,body:editModal.body});
    }
    const revert = () => {
        setModalContent({header:actionsModal.header,body:actionsModal.body});
    };
    useEffect(() => {
        if (tarea) {
            setSubHeader(tarea.nombre);
            taskActive.current = tarea;
        }
    }, [tarea]);

    useEffect(() => {
        if (!modalOpen) {
            revert();
        }
    }, [modalOpen]);

    const actions = { goTo: handleVerTarea, goCancel:handleCancel, goBack: revert, close: close, goEdit: handleEdit,goPedido:handlePedido };
    const actionsModal = actionsContent(tarea, actions);
    const cancelModal =  cancelContent(taskActive, actions);
    const editModal = editContent(taskActive, actions, options);


    const [modalContent,setModalContent] = useState({header:actionsModal.header,body:actionsModal.body});



    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={modalContent.header}
            subHeader={subHeader}
            body={modalContent.body} />
    )
}
