console.log("auth.JS LOADED");

// auth.js
import {
  auth,
  db,
  isAdmin
} from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const AUTH_CACHE_KEY = "mcm-auth-state";

const setRootAuthClass = (mode) => {
  const root = document.documentElement;
  root.classList.toggle("auth-cached-signed-in", mode === "signed-in");
  root.classList.toggle("auth-cached-signed-out", mode === "signed-out");
};

const persistAuthState = (mode, email = "") => {
  try {
    localStorage.setItem(
      AUTH_CACHE_KEY,
      JSON.stringify({ mode, email: email || "" })
    );
  } catch (err) {
    console.warn("Unable to persist auth state", err);
  }
};

const hydrateAuthState = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(AUTH_CACHE_KEY) || "null");
    const mode = cached?.mode === "signed-in" ? "signed-in" : "signed-out";
    setRootAuthClass(mode);
    const navUserEmail = document.getElementById("navUserEmail");
    if (mode === "signed-in" && cached?.email && navUserEmail) {
      navUserEmail.textContent = "Welcome";
    }
  } catch (err) {
    console.warn("Unable to read cached auth state", err);
    setRootAuthClass("signed-out");
  }
};

hydrateAuthState();

// Modal Elements
const authModal = document.getElementById("authModal");
const modalBackground = authModal.querySelector(".modal-background");
const modalCloseBtn = authModal.querySelector(".delete");
const modalTitle = document.getElementById("modalTitle");

const signInForm = document.getElementById("signInForm");
const signUpForm = document.getElementById("signUpForm");

const switchToSignUp = document.getElementById("switchToSignUp");
const switchToSignIn = document.getElementById("switchToSignIn");

// Navbar
const navAuthItems = document.querySelectorAll("[data-auth]");
const navUserEmail = document.getElementById("navUserEmail");
const signOutBtn = document.getElementById("signOutBtn");

const setAuthVisibility = (mode) => {
  setRootAuthClass(mode);
};

// Admin UI elements
const adminPanel = document.getElementById("adminPanel");
const createBlogBtn = document.getElementById("openCreateBlogModalBtn");

/* ---------------------------
   Modal Control
---------------------------- */

function openAuthModal(mode ) {
  authModal.classList.add("is-active");

  if (mode === "signup") {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
    modalTitle.textContent = "Create Account";
  } else {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
    modalTitle.textContent = "Sign In";
  }
}

function closeAuthModal() {
  authModal.classList.remove("is-active");
}

modalBackground.addEventListener("click", closeAuthModal);
modalCloseBtn.addEventListener("click", closeAuthModal);
document.querySelectorAll('a[href="#auth"]').forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const mode = btn.dataset.mode || "signin";  // default to signin
    openAuthModal(mode);
  });
});


/* ---------------------------
   Switch between Sign In <-> Sign Up
---------------------------- */

switchToSignUp?.addEventListener("click", () => openAuthModal("signup"));
switchToSignIn?.addEventListener("click", () => openAuthModal("signin"));

/* ---------------------------
   Sign In & Sign Up Logic
---------------------------- */

// SIGN IN
signInForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signInEmail").value.trim();
  const password = document.getElementById("signInPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    persistAuthState("signed-in", email);
    setAuthVisibility("signed-in");
    if (navUserEmail) navUserEmail.textContent = "Welcome";
    closeAuthModal();
  } catch (err) {
    alert("Sign In Failed: " + err.message);
  }
});

// SIGN UP
signUpForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signUpEmail").value.trim();
  const password = document.getElementById("signUpPassword").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    persistAuthState("signed-in", email);
    setAuthVisibility("signed-in");
    if (navUserEmail) navUserEmail.textContent = "Welcome";
    closeAuthModal();
  } catch (err) {
    alert("Sign Up Failed: " + err.message);
  }
});

/* ---------------------------
   Auth State Observer
---------------------------- */

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Show signed-in UI
    setAuthVisibility("signed-in");
    persistAuthState("signed-in", user.email);

    if (navUserEmail) {
      navUserEmail.textContent = "Welcome";
    }

    if (adminPanel && createBlogBtn) {
      if (isAdmin(user)) {
        adminPanel.style.display = "block";
        createBlogBtn.style.display = "inline-flex"; // show "Create New Blog"
      } else {
        adminPanel.style.display = "none";
        createBlogBtn.style.display = "none";
      }
    }

  } else {
    // Show logged-out UI
    setAuthVisibility("signed-out");
    persistAuthState("signed-out");
    if (adminPanel) adminPanel.style.display = "none";
    if (createBlogBtn) createBlogBtn.style.display = "none";
  }
});

/* ---------------------------
   Sign Out
---------------------------- */

signOutBtn?.addEventListener("click", async () => {
  persistAuthState("signed-out");
  setAuthVisibility("signed-out");
  await signOut(auth);
});
