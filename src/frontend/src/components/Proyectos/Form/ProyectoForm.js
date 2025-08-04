import React, { useState, useEffect } from "react";
import { formatDate, proyectoValidations } from "../../../utils/FormsUtils";
import { create, edit } from "../../../utils/ProyectosUtils";
import {
  emptyProyecto,
  falseProyecto,
  trueProyecto,
} from "../../../utils/Proyecto/Form/Form";

export function ProyectoForm({ proyecto, options, close, modalOpen }) {
  let [touched, setTouched] = useState(falseProyecto);
  let [errors, setErrors] = useState(emptyProyecto);
  let [editProyecto, setEditProyecto] = useState(emptyProyecto);

  useEffect(() => {
    let unmounted = false;
    if (proyecto && !unmounted) setEditProyecto(proyecto);
    else if (!unmounted) setEditProyecto(emptyProyecto);
    return () => {
      unmounted = true;
    };
  }, [proyecto]);
  useEffect(() => {
    if (!modalOpen) {
      setEditProyecto(emptyProyecto);
      setErrors(emptyProyecto);
      setTouched(falseProyecto);
      close();
    }
  }, [modalOpen]);

  const handleBlur = (field) => (event) => {
    setTouched({ ...touched, [field]: true });
  };
  const handleChanges = (field) => (event) => {
    setEditProyecto({ ...editProyecto, [field]: event.target.value });
  };
  const validate = (editProyecto, touched) => {
    let nombreContactoError = touched.nombreContacto
      ? proyectoValidations.validateNombreContacto(editProyecto.nombreContacto)
      : "";
    let nombreError = touched.nombre
      ? proyectoValidations.validateNombre(editProyecto.nombre)
      : "";
    //let telefonoError = touched.telefono ? proyectoValidations.validateTelefono(editProyecto.telefono) : '';
    let emailError = touched.email
      ? proyectoValidations.validateEmail(editProyecto.email)
      : "";
    let direccionError = touched.direccion
      ? proyectoValidations.validateDireccion(editProyecto.direccion)
      : "";
    // let latError = touched.lat ? proyectoValidations.validateLat(editProyecto.lat) : '';
    // let lngError = touched.lng ? proyectoValidations.validateLng(editProyecto.lng) : '';
    let FInicioError = touched.fInicio
      ? proyectoValidations.validateFInicio(editProyecto.fInicio)
      : "";
    let FFinError = touched.fFin
      ? proyectoValidations.validateFFin(editProyecto.fFin)
      : "";

    return {
      nombreContacto: nombreContactoError,
      nombre: nombreError,
      //telefono: telefonoError,
      email: emailError,
      direccion: direccionError,
      // lat: latError,
      // lng: lngError,
      fInicio: FInicioError,
      fFin: FFinError,
    };
  };
  useEffect(() => {
    let unmounted = false;
    if (!unmounted) setErrors(validate(editProyecto, touched));
    return () => {
      unmounted = true;
    };
  }, [editProyecto, touched]);

  const resetForm = () => {
    setEditProyecto(emptyProyecto);
    setErrors(emptyProyecto);
    setTouched(falseProyecto);
    close();
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
    setTouched(trueProyecto);
    const err = validate(editProyecto, trueProyecto);
    setErrors(err);
    if (!hasErrors(err)) {
      if (editProyecto._id) {
        edit(editProyecto).then((response) => {
          resetForm();
        });
      } else {
        create({ ...editProyecto, ...options }).then((response) => {
          resetForm();
        });
      }
    }
  };
  return (
    <React.Fragment>
      <div className={"modal-body"}>
        <form>
          <div className="fornm-group">
            <div className="row">
              <div className="col-sm-5">
                <div
                  className={
                    "form-group form-group-default" +
                    (errors.nombre.length > 0 ? " has-error" : "")
                  }
                >
                  <label>Nombre</label>
                  <input
                    value={editProyecto.nombre}
                    onBlur={handleBlur("nombre")}
                    onChange={handleChanges("nombre")}
                    type="text"
                    className="form-control"
                  />
                  {errors.nombre.length > 0 && (
                    <label id="nombre-error" className="error" htmlFor="nombre">
                      {errors.nombre}
                    </label>
                  )}
                </div>
              </div>
              <div className="col-sm-7">
                <div
                  className={
                    "form-group form-group-default" +
                    (errors.nombreContacto.length > 0 ? " has-error" : "")
                  }
                >
                  <label>Nombre de contacto</label>
                  <input
                    value={editProyecto.nombreContacto}
                    onBlur={handleBlur("nombreContacto")}
                    onChange={handleChanges("nombreContacto")}
                    type="text"
                    className="form-control"
                  />
                  {errors.nombreContacto.length > 0 && (
                    <label
                      id="nombreContacto-error"
                      className="error"
                      htmlFor="nombreContacto"
                    >
                      {errors.nombreContacto}
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <div
                  className={
                    "form-group form-group-default" +
                    (errors.email.length > 0 ? " has-error" : "")
                  }
                >
                  <label>Email</label>
                  <input
                    value={editProyecto.email}
                    onBlur={handleBlur("email")}
                    onChange={handleChanges("email")}
                    type="email"
                    className="form-control"
                  />
                  {errors.email.length > 0 && (
                    <label id="email-error" className="error" htmlFor="email">
                      {errors.email}
                    </label>
                  )}
                </div>
              </div>
              <div className="col-sm-12 col-md-6">
                <div
                  className={
                    "form-group form-group-default" +
                    (errors.direccion.length > 0 ? " has-error" : "")
                  }
                >
                  <label>Dirección</label>
                  <input
                    value={editProyecto.direccion}
                    onBlur={handleBlur("direccion")}
                    onChange={handleChanges("direccion")}
                    className="form-control"
                  />
                  {errors.direccion.length > 0 && (
                    <label
                      id="direccion-error"
                      className="error"
                      htmlFor="direccion"
                    >
                      {errors.direccion}
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div
                  className={
                    "form-group form-group-default" +
                    (errors.fInicio.length > 0 ? " has-error" : "")
                  }
                >
                  <label>Fecha inicio</label>
                  <input
                    type="date"
                    value={formatDate(editProyecto.fInicio)}
                    onBlur={handleBlur("fInicio")}
                    onChange={handleChanges("fInicio")}
                    className="form-control"
                  />
                  {errors.fInicio.length > 0 && (
                    <label
                      id="fInicio-error"
                      className="error"
                      htmlFor="fInicio"
                    >
                      {errors.fInicio}
                    </label>
                  )}
                </div>
              </div>
              <div className="col-sm-6">
                <div
                  className={
                    "form-group form-group-default" +
                    (errors.fFin.length > 0 ? " has-error" : "")
                  }
                >
                  <label>Fecha fin</label>
                  <input
                    type="date"
                    value={formatDate(editProyecto.fFin)}
                    onBlur={handleBlur("fFin")}
                    onChange={handleChanges("fFin")}
                    className="form-control"
                  />
                  {errors.fFin.length > 0 && (
                    <label id="fFin-error" className="error" htmlFor="fFin">
                      {errors.fFin}
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div
        className={"modal-footer"}
        style={{ backgroundColor: "var(--main-color)" }}
      >
        <div
          style={
            proyecto
              ? { backgroundColor: "var(--border-color)" }
              : { backgroundColor: "var(--verde-agua)" }
          }
        >
          <button
            onClick={handleConfirmar}
            type="button"
            className="qr-btn confirm-btn"
          >
            {proyecto ? "Confirmar" : "Crear"}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
