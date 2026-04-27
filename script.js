import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  addDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";


// 🔥 TU CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBApS4FohPv4HNBwiBzygaI5cQNNzewTiw",
  authDomain: "intapro-f0509.firebaseapp.com",
  projectId: "intapro-f0509",
  storageBucket: "intapro-f0509.firebasestorage.app",
  messagingSenderId: "409769664393",
  appId: "1:409769664393:web:0cb5a547c531826d6d4b58"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


// ELEMENTOS
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBox = document.getElementById("loginBox");
const appBox = document.getElementById("appBox");
const feed = document.getElementById("feed");
const fileInput = document.getElementById("file");


// REGISTER
window.register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value);
};

// LOGIN
window.login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value);
};

// LOGOUT
window.logout = () => {
  signOut(auth);
};

// SUBIR FOTO
window.upload = async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Elegí una foto");

  const fileRef = ref(storage, "posts/" + Date.now());
  await uploadBytes(fileRef, file);

  const url = await getDownloadURL(fileRef);

  await addDoc(collection(db, "posts"), {
    image: url
  });

  loadFeed();
};

// CARGAR FEED
async function loadFeed() {
  feed.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "posts"));

  querySnapshot.forEach(doc => {
    const data = doc.data();

    feed.innerHTML += `
      <div class="post">
        <img src="${data.image}">
      </div>
    `;
  });
}

// DETECTAR LOGIN
onAuthStateChanged(auth, user => {
  if (user) {
    loginBox.style.display = "none";
    appBox.style.display = "block";
    loadFeed();
  } else {
    loginBox.style.display = "block";
    appBox.style.display = "none";
  }
});