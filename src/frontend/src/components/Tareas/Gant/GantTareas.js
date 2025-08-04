import React, { useState, useEffect } from "react";
import TimeLine from "react-gantt-timeline";

import { ModalReportar } from "../../Reportes/Modales/ModalReportar";
import "./GantTareas.css";
import { trueBooleanTarea } from "../../../utils/Tarea/Form/Form";
import { constants } from "os";
import { render } from "react-dom";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { TouchableHighlight } from "react";

export function GantTareas({ cargar, setCargar, tareasArray }) {
  let [openTable, setOpenTable] = useState(0);
  let [tareas, setTareas] = useState([]);
  let [selectedTarea, setSelectedTarea] = useState(null);
  let [links, setLinks] = useState([]);
  let [modalOpenReportarTarea, setModalOpenReportarTarea] = useState(false);

  let TT = new Array();
  var cont = 0;
  var minimo = 2;
  var level1 = 0;
  var level2 = 0;
  var level3 = 0;
  var level4 = 0;
  var level5 = 0;
  var level6 = 0;
  var level7 = 0;
  var level8 = 0;
  var level9 = 0;
  var level10 = 0;
  if (tareasArray != null) {
    if (tareasArray.length > 0) {
      for (var K = 0; K < 1; K++) {
        for (var i = 0; i < tareasArray.length; i++) {
          TT.push(tareasArray[i]);
          cont = cont + 1;
          level1 = cont;
          TT[cont - 1].nivel = 1;
          if (tareasArray[i].childrens) {
            TT[level1 - 1].nivel = 2;
            for (var j = 0; j < tareasArray[i].childrens.length; j++) {
              TT.push(tareasArray[i].childrens[j]);
              cont = cont + 1;
              level2 = cont;
              TT[cont - 1].nivel = 1;
              if (tareasArray[i].childrens[j].childrens) {
                TT[level1 - 1].nivel = 3;
                TT[level2 - 1].nivel = 2;
                for (
                  var j1 = 0;
                  j1 < tareasArray[i].childrens[j].childrens.length;
                  j1++
                ) {
                  TT.push(tareasArray[i].childrens[j].childrens[j1]);
                  cont = cont + 1;
                  level3 = cont;
                  TT[cont - 1].nivel = 1;
                  if (tareasArray[i].childrens[j].childrens[j1].childrens) {
                    TT[level1 - 1].nivel = 4;
                    TT[level2 - 1].nivel = 3;
                    TT[level3 - 1].nivel = 2;
                    for (
                      var j2 = 0;
                      j2 <
                      tareasArray[i].childrens[j].childrens[j1].childrens
                        .length;
                      j2++
                    ) {
                      TT.push(
                        tareasArray[i].childrens[j].childrens[j1].childrens[j2]
                      );
                      cont = cont + 1;
                      level4 = cont;
                      TT[cont - 1].nivel = 1;
                      if (
                        tareasArray[i].childrens[j].childrens[j1].childrens[j2]
                          .childrens
                      ) {
                        TT[level1 - 1].nivel = 5;
                        TT[level2 - 1].nivel = 4;
                        TT[level3 - 1].nivel = 3;
                        TT[level4 - 1].nivel = 2;
                        for (
                          var j3 = 0;
                          j3 <
                          tareasArray[i].childrens[j].childrens[j1].childrens[
                            j2
                          ].childrens.length;
                          j3++
                        ) {
                          TT.push(
                            tareasArray[i].childrens[j].childrens[j1].childrens[
                              j2
                            ].childrens[j3]
                          );
                          cont = cont + 1;
                          level5 = cont;
                          TT[cont - 1].nivel = 1;
                          if (
                            tareasArray[i].childrens[j].childrens[j1].childrens[
                              j2
                            ].childrens[j3].childrens
                          ) {
                            TT[level1 - 1].nivel = 6;
                            TT[level2 - 1].nivel = 5;
                            TT[level3 - 1].nivel = 4;
                            TT[level4 - 1].nivel = 3;
                            TT[level5 - 1].nivel = 2;
                            for (
                              var j4 = 0;
                              j4 <
                              tareasArray[i].childrens[j].childrens[j1]
                                .childrens[j2].childrens[j3].childrens.length;
                              j4++
                            ) {
                              TT.push(
                                tareasArray[i].childrens[j].childrens[j1]
                                  .childrens[j2].childrens[j3].childrens[j4]
                              );
                              cont = cont + 1;
                              level6 = cont;
                              TT[cont - 1].nivel = 1;
                              if (
                                tareasArray[i].childrens[j].childrens[j1]
                                  .childrens[j2].childrens[j3].childrens[j4]
                                  .childrens
                              ) {
                                TT[level1 - 1] = 7;
                                TT[level2 - 1] = 6;
                                TT[level3 - 1] = 5;
                                TT[level4 - 1] = 4;
                                TT[level5 - 1] = 3;
                                TT[level6 - 1] = 2;
                                for (
                                  var j5 = 0;
                                  j5 <
                                  tareasArray[i].childrens[j].childrens[j1]
                                    .childrens[j2].childrens[j3].childrens[j4]
                                    .childrens.length;
                                  j5++
                                ) {
                                  TT.push(
                                    tareasArray[i].childrens[j].childrens[j1]
                                      .childrens[j2].childrens[j3].childrens[j4]
                                      .childrens[j5]
                                  );
                                  cont = cont + 1;
                                  level7 = cont;
                                  TT[cont - 1].nivel = 1;
                                  if (
                                    tareasArray[i].childrens[j].childrens[j1]
                                      .childrens[j2].childrens[j3].childrens[j4]
                                      .childrens[j5].childrens
                                  ) {
                                    TT[level1 - 1] = 8;
                                    TT[level2 - 1] = 7;
                                    TT[level3 - 1] = 6;
                                    TT[level4 - 1] = 5;
                                    TT[level5 - 1] = 4;
                                    TT[level6 - 1] = 3;
                                    TT[level7 - 1] = 2;
                                    for (
                                      var j6 = 0;
                                      j6 <
                                      tareasArray[i].childrens[j].childrens[j1]
                                        .childrens[j2].childrens[j3].childrens[
                                        j4
                                      ].childrens[j5].childrens.length;
                                      j6++
                                    ) {
                                      TT.push(
                                        tareasArray[i].childrens[j].childrens[
                                          j1
                                        ].childrens[j2].childrens[j3].childrens[
                                          j4
                                        ].childrens[j5].childrens[j6]
                                      );
                                      cont = cont + 1;
                                      level8 = cont;
                                      TT[cont - 1].nivel = 1;
                                      if (
                                        tareasArray[i].childrens[j].childrens[
                                          j1
                                        ].childrens[j2].childrens[j3].childrens[
                                          j4
                                        ].childrens[j5].childrens[j6].childrens
                                      ) {
                                        TT[level1 - 1] = 9;
                                        TT[level2 - 1] = 8;
                                        TT[level3 - 1] = 7;
                                        TT[level4 - 1] = 6;
                                        TT[level5 - 1] = 5;
                                        TT[level6 - 1] = 4;
                                        TT[level7 - 1] = 3;
                                        TT[level8 - 1] = 2;
                                        for (
                                          var j7 = 0;
                                          j7 <
                                          tareasArray[i].childrens[j].childrens[
                                            j1
                                          ].childrens[j2].childrens[j3]
                                            .childrens[j4].childrens[j5]
                                            .childrens[j6].childrens.length;
                                          j7++
                                        ) {
                                          TT.push(
                                            tareasArray[i].childrens[j]
                                              .childrens[j1].childrens[j2]
                                              .childrens[j3].childrens[j4]
                                              .childrens[j5].childrens[j6]
                                              .childrens[j7]
                                          );
                                          cont = cont + 1;
                                          level9 = cont;
                                          TT[cont - 1].nivel = 1;
                                          if (
                                            tareasArray[i].childrens[j]
                                              .childrens[j1].childrens[j2]
                                              .childrens[j3].childrens[j4]
                                              .childrens[j5].childrens[j6]
                                              .childrens[j7].childrens
                                          ) {
                                            TT[level1 - 1] = 10;
                                            TT[level2 - 1] = 9;
                                            TT[level3 - 1] = 8;
                                            TT[level4 - 1] = 7;
                                            TT[level5 - 1] = 6;
                                            TT[level6 - 1] = 5;
                                            TT[level7 - 1] = 4;
                                            TT[level8 - 1] = 3;
                                            TT[level9 - 1] = 2;
                                            for (
                                              var j8 = 0;
                                              j8 <
                                              tareasArray[i].childrens[j]
                                                .childrens[j1].childrens[j2]
                                                .childrens[j3].childrens[j4]
                                                .childrens[j5].childrens[j6]
                                                .childrens[j7].childrens.length;
                                              j8++
                                            ) {
                                              TT.push(
                                                tareasArray[i].childrens[j]
                                                  .childrens[j1].childrens[j2]
                                                  .childrens[j3].childrens[j4]
                                                  .childrens[j5].childrens[j6]
                                                  .childrens[j7].childrens[j8]
                                              );
                                              cont = cont + 1;
                                              level10 = cont;
                                              TT[cont - 1].nivel = 1;
                                              if (
                                                tareasArray[i].childrens[j]
                                                  .childrens[j1].childrens[j2]
                                                  .childrens[j3].childrens[j4]
                                                  .childrens[j5].childrens[j6]
                                                  .childrens[j7].childrens[j8]
                                                  .childrens
                                              ) {
                                                TT[level1 - 1] = 11;
                                                TT[level2 - 1] = 10;
                                                TT[level3 - 1] = 9;
                                                TT[level4 - 1] = 8;
                                                TT[level5 - 1] = 7;
                                                TT[level6 - 1] = 6;
                                                TT[level7 - 1] = 5;
                                                TT[level8 - 1] = 4;
                                                TT[level9 - 1] = 3;
                                                TT[level10 - 1] = 2;
                                                for (
                                                  var j9 = 0;
                                                  j9 <
                                                  tareasArray[i].childrens[j]
                                                    .childrens[j1].childrens[j2]
                                                    .childrens[j3].childrens[j4]
                                                    .childrens[j5].childrens[j6]
                                                    .childrens[j7].childrens[j8]
                                                    .childrens.length;
                                                  j9++
                                                ) {
                                                  TT.push(
                                                    tareasArray[i].childrens[j]
                                                      .childrens[j1].childrens[
                                                      j2
                                                    ].childrens[j3].childrens[
                                                      j4
                                                    ].childrens[j5].childrens[
                                                      j6
                                                    ].childrens[j7].childrens[
                                                      j8
                                                    ].childrens[j9]
                                                  );
                                                  cont = cont + 1;
                                                  TT[cont - 1].nivel = 1;
                                                  minimo = 1;
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  var cc = 0;
  for (cc = 0; cc < TT.length - 1; cc++) {
    if (TT[cc + 1].nivel >= TT[cc].nivel && TT[cc].nivel > minimo) {
      TT[cc].nivel = TT[cc + 1].nivel + 1;
    }
  }
  useEffect(() => {
    let unmounted = false;
    if (TT.length > 0) {
      tareasArray = TT;
    }
    if (tareasArray && tareasArray.length > 0) {
      let d1 = new Date();
      let d2 = new Date();
      d2.setDate(d2.getDate() + 5);
      let enlaces = [];
      const funcion = (tarea) => {
        if (tarea.nivel == minimo) {
          //tarea.color = "#B2BABB";
          tarea.color = "#808B96";
        }
        if (tarea.nivel == minimo + 1) {
          //tarea.color = "#A3E4D7";
          tarea.color = "#34495E";
        }
        if (tarea.nivel == minimo + 2) {
          tarea.color = "#AED6F1";
        }
        if (tarea.nivel == minimo + 3) {
          tarea.color = "#85C1E9";
        }
        if (tarea.nivel == minimo + 4) {
          tarea.color = "#5DADE2";
        }
        if (tarea.nivel == minimo + 5) {
          tarea.color = "#3498DB";
        }
        if (tarea.nivel == minimo + 6) {
          tarea.color = "#2E86C1";
        }
        if (tarea.nivel == minimo + 7) {
          tarea.color = "#2874A6";
        }
        if (tarea.nivel == minimo + 8) {
          tarea.color = "#8E44AD";
        }
        if (tarea.nivel == minimo + 9) {
          tarea.color = "#6C3483";
        }
        if (tarea.nivel == minimo + 10) {
          tarea.color = "#4A235A";
        }
        if (tarea.nivel == minimo + 11) {
          tarea.color = "#000000";
        }
        tarea.name = tarea.nombre;
        tarea.end = tarea.fFin || d2;
        tarea.start = tarea.fInicio || d1;
        tarea.id = tarea.idPlanificacion;
        if (tarea.idPredecesora)
          enlaces.push({
            id: enlaces.length + 1,
            start: tarea.idPredecesora,
            end: tarea.idPlanificacion,
          });
        return tarea;
      };
      tareasArray.map(funcion);
      if (!unmounted) {
        setLinks(enlaces);
        setTareas(tareasArray);
      }
    }
    return () => {
      unmounted = true;
    };
  }, [cargar, tareasArray]);
  let config0 = {
    header: {
      //Targert the time header containing the information month/day of the week, day and time.
      top: {
        //Tartget the month elements
        style: { backgroundColor: "#333333" }, //The style applied to the month elements
      },
      middle: {
        //Tartget elements displaying the day of week info
        style: { backgroundColor: "chocolate" }, //The style applied to the day of week elements
        selectedStyle: { backgroundColor: "#b13525" }, //The style applied to the day of week elements when is selected
      },
      bottom: {
        //Tartget elements displaying the day number or time
        style: { background: "grey", fontSize: 9 }, //the style tp be applied
        selectedStyle: { backgroundColor: "#b13525", fontWeight: "bold" }, //the style tp be applied  when selected
      },
    },
    taskList: {
      //the right side task list
      title: {
        //The title od the task list
        label: "CAPÍTULOS Y PARTIDAS", //The caption to display as title
        style: {
          backgroundColor: "#333333",
          borderBottom: "solid 1px silver",
          color: "white",
          textAlign: "center",
        }, //The style to be applied to the title
      },
      task: {
        // The items inside the list diplaying the task
        style: {
          backgroundColor: "#FFFFFF",
          pointerEvents: "none",
        }, // the style to be applied
      },
      verticalSeparator: {
        //the vertical seperator use to resize he width of the task list
        style: { backgroundColor: "#333333" }, //the style
        grip: {
          //the four square grip inside the vertical separator
          style: { backgroundColor: "#cfcfcd" }, //the style to be applied
        },
      },
    },
    dataViewPort: {
      //The are where we display the task
      rows: {
        //the row constainting a task
        style: {
          backgroundColor: "#fbf9f9",
          borderBottom: "solid 0.5px #cfcfcd",
        },
      },
      task: {
        //the task itself
        showLabel: false, //If the task display the a lable
        style: {
          position: "absolute",
          borderRadius: 14,
          color: "white",
          textAlign: "center",
          backgroundColor: "grey",
        },
        selectedStyle: {
          border: "red solid",
        }, //the style tp be applied  when selected
      },
    },
    links: {
      //The link between two task
      color: "black",
      selectedColor: "#ff00fa",
    },
  };
  let config1 = {
    header: {
      //Targert the time header containing the information month/day of the week, day and time.
      top: {
        //Tartget the month elements
        style: { backgroundColor: "#333333" }, //The style applied to the month elements
      },
      middle: {
        //Tartget elements displaying the day of week info
        style: { backgroundColor: "chocolate" }, //The style applied to the day of week elements
        selectedStyle: { backgroundColor: "#b13525" }, //The style applied to the day of week elements when is selected
      },
      bottom: {
        //Tartget elements displaying the day number or time
        style: { background: "grey", fontSize: 9 }, //the style tp be applied
        selectedStyle: { backgroundColor: "#b13525", fontWeight: "bold" }, //the style tp be applied  when selected
      },
    },
    taskList: {
      //the right side task list
      title: {
        //The title od the task list
        label: "CAPÍTULOS Y PARTIDAS", //The caption to display as title
        style: {
          backgroundColor: "#333333",
          borderBottom: "solid 1px silver",
          color: "white",
          textAlign: "center",
        }, //The style to be applied to the title
      },
      task: {
        // The items inside the list diplaying the task
        style: {
          backgroundColor: "#FFFFFF",
          pointerEvents: "none",
        }, // the style to be applied
      },
      verticalSeparator: {
        //the vertical seperator use to resize he width of the task list
        style: { backgroundColor: "#333333" }, //the style
        grip: {
          //the four square grip inside the vertical separator
          style: { backgroundColor: "#cfcfcd" }, //the style to be applied
        },
      },
    },
    dataViewPort: {
      //The are where we display the task
      rows: {
        //the row constainting a task
        style: {
          backgroundColor: "#fbf9f9",
          borderBottom: "solid 0.5px #cfcfcd",
        },
      },
      task: {
        //the task itself
        showLabel: true, //If the task display the a lable
        style: {
          position: "absolute",
          borderRadius: 14,
          color: "white",
          textAlign: "center",
          backgroundColor: "grey",
        },
        selectedStyle: {
          border: "red solid",
        }, //the style tp be applied  when selected
      },
    },
    links: {
      //The link between two task
      color: "black",
      selectedColor: "#78281F",
    },
  };
  const onSelectItem = (item) => {
    //this.setState({ selectedItem: item });
    setSelectedTarea(item);
  };
  const doCargar = () => {
    setCargar(!cargar);
  };
  /*
  var html = ReactDOMServer.renderToString(JSX);
  var html2jsx = (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    ></div>
  );
  class HtmlComponent extends React.Component {
    render() {
      const jsx = html;
      return <div>{ReactHtmlParser(jsx)}</div>;
    }
  }
  var jsx = <div>{ReactHtmlParser(html)}</div>;
 const cambiaSI = () => {
    console.log("PONER");
  };
  const cambiaNO = () => {
    console.log("QUITAR");
  };
  */
  if (tareas.length > 0) {
    return (
      <div className={"section-body--body"}>
        <div
          style={{
            marginLeft: 0,
            textAlign: "left",
            backgroundColor: "antiquewhite",
            paddingLeft: 15,
            borderRadius: 1,
            borderWidth: 41,
            paddingBottom: 7,
            paddingTop: 7,
            borderColor: "gainsboro",
            width: 340,
          }}
        >
          <p style={{ marginRight: 30, fontWeight: "bold" }}>
            ¿Quieres ver los títulos en las barras de la línea temporal?
          </p>
          <button
            style={{
              width: 90,
              height: 26,
              borderRadius: 20,
              backgroundColor: "gainsboro",
              boxShadow: "none",
              borderWidth: 1,
            }}
            onClick={() => setOpenTable(1)}
          >
            {""}
            <p style={{ fontSize: 10, color: "#000000", fontWeight: "normal" }}>
              MOSTRAR
            </p>{" "}
          </button>{" "}
          <button
            style={{
              marginLeft: 2,
              width: 90,
              height: 26,
              borderRadius: 20,
              backgroundColor: "gainsboro",
              boxShadow: "none",
              borderWidth: 1,
            }}
            onClick={() => setOpenTable(0)}
          >
            {""}
            <p style={{ fontSize: 10, color: "#000000", fontWeight: "normal" }}>
              OCULTAR
            </p>{" "}
          </button>{" "}
        </div>
        <br></br>
        {/*{hasPermission("RT") && <button disabled={!selectedTarea} onClick={selectedTarea ? handleReportarTarea : null} className="btn">Reportar tarea</button>}
            {hasPermission("AT") && <button disabled={!selectedTarea} onClick={selectedTarea ? handleAsignarTarea(selectedTarea._id) : null} className="btn">Asignar tarea</button>}
            {hasPermission("ET") && <button disabled={!selectedTarea} onClick={handleEditarTarea} type="button" className="btn btn-default">Editar tarea</button>}
        */}
        {openTable === 1 && (
          <TimeLine
            //onUpdateTask={onUpdateTask}
            //onCreateLink={onCreateLink}
            //onSelectItem={onSelectItem}
            //selectedItem={selectedTarea}
            nonEditableName={true}
            config={config1}
            data={tareas}
            links={links}
          />
        )}
        {openTable === 0 && (
          <TimeLine
            //onUpdateTask={onUpdateTask}
            //onCreateLink={onCreateLink}
            //onSelectItem={onSelectItem}
            //selectedItem={selectedTarea}
            nonEditableName={true}
            config={config0}
            data={tareas}
            links={links}
          />
        )}
        {/*<ModalFormTareas tarea={selectedTarea} doCargar={doCargar} options={{ proyecto: proyecto._id }} modalOpen={modalOpenFormTareas} setModalOpen={setModalOpenFormTareas} />*/}
        <ModalReportar
          tarea={selectedTarea}
          doCargar={doCargar}
          modalOpen={modalOpenReportarTarea}
          setModalOpen={setModalOpenReportarTarea}
        />
      </div>
    );
  }
  if (tareasArray == null) {
    return <div> PASE POR LA VISTA TOTAL DEL PROYECTO </div>;
  }
  return <div />;
}
