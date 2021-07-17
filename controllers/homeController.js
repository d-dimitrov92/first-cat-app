const router = require('express').Router();

router.get('/', async (req, res) => {
    const cats = await req.storage.getAllCats(req.query);
    
    res.render('home', { cats });
});

router.get('/about', async (req, res) => {

    res.render('about');
});



module.exports = router;