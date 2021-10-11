const mongoose = require("mongoose");
const redis = require("promise-redis")();
const client = redis.createClient();
const QueueClient = require("../core/rabbitmq/queueClient");
const Paginate = require("../models/Paginate");
const AddressController = require("./AddressController");

const Person = mongoose.model("Person");
const Address = mongoose.model("Address");

const waitQueue = async (queue) => {
  try {
    await queue.waitForConnection(1000);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = {
  async list(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const people = await Person.paginate(
      {},
      { page, limit: parseInt(limit) }
    ).then((res) => new Paginate(res));
    return res.json(people);
  },
  async getById(req, res) {
    const result = await client.get(req.params.id);
    if (result) {
      return res.json(JSON.parse(result));
    }

    const person = await Person.findById(req.params.id);
    await client.set(`${person._id}`, JSON.stringify(person), "EX", 60);
    return res.json(person);
  },
  async save(req, res) {
    // const queueName = 'PersonSave'
    // const queue = new QueueClient(queueName)
    // await waitQueue(queue)
    // await queue.produce(req.body)
    // await queue.channel.consume(queueName, async ({content}) => {
    // const person = await Person.create(JSON.parse(content.toString()))
    const address = await AddressController.save(req.body.address);
    await client.set(`${address._id}`, JSON.stringify(address), "EX", 60);
    const person = await Person.create({ ...req.body, address });
    await client.set(`${person._id}`, JSON.stringify(person), "EX", 60);
    return res.json(person);
    // }, { noAck: false })
  },
  async edit(req, res) {
    const person = await Person.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json(person);
  },
  async delete(req, res) {
    const person = await Person.findByIdAndRemove(req.params.id);
    return res.json(person);
  },
};
