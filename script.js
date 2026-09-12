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
