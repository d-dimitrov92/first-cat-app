const User = require('../models/User');

async function createUser(username, email, hashedPassword, userImg) {
    const user = new User({
        username,
        email,
        hashedPassword,
        userImg,
        givenCats: []
    });

    await user.save();

    return user;
}

async function getUserByUsername(username) {
    const pattern = new RegExp(`^${username}$`, 'i');
    const user = await User.findOne({ username: { $regex: pattern } }).populate('givenCats').lean();

    return user;
}

async function getUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`, 'i');
    const user = await User.findOne({ email: { $regex: pattern } });

    return user;
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserByEmail
}