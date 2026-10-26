/* Vizune — Coming Soon
   Sign-up form (Kit) + footer year. Dependency-free. */
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

  var formId = (form.getAttribute("data-kit-form") || "").trim();
  var configured = /^\d+$/.test(formId);
  var endpoint = "https://app.kit.com/forms/" + formId + "/subscriptions";

  function say(message, isError) {
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
  }

  function done() {
    form.classList.add("is-done");
    form.innerHTML = "<span>✦ Almost there! Check your inbox to confirm your email. ✦</span>";
    say("");
  }

  // Coming back from Kit after a no-JavaScript / fallback sign-up
  // (set Kit's "redirect after subscribing" to https://vizune.com/?subscribed=1)
  if (/[?&]subscribed=1\b/.test(window.location.search)) {
    done();
    if (window.history && history.replaceState) {
      history.replaceState(null, "", window.location.pathname + window.location.hash);
    }
  }

  // Fallback: a plain form POST to Kit always works, even if the browser
  // blocks the background request. Kit then shows/redirects to its success page.
  function submitNatively(email) {
    if (honeypot) honeypot.disabled = true; // don't send the honeypot to Kit
    form.action = endpoint;
    form.method = "post";
    input.value = email;
    HTMLFormElement.prototype.submit.call(form);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var email = input.value.trim();
    if (!EMAIL_RE.test(email)) {
      say("Hmm, that email doesn't look quite right. Mind checking it?", true);
      input.focus();
      return;
    }

    // Quietly accept bot submissions without sending them anywhere
    if (honeypot && honeypot.value) {
      done();
      return;
    }

    if (!configured) {
      console.warn("[Vizune] Kit form ID not set. Replace KIT_FORM_ID in index.html.");
      say("Sign-ups open very soon. Check back shortly!", true);
      return;
    }

    button.disabled = true;
    say("Brewing…");

    var body = new FormData();
    body.append("email_address", email);

    fetch(endpoint, {
      method: "POST",
      body: body,
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (res.ok && (!data.status || data.status === "success")) return done();
          var msg = data && data.errors && data.errors.messages && data.errors.messages[0];
          throw { message: msg || "", handled: Boolean(msg) };
        });
      })
      .catch(function (err) {
        if (err && err.handled) {
          button.disabled = false;
          say(err.message, true);
          return;
        }
        // Network/CORS hiccup: hand over to a normal form submission
        submitNatively(email);
      });
  });
})();
