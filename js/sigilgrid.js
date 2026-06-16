/* SIGILGRID — interactive audiovisual sigil engine
   Click grid nodes to inscribe a sigil; ACTIVATE plays it as a
   Web Audio sequence. Pure client-side, GitHub Pages friendly. */
(function () {
  "use strict";

  var canvas = document.getElementById("sigil-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var COLS = 8, ROWS = 8;
  var W = canvas.width, H = canvas.height;
  var cellW = W / COLS, cellH = H / ROWS;

  // Grid state: nodes[row][col] = boolean
  var nodes = [];
  for (var r = 0; r < ROWS; r++) { nodes.push(new Array(COLS).fill(false)); }

  // F# natural minor scale across rows (top = high pitch), Hz
  // F#, A, B, C#, E, F#... built as a dark minor pentatonic + extras
  var scale = [369.99, 329.63, 293.66, 246.94, 220.00, 185.00, 164.81, 138.59];

  // ---------- Audio ----------
  var audio = null, master = null;
  function getAudio() {
    if (!audio) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audio = new AC();
      master = audio.createGain();
      master.gain.value = 0.0;
      master.connect(audio.destination);
    }
    return audio;
  }

  function voice(freq, time, dur, isBass) {
    var o1 = audio.createOscillator();
    var o2 = audio.createOscillator();
    var g = audio.createGain();
    var f = audio.createBiquadFilter();
    o1.type = "sawtooth";
    o2.type = "sawtooth";
    o1.frequency.value = freq;
    o2.frequency.value = freq * (isBass ? 0.5 : 1.005); // sub or detune
    o2.detune.value = isBass ? 0 : -8;
    f.type = "lowpass";
    f.frequency.setValueAtTime(isBass ? 600 : 900, time);
    f.frequency.exponentialRampToValueAtTime(isBass ? 200 : 2600, time + 0.05);
    f.frequency.exponentialRampToValueAtTime(isBass ? 180 : 500, time + dur);
    f.Q.value = isBass ? 4 : 8;
    o1.connect(f); o2.connect(f); f.connect(g); g.connect(master);
    var peak = isBass ? 0.5 : 0.32;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(peak, time + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o1.start(time); o2.start(time);
    o1.stop(time + dur + 0.05); o2.stop(time + dur + 0.05);
  }

  // ---------- Sequencer ----------
  var playing = false, step = 0, nextStepTime = 0, timer = null;
  var tempo = 96;
  function stepDur() { return 60 / tempo / 2; } // eighth notes

  function schedule() {
    var ac = getAudio();
    if (!ac) return;
    while (nextStepTime < ac.currentTime + 0.12) {
      playStep(step, nextStepTime);
      nextStepTime += stepDur();
      step = (step + 1) % COLS;
    }
  }
  function playStep(col, time) {
    for (var row = 0; row < ROWS; row++) {
      if (nodes[row][col]) {
        var isBass = row >= ROWS - 2;
        voice(scale[row], time, isBass ? stepDur() * 1.8 : stepDur() * 1.1, isBass);
      }
    }
    activeCol = col;
  }

  function start() {
    var ac = getAudio();
    if (!ac) { setStatus("NO AUDIO"); return; }
    if (ac.state === "suspended") ac.resume();
    if (playing) return;
    playing = true;
    master.gain.setTargetAtTime(0.9, ac.currentTime, 0.05);
    step = 0; nextStepTime = ac.currentTime + 0.05;
    timer = setInterval(schedule, 25);
    setStatus("ACTIVE");
    playBtn.textContent = "▮ STOP";
  }
  function stop() {
    playing = false;
    if (timer) clearInterval(timer);
    if (master && audio) master.gain.setTargetAtTime(0.0, audio.currentTime, 0.05);
    activeCol = -1;
    setStatus("IDLE");
    playBtn.textContent = "▶ ACTIVATE";
  }

  // ---------- Rendering ----------
  var activeCol = -1, frame;
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // grid lines
    ctx.strokeStyle = "rgba(177,75,255,0.18)";
    ctx.lineWidth = 1;
    for (var c = 0; c <= COLS; c++) {
      ctx.beginPath(); ctx.moveTo(c * cellW, 0); ctx.lineTo(c * cellW, H); ctx.stroke();
    }
    for (var rr = 0; rr <= ROWS; rr++) {
      ctx.beginPath(); ctx.moveTo(0, rr * cellH); ctx.lineTo(W, rr * cellH); ctx.stroke();
    }

    // active column highlight
    if (playing && activeCol >= 0) {
      ctx.fillStyle = "rgba(20,240,255,0.06)";
      ctx.fillRect(activeCol * cellW, 0, cellW, H);
    }

    // connect lit nodes into a sigil path
    var lit = [];
    for (var r = 0; r < ROWS; r++) {
      for (var c2 = 0; c2 < COLS; c2++) {
        if (nodes[r][c2]) lit.push({ x: c2 * cellW + cellW / 2, y: r * cellH + cellH / 2, r: r, c: c2 });
      }
    }
    if (lit.length > 1) {
      ctx.strokeStyle = "rgba(255,43,214,0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lit[0].x, lit[0].y);
      for (var i = 1; i < lit.length; i++) ctx.lineTo(lit[i].x, lit[i].y);
      ctx.stroke();
    }

    // nodes
    var t = performance.now() / 1000;
    for (var n = 0; n < lit.length; n++) {
      var node = lit[n];
      var firing = playing && node.c === activeCol;
      var pulse = firing ? 1 : 0.55 + 0.12 * Math.sin(t * 3 + n);
      var rad = (firing ? 16 : 9) * pulse + 4;
      var grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, rad * 2);
      var col = firing ? "20,240,255" : "255,43,214";
      grad.addColorStop(0, "rgba(" + col + "," + (firing ? 1 : 0.95) + ")");
      grad.addColorStop(1, "rgba(" + col + ",0)");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(node.x, node.y, rad * 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(" + col + ",1)";
      ctx.beginPath(); ctx.arc(node.x, node.y, 3, 0, Math.PI * 2); ctx.fill();
    }

    // dim dots for empty nodes
    ctx.fillStyle = "rgba(156,147,199,0.18)";
    for (var er = 0; er < ROWS; er++) {
      for (var ec = 0; ec < COLS; ec++) {
        if (!nodes[er][ec]) {
          ctx.beginPath();
          ctx.arc(ec * cellW + cellW / 2, er * cellH + cellH / 2, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    frame = requestAnimationFrame(draw);
  }

  // ---------- Interaction ----------
  function nodeFromEvent(e) {
    var rect = canvas.getBoundingClientRect();
    var px = (e.clientX - rect.left) * (W / rect.width);
    var py = (e.clientY - rect.top) * (H / rect.height);
    return { c: Math.floor(px / cellW), r: Math.floor(py / cellH) };
  }
  function toggleAt(e) {
    var p = nodeFromEvent(e);
    if (p.r < 0 || p.r >= ROWS || p.c < 0 || p.c >= COLS) return;
    nodes[p.r][p.c] = !nodes[p.r][p.c];
    updateCount();
  }
  canvas.addEventListener("pointerdown", function (e) { e.preventDefault(); toggleAt(e); });

  // ---------- Controls / readout ----------
  var playBtn = document.getElementById("sg-play");
  var clearBtn = document.getElementById("sg-clear");
  var randomBtn = document.getElementById("sg-random");
  var tempoInput = document.getElementById("sg-tempo");
  var nodesOut = document.getElementById("sg-nodes");
  var statusOut = document.getElementById("sg-status");

  function setStatus(s) { if (statusOut) statusOut.textContent = "STATUS: " + s; }
  function updateCount() {
    var count = 0;
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) if (nodes[r][c]) count++;
    if (nodesOut) nodesOut.textContent = "NODES: " + count;
  }

  playBtn.addEventListener("click", function () { playing ? stop() : start(); });
  clearBtn.addEventListener("click", function () {
    for (var r = 0; r < ROWS; r++) nodes[r].fill(false);
    updateCount();
  });
  randomBtn.addEventListener("click", function () {
    for (var c = 0; c < COLS; c++) {
      for (var r = 0; r < ROWS; r++) nodes[r][c] = false;
      if (Math.random() > 0.35) nodes[Math.floor(Math.random() * ROWS)][c] = true;
    }
    updateCount();
  });
  tempoInput.addEventListener("input", function () { tempo = parseInt(tempoInput.value, 10) || 96; });

  // Seed a starter sigil so the grid isn't empty on load
  [[1,0],[3,1],[2,2],[6,2],[4,4],[2,5],[5,6],[6,7]].forEach(function (p) {
    nodes[p[0]][p[1]] = true;
  });

  updateCount();
  setStatus("IDLE");
  draw();
})();
