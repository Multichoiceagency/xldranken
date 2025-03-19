// This is a simple service worker that redirects to OneSignalSDKWorker.js
self.addEventListener("install", (event) => {
    self.skipWaiting()
  })
  
  self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim())
  })
  
  // Log when the service worker is active
  self.addEventListener("activate", (event) => {
    console.log("Service worker activated")
  })
  
  