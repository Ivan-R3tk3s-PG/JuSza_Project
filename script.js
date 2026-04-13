document.addEventListener('DOMContentLoaded', function () {
  var feedbacks = {
    1:  { ok: 'Helyes! A Go nyelvet a Google fejlesztette rendszerszintű programozásra.', bad: 'Helytelen. A helyes válasz: Go.' },
    2:  { ok: 'Helyes! HTML = HyperText Markup Language.', bad: 'Helytelen. A helyes rövidítés: HyperText Markup Language.' },
    3:  { ok: 'Helyes! Haskell, Erlang és Lisp funkcionális nyelvek.', bad: 'Helytelen. A helyes válaszok: Haskell, Erlang és Lisp.' },
    4:  { ok: 'Helyes! Agra híres a Taj Mahal-ról.', bad: 'Helytelen. A helyes válasz: Agra.' },
    5:  { ok: 'Helyes! A Git használ commit és push parancsokat.', bad: 'Helytelen. A helyes válasz: Git.' },
    6:  { ok: 'Helyes! A JVM natívan Java bytecode-ot futtat (Java nyelv).', bad: 'Helytelen. A helyes válasz: Java.' },
    7:  { ok: 'Helyes! A Földön 7 kontinens található.', bad: 'Helytelen. A helyes válasz: 7.' },
    8:  { ok: 'Helyes! Brazília, Argentína és Chile Dél‑Amerikában vannak.', bad: 'Helytelen. A helyes válaszok: Brazília, Argentína, Chile.' },
    9:  { ok: 'Helyes! A repository klónozására a "git clone" parancs szolgál.', bad: 'Helytelen. A helyes válasz: git clone.' },
    10: { ok: 'Helyes! 5! = 120.', bad: 'Helytelen. A helyes válasz: 120.' }
  };

  function updateProgress() {
    var cards = document.querySelectorAll('.question-card');
    var answered = 0;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var q    = card.getAttribute('data-q');
      var type = card.getAttribute('data-type');
      var done = false;
      if (type === 'radio') {
        done = !!document.querySelector('input[name="q' + q + '"]:checked');
      } else if (type === 'checkbox') {
        done = !!document.querySelector('input[name="q' + q + '"]:checked');
      } else if (type === 'text') {
        var el = document.getElementById('q' + q + '-input');
        done = el && el.value.trim().length > 0;
      } else if (type === 'select') {
        var sel = document.getElementById('q' + q + '-select');
        done = sel && sel.value !== '';
      } else if (type === 'range') {
        done = true;
      }
      if (done) answered++;
    }
    var pct = (answered / 10) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressLabel').textContent = answered + ' / 10';
  }

  // Option click handlers
  var allLabels = document.querySelectorAll('.option-label');
  for (var li = 0; li < allLabels.length; li++) {
    allLabels[li].addEventListener('click', function () {
      var inp = this.querySelector('input');
      if (!inp) return;
      if (inp.type === 'radio') {
        var siblings = document.querySelectorAll('input[name="' + inp.name + '"]');
        for (var s = 0; s < siblings.length; s++) {
          siblings[s].parentElement.classList.remove('selected');
        }
        inp.checked = true;
        this.classList.add('selected');
      } else if (inp.type === 'checkbox') {
        inp.checked = !inp.checked;
        if (inp.checked) {
          this.classList.add('selected');
        } else {
          this.classList.remove('selected');
        }
      }
      updateProgress();
    });
  }

  // Range handler
  var rangeEl = document.getElementById('q7-range');
  if (rangeEl) {
    rangeEl.addEventListener('input', function () {
      document.getElementById('q7-val').textContent = this.value;
    });
  }

  // Submit
  document.getElementById('submitBtn').addEventListener('click', function () {
    var score = 0;
    var cards = document.querySelectorAll('.question-card');

    for (var i = 0; i < cards.length; i++) {
      var card    = cards[i];
      var q       = card.getAttribute('data-q');
      var type    = card.getAttribute('data-type');
      var correct = card.getAttribute('data-correct');
      var userAns = null;
      var isOk    = false;

      if (type === 'radio') {
        var chk = document.querySelector('input[name="q' + q + '"]:checked');
        userAns = chk ? chk.value : null;
        isOk    = (userAns === correct);
        var lbls = card.querySelectorAll('.option-label');
        for (var j = 0; j < lbls.length; j++) {
          var lbl = lbls[j];
          var v   = lbl.getAttribute('data-val');
          lbl.style.pointerEvents = 'none';
          lbl.classList.remove('selected');
          if (v === correct) { lbl.classList.add('correct'); }
          else if (v === userAns) { lbl.classList.add('wrong'); }
        }

      } else if (type === 'checkbox') {
        var boxes = document.querySelectorAll('input[name="q' + q + '"]:checked');
        var vals  = [];
        for (var k = 0; k < boxes.length; k++) { vals.push(boxes[k].value); }
        vals.sort();
        userAns = vals.join(',');
        isOk    = (userAns === correct.split(',').sort().join(','));
        var cArr = correct.split(',');
        var cLbls = card.querySelectorAll('.option-label');
        for (var m = 0; m < cLbls.length; m++) {
          var cl   = cLbls[m];
          var cv   = cl.getAttribute('data-val');
          var cinp = cl.querySelector('input');
          cl.style.pointerEvents = 'none';
          cl.classList.remove('selected');
          if (cArr.indexOf(cv) !== -1) { cl.classList.add('correct'); }
          else if (cinp && cinp.checked) { cl.classList.add('wrong'); }
        }

      } else if (type === 'text') {
        var tinp = document.getElementById('q' + q + '-input');
        userAns  = tinp ? tinp.value.trim().toLowerCase() : '';
        isOk     = (userAns === correct.toLowerCase());
        if (tinp) { tinp.readOnly = true; tinp.classList.add(isOk ? 'correct' : 'wrong'); }

      } else if (type === 'select') {
        var selEl = document.getElementById('q' + q + '-select');
        userAns   = selEl ? selEl.value : '';
        isOk      = (userAns === correct);
        if (selEl) { selEl.disabled = true; selEl.classList.add(isOk ? 'correct' : 'wrong'); }

      } else if (type === 'range') {
        var rng = document.getElementById('q' + q + '-range');
        userAns = rng ? rng.value : '';
        isOk    = (userAns === correct);
        if (rng) { rng.disabled = true; rng.classList.add(isOk ? 'correct' : 'wrong'); }
      }

      if (isOk) score++;
      card.classList.add('answered');

      var fbEl   = card.querySelector('.q-feedback');
      var fbIcon = card.querySelector('.q-feedback-icon');
      var fbTxt  = card.querySelector('.q-feedback-text');
      var msg    = feedbacks[parseInt(q, 10)];
      fbEl.classList.add('show', isOk ? 'correct' : 'wrong');
      fbIcon.textContent = isOk ? '\u2713' : '\u2717';
      fbTxt.textContent  = msg ? (isOk ? msg.ok : msg.bad) : '';
    }

    this.disabled    = true;
    this.textContent = 'Kiértékelve';
    document.getElementById('progressFill').style.width  = '100%';
    document.getElementById('progressLabel').textContent = '10 / 10';

    setTimeout(function () {
      var res = document.getElementById('results');
      res.classList.add('show');
      res.scrollIntoView({ behavior: 'smooth', block: 'start' });

      document.getElementById('scoreNum').textContent    = score;
      document.getElementById('statCorrect').textContent = score;
      document.getElementById('statWrong').textContent   = 10 - score;
      document.getElementById('statPct').textContent     = Math.round(score / 10 * 100) + '%';

      document.getElementById('ringFill').style.strokeDashoffset = 339.3 * (1 - score / 10);

      var title, subtitle;
      if (score === 10)    { title = 'Tökéletes eredmény!';    subtitle = 'Lenyűgöző, mind a 10 kérdésre helyesen válaszoltál!'; }
      else if (score >= 8) { title = 'Kiváló teljesítmény!';   subtitle = 'Nagyon jó eredmény, csak néhány apró hiba csúszott be.'; }
      else if (score >= 6) { title = 'Szép munka!';            subtitle = 'Átlag feletti teljesítmény, van még mit csiszolni.'; }
      else if (score >= 4) { title = 'Közepes eredmény';       subtitle = 'Nem rossz, de érdemes mélyebben utánanézni a témáknak.'; }
      else                 { title = 'Van mire fejlődni!';     subtitle = 'Ne add fel, próbáld újra és lapozz utána a téves válaszoknak.'; }

      document.getElementById('resultTitle').textContent    = title;
      document.getElementById('resultSubtitle').textContent = subtitle;
    }, 400);
  });

  document.getElementById('retryBtn').addEventListener('click', function () {
    location.reload();
  });

  document.addEventListener('change', updateProgress);

  // Staggered card animation
  var cards = document.querySelectorAll('.question-card');
  for (var ci = 0; ci < cards.length; ci++) {
    (function (c, d) {
      setTimeout(function () { c.classList.add('visible'); }, d);
    })(cards[ci], 100 + ci * 80);
  }

  updateProgress();
});
