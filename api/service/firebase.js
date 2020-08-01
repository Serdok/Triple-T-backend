const functions = require('firebase-functions');
const config = functions.config().triple_t;

const isDev = process.env.FUNCTIONS_EMULATOR;
let app;
let db;

if (isDev) {
    // Setup the emulator
    const firebase = require('@firebase/testing');
    app = firebase.initializeTestApp({
        projectId: config.projectId,
    });
    db = app.firestore();
} else {
    const admin = require('firebase-admin');
    app = admin.initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        databaseURL: config.databaseURL,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
        measurementId: config.measurementId,
    });
    db = admin.firestore(app);
}

exports.firebase_app = app;
exports.db = db;
