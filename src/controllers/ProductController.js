const mongoose = require('mongoose');
const redis = require('promise-redis')();
const client = redis.createClient();
const QueueClient = require('../core/rabbitmq/queueClient')

const Product = mongoose.model('Product');

const waitQueue = async (queue) => {
    try {
            await queue.waitForConnection(1000)
        } catch (err) {
            console.log(err.message)
            process.exit(1)
        }
}

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
        const queueName = 'ProductSave'
        const queue = new QueueClient(queueName)
        await waitQueue(queue)
        await queue.produce(req.body)
        await queue.channel.consume(queueName, async ({content}) => {
            const product = await Product.create(JSON.parse(content.toString()))
            return res.json(product)
        }, { noAck: false })
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