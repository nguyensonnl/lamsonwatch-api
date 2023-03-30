const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: { type: String, slug: "name" },
});

exports.Category1 = mongoose.model("Category1", categorySchema);
