// VARIABLES
// LOGIN
const l_email = document.querySelector("#login_email");
const l_pass = document.querySelector("#login_pass");
const l_submit = document.querySelector("#login_submit");
// REGISTER
const r_fname = document.querySelector("#r_fname");
const r_lname = document.querySelector("#r_lname");
const r_email = document.querySelector("#r_email");
const r_pass1 = document.querySelector("#r_pass1");
const r_pass2 = document.querySelector("#r_pass2");
const r_submit = document.querySelector("#r_submit");
// general
const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const signOutBtn = document.querySelector("#sign_out_btn");

function handleError(el) {
  el.classList.add("errored");
  setTimeout(() => {
    el.classList.remove("errored");
  }, 3000);
}

if (l_email) {
  l_submit.addEventListener("click", async () => {
    if (!emailRegExp.test(l_email.value)) {
      handleError(l_email);
      return;
    }

    if (l_pass.value.length < 8) {
      handleError(l_pass);
      return;
    }

    const request = await fetch(
      "https://backend-curs.herokuapp.com/users/login",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email: l_email.value,
          password: l_pass.value,
        }),
      }
    );
    const response = await request.json();

    if (request.status !== 201) {
      alert(response.message);
    } else {
      sessionStorage.setItem("token", response.token);
      window.location.reload();
    }
  });

  r_submit.addEventListener("click", async () => {
    if (r_fname.value.length < 2) {
      handleError(r_fname);
      return;
    }

    if (r_lname.value.length < 2) {
      handleError(r_lname);
      return;
    }

    if (!emailRegExp.test(r_email.value)) {
      handleError(r_email);
      return;
    }

    if (r_pass1.value.length < 8) {
      handleError(r_pass1);
      return;
    }

    if (r_pass1.value !== r_pass2.value) {
      handleError(r_pass1);
      handleError(r_pass2);
      return;
    }

    const request = await fetch(
      "https://backend-curs.herokuapp.com/users/register",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          first_name: r_fname.value,
          last_name: r_lname.value,
          email: r_email.value,
          password: r_pass1.value,
        }),
      }
    );

    const response = await request.json();

    if (request.status !== 201) {
      alert(response.message);
    } else {
      alert("Account created. Please log in.");
    }
  });
}
// newsfeed page
if (signOutBtn) {
  signOutBtn.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.reload();
  });

  const token = sessionStorage.token;
  async function getPosts () {
    const posts = await fetch("https://backend-curs.herokuapp.com/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    const pageData = await posts.json();
    if (posts.status === 200) {
      console.log(pageData);
      pageData.map((post, index) => 
      document.querySelector("main").innerHTML += `
      <article id="unique_id_${post._id}">
          <header>
            <p>${post.author}</p>
            <p>${post.date}</p>
          </header>
          <div class="separator"></div>
          <div>
            <p>Ceva text</p>

            <img src="img/pexels.jpg" alt="cat" />

            <video autoplay controls muted>
              <source src="videos/pexels.mp4" type="video/mp4" />
            </video>
          </div>
          <footer>
            <ul class="buttons">
              <li>
                <i class="fa fa-thumbs-up"></i>
                <span>Like <b>(1)</b></span>
              </li>
              <li>
                <i class="fa fa-comments"></i>
                <span>Comments <b>(1)</b></span>
              </li>
              <li>
                <i class="fa fa-share-alt"></i>
                <span>Share <b>(1)</b></span>
              </li>
            </ul>
            <div class="separator"></div>
            <ul class="comments">
              <li>
                <a href="#">John Doe</a>
                <p>comment text here</p>
              </li>
              <li class="reply">
                <a href="#">John Doe</a>
                <p>comment text here</p>
              </li>
            </ul>
          </footer>
        </article>`)
    }
  }
  getPosts();

}


