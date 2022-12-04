var logoutBlock = document.querySelector(".logout-block");
var addForm = document.querySelector(".add-blog-form");
var sigIn = document.querySelector(".sign-in");

var users = [
  {
    name: "Kenan Novalic",
    email: "kenan.no@gmail.com",
    password: "12345",
    username: "kensi",
    address: "Konjic bb",
  },
];

var loggedUser = {};

var allBlogs = [];

var signupForm = document.getElementById("signup-form");
signupForm.style.display = "none";

function isUserLogged() {
  var userData = localStorage.getItem("loggedUser");
  if (userData) {
    var user = JSON.parse(userData);
    login(user.email, user.password);
    hide(sigIn);
  } else {
    hide(logoutBlock);
    hide(addForm);
    displayBlog();
  }
}

isUserLogged();

function login(p_email, p_password) {
  var email = p_email || document.getElementById("email").value;
  var password = p_password || document.getElementById("password").value;
  var usersData = localStorage.getItem("users");
  if (usersData) {
    users = JSON.parse(usersData);
  }
  for (var user of users) {
    if (
      (email === user.email || email === user.username) &&
      password === user.password
    ) {
      var loginForm = document.querySelector("#login-form");
      loginForm.style.display = "none";
      hide(sigIn);
      var nav = document.querySelector(".wrapper");
      nav.style.display = "block";
      loggedUser = user;
      localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      clearValue("email");
      clearValue("password");
      var name = document.getElementById("user-name");
      name.innerHTML = user.name;
      addForm.style.display = "block";
      logoutBlock.style.display = "flex";
      loggedUser = user;
    } else {
      var errorMsg = document.querySelector(".error-msg");
      errorMsg.style.display = "block";
    }
  }

  displayBlog();
}

function loginOnEnter(e) {
  if (e.keyCode === 13) {
    login();
  }
}

function logout() {
  var loginForm = document.querySelector("#login-form");
  loginForm.style.display = "block";
  var nav = document.querySelector(".wrapper");
  nav.style.display = "none";
  document.querySelector(".error-msg").style.display = "none";
  loggedUser = {};
  localStorage.removeItem("loggedUser");
}

function goToSignupForm() {
  var loginForm = document.querySelector("#login-form");

  loginForm.style.display = "none";
  signupForm.style.display = "block";
}

function goToLoginForm() {
  var loginForm = document.querySelector("#login-form");

  loginForm.style.display = "block";
  signupForm.style.display = "none";
}
function registerNow() {
  var name = getValue("name");
  var email = getValue("su-email");
  var address = getValue("address");
  var username = getValue("username");
  var password = getValue("su-password");
  if (
    name === "" ||
    email === "" ||
    address === "" ||
    username === "" ||
    password === ""
  ) {
    return alert("Unesite sve podatke");
  }

  var user = {
    name,
    email,
    address,
    username,
    password,
  };
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  clearValue("name");
  clearValue("su-email");
  clearValue("address");
  clearValue("username");
  clearValue("su-password");

  goToLoginForm();
}

function getValue(id) {
  return document.getElementById(id).value;
}

function clearValue(id) {
  document.getElementById(id).value = "";
}
function postBlog() {
  var blogTitle = getValue("blog-title");
  var blogDesc = getValue("blog-desc");

  if (blogTitle === "" || blogDesc === "") {
    return alert("popunite sve podatke");
  }

  var blog = {
    blogTitle,
    blogDesc,
    postDate: new Date(),
    author: loggedUser.name,
    comments: [],
    likes: [],
    dislikes: [],
  };

  allBlogs.push(blog);
  localStorage.setItem("blogs", JSON.stringify(allBlogs));
  displayBlog();

  clearValue("blog-title");
  clearValue("blog-desc");
}

function displayBlog() {
  var blogsData = localStorage.getItem("blogs");
  if (blogsData) {
    allBlogs = JSON.parse(blogsData);
  }
  renderBlogs(allBlogs);
}

function searchBlogs(e) {
  var searchBy = e.target.value;
  var filteredBlogs = [];
  for (var blog of allBlogs) {
    if (blog.blogTitle.toLowerCase().indexOf(searchBy.toLowerCase()) > -1) {
      filteredBlogs.push(blog);
    }
  }
  renderBlogs(filteredBlogs);
}

function renderBlogs(blogs) {
  blogs.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
  var publishedBlogs = document.getElementById("published-blogs");
  publishedBlogs.innerHTML = "";
  for (var blog of blogs) {
    var h3 = document.createElement("h3");
    h3.innerHTML = blog.blogTitle;
    h3.classList.add("blog-title");
    h3.appendChild(createDeleteBtn(blog));
    var div = document.createElement("div");
    div.classList.add("posted-blog");
    var p = document.createElement("p");
    p.innerHTML = blog.blogDesc;

    var span = document.createElement("span");
    span.innerHTML = `Author: <span style="font-weight:bold;"> ${blog.author}</span>`;
    var datum = document.createElement("i");
    datum.style.paddingLeft = "30px";
    datum.innerHTML = new Date(blog.postDate).toLocaleString();

    div.appendChild(p);
    div.appendChild(span);
    div.appendChild(datum);
    div.appendChild(addLike(blog));
    publishedBlogs.appendChild(h3);
    publishedBlogs.appendChild(div);
    showComments(blog.comments);
    publishedBlogs.appendChild(addComment(blog));
  }
}

function addComment(blog) {
  var input = document.createElement("input");
  input.classList.add("blog-input");
  input.placeholder = "Leave a comment...";
  input.style = "width:40%;margin-left:60%;margin-top:5px;";
  input.addEventListener("keyup", function (e) {
    var text = e.target.value;
    if (e.keyCode !== 13) return;
    if (isGuest()) return alert("Molimo Vas registrujte se");
    var comment = {
      text,
      author: loggedUser.name,
      postedDate: new Date(),
    };
    if (!blog.comments) {
      blog.comments = [];
    }

    blog.comments.push(comment);
    localStorage.setItem("blogs", JSON.stringify(allBlogs));
    input.value = "";
    renderBlogs(allBlogs);
  });
  return input;
}

function showComments(comments) {
  var publishedBlogs = document.getElementById("published-blogs");
  for (var comment of comments) {
    var div = document.createElement("div");
    div.classList.add("posted-blog");
    div.style = "width:60%;margin-left:40%;margin-top:4px;padding:7px 15px;";
    var p = document.createElement("p");
    p.innerHTML = comment.text;
    p.style = "margin-bottom:5px;margin-top:5px;";
    var span = document.createElement("span");
    span.innerHTML = `Author: ${comment.author}`;
    var datum = document.createElement("i");
    datum.style.paddingLeft = "30px";
    datum.innerHTML = new Date(comment.postedDate).toLocaleString();
    div.appendChild(p);
    div.appendChild(span);
    div.appendChild(datum);
    publishedBlogs.appendChild(div);
  }
}

function createDeleteBtn(blog) {
  var btn = document.createElement("button");

  btn.classList.add("blog-delete-btn");
  btn.style.display = loggedUser.name === blog.author ? "block" : "none";

  btn.innerHTML =
    '<i class="fa fa-trash" style="font-size:22px;cursor: pointer;"></i>';

  btn.addEventListener("click", function () {
    var index = allBlogs.indexOf(blog);
    var response = confirm("jeste li sigurni");
    if (!response) return;
    allBlogs.splice(index, 1);
    renderBlogs(allBlogs);
  });
  return btn;
}

function isGuest() {
  return !loggedUser.name;
}

function hide(el) {
  el.style.display = "none";
}
function addLike(blog) {
  var id = allBlogs.indexOf(blog);
  var licon = isUserLiked(blog) ? "up" : "o-up";
  var dicon = isUserDislked(blog) ? "down" : "o-down";
  var likeWrapper = document.createElement("div");
  likeWrapper.classList.add("like-icons");
  likeWrapper.innerHTML = isGuest()
    ? ""
    : `
  <i data-id="${id}" style="color:blue" onclick="likeBlog(event)" class="fa fa-thumbs-${licon}" ></i>
  <span title="${
    blog.likes ? blog.likes.join(", ").toUpperCase() : "Nema lajkova"
  }"  style="color:blue">${blog.likes ? blog.likes.length : 0}</span>
   <i  data-id="${id}"  style="color:red" onclick="dislikeBlog(event)"  class="fa fa-thumbs-${dicon}" ></i>
   <span style="color:red">${blog.dislikes ? blog.dislikes.length : 0}</span>`;
  return likeWrapper;
}

function likeBlog(e) {
  var index = e.target.getAttribute("data-id");
  var blog = allBlogs[index];
  if (!blog.likes) {
    blog.likes = [];
  }

  if (blog.likes.includes(loggedUser.username)) {
    var i = blog.likes.indexOf(loggedUser.username);
    blog.likes.splice(i, 1);
  } else blog.likes.push(loggedUser.username);

  localStorage.setItem("blogs", JSON.stringify(allBlogs));
  renderBlogs(allBlogs);
}
function dislikeBlog(e) {
  var index = e.target.getAttribute("data-id");
  var blog = allBlogs[index];
  if (!blog.dislikes) {
    blog.dislikes = [];
  }

  if (blog.dislikes.includes(loggedUser.username)) {
    var i = blog.dislikes.indexOf(loggedUser.username);
    blog.dislikes.splice(i, 1);
  } else blog.dislikes.push(loggedUser.username);

  localStorage.setItem("blogs", JSON.stringify(allBlogs));
  renderBlogs(allBlogs);
}

function isUserLiked(blog) {
  if (blog.likes && blog.likes.includes(loggedUser.username)) return true;
  return;
}
function isUserDislked(blog) {
  if (blog.dislikes && blog.dislikes.includes(loggedUser.username)) return true;
  return;
}
