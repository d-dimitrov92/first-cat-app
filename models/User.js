const { Schema, model } = require('mongoose');


const schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    userImg: { type: String, default: '' },
    givenCats: [{ type: Schema.Types.ObjectId, ref: 'Cat' }]
});

module.exports = model('User', schema);