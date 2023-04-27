// Import the functions you need from the SDKs you need
// TODO create auth 2.0 with Google provider

const { initializeApp, default: firebase } = require("firebase/app");

const { signInWithPopup, GoogleAuthProvider } = require('firebase/auth');

const { getDatabase } = require('firebase-admin/database');

const admin = require('firebase-admin');

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

    apiKey: "AIzaSyDzlFYTU-rt01NSKttY6fXl1w2xMsSeJdk",

    authDomain: "click-jobs-b016d.firebaseapp.com",

    projectId: "click-jobs-b016d",

    storageBucket: "click-jobs-b016d.appspot.com",

    messagingSenderId: "363624944389",

    appId: "1:363624944389:web:066714ddbd329097f45d6c",

    measurementId: "G-S4XNGPD80K"

};


// Initialize Firebase
initializeApp(firebaseConfig);


const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
module.exports = { firebase, provider, admin, signInWithPopup };