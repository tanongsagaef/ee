/* ---------- Shared Firebase init + Google sign-in (cross-device sync) ----------
   Loaded on Trade Journal and Stock/Decide. Auth state is shared across pages on
   this origin since Firebase Auth persists its session in IndexedDB — signing in
   on one page keeps you signed in when navigating to another page here.
   If Firebase fails to load/init (ad-blocker, offline, etc.) the app must keep
   working fully offline/local-only — every call here is defensive about that. */
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDO9u6i3XZInzZMVg5RpgNx8WqPHwZVmxc",
    authDomain: "ee-project-88528.firebaseapp.com",
    projectId: "ee-project-88528",
    storageBucket: "ee-project-88528.firebasestorage.app",
    messagingSenderId: "897961234322",
    appId: "1:897961234322:web:5fb3b67d580a01c9983b4b",
  };

  let auth = null, db = null, provider = null, ready = false;
  try {
    if (typeof firebase === "undefined") throw new Error("Firebase SDK did not load");
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    provider = new firebase.auth.GoogleAuthProvider();
    ready = true;
  } catch (err) {
    console.error("Firebase init failed — cloud sync disabled, app still works locally.", err);
  }

  const listeners = [];
  let currentUser = null;
  let authKnown = false;

  if (ready) {
    auth.onAuthStateChanged(function (user) {
      currentUser = user;
      authKnown = true;
      listeners.forEach(function (cb) { cb(user); });
    });
  }

  window.FirebaseSync = {
    enabled: ready,
    // cb(user) fires on every auth change; fires immediately with the current
    // (possibly still-loading) state too once the SDK has resolved it once
    onAuthChange: function (cb) {
      listeners.push(cb);
      if (authKnown) cb(currentUser);
    },
    signIn: function () {
      if (!ready) return Promise.reject(new Error("ใช้งานระบบซิงค์ไม่ได้ในตอนนี้"));
      return auth.signInWithPopup(provider);
    },
    signOut: function () {
      if (!ready) return Promise.resolve();
      return auth.signOut();
    },
    getUser: function () { return currentUser; },
    getDb: function () { return db; },
  };
})();
