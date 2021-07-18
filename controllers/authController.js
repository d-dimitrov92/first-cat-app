const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewares/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('auth/register');
})

router.post(
    '/register',
    isGuest(),
    body('username')
        .isLength({ min: 3 }).withMessage('Username must be atleast 3 chars long').bail()
        .matches(/[a-zA-Z0-9]/).withMessage('Username must contains only english letters and numbers'),
    body('email', 'Invalid email').isEmail(),
    body('password')
        .isLength({ min: 3 }).withMessage('Password must be at least 3 chars long').bail()
        .matches(/[a-zA-Z0-9]/).withMessage('Password must contains only english letters and numbers'),
    body('rePass').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Passwords dont match');
        }
        return true
    }),
    async (req, res) => {
        const { errors } = validationResult(req);

        try {
            if (errors.length > 0) {
                throw new Error(Object.values(errors).map(e => e.msg).join('\n'));
            }

            await req.auth.register(req.body.username, req.body.email, req.body.password, req.body.userImg);

            res.redirect('/');
        } catch (err) {
            console.log(err);
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    username: req.body.username,
                    email: req.body.email,
                    userImg: req.body.userImg
                }
            }
            res.status(400).render('auth/register', ctx);
        }
    });

router.get('/login', isGuest(), (req, res) => {
    res.render('auth/login');
})

router.post('/login', isGuest(), async (req, res) => {

    try {
        await req.auth.login(req.body.username, req.body.password);

        res.redirect('/');
    } catch (err) {
        console.log(err);
        let errors = err.message;
        if (err.type == 'credential') {
            errors = ['Incorrect username or password'];
        }
        const ctx = {
            errors,
            userData: {
                username: req.body.username
            }
        };
        res.status(400).render('auth/login', ctx)
    }
});

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/');
});

module.exports = router;