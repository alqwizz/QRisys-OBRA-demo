import React, { useState } from "react";
import Comparativos from "./Comparativos";
import Certificaciones from "./Certificaciones";
import "./Dashboard.css";
import { MapaRecursos } from "./MapaRecursos";
import Proyecto from "./Proyecto";
import { Bar, Line } from "react-chartjs-2";
import {
  daysFromTo,
  goToTheRight,
  goToTheLeft,
  breakByWeeks,
} from "../../utils/Proyecto/Costes";
import { FCForm } from "./Forms/FechasCostesForm";
import { CIForm } from "./Forms/CTECIForm";

export default function Dashboard({ proyecto }) {
  const [activeTab, setActiveTab] = useState("proyecto");
  const [right, setRight] = useState(new Date());

  const showTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  let CR = [...proyecto.CD].map(
    (item, i) =>
      item +
      (proyecto.CO[i] ? proyecto.CO[i] : 0) +
      (proyecto.CI[i] ? proyecto.CI[i] : 0) +
      (proyecto.CM[i] ? proyecto.CM[i] : 0)
  );

  let fInicio = new Date(proyecto.fInicio);
  fInicio = new Date(
    fInicio.getFullYear(),
    fInicio.getMonth(),
    fInicio.getDate()
  );
  /*
  const [options, setOptions];
  */
  const initialData = {
    labels: daysFromTo(
      new Date(fInicio),
      new Date(right.getFullYear(), right.getMonth(), right.getDate())
    ).slice(-7),
    datasets: [
      {
        label: "CC",
        data: [...proyecto.CC].slice(-7),
        borderColor: "#49D449",
        backgroundColor: "rgba(73, 212, 73, 0.62)",
        lineTension: 0.2,
      },
      {
        label: "CR",
        data: CR.slice(-7),
        borderColor: "#F92125",
        backgroundColor: "rgba(212, 73, 73, 0.32)",
        lineTension: 0.1,
      },
      {
        label: "CD",
        data: [...proyecto.CD].slice(-7),
        borderColor: "#D44949",
        backgroundColor: "rgba(212, 73, 73, 0.37)",
        lineTension: 0.01,
      },
      {
        label: "CO",
        data: [...proyecto.CO].slice(-7),
        borderColor: "#2B5DE2",
        backgroundColor: "#8FC1E2",
      },
      {
        label: "CM",
        data: [...proyecto.CM].slice(-7),
        borderColor: "#F96028",
        backgroundColor: "#F9C48C",
      },
      {
        label: "CI",
        data: [...proyecto.CTECI].slice(-7),
        borderColor: "#5B5B48",
        backgroundColor: "#C2BB9B",
      },
    ],
  };

  const [data, setData] = useState(initialData);

  const changeData = (fechaI, fechaF) => {
    console.log(fechaI);
    console.log(fechaF);
    console.log(new Date(fInicio));
    console.log(
      (fechaI.getTime() - new Date(fInicio).getTime()) / (3600 * 1000 * 24)
    );
    let indexI = parseInt(
      (fechaI.getTime() - new Date(fInicio).getTime()) / (3600 * 1000 * 24)
    );
    let indexF =
      parseInt(
        (fechaF.getTime() - new Date(fInicio).getTime()) / (3600 * 1000 * 24)
      ) + 2;
    const empty = indexF < 0 || indexI > proyecto.CC.length - 1;
    if (indexF > proyecto.CC.length) indexF = proyecto.CC.length;
    const nof0 = indexI < 0 ? -indexI : 0;
    const ceroArray = new Array(nof0).fill(0);
    console.log(ceroArray);
    let useCC = empty
      ? []
      : [...ceroArray].concat(
          [...proyecto.CC].slice(indexI < 0 ? 0 : indexI, indexF)
        );
    let useCM = empty
      ? []
      : [...ceroArray].concat(
          [...proyecto.CM].slice(indexI < 0 ? 0 : indexI, indexF)
        );
    let useCO = empty
      ? []
      : [...ceroArray].concat(
          [...proyecto.CO].slice(indexI < 0 ? 0 : indexI, indexF)
        );
    let useCR = empty
      ? []
      : [...ceroArray].concat(CR.slice(indexI < 0 ? 0 : indexI, indexF));
    let useCD = empty
      ? []
      : [...ceroArray].concat(
          [...proyecto.CD].slice(indexI < 0 ? 0 : indexI, indexF)
        );
    let useCI = empty
      ? []
      : [...ceroArray].concat(
          [...proyecto.CTECI].slice(indexI < 0 ? 0 : indexI, indexF)
        );

    console.log(indexI, indexF);

    console.log(ceroArray);
    console.log([...ceroArray].concat([...proyecto.CC].slice(0, indexF)));
    console.log([...proyecto.CC]);
    console.log(daysFromTo(fechaI, fechaF));
    setData({
      labels: daysFromTo(fechaI, fechaF).slice(-7),
      datasets: [
        {
          label: "CC",
          data: useCC,
          borderColor: "#49D449",
          backgroundColor: "rgba(73, 212, 73, 0.6)",
          lineTension: 0.2,
        },
        {
          label: "CR",
          data: useCR,
          borderColor: "#F92125",
          backgroundColor: "rgba(142, 212, 73, 0.4)",
          lineTension: 0.1,
        },
        {
          label: "CD",
          data: useCD,
          borderColor: "#D44949",
          backgroundColor: "rgba(212, 73, 73, 0.37)",
          lineTension: 0.01,
        },
        {
          label: "CO",
          data: useCO,
          borderColor: "#2B5DE2",
          backgroundColor: "#8FC1E2",
          lineTension: 0.15,
        },
        {
          label: "CM",
          data: useCM,
          borderColor: "#F96028",
          backgroundColor: "#F9C48C",
          lineTension: 0.12,
        },
        {
          label: "CI",
          data: useCI,
          borderColor: "#5B5B48",
          backgroundColor: "#C2BB9B",
          lineTension: 0.13,
        },
      ],
    });
  };

  const handleToRight = () => {
    changeData(
      new Date(right.getFullYear(), right.getMonth(), right.getDate() + 1),
      new Date(right.getFullYear(), right.getMonth(), right.getDate() + 7)
    );
    setRight(
      new Date(right.getFullYear(), right.getMonth(), right.getDate() + 7)
    );
  };
  const handleToLeft = () => {
    changeData(
      new Date(right.getFullYear(), right.getMonth(), right.getDate() - 6 - 7),
      new Date(right.getFullYear(), right.getMonth(), right.getDate() - 7)
    );
    setRight(
      new Date(right.getFullYear(), right.getMonth(), right.getDate() - 7)
    );
  };

  const comeback = () => {
    setRight(new Date());
    setData(initialData);
  };

  /*const moveTo = (side) => {
    if(side === "right"){
      setRight(new Date(right.getFullYear(), right.getMonth(), right.getDate()));
      changeData(new Date(right.getFullYear(), right.getMonth(), right.getDate()+1),right)
    } else if(side === "left"){
      setRight(new Date(right.getFullYear(), right.getMonth(), right.getDate()));
      changeData(new Date(right.getFullYear(), right.getMonth(), right.getDate()-1),right)
    }
  }*/

  const options = {
    title: {
      display: true,
      text: "Gráfico de Costes",
      position: "bottom",
      fontsize: 20,
    },
    scales: {
      tickMarkLength: 70,
    },
    ticks: {
      padding: 10,
    },
    legend: {
      labels: {
        boxWidth: 10,
      },
    },
  };

  // INTERFACE
  return (
    <div className={"section-body"}>
      <div
        className={"section-body--header"}
        style={{ marginBottom: "15px", justifyContent: "space-evenly" }}
      >
        <div></div>
        <div
          className={"selectors"}
          style={{
            gridArea: "1/1/1/3",
            flex: 1,
            justifyContent: "flex-start",
          }}
        >
          <span
            className={
              "selector_item" +
              (activeTab === "proyecto" || activeTab === "certificaciones"
                ? " active"
                : "")
            }
            onClick={() => showTab("proyecto")}
          >
            Proyecto
          </span>
          <span
            className={
              "selector_item" + (activeTab === "comparativos" ? " active" : "")
            }
            onClick={() => showTab("comparativos")}
          >
            Comparativos
          </span>
          {/*<span className={'selector_item' + (activeTab === 'certificaciones' ? ' active' : '')} onClick={() => showTab('certificaciones')}>Certificaciones</span>*/}
          <span
            className={
              "selector_item" + (activeTab === "mapaRecursos" ? " active" : "")
            }
            onClick={() => showTab("mapaRecursos")}
          >
            Mapa Recursos
          </span>
        </div>
      </div>

      <div className={"section-body--body"}>
        {activeTab === "proyecto" && (
          <div style={{ textAlign: "center" }}>
            <div className={"chartContainer"}>
              <Line data={data} options={options} />
              <button
                style={{
                  backgroundColor: "#4F8698",
                  color: "white",
                  border: "0px",
                  fontWeight: "bolder",
                  fontsize: "60px",
                }}
                onClick={handleToLeft}
              >
                {" "}
                ←
              </button>
              <span></span>{" "}
              <button
                style={{
                  backgroundColor: "#4F8698",
                  color: "white",
                  border: "0px",
                  fontWeight: "bolder",
                  fontsize: "60px",
                }}
                onClick={comeback}
              >
                {" "}
                ⌂
              </button>
              <span></span>{" "}
              <button
                style={{
                  backgroundColor: "#4F8698",
                  color: "white",
                  border: "0px",
                  fontWeight: "bolder",
                  fontsize: "30px",
                }}
                onClick={handleToRight}
              >
                {" "}
                →
              </button>
              <br />
              <br />
              <CIForm proyecto={proyecto} />
            </div>

            <Proyecto proyecto={proyecto} setActiveTab={setActiveTab} />
          </div>
        )}
        {activeTab === "comparativos" && <Comparativos proyecto={proyecto} />}
        {activeTab === "certificaciones" && (
          <Certificaciones proyecto={proyecto} />
        )}
        {activeTab === "mapaRecursos" && (
          <MapaRecursos idProyecto={proyecto._id} />
        )}
      </div>
    </div>
  );
}
