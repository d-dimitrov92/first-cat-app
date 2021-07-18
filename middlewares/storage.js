const catService = require("../services/cat");
const userService = require("../services/user");

module.exports = () => (req, res, next) => {
    req.storage = {
        ...catService,
        ...userService
    };

    next();
}