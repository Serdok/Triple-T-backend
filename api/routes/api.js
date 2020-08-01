const express = require('express');
const router = express.Router();


// Routes served under /api
const gamesRouter = require('./games');
const gameRouter = require('./game');

// Assign the routes
router.use('/games', gamesRouter);
router.use('/game', gameRouter);


// Index GET request handler
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Triple-T RESTful API',
        description: 'RESTful API used for my Triple-T online game',
    });
});


// Export routes
module.exports = router;
