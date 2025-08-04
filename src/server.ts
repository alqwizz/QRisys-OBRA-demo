import express from "express";
import config from "./config";
import Logger from "./loaders/logger";
import listEndpoints from "express-list-endpoints";
import path from "path";

async function startServer() {
  var fs = require("fs");
  var https = require("https");
  const app = express();

  if (config.mode === "prod") {
    Logger.info(`
              Server in production mode
            `);
    // Serve the static files from the React app
    app.use(express.static(path.join(__dirname, "/frontend/build")));
  }
  await require("./loaders").default({ expressApp: app });
  /*const arr = listEndpoints(app);
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i])
        //Logger.info(arr[i])
    }*/
  if (config.mode === "prod") {
    // Handles any requests that don't match the ones above
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
    });
    var privateKey = fs.readFileSync(
      "/root/Qrisys/Files/www.qrisysobra.com_private_key.key",
      "utf8"
    );
    var certificate = fs.readFileSync(
      "/root/Qrisys/Files/www.qrisysobra.com_ssl_certificate.cer",
      "utf8"
    );
    var credentials = { key: privateKey, cert: certificate };

    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(80, (err) => {
      if (err) {
        Logger.error(err);
        //process.exit(1);
        //return;
      }
      Logger.info(`
                ################################################
                🛡️  HTTPS listening on port: ${80} 🛡️ 
                ################################################
              `);
    });
  } else {
    app.listen(config.port, (err) => {
      if (err) {
        Logger.error(err);
        //process.exit(1);
        //return;
      }
      Logger.info(`
                ################################################
                🛡️  HTTP listening on port: ${config.port} 🛡️ 
                ################################################
              `);
    });
  }
}

startServer();
