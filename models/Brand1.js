const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: { type: String, slug: "name" },
});

exports.Brand1 = mongoose.model("Brand1", brandSchema);
