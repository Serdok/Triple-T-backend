const functions = require('firebase-functions');
const config = {
    apiKey: "AIzaSyA4-iPqaaVNzsyP_S7RzOvtHMtTVdCrNnw",
    authDomain: "triple-t-e2e24.firebaseapp.com",
    databaseURL: "https://triple-t-e2e24.firebaseio.com",
    projectId: "triple-t-e2e24",
    storageBucket: "triple-t-e2e24.appspot.com",
    messagingSenderId: "133026401644",
    appId: "1:133026401644:web:fb19e1cb86f73aaeb97749",
    measurementId: "G-TN3STENB4J"
};

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
