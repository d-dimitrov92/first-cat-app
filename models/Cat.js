const { Schema, model } = require('mongoose');


const schema = new Schema({
  name: { type: String, required: [true, 'Please enter name of the cat'] },
  description: { type: String, required: [true, 'Write description'], minLength: [10, 'Description must be minimum 10 chars!'] },
  imageUrl: { type: String, required: [true, 'Add image please'], match: [/^https?/, 'Image must be a valid URL'] },
  createdAt: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = model('Cat', schema);