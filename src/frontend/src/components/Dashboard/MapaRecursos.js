import React, { useRef, useEffect, useState } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import useScript from "../../utils/useScript";
import imagen from "../../assets/img/maquina.png"
import { findMaquinasByProyecto, findMaterialesByProyecto } from '../../utils/AdquisicionesUtils'
import { ModalDetalleMaquina } from './ModalDetalleMaquina'
export function MapaRecursos({ idProyecto }) {

    let [mapLoaded] = useScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBv0s5lxqj1SJif7OclE-kBOKtEAO_rUgY&language=es&region=ES");
    const mapCenterInitial = { lat: 38.93098665592437, lng: -4.626235757987615 };
    const mapStyles = {
        width: '100%',
        height: '600px',
        maxHeight: '100vh',
        position: 'relative',
    };
    const mapRef = useRef(null);
    const [mapa, setMapa] = useState(null)
    const [maquinas, setMaquinas] = useState([])
    const [materiales, setMateriales] = useState([])
    const [maquinaInModal, setMaquinaInModal] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    useEffect(() => {
        findMaquinasByProyecto(idProyecto).then(res => {
            setMaquinas(res.data.adquisiciones);
        })
        findMaterialesByProyecto(idProyecto).then(res => {
            setMateriales(res.data.adquisiciones);
        })
    }, [])

    const getPositionMaquina = (maquina, numeroMaquina) => {
        if (maquina && maquina.reportes && maquina.reportes.length > 0) {
            const reportes = maquina.reportes.filter(x => x.numeroMaquina === numeroMaquina);
            const reporte = reportes.length > 0 ? reportes[reportes.length - 1] : null;
            if (reporte && reporte.geolocalizacion)
                return { lat: reporte.geolocalizacion.lat, lng: reporte.geolocalizacion.lng }
        }
        return null;
    }
    useEffect(() => {
        if (mapLoaded) {
            console.log('Iniciamdo mapa....');
            var iconBase =
                '../../assets/img/maquina.png';

            var icons = {
                parking: {
                    icon: iconBase + 'parking_lot_maps.png'
                },
                library: {
                    icon: iconBase + 'library_maps.png'
                },
                info: {
                    icon: iconBase + 'info-i_maps.png'
                }
            };

            const map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                //gestureHandling: 'cooperative',
                center: mapCenterInitial,
                scaleControl: false,
                fullscreenControl: false,
                mapTypeControlOptions: {
                    style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                    position: window.google.maps.ControlPosition.TOP_CENTER
                },
                streetViewControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_CENTER
                }
            });

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    let aux = {}
                    for (let i = 0; i < maquinas.length; i++) {
                        const maquina = maquinas[i];
                        let acum = 0;
                        if (aux[maquina.nombre])
                            acum = aux[maquina.nombre];
                        for (let i = 0; i < maquina.cantidad; i++) {
                            acum++;
                            aux[maquina.nombre] = acum;
                            var marker = new window.google.maps.Marker({
                                position: getPositionMaquina(maquina, i),
                                icon: imagen,
                                map: map
                            });
                            marker.addListener('click', handleMaquina(maquina, i))
                        }
                    }

                    map.setCenter(pos);
                    map.setZoom(12);
                    setMapa(map)
                }, function () {
                    var pos = {
                        lat: 36.68645,
                        lng: -6.13606
                    };
                    let aux = {}
                    for (let i = 0; i < maquinas.length; i++) {
                        const maquina = maquinas[i];
                        let acum = 0;
                        if (aux[maquina.nombre])
                            acum = aux[maquina.nombre];
                        for (let i = 0; i < maquina.cantidad; i++) {
                            acum++;
                            aux[maquina.nombre] = acum;
                            var marker = new window.google.maps.Marker({
                                position: getPositionMaquina(maquina, i),
                                icon: imagen,
                                map: map
                            });
                            marker.addListener('click', handleMaquina(maquina, i))
                        }
                    }

                    map.setCenter(pos);
                    map.setZoom(12);
                    setMapa(map)
                });

            } else {
                // Browser doesn't support Geolocation
                console.error('Navegador no soporta la geolocalizacion.');
            }
        }
    }, [mapLoaded, maquinas]);
    const handleMaquina = (maquina, numeroMaquina) => () => {
        if (mapa) {
            const position = getPositionMaquina(maquina, numeroMaquina)
            if (position)
                mapa.setCenter(position)
        }
        setOpenModal(true)
        setMaquinaInModal({ maquina, numeroMaquina: numeroMaquina })
    }
    let nombreMaquinas = {}
    return (
        <React.Fragment>
            <div className={'mapa-container'}>
                <div id={'map'} style={mapStyles} ref={mapRef} />
            </div>
            <br></br>
            <div className={'maquinas-info--map'}>
                    <span className={'maquinas-info--map--title'}>MÁQUINAS</span>
                    <div className={'maquinas-info--map--maquinas'}>
                        {maquinas && maquinas.length > 0 && maquinas.map(maquina => {
                            const res = []
                            let acum = 0;
                            if (nombreMaquinas[maquina.nombre])
                                acum = nombreMaquinas[maquina.nombre];
                            for (let i = 0; i < maquina.cantidad; i++) {
                                acum++;
                                nombreMaquinas[maquina.nombre] = acum;
                                const row = <div onClick={handleMaquina(maquina, i)} style={maquina.estadosMaquinas[i] === 'ENTREGADO' ? { backgroundColor: 'rgba(113,175,113,.2)' } : (maquina.estadosMaquinas[i] === 'EN USO' ? { backgroundColor: 'rgba(113,115,175,.2)' } : (maquina.estadosMaquinas[i] === 'PROBLEMA') ? { backgroundColor: 'rgba(175,113,175,.2)' } : {})}>
                                    <span style={{overflow:"hidden"}}>{maquina.nombre + " " + (acum)}</span><span>{maquina.estadosMaquinas[i]}</span></div>
                                res.push(row);
                            }
                            return res;

                        })}
                    </div>
                    <span className={'maquinas-info--map--title'}>MATERIALES</span>
                    <div className={'maquinas-info--map--maquinas'}>
                        {materiales && materiales.length > 0 && materiales.map(material => {
                            return <div style={material.estadoMaterial === 'ENTREGADO' ? { backgroundColor: 'rgba(113,175,113,..2)' } : (material.estadoMaterial === 'ACOPIADO' ? { backgroundColor: 'rgba(1113,175,113,.2)' } : (material.estadoMaterial === 'PENDIENTE') ? { backgroundColor: 'rgba(75,113,175,.2)' } : {})}>
                                <span style={{overflow:"hidden"}}>{material.nombre}</span><span>{material.estadoMaterial}</span></div>
                        })}
                    </div>
                </div>
            <ModalDetalleMaquina modalOpen={openModal} setModalOpen={setOpenModal} maquina={maquinaInModal && maquinaInModal.maquina} numeroMaquina={maquinaInModal && maquinaInModal.numeroMaquina} />
        </React.Fragment>
    )
}
