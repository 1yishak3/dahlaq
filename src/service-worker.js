/**
 * Check out https://googlechrome.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */


'use strict';
importScripts('./build/sw-toolbox.js');
// importScripts('./firebase-app.js')
// importScripts('./firebase-messaging.js')
// //
// // firebase.initializeApp({
// firebase.initializeApp({
//   // get this from Firebase console, Cloud messaging section
//   apiKey: "AIzaSyCYT5qaezgIxItyCT_idaM0rXNnKA9eBMY",
//   authDomain: "dahlaq-c7e0f.firebaseapp.com",
//   databaseURL: "https://dahlaq-c7e0f.firebaseio.com",
//   projectId: "dahlaq-c7e0f",
//   storageBucket: "dahlaq-c7e0f.appspot.com",
//   messagingSenderId: "500593695235"
// });
//
// const messaging = firebase.messaging();
//
// messaging.setBackgroundMessageHandler(function(payload) {
//   console.log('Received background message ', payload);
//   // here you can override some options describing what's in the message;
//   // however, the actual content will come from the Webtask
//   const notificationOptions = {
//     icon: '/assets/icon/dahlaq.png'
//   };
//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });

self.toolbox.options.cache = {
  name: 'ionic-cache'
};

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/main.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json'
  ]
);

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.cacheFirst);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;
