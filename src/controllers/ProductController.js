const mongoose = require('mongoose');
const redis = require('promise-redis')();
const client = redis.createClient();

const Product = mongoose.model('Product');

module.exports = {
    async list(req, res) {
        const { page = 1 } = req.query;
        const { limit = 10 } = req.query;
        const products = await Product.paginate({}, { page, limit: parseInt(limit) });
        return res.json(products);
    },
    async getById(req, res) {
        const result = await client.get(req.params.id);
        if (result) {
            return res.json(JSON.parse(result));
        }

        const product = await Product.findById(req.params.id);
        await client.set(req.params.id, JSON.stringify(product), 'EX', 30);
        return res.json(product);
    },
    async save(req, res) {
        const product = await Product.create(req.body);
        return res.json(product);
    },
    async edit(req, res) {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json(product);
    },
    async delete(req, res) {
        const product = await Product.findByIdAndRemove(req.params.id);
        return res.json(product);
    }
}