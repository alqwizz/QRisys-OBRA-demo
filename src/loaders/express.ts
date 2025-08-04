import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import connectStore from "connect-mongo";
import passport from "passport";
import routes from "../api";
import config from "../config";
import busboy from "connect-busboy";
export default async ({
  app,
  connection,
}: {
  app: express.Application;
  connection: any;
}) => {
  app.get("/status", (req, res) => {
    return res.json({ hola: "hla" }).status(200);
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  app.use(express.static("../public"));
  const corsConfig = {
    origin: config.CLIENT_URL,
    credentials: true,
  };

  app.use(cors(corsConfig));
  app.disable("x-powered-by");
  app.use(busboy());
  app.use(helmet());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  const MongoStore = connectStore(session);
  app.use(
    session({
      name: config.SESS_NAME,
      secret: config.SESS_SECRET,
      saveUninitialized: true,
      resave: false,
      store: new MongoStore({
        mongooseConnection: connection,
        collection: "session",
        ttl: parseInt(config.SESS_LIFETIME) / 1000,
      }),
      cookie: {
        httpOnly: true,
        sameSite: false,
        secure: false, //PONER A TRUE EN PRODUCCION
        maxAge: parseInt(config.SESS_LIFETIME),
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(config.api.prefix, express.static("api/data"));
  app.use(express.static("../files"));
  // Load API routes
  app.use(config.api.prefix, routes());

  return app;
};
