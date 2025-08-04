import React, { useState, useEffect } from "react";
import { formatDate, proyectoValidations } from "../../../utils/FormsUtils";
import { editCTECI, findById } from "../../../utils/ProyectosUtils";

export function CIForm({ proyecto }) {
  const [newCTECI, setNewCTECI] = useState(Number(proyecto.CTECI[proyecto.CTECI.length - 1]));
  let [reload, setReload] = useState(true);

  console.log("cteci del proyecto:" + proyecto.CTECI[proyecto.CTECI.length - 1]);
  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      findById(proyecto._id).then((res) => {
        proyecto = res.data.proyecto;
      });
      console.log("Proyecto Actualizado:");
      console.log(proyecto);
      setReload(false);
    }
    return () => {
      unmounted = true;
    };
  }, [reload]);

  const handleChanges = (param) => (event) => {
    setNewCTECI(Number(event.target.value));
  }; /*
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
  };*/
  /*
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
*/

  const handleConfirmar = () => {
    //const err = validate(newCTECI);
    console.log(newCTECI);
    if (proyecto._id) editCTECI({ _id: proyecto._id, CTECI: Number(newCTECI) });
    setReload(true);
  };

  return (
    <React.Fragment>
      <div>
        CTECI :
        <input
          value={newCTECI}
          onChange={handleChanges("change")}
          type="number"
        ></input>
        <button
          style={{ backgroundColor: "#4F8698", color: "white", border: "0px" }}
          onClick={handleConfirmar}
          type="button"
        >
          <b>SAVE</b>
        </button>
      </div>
    </React.Fragment>
  );
}
