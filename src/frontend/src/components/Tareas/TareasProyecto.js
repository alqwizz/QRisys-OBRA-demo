import React, { useState, useEffect } from "react";
import {
  findByProyectoLista,
  findByProyectoDesordenadas,
} from "../../utils/TareasUtils";
import useGlobal from "../../store/store";
import { ModalReportar } from "../Reportes/Modales/ModalReportar";
import { GantTareas } from "./Gant/GantTareas";
import TableTareas from "./Tablas/TablaTareas";
import { ModalFormPedidos } from "../Pedidos/Modales/ModalFormPedidos";
import { ModalFormTareas } from "./Modales/ModalFormTareas";
import Buscador from "../Proyectos/Buscador";
import reporteIcon from "../../assets/img/icons/hammer_Report.png";
import pedidosIcon from "../../assets/img/icons/delivery.svg";

export function TareasProyecto({ proyecto, origin, doCargar }) {
  let [openTable, setOpenTable] = useState(null);
  let [cargar, setCargar] = useState(false);
  let [tareas, setTareas] = useState(null);
  let [tareasOrdenadas, setTareasOrdenadas] = useState(null);
  let [editTarea, setEditTarea] = useState(null);
  const [hayPaginacion, setHayPaginacion] = useState(false);
  const [pages, setPages] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [openActions, setOpenActions] = useState(false);
  const [search, setSearch] = useState("");

  let [modalOpenFormTareas, setModalOpenFormTareas] = useState(false);
  let [modalOpenReportarTarea, setModalOpenReportarTarea] = useState(false);
  const [modalOpenPedidoTarea, setModalOpenPedidoTarea] = useState(false);

  const actions = useGlobal()[1];
  const hasPermission = actions.hasPermission();

  console.log(proyecto);

  useEffect(() => {
    let unmounted = false;
    if (origin) {
      if (origin === "tareasOrdenadas" && hasPermission("VTO") && !unmounted) {
        setOpenTable(0);
      }
      if (origin === "tareas" && hasPermission("VAT") && !unmounted) {
        setOpenTable(1);
      }
    } else {
      if (hasPermission("VTO")) {
        if (!unmounted) setOpenTable(0);
      } else if (hasPermission("VAT")) {
        if (!unmounted) setOpenTable(1);
      } else if (hasPermission("VG")) if (!unmounted) setOpenTable(2);
    }
    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => {
    let unmounted = false;
    if (openTable === 1) {
      if (!unmounted) setHayPaginacion(true);
    } else {
      if (!unmounted) setHayPaginacion(false);
    }
    return () => {
      unmounted = true;
    };
  }, [openTable]);

  useEffect(() => {
    let unmounted = false;
    if (openTable === 0) {
      findByProyectoLista(proyecto._id, page, limit, search).then((res) => {
        const tareasRes = res.data.tareas;
        if (!unmounted) {
          setPages(res.data.pages);
          setTareasOrdenadas(tareasRes);
        }
      });
    }
    if (openTable === 1)
      findByProyectoDesordenadas(proyecto._id, page, limit, search).then(
        (res) => {
          const tareasRes = res.data.tareas;
          if (!unmounted) {
            setPages(res.data.pages);
            setTareas(tareasRes);
          }
        }
      );
    return () => {
      unmounted = true;
    };
  }, [cargar, proyecto, search, page, limit, openTable]);

  const recargar = () => {
    doCargar();
    setCargar(!cargar);
  };

  const handleNuevaTarea = () => {
    setEditTarea(null);
    setModalOpenFormTareas(true);
  };

  const handleReportar = (tarea) => () => {
    setEditTarea(tarea);
    setModalOpenReportarTarea(true);
  };

  const handlePedido = (tarea) => () => {
    setEditTarea(tarea);
    setModalOpenPedidoTarea(true);
  };
  const handleCanReportar = (tarea) => {
    return !(tarea.childrens && tarea.childrens.length > 0);
  };

  const buttons = [
    {
      icon: reporteIcon,
      title: "Reportar",
      action: handleReportar,
      condition: handleCanReportar,
      hasPermission: hasPermission("CR"),
      color: "red",
    },
    {
      icon: pedidosIcon,
      title: "Hacer pedido",
      action: handlePedido,
      hasPermission: hasPermission("CP"),
      color: "var(--green-lighter)",
    },
  ];
  const middlePage = page === 1 ? 2 : page === pages ? pages - 1 : page;
  return (
    <React.Fragment>
      <div className="section-body">
        <div className={"section-body--header"}>
          {hasPermission("CC") && (
            <button
              onClick={handleNuevaTarea}
              type="button"
              className="qr-btn add-btn"
            >
              <i className={"fa fa-plus"} />
              <b>Contradictorio</b>
            </button>
          )}
          <div className={"qr-btn-group"}>
            {hasPermission("VTO") && (
              <button
                disabled={openTable === 0}
                title="Tabla de tareas ordenadas"
                onClick={() => setOpenTable(0)}
                className="icon-btn"
              >
                <i className="fas fa-stream" />
              </button>
            )}
            {hasPermission("VAT") && (
              <button
                disabled={openTable === 1}
                title="Tabla de tareas"
                onClick={() => setOpenTable(1)}
                className="icon-btn"
              >
                <i className="fa fa-list" />
              </button>
            )}
            {hasPermission("VG") && (
              <button
                disabled={openTable === 2}
                title="Gant de tareas"
                onClick={() => setOpenTable(2)}
                className="icon-btn"
              >
                <i className="fa fa-chart-line" />
              </button>
            )}
          </div>

          <Buscador setSearch={setSearch} />
        </div>
        <div className={"section-body--body"}>
          {hasPermission("VTO") && openTable === 0 && (
            <TableTareas
              ruta={true}
              tareas={tareasOrdenadas}
              openActions={openActions}
              setOpenActions={setOpenActions}
              setEditTarea={setEditTarea}
              buttons={buttons}
            />
          )}
          {hasPermission("VAT") && openTable === 1 && (
            <TableTareas
              tareas={tareas}
              openActions={openActions}
              setOpenActions={setOpenActions}
              setEditTarea={setEditTarea}
              buttons={buttons}
            />
          )}
          {hasPermission("VG") && openTable === 2 && (
            <GantTareas
              cargar={cargar}
              setCargar={setCargar}
              tareasArray={tareas}
            />
          )}
          {hayPaginacion && (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <div className={"pags-options"}>
                {page !== 1 && (
                  <span onClick={() => setPage(page - 1)}>&lt;&lt;</span>
                )}
                <span
                  className={page === 1 ? "active" : ""}
                  onClick={() => {
                    if (page !== 1) setPage(1);
                  }}
                >
                  1
                </span>
                {pages > 1 && (
                  <span
                    className={middlePage === page ? "active" : ""}
                    onClick={() => {
                      if (page !== middlePage) setPage(middlePage);
                    }}
                  >
                    {middlePage}
                  </span>
                )}
                {pages > 2 && "..."}
                {pages > 2 && (
                  <span
                    className={page === pages ? "active" : ""}
                    onClick={() => {
                      if (page !== pages) setPage(pages);
                    }}
                  >
                    {pages}
                  </span>
                )}
                {page !== pages && (
                  <span onClick={() => setPage(page + 1)}>&gt;&gt;</span>
                )}
              </div>
              <div className={"pags-options"}>
                <b>Resultados por página:</b>
                <span
                  onClick={() => {
                    if (limit !== 5) setLimit(5);
                  }}
                  className={limit === 5 ? "active" : ""}
                >
                  5
                </span>
                <span
                  onClick={() => {
                    if (limit !== 10) setLimit(10);
                  }}
                  className={limit === 10 ? "active" : ""}
                >
                  10
                </span>
                <span
                  onClick={() => {
                    if (limit !== 20) setLimit(20);
                  }}
                  className={limit === 20 ? "active" : ""}
                >
                  20
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <ModalFormTareas
        tarea={editTarea}
        doCargar={recargar}
        options={{ proyecto: proyecto._id }}
        modalOpen={modalOpenFormTareas}
        setModalOpen={setModalOpenFormTareas}
      />
      <ModalReportar
        tarea={editTarea}
        doCargar={recargar}
        modalOpen={modalOpenReportarTarea}
        setModalOpen={setModalOpenReportarTarea}
      />
      <ModalFormPedidos
        callbackPedido={() => {
          setModalOpenPedidoTarea(false);
        }}
        adquisiciones={[]}
        tarea={editTarea}
        doCargar={recargar}
        modalOpen={modalOpenPedidoTarea}
        setModalOpen={setModalOpenPedidoTarea}
        idProyecto={proyecto._id}
      />
      {/*<ModalActionsTarea tarea={editTarea} doCargar={recargar} modalOpen={openActions} setModalOpen={setOpenActions} options={{ proyecto: proyecto._id }} />*/}
    </React.Fragment>
  );
}
