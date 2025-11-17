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

// Admin UI elements
const adminPanel = document.getElementById("adminPanel");
const createBlogBtn = document.getElementById("openCreateBlogModalBtn");

/* ---------------------------
   Modal Control
---------------------------- */

function openAuthModal(mode = "signin") {
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

// Buttons that open modal
document.querySelectorAll('a[href="#auth"]').forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openAuthModal("signin");
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
    navAuthItems.forEach(el => {
      el.style.display = el.dataset.auth === "signed-in" ? "block" : "none";
    });

    navUserEmail.textContent = "Welcome, " + user.email;

    if (isAdmin(user)) {
      adminPanel.style.display = "block";
      createBlogBtn.style.display = "inline-flex"; // show "Create New Blog"
    } else {
      adminPanel.style.display = "none";
      createBlogBtn.style.display = "none";
    }

  } else {
    // Show logged-out UI
    navAuthItems.forEach(el => {
      el.style.display = el.dataset.auth === "signed-out" ? "block" : "none";
    });
    adminPanel.style.display = "none";
    createBlogBtn.style.display = "none";
  }
});

/* ---------------------------
   Sign Out
---------------------------- */

signOutBtn?.addEventListener("click", async () => {
  await signOut(auth);
});
