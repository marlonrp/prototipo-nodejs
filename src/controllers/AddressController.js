const mongoose = require("mongoose");
const redis = require("promise-redis")();
const client = redis.createClient();

const Address = mongoose.model("Address");

module.exports = {
  async getById(id) {
    let address = await client.get(id);
    if (address) {
      return JSON.parse(address);
    }

    address = await Address.findById(id);
    await client.set(`${address._id}`, JSON.stringify(address), "EX", 30);
    return res.json(address);
  },
  async save(address) {
    return await Address.create(address);
  },
  async edit(address) {
    return await Address.findByIdAndUpdate(address._id, address, { new: true });
  },
  async delete(id) {
    return await Address.findByIdAndRemove(id);
  },
};
