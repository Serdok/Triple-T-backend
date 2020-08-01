const express = require('express');
const router = express.Router();
const moment = require('moment');


// JSON validation
const { validator } = require('@exodus/schemasafe');
const schema = require('../schemas/game.json');
const validate = validator(schema, { includeErrors: true, });


// Database interactions
const { db } = require('../service/firebase');
const firestore = require('../service/firebaseDatabase');


// Error handler
const errorHandler = (err, res) => {
    console.error(err);
    res.status(500).json({
        code: 500,
        name: 'InternalError',
        description: 'An internal error occurred',
    });
}


// Create a new game
router.post('/', async (req, res) => {
    try {
        const game = {
            tiles: Array(9).fill(null),
            xIsNext: true,
            createTime: moment().format(),
            updateTime: moment().format(),
        };

        // Add game to the database
        const snapshot = await firestore.create(db.collection('games'), game);
        const createdGame = {
            id: snapshot.id,
            ...snapshot.data(),
        }

        // Validate created game
        if (!validate(createdGame)) {
            console.error(validate.errors);
            res.status(500).json({
                code: 500,
                error: 'ValidationError',
                description: validate.errors,
            });
            return;
        }

        // Send created game to the caller
        res.status(201).json(createdGame);
    } catch (err) {
        errorHandler(err, res);
    }
});

// Get a game from its ID
router.get('/:id', async (req, res) => {
    try {
        const snapshot = await firestore.get(db.collection('games'), req.params.id);
        if (!snapshot) {
            // Document not found
            const err = `Game ID '${req.params.id}' not found`;
            console.error(err);
            res.status(404).json({
                code: 404,
                name: 'NotFound',
                description: err,
            });
            return;
        }

        // Validate game
        const game = {
            id: snapshot.id,
            ...snapshot.data(),
        };
        if (!validate(game)) {
            console.error(validate.errors);
            res.status(500).json({
                code: 500,
                error: 'ValidationError',
                description: validate.errors,
            });
            return;
        }

        // Send found game to the caller
        res.status(200).json(game);
    } catch (err) {
        // Could not find game
        errorHandler(err, res);
    }
});

// Update a game
router.patch('/:id', async (req, res) => {
    try {
        // Only care about 'tiles' and 'xIsNext' properties
        const update = {
            ...(req.body.tiles && {tiles: req.body.tiles}),
            ...(req.body.xIsNext && {xIsNext: req.body.xIsNext}),
        }

        // Update the game
        const snapshot = await firestore.update(db.collection('games'), req.params.id, update);
        if (!snapshot) {
            // Document not found
            const err = `Game ID '${req.params.id}' not found`;
            console.error(err);
            res.status(404).json({
                code: 404,
                name: 'NotFound',
                description: err,
            });
            return;
        }

        // Send updated game to the caller
        res.status(200).json({
            id: snapshot.id,
            ...snapshot.data(),
        });
    } catch (err) {
        errorHandler(err, res);
    }
});

// Delete a game
router.delete('/:id', async (req, res) => {
    try {
        await firestore.delete(db.collection('games'));
        res.status(200);
    } catch (err) {
        errorHandler(err);
    }
});

module.exports = router;
