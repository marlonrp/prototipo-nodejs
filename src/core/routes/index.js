const express = require('express');
const routes = express.Router();
const queue = require('../rabbitmq')

const ProductController = require('../../controllers/ProductController');

routes.get('/products', ProductController.list);
routes.get('/products/:id', ProductController.getById);
routes.post('/products', ProductController.save);
routes.put('/products/:id', ProductController.edit);
routes.delete('/products/:id', ProductController.delete);

module.exports = routes;