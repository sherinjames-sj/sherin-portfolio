(function(){
  // ---------------- roaming critters (ducks + AI bot friend) ----------------
  (function(){
    var zone = document.getElementById('roamZone');
    if (!zone) return;
    var critters = Array.prototype.slice.call(zone.querySelectorAll('.critter'));
    var CW = 52, CH = 52; // matches .critter CSS size

    function bounds(){
      var r = zone.getBoundingClientRect();
      return { w: Math.max(r.width, CW + 10), h: Math.max(r.height, CH + 10) };
    }

    function place(el, xPct, yPct, seconds){
      el.style.transition = 'left ' + seconds + 's ease-in-out, top ' + seconds + 's ease-in-out';
      var prevLeft = parseFloat(el.style.left) || 0;
      if (xPct < prevLeft) el.classList.add('flip'); else el.classList.remove('flip');
      el.style.left = xPct + '%';
      el.style.top = yPct + '%';
    }

    function randomWander(el){
      if (el._fleeing) return;
      var b = bounds();
      var maxXPct = 100 - (CW / b.w) * 100;
      var maxYPct = 100 - (CH / b.h) * 100;
      var x = Math.random() * Math.max(maxXPct, 10);
      var y = Math.random() * Math.max(maxYPct, 10);
      var dur = 3 + Math.random() * 3;
      place(el, x, y, dur);
      el._timer = setTimeout(function(){ randomWander(el); }, dur * 1000 + Math.random() * 900);
    }

    function flee(el){
      if (el._fleeing) return;
      el._fleeing = true;
      clearTimeout(el._timer);
      el.classList.add('spooked');
      var b = bounds();
      var maxXPct = 100 - (CW / b.w) * 100;
      var maxYPct = 100 - (CH / b.h) * 100;
      var x = Math.random() * Math.max(maxXPct, 10);
      var y = Math.random() * Math.max(maxYPct, 10);
      place(el, x, y, 0.35);
      setTimeout(function(){ el.classList.remove('spooked'); }, 400);
      setTimeout(function(){
        el._fleeing = false;
        randomWander(el);
      }, 700);
    }

    critters.forEach(function(el){
      el.addEventListener('pointerenter', function(){ flee(el); });
      el.addEventListener('pointerdown', function(){ flee(el); });
      randomWander(el);
    });
  })();

  // ---------------- The Pond Derby racing game (no AI, pure JS) ----------------
  function setupGame(){
    var pickEl0 = document.getElementById('racerPick');
    if (!pickEl0) return;

    var RACER_DEFS = [
      { key:'duck',   emoji:'🦆', skill:1.00 },
      { key:'cat',    emoji:'🐱', skill:0.96 },
      { key:'dog',    emoji:'🐕', skill:1.04 },
      { key:'rabbit', emoji:'🐇', skill:1.08 }
    ];
    var BOOST_PLAYER = 27;      // percent/sec added per tap
    var MAX_SPEED = 92;         // percent/sec cap
    var DECAY = 2.4;            // exponential speed decay per second
    var CPU_BURST_MIN = 9, CPU_BURST_MAX = 24;
    var CPU_INTERVAL_MIN = 170, CPU_INTERVAL_MAX = 430;
    var SPRITE_W = 26;

    var pickEl = document.getElementById('racerPick');
    var boardEl = document.getElementById('trackBoard');
    var statusEl = document.getElementById('raceStatus');
    var btnEl = document.getElementById('raceBtn');
    var hintEl = document.getElementById('raceHint');

    var racers = RACER_DEFS.map(function(def){
      return {
        key: def.key, emoji: def.emoji, skill: def.skill,
        isPlayer: false, pos: 0, speed: 0,
        lane: boardEl.querySelector('.track-lane[data-lane="' + def.key + '"]'),
        cpuTimer: null
      };
    });
    racers.forEach(function(r){ r.trackEl = r.lane.querySelector('.lane-track'); r.spriteEl = r.lane.querySelector('.racer-sprite'); });

    var phase = 'pick'; // pick -> countdown -> racing -> finished
    var playerKey = null;
    var rafId = null, lastTs = null, laneWidth = 240;

    function selectRacer(key){
      if (phase !== 'pick' && phase !== 'finished') return;
      playerKey = key;
      racers.forEach(function(r){ r.isPlayer = (r.key === key); });
      pickEl.querySelectorAll('.racer-opt').forEach(function(b){
        b.classList.toggle('selected', b.getAttribute('data-racer') === key);
      });
      phase = 'pick';
      btnEl.disabled = false;
      btnEl.textContent = '▶ Ready, Set, Go';
      var name = RACER_DEFS.find(function(d){ return d.key === key; });
      statusEl.textContent = "You're racing as the " + name.key + ". Hit go when ready!";
    }

    pickEl.querySelectorAll('.racer-opt').forEach(function(b){
      b.addEventListener('click', function(){ selectRacer(b.getAttribute('data-racer')); });
    });

    function layoutRacers(){
      laneWidth = racers[0].trackEl.getBoundingClientRect().width;
      racers.forEach(function(r){
        r.pos = 0; r.speed = 0;
        r.spriteEl.style.left = '2px';
      });
    }

    function placeSprite(r){
      var usable = Math.max(laneWidth - SPRITE_W - 4, 10);
      r.spriteEl.style.left = (2 + (Math.min(r.pos,100)/100) * usable) + 'px';
    }

    function clearCpuTimers(){
      racers.forEach(function(r){ if (r.cpuTimer) clearTimeout(r.cpuTimer); r.cpuTimer = null; });
    }

    function scheduleCpu(r){
      var delay = CPU_INTERVAL_MIN + Math.random() * (CPU_INTERVAL_MAX - CPU_INTERVAL_MIN);
      r.cpuTimer = setTimeout(function(){
        if (phase !== 'racing') return;
        var burst = (CPU_BURST_MIN + Math.random() * (CPU_BURST_MAX - CPU_BURST_MIN)) * r.skill;
        r.speed = Math.min(MAX_SPEED, r.speed + burst);
        scheduleCpu(r);
      }, delay);
    }

    function loop(ts){
      if (phase !== 'racing'){ return; }
      if (lastTs == null) lastTs = ts;
      var dt = Math.min(60, ts - lastTs) / 1000;
      lastTs = ts;

      var winner = null;
      racers.forEach(function(r){
        r.speed *= Math.exp(-DECAY * dt);
        r.pos += r.speed * dt;
        if (r.pos >= 100 && !winner) winner = r;
        placeSprite(r);
      });

      if (winner){
        finishRace(winner);
        return;
      }
      rafId = requestAnimationFrame(loop);
    }

    function dash(){
      if (phase !== 'racing' || !playerKey) return;
      var r = racers.find(function(x){ return x.key === playerKey; });
      r.speed = Math.min(MAX_SPEED, r.speed + BOOST_PLAYER);
    }

    btnEl.addEventListener('click', function(){
      if (phase === 'pick'){
        if (!playerKey){ statusEl.textContent = 'Pick a racer first!'; return; }
        startCountdown();
      } else if (phase === 'racing'){
        dash();
      } else if (phase === 'finished'){
        resetToPick();
      }
    });

    document.addEventListener('keydown', function(e){
      if (e.code !== 'Space') return;
      if (!document.getElementById('view-game').classList.contains('active')) return;
      e.preventDefault();
      if (phase === 'racing') dash();
    });

    function startCountdown(){
      phase = 'countdown';
      btnEl.disabled = true;
      layoutRacers();
      var steps = ['Ready?', '3', '2', '1', 'GO!'];
      var i = 0;
      hintEl.textContent = 'Tap "Dash!" (or hit Space) as fast as you can, your racer only moves when you do.';
      (function next(){
        statusEl.textContent = steps[i];
        i++;
        if (i < steps.length){
          setTimeout(next, i === 1 ? 500 : 550);
        } else {
          beginRace();
        }
      })();
    }

    function beginRace(){
      phase = 'racing';
      lastTs = null;
      btnEl.disabled = false;
      btnEl.textContent = '💨 Dash!';
      statusEl.textContent = 'Go go go!';
      racers.forEach(function(r){ if (!r.isPlayer) scheduleCpu(r); });
      rafId = requestAnimationFrame(loop);
    }

    function finishRace(winner){
      phase = 'finished';
      clearCpuTimers();
      if (rafId) cancelAnimationFrame(rafId);
      racers.forEach(function(r){ r.pos = Math.min(r.pos, 100); placeSprite(r); });
      var ranked = racers.slice().sort(function(a,b){ return b.pos - a.pos; });
      var playerRank = ranked.findIndex(function(r){ return r.isPlayer; }) + 1;
      var winnerLabel = winner.key.charAt(0).toUpperCase() + winner.key.slice(1);
      if (winner.isPlayer){
        statusEl.textContent = '🏆 You won! The ' + winner.key + ' crosses the line first.';
      } else {
        var ord = playerRank === 2 ? '2nd' : (playerRank === 3 ? '3rd' : '4th');
        statusEl.textContent = '😅 The ' + winnerLabel + ' wins this one. You placed ' + ord + '.';
      }
      btnEl.disabled = false;
      btnEl.textContent = '🔁 Race Again';
      hintEl.textContent = 'Pick the same racer or try a different one, then go again.';
    }

    function resetToPick(){
      phase = 'pick';
      clearCpuTimers();
      if (rafId) cancelAnimationFrame(rafId);
      layoutRacers();
      btnEl.textContent = '▶ Ready, Set, Go';
      statusEl.textContent = playerKey ? "You're racing as the " + playerKey + ". Hit go when ready!" : 'Pick your racer to begin';
    }

    layoutRacers();
  }
  setupGame();
})();


(function(){
  function showToast(msg){
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(function(){ t.classList.remove('show'); }, 3600);
  }

  function copyEmail(email){
    email = email || 'sherinalice28@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(function(){
        showToast('Copied ' + email + '. Paste it into your mail app.');
      }).catch(function(){
        showToast('Email me at ' + email);
      });
    } else {
      showToast('Email me at ' + email);
    }
  }

  document.querySelectorAll('.js-mailto').forEach(function(a){
    a.addEventListener('click', function(){
      copyEmail(a.getAttribute('data-email'));
    });
  });
})();

// ---------------- walking cat, all the way across the topbar (all pages) ----------------
(function(){
  var row = document.querySelector('.topbar-row1');
  if (!row) return;
  var track = document.createElement('div');
  track.className = 'cat-walk-track';
  track.setAttribute('aria-hidden', 'true');
  track.innerHTML = '<span class="walking-cat-emoji"><span class="walking-cat-bob">🐈</span></span>';
  row.appendChild(track);
})();

// ---------------- meow + tiny robots & cats on the "hi, I'm Sherin" pill (home only) ----------------
(function(){
  var eyebrow = document.querySelector('.hero-eyebrow');
  if (!eyebrow) return;

  eyebrow.setAttribute('role', 'button');
  eyebrow.setAttribute('tabindex', '0');
  eyebrow.setAttribute('aria-label', eyebrow.textContent.trim() + ' (tap for a surprise)');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // short synthesized meow clip, embedded so no external file/network request is needed
  var MEOW_B64 = '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';
  var meowAudio = null;
  function playMeow(){
    try {
      if (!meowAudio) meowAudio = new Audio('data:audio/mpeg;base64,' + MEOW_B64);
      meowAudio.currentTime = 0;
      var p = meowAudio.play();
      if (p && p.catch) p.catch(function(){ /* ignore autoplay/format issues */ });
    } catch (e) { /* audio not available, fail silently */ }
  }

  function spawnCritters(){
    if (reduceMotion) return;
    var rect = eyebrow.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var critters = ['🤖', '🤖', '🐱', '🐱'];
    var spread = [-105, -35, 35, 105];
    critters.forEach(function(emoji, i){
      var el = document.createElement('span');
      el.className = 'robot-cat-pop';
      el.textContent = emoji;
      el.style.left = cx + 'px';
      el.style.top = cy + 'px';
      var angle = spread[i] * (Math.PI / 180);
      var dist = 62 + Math.random() * 28;
      el.style.setProperty('--dx', (Math.cos(angle) * dist).toFixed(1) + 'px');
      el.style.setProperty('--dy', (Math.sin(angle) * dist - 45).toFixed(1) + 'px');
      document.body.appendChild(el);
      setTimeout(function(){ el.remove(); }, 900);
    });
  }

  function trigger(){
    playMeow();
    spawnCritters();
  }

  eyebrow.addEventListener('click', trigger);
  eyebrow.addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      trigger();
    }
  });
})();
