import React, { useState, useEffect } from "react";
import { formatDate, proyectoValidations } from "../../../utils/FormsUtils";

export function FCForm({ proyecto, changeData }) {
  const today = new Date();
  const [fechaI, setFechaI] = useState(new Date(proyecto.fInicio));
  const [fechaF, setFechaF] = useState(new Date(today));

  const handleChange = (field) => (event) => {
    if (field === "inicio") setFechaI(new Date(event.target.value));
    if (field === "fin") setFechaF(new Date(event.target.value));
  };

  const validate = (fechaI, fechaF) => {
    let fechaIError =
      !fechaI ||
      fechaI === " " ||
      fechaI.getTime() < new Date(proyecto.fInicio).getTime() ||
      fechaI.getTime() > today.getTime()
        ? "Debe introducirse una fecha inicial posterior al inicio del proyecto"
        : "";
    let fechaFError =
      !fechaF || fechaF === " " || fechaF.getTime() < fechaI.getTime()
        ? "Debe introducirse una fecha final menor o igual a hoy"
        : "";

    return {
      fechaI: fechaIError,
      fFin: fechaFError,
    };
  };

  const hasErrors = (errors) => {
    let res = false;
    for (var prop in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, prop)) {
        if (errors[prop] !== "") {
          res = true;
          break;
        }
      }
    }
    return res;
  };

  const handleConfirmar = () => {
    const err = validate(fechaI, fechaF);
    if (!hasErrors(err)) {
      changeData(fechaI, fechaF);
    }
  };

  return (
    <React.Fragment>
      <div>
        <input
          value={formatDate(fechaI)}
          onChange={handleChange("inicio")}
          style={{width:"35%", maxWidth:"150px"}}
          type="date"
        ></input>
        <button
          style={{ backgroundColor: "#4F8698", color: "white", border: "0px" }}
          onClick={handleConfirmar}
          type="button"
        >
          <b>Refresh</b>
        </button>
        <input
          type="date"
          style={{width:"35%", maxWidth:"150px"}}
          value={formatDate(fechaF)}
          onChange={handleChange("fin")}
        ></input>
      </div>
    </React.Fragment>
  );
}
