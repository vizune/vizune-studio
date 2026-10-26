/* Vizune — Coming Soon
   Small, dependency-free progressive enhancement for the sign-up form. */
(function () {
  "use strict";

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var form = document.getElementById("signup");
  var status = document.getElementById("signup-status");
  if (!form || !status) return;

  var input = form.querySelector('input[type="email"]');
  var button = form.querySelector("button");
  var honeypot = form.querySelector('input[name="website"]');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function say(message, isError) {
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var email = input.value.trim();
    if (!EMAIL_RE.test(email)) {
      say("Hmm, that email doesn't look quite right — mind checking it?", true);
      input.focus();
      return;
    }

    // Quietly accept bot submissions without sending them anywhere
    if (honeypot && honeypot.value) {
      done();
      return;
    }

    var endpoint = form.getAttribute("data-endpoint");
    if (!endpoint) {
      console.warn("[Vizune] No sign-up endpoint set. Add your provider URL to data-endpoint on #signup.");
      say("Sign-ups open very soon — check back shortly!", true);
      return;
    }

    button.disabled = true;
    say("Brewing…");

    var body = new FormData();
    body.append("email", email);

    fetch(endpoint, {
      method: "POST",
      body: body,
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        done();
      })
      .catch(function () {
        button.disabled = false;
        say("Something fizzled out. Please try again in a moment.", true);
      });
  });

  function done() {
    form.classList.add("is-done");
    form.innerHTML = "<span>✦ You're on the list! We'll be in touch when the cauldron's ready. ✦</span>";
    say("");
  }
})();
