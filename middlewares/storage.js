const catService = require("../services/cat");

module.exports = () => (req, res, next) => {
    req.storage = {
        ...catService
    };

    next();
}