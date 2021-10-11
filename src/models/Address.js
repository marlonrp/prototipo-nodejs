const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const AddressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  complement: {
    type: String,
    required: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

AddressSchema.plugin(mongoosePaginate);

mongoose.model("Address", AddressSchema);
