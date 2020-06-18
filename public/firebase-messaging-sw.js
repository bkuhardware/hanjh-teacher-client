/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCy0-aVl3F5qXjnG6TrxyVc6TW7G58SQBU",
    authDomain: "huyefen-2102.firebaseapp.com",
    databaseURL: "https://huyefen-2102.firebaseio.com",
    projectId: "huyefen-2102",
    storageBucket: "huyefen-2102.appspot.com",
    messagingSenderId: "458551078946",
    appId: "1:458551078946:web:22581feb0d92fbf8a89a7b",
    measurementId: "G-G3HZV8JYLG"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();