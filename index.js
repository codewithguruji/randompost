const apiUrl = "some valid url";

const editBtn = document.getElementById("editBtn");
const inputBox = document.getElementById("inputBox");
const postBtn = document.getElementById("postBtn");
const postContainer = document.getElementById("postContainer");

inputBox.addEventListener("keypress", function (e) {
  if (e.keyCode === 13) newPost();
});

postBtn.addEventListener("click", newPost);

function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);

  return element;
}

function createPost({ _id, post }) {
  const postDiv = createElement("div", "post");
  postDiv.setAttribute("id", _id);

  const postText = createElement("h4", "text");
  postText.textContent = post;

  const footerDiv = createElement("div", "footer");

  const editImg = createElement("img");
  editImg.setAttribute("src", "./edit.png");
  editImg.addEventListener("click", handleEdit);

  const deleteImg = createElement("img");
  deleteImg.setAttribute("src", "./delete.png");
  deleteImg.addEventListener("click", handleDelete);

  footerDiv.append(editImg, deleteImg);
  postDiv.append(postText, footerDiv);
  postContainer.append(postDiv);
}

function deletePost(postElement) {
  const postId = postElement.getAttribute("id");

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4)
      xhr.status === 200
        ? postElement.remove()
        : console.log("SOMETHING WENT WRONG!");
  };

  xhr.open("DELETE", `${apiUrl}/${postId}`);
  xhr.send();
}

function fetchPosts() {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status !== 200) return console.log("SOMETHING WENT WRONG!");

      const posts = JSON.parse(xhr.response);
      for (post of posts) {
        createPost(post);
      }
    }
  };

  xhr.open("GET", apiUrl);
  xhr.send();
}

function handleDelete(e) {
  const shouldDelete = confirm("Are you sure you want to delete?");
  if (!shouldDelete) return;

  const parentPost = e.target.parentElement.parentElement;
  deletePost(parentPost);
}

function handleEdit(e) {
  const parentElement = e.target.parentElement;

  const parentPost = parentElement.parentElement;
  const postId = parentPost.getAttribute("id");

  const textElement = parentElement.previousElementSibling;
  const text = textElement.textContent;

  const result = prompt(`Current text: ${text}`, text);

  if (!result || result === text) return;

  const shouldUpdate = validateText(result);
  if (!shouldUpdate) return showAlert();

  updatePost(postId, result, textElement);
}

function newPost() {
  const shouldContinue = validateText(inputBox.value);
  if (!shouldContinue) return showAlert();

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status !== 200) return console.log("SOMETHING WENT WRONG");

      const response = JSON.parse(xhr.response);
      createPost(response);
      inputBox.value = "";
    }
  };

  xhr.open("POST", apiUrl);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ post: inputBox.value }));
}

function showAlert() {
  alert("Minimum 3 characters required...");
}

function validateText(value) {
  return value.replace(/\s+/g, "").length > 2;
}

function updatePost(id, post, textElement) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status !== 200) return console.log("ERROR!");

      textElement.textContent = post;
    }
  };

  xhr.open("PUT", apiUrl);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ id, post }));
}

fetchPosts();
