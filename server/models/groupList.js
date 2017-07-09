var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var roomsSchema = new Schema({
  groupname: {
    type: String,
    default: "",
    trim: true
  },
  avatarletter: {
    type: String,
    default: "",
    trim: true
  },
  conversation: [
    {
      from: String,
      message: String
    }
  ],
  participants: [{}]
});

// groupListSchema.index({ "user_id": 1, "other_id": 1 }, { "unique": true });

module.exports = mongoose.model("rooms", roomsSchema);
