const functions = require('firebase-functions');
const config = functions.config().triple_t;
const credential = functions.config().credential;

const isDev = process.env.FUNCTIONS_EMULATOR;
let app;
let db;

if (isDev) {
    // Setup the emulator
    const firebase = require('@firebase/testing');
    app = firebase.initializeAdminApp({
        projectId: config.projectId,
    });
    db = app.firestore();
} else {
    const admin = require('firebase-admin');
    app = admin.initializeApp({
        ...config,

        credential: admin.credential.cert(credential),
    });
    db = admin.firestore(app);
}

exports.firebase_app = app;
exports.db = db;
