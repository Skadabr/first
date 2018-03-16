import express = require("express");
import p = require("path");

const { NODE_ENV = "development" } = process.env;

export default function init({ router, morgan, passport }) {
  const app = express();

  if (NODE_ENV === "development") app.use(morgan);
  app.use(express.static("/app/client/public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(passport.initialize());

  app.use(router);

  return app;
}
