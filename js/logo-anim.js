/* Vizune logo animation — VZN → accordion → cat peers → paws. Click to replay. */
(function () {
  "use strict";

  var root = document.querySelector(".logo-button");
  if (!root || !root.animate) return;
  var svg = root.querySelector(".vz");
  var $ = function (s) { return svg.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(svg.querySelectorAll(s)); };

  var outline = $(".vz-outline");          // Cloverie's exact sticker outline (shown at rest)
  var liveOutline = $(".vz-live-outline");  // stroked copies that move with each piece

  // Every moving piece exists twice: once in the jade outline layer, once in
  // the colour layer. part("V") returns both so they always move together.
  function part(name) { return $$('[data-part="' + name + '"]'); }
  var parts = {
    V: part("V"), i: part("i"), Z: part("Z"), u: part("u"), N: part("N"), e: part("e"),
    spark: part("spark"), head: part("head"), filler: part("filler"),
    pawL: part("pawL"), pawR: part("pawR"), glints: $$(".vz-glint")
  };

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var running = [];
  var timers = [];
  var peekRect = $(".vz-peek-rect");
  // While peeking, the head is hidden below the letters' top edge.
  var PEEK_LINE = 1780, NO_CLIP = 2400;

  var BOUNCE = "cubic-bezier(.34, 1.56, .64, 1)";
  var SOFT = "cubic-bezier(.22, 1, .36, 1)";

  // How far V, Z and N sit from home when squashed into "VZN" (SVG user units)
  var SQUASH = { V: 536, Z: 328, N: -112 };

  // Easing passed in opts is applied per step (between keyframes), so holds
  // stay as holds rather than the whole timeline being squashed.
  function play(target, frames, opts) {
    if (Array.isArray(target)) {
      target.forEach(function (el) { play(el, frames, opts); });
      return;
    }
    var el = target;
    opts = Object.assign({ fill: "both" }, opts);
    if (opts.easing) {
      frames = frames.map(function (f) { return f.easing ? f : Object.assign({ easing: opts.easing }, f); });
      delete opts.easing;
    }
    var a = el.animate(frames, opts);
    running.push(a);
    return a;
  }

  function stop() {
    running.forEach(function (a) { a.cancel(); });
    running = [];
    timers.forEach(clearTimeout);
    timers = [];
    peekRect.setAttribute("height", NO_CLIP);
  }

  function setLiveOutline(on) {
    // During the animation the stroked copies draw the jade outline so it can
    // stretch with the letters; at rest we show Cloverie's exact outline.
    liveOutline.style.visibility = on ? "visible" : "hidden";
  }

  function run() {
    stop();
    root.classList.add("is-playing");
    setLiveOutline(true);
    peekRect.setAttribute("height", PEEK_LINE);
    // Release the clip mid-pop, while the head is moving fast
    timers.push(setTimeout(function () { peekRect.setAttribute("height", NO_CLIP); }, 2150));

    // 0 — outline hidden, "VZN" pops in
    play(outline, [{ opacity: 0 }, { opacity: 0 }], { duration: 3300 });
    play(svg, [
      { transform: "scale(.6)", opacity: 0 },
      { transform: "scale(1.04)", opacity: 1, offset: .7 },
      { transform: "scale(1)", opacity: 1 }
    ], { duration: 520, easing: SOFT });

    // 1 — accordion: V/Z/N slide out, i/u/e unfold in the gaps
    ["V", "Z", "N"].forEach(function (k) {
      play(parts[k], [
        { transform: "translateX(" + SQUASH[k] + "px)" },
        { transform: "translateX(" + SQUASH[k] + "px)", offset: .35 },
        { transform: "translateX(0)" }
      ], { duration: 1250, easing: BOUNCE });
    });
    [["i", 0], ["u", 60], ["e", 120]].forEach(function (pair) {
      play(parts[pair[0]], [
        { transform: "scale(0, .5)", opacity: 0 },
        { transform: "scale(0, .5)", opacity: 0, offset: .35 },
        { transform: "scale(1.12, 1.05)", opacity: 1, offset: .8 },
        { transform: "scale(1)", opacity: 1 }
      ], { duration: 1250, delay: pair[1], easing: SOFT });
    });
    play(parts.spark, [
      { transform: "scale(0) rotate(-180deg)" },
      { transform: "scale(0) rotate(-180deg)", offset: .6 },
      { transform: "scale(1.35) rotate(15deg)", offset: .88 },
      { transform: "scale(1) rotate(0)" }
    ], { duration: 1500, easing: SOFT });

    // 2 — the cat peers over: ears, a curious wiggle, then the full head
    play(parts.head, [
      { transform: "translateY(1450px) rotate(0)" },
      { transform: "translateY(1450px) rotate(0)", offset: .34 },
      { transform: "translateY(560px) rotate(0)", offset: .45, easing: "ease-in-out" },
      { transform: "translateY(600px) rotate(-5deg)", offset: .55, easing: "ease-in-out" },
      { transform: "translateY(560px) rotate(5deg)", offset: .65, easing: "ease-in-out" },
      { transform: "translateY(600px) rotate(0)", offset: .72, easing: BOUNCE },
      { transform: "translateY(0) rotate(0)", offset: .9 },
      { transform: "translateY(0) rotate(0)" }
    ], { duration: 2700, easing: SOFT });
    parts.glints.forEach(function (g, n) {
      play(g, [
        { transform: "scale(1) rotate(0)" },
        { transform: "scale(1.7) rotate(90deg)", offset: .5 },
        { transform: "scale(1) rotate(180deg)" }
      ], { duration: 500, delay: 2500 + n * 90, easing: "ease-in-out", fill: "none" });
    });

    // 3 — paws plop onto the letters
    [[parts.pawL, 2650], [parts.pawR, 2780]].forEach(function (pair) {
      play(pair[0], [
        { transform: "translateY(-320px) scale(.7)", opacity: 0 },
        { transform: "translateY(-320px) scale(.7)", opacity: 0, offset: 0 },
        { transform: "translateY(20px) scale(1.15, .8)", opacity: 1, offset: .55 },
        { transform: "translateY(-18px) scale(.95, 1.06)", opacity: 1, offset: .78 },
        { transform: "translateY(0) scale(1)", opacity: 1 }
      ], { duration: 520, delay: pair[1], easing: "ease-out" });
    });
    play(parts.filler, [{ opacity: 1 }, { opacity: 1, offset: .99 }, { opacity: 0 }], { duration: 2950 });

    // 4 — settle onto the official sticker outline
    timers.push(setTimeout(function () {
      outline.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: "forwards" })
        .onfinish = function () {
          stop();               // everything back to its natural (final) state
          setLiveOutline(false);
          root.classList.remove("is-playing");
        };
    }, 3350));
  }

  root.addEventListener("click", function () {
    if (reduce && reduce.matches) {
      // A tiny wiggle instead of the full sequence
      root.animate([{ transform: "rotate(0)" }, { transform: "rotate(-3deg)" }, { transform: "rotate(3deg)" }, { transform: "rotate(0)" }], { duration: 400 });
      return;
    }
    run();
  });

  if (reduce && reduce.matches) {
    document.documentElement.classList.remove("vz-pending");
    return;
  }
  run();
  document.documentElement.classList.remove("vz-pending");
})();
