const mongoose = require("mongoose");

const postschema = new mongoose.Schema({
  post: {
    type: String,
    required: true,
  },
  postedBy: {
    type: String,
    default: "Guest",
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: String,
    default: new Date(Date.now()).toLocaleDateString(),
  },
});

module.exports = mongoose.model("Post", postschema);
