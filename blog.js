
// blog.js

import { db, auth, isAdmin } from "./firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
console.log("blog.js auth =", auth);
console.log("blog.js db =", db);

// Elements
const createBlogBtn = document.getElementById("openCreateBlogModalBtn");
const createBlogModal = document.getElementById("createBlogModal");
const createBlogForm = document.getElementById("createBlogForm");
const adminBlogList = document.getElementById("adminBlogList");
const blogCards = document.getElementById("blogCards");


// Modal
function openCreateBlogModal() {
  createBlogModal.classList.add("is-active");
}

function closeCreateBlogModal() {
  createBlogModal.classList.remove("is-active");
}

createBlogModal.querySelector(".modal-background").addEventListener("click", closeCreateBlogModal);
createBlogModal.querySelector(".delete").addEventListener("click", closeCreateBlogModal);

createBlogBtn?.addEventListener("click", openCreateBlogModal);

/* --------------------------------------
   LOAD BLOGS (PUBLIC VIEW)
-------------------------------------- */

async function loadBlogs() {
  blogCards.innerHTML = "";

  const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const blog = docSnap.data();
    
    const col = document.createElement("div");
    col.className = "column is-one-third";

    col.innerHTML = `
      <div class="card blog-card">
        <div class="card-content">
          <h3 class="title is-5">${blog.title}</h3>
          <p class="content">${blog.content.substring(0, 120)}...</p>
          <p class="is-size-7 has-text-grey">Published: ${new Date(blog.createdAt.toMillis()).toLocaleString()}</p>
        </div>
      </div>
    `;

    blogCards.appendChild(col);
  });
}

/* --------------------------------------
   LOAD BLOGS IN ADMIN PANEL
-------------------------------------- */

async function loadAdminBlogs() {
  adminBlogList.innerHTML = "";

  const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const blog = docSnap.data();

    const item = document.createElement("div");
    item.className = "box";

    item.innerHTML = `
      <p><strong>${blog.title}</strong></p>
      <p>${blog.content.substring(0, 120)}...</p>
      <button class="button is-small is-info mt-2" data-edit="${docSnap.id}">Edit</button>
      <button class="button is-small is-danger mt-2" data-delete="${docSnap.id}">Delete</button>
    `;

    adminBlogList.appendChild(item);
  });

  // DELETE
  adminBlogList.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.delete;
      await deleteDoc(doc(db, "blogs", id));
      loadBlogs();
      loadAdminBlogs();
    });
  });

  // EDIT
  adminBlogList.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.edit;
      openCreateBlogModal();
      createBlogForm.dataset.editId = id;

      const docSnap = snapshot.docs.find(d => d.id === id);
      const blog = docSnap.data();

      document.getElementById("blogTitle").value = blog.title;
      document.getElementById("blogContent").value = blog.content;
    });
  });
}

/* --------------------------------------
   CREATE OR UPDATE BLOG
-------------------------------------- */
console.log("CALLING addDoc...");

createBlogForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("blogTitle").value.trim();
  const content = document.getElementById("blogContent").value.trim();
  const editId = createBlogForm.dataset.editId;

  try {
    if (editId) {
      await updateDoc(doc(db, "blogs", editId), {
        title,
        content,
        updatedAt: Timestamp.now(),
      });
      delete createBlogForm.dataset.editId;
    } else {
      await addDoc(collection(db, "blogs"), {
        title,
        content,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
    console.log("ABOUT TO WRITE BLOG:", { title, content });


    createBlogForm.reset();
    closeCreateBlogModal();
    loadBlogs();
    loadAdminBlogs();

  } catch (err) {
    console.error("Blog error:", err);
    alert("Failed to publish blog: " + err.message);
  }
});
console.log("addDoc SUCCESS");


/* --------------------------------------
   INITIAL LOAD
-------------------------------------- */

loadBlogs();
loadAdminBlogs();
