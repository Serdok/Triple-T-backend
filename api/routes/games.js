const express = require('express');
const router = express.Router();


// Database interactions
const { db } = require('../service/firebase');
const firestore = require('../service/firebaseDatabase');


// Get all games
router.get('/', async (req, res) => {
    try {
        // Get games from a database
        const games = await firestore.getAll(db.collection('games'));

        // Send found games to the caller
        res.status(200).json(games);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            name: 'InternalError',
            description: 'Internal server error',
        });
    }
});

module.exports = router;
