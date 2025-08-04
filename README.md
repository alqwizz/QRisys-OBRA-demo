# [Qrisys2:](https://github.com/JSnow11/Qrisys2/projects/1)

## Deploy
### Carga de Roles, Users y Permisos
* `ts-node seeds/index.ts`

### Local
* Dependencias:

  Instalar node 12.6
```
  cd <PROJECT_DIR>/src/
  npm install

  cd <PROJECT_DIR>/src/frontend/src
  npm install
```

* Iniciar frontend:
  `cd <PROJECT_DIR>/src/frontend/src`
  `npm run start`

* Iniciar backend:
  `cd <PROJECT_DIR>/src/`
  `ts-node server.ts`

### Server
* Conectar mediante `ssh` al server: `ssh root@5b158f7.online-server.cloud`
* Descargar o subir el proyecto, preferiblemente usando **git**
* Configurar .env y config.js con la ip del server
* Desplegar backend y frontend con `ts-node server.ts` y `npm run start` 


-----------------------------------------INI-server.ts-------------------------------------

import express from "express";
import config from "./config";
import Logger from "./loaders/logger";
import path from "path";

async function startServer() {
  var fs = require("fs");
  var http = require("http");
  var https = require("https");
  const app = express();

  // OPCIONES GENERALES DE INFRAESTRUCTURA
  var CONEXION_SSL=0;           // [bin]  Indica si el servidor es seguro (https SSL)
  var PUERTO_CONFIG=5000;       // [int]  Puerto de escucha Backend
  var URL_INDEX="/";            // [str]  Direccion url a la carpeta donde esta el index.html (post npm run build)
  var BACK_FOLDER_ACTIVO=0;     // [bin]  Indica simplemente si URL_INDEX esta en la carpeta anterior al Backend

  // ARMA EL NODE
  await require("./loaders").default({ expressApp: app });

  // MODO PRODUCCION
  if (config.mode === "prod") {
    // LOG DE CONEXION
    Logger.info(' ');
    Logger.info(` 
                  ----------------------------
                     SERVIDOR EN PRODUCCION
                  ---------------------------- 
                  `);
    Logger.info(' ');
    Logger.info(' - Escuchando en el puerto             => '+PUERTO_CONFIG.toString());
    if (BACK_FOLDER_ACTIVO==0) {
      Logger.info(' - Back_folder                         => DESACTIVADO');
      Logger.info(' - Trabajamos en la URL (Ubuntu local) => '+__dirname.toString());
      Logger.info(' - URL del FrontEnd (index.html)       => '+__dirname+URL_INDEX);
    } else {
      Logger.info(' - Back_folder                         => ACTIVADO');
      Logger.info(' - Trabajamos en la URL (Ubuntu local) => '+__dirname.toString());
      Logger.info(' - URL del FrontEnd (index.html)       => '+'/var/www/html');
    }
    Logger.info(' ');

    // SERVIR LOS ARCHIVOS /static DE REACT
    if (BACK_FOLDER_ACTIVO==0){
      app.use(express.static(path.join(__dirname , URL_INDEX)));
    } else {
      app.use(express.static(path.join('/var/www/html')));
    }
  
    // SERVIR EL LADO DEL CLIENTE
    if (BACK_FOLDER_ACTIVO==0){
      app.get("*", (req, res) => { res.sendFile(path.join(__dirname + URL_INDEX + "index.html")); });
    } else {
      app.get("*", (req, res) => { res.sendFile(path.join("/var/www/html/index.html")); });
    }

    // ARRANCA EL SERVIDOR SIN SSL (http)
    if (CONEXION_SSL==0) {
      var httpServer = http.createServer(app);
      httpServer.listen(PUERTO_CONFIG);
    }

    // ARRANCA EL SERVIDOR CON SSL (https)
    if (CONEXION_SSL==1) {
      var privateKey = fs.readFileSync( "/root/Qrisys/Files/www.qrisysobra.com_private_key.key", "utf8" );
      var certificate = fs.readFileSync( "/root/Qrisys/Files/www.qrisysobra.com_ssl_certificate.cer", "utf8" );
      var credentials = { key: privateKey, cert: certificate };
      var httpsServer = https.createServer(credentials, app);
      httpsServer.listen(PUERTO_CONFIG, (err) => {
        if (err) { Logger.error(err); }
        else {
          Logger.info(`
                    ################################################
                    🛡️  HTTPS listening on port: ${PUERTO_CONFIG} 🛡️ 
                    ################################################
                  `);
        }
      });
    }
  } else { // MODO DEVELOPMENT
    app.listen(config.port, (err) => {
      if (err) { Logger.error(err); }
      else {
        Logger.info(`
                  ################################################
                  🛡️  HTTP listening on port: ${config.port} 🛡️ 
                  ################################################
                `);
      }
    });
  }
}
startServer();

-----------------------------------------END-server.ts-------------------------------------