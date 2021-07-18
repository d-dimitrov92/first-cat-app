const router = require('express').Router();

router.get('/', async (req, res) => {
    const cats = await req.storage.getAllCats(req.query);

    const ctx = {
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit,
        cats
    }
    
    res.render('home', ctx);
});

router.get('/about', async (req, res) => {

    res.render('about');
});

router.get('/profile', async (req, res) => {
    console.log(req.user);
    const userData = req.user;
    res.render('auth/profile', {userData});
});



module.exports = router;