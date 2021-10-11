const express = require("express");
const routes = express.Router();
const queue = require("../rabbitmq");

const PersonController = require("../../controllers/PersonController");

routes.get("/person", PersonController.list);
routes.get("/person/:id", PersonController.getById);
routes.post("/person", PersonController.save);
routes.put("/person/:id", PersonController.edit);
routes.delete("/person/:id", PersonController.delete);

module.exports = routes;
