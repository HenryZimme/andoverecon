/* deadline.js — single source of truth for the AER final submission deadline.
   To change the deadline site-wide, edit DEADLINE_ISO and DEADLINE_DISPLAY below. */
(function () {
  'use strict';

  var DEADLINE_ISO     = '2026-09-25T23:59:00-04:00';          // Sept 25, 2026, 11:59 PM Eastern
  var DEADLINE_DISPLAY = 'September 25, 2026 at 11:59 PM EST'; // text shown to readers

  var deadline = new Date(DEADLINE_ISO);

  // Fill every element marked data-deadline with the display string.
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-deadline]'),
    function (el) { el.textContent = DEADLINE_DISPLAY; }
  );

  var banner = document.querySelector('.deadline-banner');
  var out    = document.getElementById('deadline-countdown');
  if (!out) return;

  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  function render() {
    var ms = deadline - new Date();

    if (ms <= 0) {
      out.textContent = 'Submissions are now closed';
      if (banner) {
        banner.classList.add('deadline-closed');
        var head = banner.querySelector('.deadline-headline');
        var note = banner.querySelector('.deadline-note');
        if (head) {
          head.innerHTML = 'Final submissions closed on <span class="deadline-date">' +
                           DEADLINE_DISPLAY + '</span>.';
        }
        if (note) {
          note.textContent = 'The submission window for this cycle has closed. ' +
                             'Watch this page for the next call for papers.';
        }
      }
      return;
    }

    var mins  = Math.floor(ms / 60000);
    var days  = Math.floor(mins / 1440);
    var hours = Math.floor((mins % 1440) / 60);
    var parts = days > 0
      ? [plural(days, 'day'), plural(hours, 'hour')]
      : [plural(hours, 'hour'), plural(mins % 60, 'minute')];

    out.textContent = parts.join(', ') + ' remaining';
  }

  render();
  setInterval(render, 30000);
})();
