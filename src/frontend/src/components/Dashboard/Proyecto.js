import React, { useState, useEffect } from "react";
import { exportarExcel as exportarExcelTareas } from "../../utils/TareasUtils";
import useGlobal from "../../store/store";
import {
  exportarExcel as exportarExcelPedidos,
  exportarData as exportarDataPedidos,
} from "../../utils/PedidosUtils";
import { exportarExcel as exportarParteAsistencia } from "../../utils/ParteAsistenciaUtils";
import { exportarArchivosProyecto } from "../../utils/ReportesProduccionUtils";

export default function Proyecto({
  proyecto,
  setActiveTab,
  options,
  close,
  modalOpen,
}) {
  const actions = useGlobal()[1];
  const hasPermission = actions.hasPermission();

  const handleExportarTareas = () => {
    exportarExcelTareas(proyecto._id).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "EXCEL TAREAS.xlsx");
      document.body.appendChild(link);
      link.click();
    });
  };
  const handleExportarPedidos = () => {
    exportarExcelPedidos(proyecto._id).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "EXCEL TODOS LOS PEDIDOS.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  const handleExportarDatosPedidos = () => {
    exportarDataPedidos(proyecto._id).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", proyecto._id + ".zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  const handleExportarPartesPersonal = () => {
    exportarParteAsistencia(proyecto._id).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "PARTES PERSONAL.xlsx");
      document.body.appendChild(link);
      link.click();
    });
  };
  const handleExportarArchivos = () => {
    exportarArchivosProyecto(proyecto._id).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", proyecto._id + ".zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div>
      <div>
        <div className={"proyecto-panel"}>
          <div className={"proyecto-title"}>Exportación a excel</div>
          <div className={"exportaciones-container"}>
            {hasPermission("EP") && (
              <button
                className={"qr-btn add-btn"}
                onClick={handleExportarTareas}
              >
                <i className={"far fa-file-excel"} />
                <b>EJECUCIÓN PARTIDAS</b>
              </button>
            )}
            {hasPermission("EP") && (
              <button
                className={"qr-btn add-btn"}
                onClick={handleExportarArchivos}
              >
                <i className={"far fa-file-excel"} />
                <b>Archivos de producción</b>
              </button>
            )}
            <button
              className={"qr-btn add-btn"}
              onClick={handleExportarPedidos}
            >
              <i className={"far fa-file-excel"} />
              <b>PEDIDOS</b>
            </button>
            <button
              className={"qr-btn add-btn"}
              onClick={handleExportarDatosPedidos}
            >
              <i className={"far fa-file-excel"} />
              <b>ARCHIVOS DE PEDIDOS</b>
            </button>
            {hasPermission("EPT") && (
              <button
                className={"qr-btn add-btn"}
                onClick={handleExportarPartesPersonal}
              >
                <i className={"far fa-file-excel"} />
                <b>PARTES DE PERSONAL</b>
              </button>
            )}
          </div>
        </div>
        <button
          className={"qr-btn blue"}
          onClick={() => setActiveTab("certificaciones")}
        >
          <b>Certificaciones</b>
        </button>
      </div>
    </div>
  );
}
