import React, { useEffect } from "react";
import useGlobal from "../../../store/store";
import { navigate } from "hookrouter";
import problemFlag from "../../../assets/img/icons/divisa.svg";

import "./TablaTareas.css";
export default function TableTareas({
  ruta = false,
  tareas,
  openActions,
  setOpenActions,
  setEditTarea,
  buttons,
  certificacion,
}) {
  const [state, actions] = useGlobal();
  const user = state.userSession;
  const hasPermission = actions.hasPermission();
  function clickTask(tarea) {
    if (!certificacion) {
      navigate("/tareas/" + tarea._id);
    }
    console.log(tarea.reportesProduccion);
  }
  // useEffect(() => {
  //     console.log(tareas);
  // },[]);

  console.log(tareas);

  const returnStrokeStyle = (tarea) => {
    const result = {};
    switch (tarea.estado) {
      case "iniciado":
        result.stroke = "#238998";
        break;
      case "problema":
        result.stroke = "#fdb5b0";
        break;
      case "completado":
        result.stroke = "#212B4A";
        break;
      case "cerrado":
        result.stroke = "#487A1D";
        break;
      case "cancelado":
        result.display = "none";
        break;
      default:
        result.stroke = "white";
        break;
    }
    result.strokeDashoffset = 252 - 252 * (tarea.porcentajeActual / 100);
    // if (user && user.tareas && !user.tareas.includes(tarea._id)) {
    //     result.backgroundColor = '#f6f6f6';
    // }
    return result;
  };

  const firstCircleStyle = {
    stroke: "grey",
    strokeWidth: "4px",
  };
  const secondCircleStyle = {
    strokeWidth: "10px",
    strokeDasharray: "252",
    strokeLinecap: "round",
  };

  const canClickTask = (tarea) => {
    if (user) {
      if (
        (!tarea.childrens || tarea.childrens.length === 0) &&
        hasPermission(["VTRP", "VTP"])
      )
        return true;
    }
    return false;
  };
  const makeRow = (el, nombrePadre) => {
    let tarea = el;
    /*if(certificacion) tarea = el.tarea;
        console.log(el);
        console.log(tarea);*/
    let esPadreInutil = false;
    let nombre = nombrePadre
      ? nombrePadre + " / " + tarea.nombre
      : tarea.nombre;
    return (
      <div className={"tarea-container"} key={tarea._id}>
        {tarea.reportesProduccion &&
          tarea.reportesProduccion[tarea.reportesProduccion.length - 1] &&
          tarea.reportesProduccion[tarea.reportesProduccion.length - 1]
            .reporte &&
          tarea.reportesProduccion[tarea.reportesProduccion.length - 1].reporte
            .tipo === "problema" && (
            <img
              src={problemFlag}
              alt={"bandera de problema"}
              className={"tarea-problem-indicator"}
            />
          )}
        {tarea.estado !== "cancelado" &&
        tarea.childrens &&
        tarea.childrens.length > 0 ? (
          <div
            className={"children-container"}
            style={{
              overflow: "hidden",
              transition: "max-height .5s linear",
              marginLeft: "15px",
              marginTop: "2px",
            }}
          >
            {tarea.childrens.map((el, i) => {
              if (el.childrens && el.childrens.length > 0) esPadreInutil = true;
              return makeRow(el, esPadreInutil ? tarea.nombre : undefined);
            })}
          </div>
        ) : (
          ""
        )}
        {!esPadreInutil && (
          <div
            style={{ display: tarea.estado === "cancelado" ? "none" : "flex" }}
            className={
              "tarea-info" +
              (tarea.childrens && tarea.childrens.length > 0
                ? " capitulo"
                : ruta
                ? " tarea rutas"
                : " tarea")
            }
            id={tarea._id}
            data-id={tarea.parent ? tarea.parent : ""}
            data-children={tarea.childrens && tarea.childrens.length}
          >
            <div className={"tarea-info--content"}>
              {tarea.childrens && tarea.childrens.length === 0 ? (
                <svg
                  viewBox="0 0 100 100"
                  style={{ height: "4em", marginRight: "30px" }}
                >
                  <circle
                    id="first-circle"
                    cx="50"
                    cy="50"
                    r="32"
                    fill="none"
                    style={firstCircleStyle}
                  />
                  <circle
                    id="second-circle"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    style={Object.assign(
                      {},
                      secondCircleStyle,
                      returnStrokeStyle(tarea)
                    )}
                  />
                  <text
                    x="50"
                    y="50"
                    fontSize={"18"}
                    fontWeight={"bold"}
                    dominantBaseline="middle"
                    textAnchor="middle"
                  >
                    {tarea &&
                      tarea.porcentajeActual &&
                      tarea.porcentajeActual.toFixed(0)}
                    %
                  </text>
                </svg>
              ) : (
                <span style={{ marginRight: "15px" }}>
                  {tarea &&
                    tarea.porcentajeActual &&
                    tarea.porcentajeActual.toFixed(0)}
                  %
                </span>
              )}

              <span
                style={{
                  fontWeight: "bold",
                  cursor: canClickTask(tarea) ? "pointer" : "default",
                }}
                onClick={() => (canClickTask(tarea) ? clickTask(tarea) : "")}
              >
                {nombre}
              </span>
              {ruta && <div className="ruta">{tarea.parent}</div>}

              {!certificacion &&
                (!tarea.childrens || tarea.childrens.length === 0) && (
                  <div style={{ display: "flex", justifySelf: "end" }}>
                    {buttons.map((button, i) => {
                      if (button.hasPermission)
                        return (
                          <img
                            key={i}
                            onClick={button.action(tarea)}
                            className={"icon-img--btn"}
                            src={button.icon}
                            alt={button.title}
                            title={button.title}
                          />
                        );
                      return <div></div>;
                    })}
                  </div>
                )}
              {certificacion && (
                <div style={{ display: "flex" }}>
                  {tarea.porcentajeCert && (
                    <span style={{ marginRight: "15px" }}>
                      {(+tarea.porcentajeCert).toFixed()}%
                    </span>
                  )}
                  {tarea.costeAsociado && (
                    <span>{(+tarea.costeAsociado).toFixed(2)}€</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return tareas && tareas.length > 0 ? (
    tareas.map((el, i) => {
      return makeRow(el);
    })
  ) : (
    <div>
      <p>No hay tareas disponibles.</p>
    </div>
  );
}
