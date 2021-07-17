  const { Schema, model } = require('mongoose');


const schema = new Schema({
    name: { type: String, required: [true, 'Please enter Title'] },
    description: { type: String, required: [true, 'Write description'], maxLength: [50, 'Description must be max 50 chars!'] },
    imageUrl: { type: String, required: [true, 'Add image please'] },
    author: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = model('Cat', schema);