const router = require('express').Router();
const { isUser } = require("../middlewares/guards")


router.get('/create', isUser(), async (req, res) => {

    res.render('cat/create');
});

router.post('/create', isUser(), async (req, res) => {
    try {
        const catData = {
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            author: req.user._id
        }

        const cat = await req.storage.createCat(catData);
        res.redirect('/');
    } catch (err) {
        let errors;
        if (err.errors) {
            errors = Object.values(err.errors).map(e => e.properties.message);
        } else {
            errors = [err.message];
        }

        const ctx = {
            errors,
            catData: {
                name: req.body.name,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
            }
        }

        res.render('cat/create', ctx);
    }
});

router.get('/details/:id', async (req, res) => {
    try {
        const cat = await req.storage.getCatById(req.params.id);

        cat.hasUser = Boolean(req.user);
        cat.isAuthor = req.user && req.user._id == cat.author;
        res.render('cat/details', { cat });
    } catch (err) {
        console.log(err.message);
        res.render('404');
    }

});

router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        const cat = await req.storage.getCatById(req.params.id);

        if (req.user._id != cat.author) {
            throw new Error('You cannot edit cat information.')
        }
        console.log(req.body);
        await req.storage.editCat(req.params.id, req.body);

        res.redirect('/');

    } catch (err) {
        let errors;

        if (err.errors) {
            errors = Object.values(err.errors).map(e => e.properties.message);
        } else {
            errors = [err.message];
        }

        const ctx = {
            errors,
            catData: {
                _id: req.params.id,
                name: req.body.name,
                description: req.body.description,
                imageUrl: req.body.imageUrl
            }
        }

        res.render('cat/edit', ctx);
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const catData = await req.storage.getCatById(req.params.id);

        if (req.user._id != catData.author) {
            throw new Error('You cannot edit cat information.')
        }

        res.render('cat/edit', { catData });

    } catch (err) {
        console.log(err.message);
        res.redirect('/cat/details/' + req.params.id);
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    try {
        const cat = await req.storage.getCatById(req.params.id);

        if (cat.author != req.user._id) {
            throw new Error('Cannot delete cat information.');
        }

        await req.storage.deleteCat(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        res.redirect('/cat/details/' + req.params.id);
    }
});


module.exports = router;

