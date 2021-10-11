const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Address = mongoose.model("Address");

const PersonSchema = new mongoose.Schema({
  document: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

PersonSchema.plugin(mongoosePaginate);

mongoose.model("Person", PersonSchema);
