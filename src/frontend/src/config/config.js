export const mode = "dev"; //dev || prod
export const API_URL =
  mode === "dev"
    ? "http://localhost:5000/api"
    : "http://82.223.111.239:5000/api";
export const URL =
  mode === "dev" ? "http://localhost:3000/" : "http://82.223.111.239:3000/";
export const BACK_URL =
  mode === "dev" ? "http://localhost:5000" : "http://82.223.111.239:5000";
//export const SECRET_KEY = '7dviKcN8A09nRf2COJ101C071n15WPL1clxILWbnYyY82ofRG7L1cG5FGb4XJgnMSsg5CbpwE6WiKJAsWSvIkBstxIHHBaRXpasFCflo4r6wrgsvD71h5efxXlDFcZfpQE3$'
