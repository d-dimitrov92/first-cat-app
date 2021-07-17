const router = require('express').Router();

router.get('/', async (req, res) => {
    const cats = await req.storage.getAllCats(req.query);

    const ctx = {
        search: req.query.search,
        cats
    }
    
    res.render('home', ctx);
});

router.get('/about', async (req, res) => {

    res.render('about');
});



module.exports = router;