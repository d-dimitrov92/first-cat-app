const router = require('express').Router();
const { isUser } = require('../middlewares/guards');

router.get('/', async (req, res) => {
  const cats = await req.storage.getAllCats(req.query);

  const ctx = {
    search: req.query.search,
    page: req.query.page,
    limit: req.query.limit,
    cats,
  };

  res.render('home', ctx);
});

router.get('/about', async (req, res) => {
  res.render('about');
});

router.get('/profile', isUser(), async (req, res) => {
  const userData = await req.storage.getUserByUsername(req.user.username);

  res.render('auth/profile', { userData });
});

module.exports = router;
