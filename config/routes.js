const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const catController = require('../controllers/catController');

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/cat', catController);
    
    app.use((req, res) => {
        res.status(404).render('404');
    });
}