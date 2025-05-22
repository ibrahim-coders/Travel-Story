// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const travelStorySchema = new Schema({
//   title: { type: String, required: true },
//   story: { type: String, required: true },
//   visitedLocation: { type: [String], default: [] },
//   isFavourite: { type: Boolean, default: false },
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   createdOn: { type: Date, default: Date.now },
//   imageUrl: { type: String, require: true },
//   visitDate: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('TravelStory', travelStorySchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const travelStorySchema = new Schema({
  title: { type: String, required: true },
  story: { type: String, required: true },
  visitedLocation: { type: String, required: true },
  isFavourite: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdOn: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  visitDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TravelStory', travelStorySchema);

