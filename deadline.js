/* deadline.js — single source of truth for the AER final submission deadline.
   To change the deadline site-wide:

     1. Edit DEADLINE_ISO and DEADLINE_DISPLAY below.
     2. Grep for leftover hardcoded dates and update the meta descriptions:
        grep -rn "September 25" *.html
     3. Update the "Deadline" row in submit.html's sidebar if the date moved.

   NOTE ON TIME ZONES: use the correct abbreviation for the date in question.
   Dates between March and November are Eastern DAYLIGHT Time (EDT, UTC-4);
   dates between November and March are Eastern STANDARD Time (EST, UTC-5).
   The current deadline falls in September, so the display says EDT.
*/
(function () {
  'use strict';

  var DEADLINE_ISO     = '2026-09-25T23:59:00-04:00';          // Sept 25, 2026, 11:59 PM Eastern Daylight Time
  var DEADLINE_DISPLAY = 'September 25, 2026 at 11:59 PM EDT'; // text shown to readers

  var deadline = new Date(DEADLINE_ISO);

  // Fill every element marked data-deadline with the display string.
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-deadline]'),
    function (el) { el.textContent = DEADLINE_DISPLAY; }
  );

  var banner = document.querySelector('.deadline-banner');
  var out    = document.getElementById('deadline-countdown');
  if (!out) return;

  // The countdown text changes at most once per minute; only touch the DOM
  // when the string actually changes so screen readers are not re-notified
  // of identical text every 30 seconds.
  var lastCountdown = null;

  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  // Rewrite the small gold callout cards (.deadline-inline) that also carry a
  // [data-deadline] date. The banner switches to a closed state below, but
  // without this those cards would keep saying "Submissions close soon"
  // after the deadline has passed.
  function closeInlineCallouts() {
    Array.prototype.forEach.call(
      document.querySelectorAll('.deadline-inline'),
      function (box) {
        if (!box.querySelector('[data-deadline]')) return;
        var strong = box.querySelector('strong');
        var span   = box.querySelector('span');
        if (strong) strong.textContent = 'Submissions have closed for this cycle';
        if (span)   span.textContent   = 'The final deadline was ' + DEADLINE_DISPLAY +
                                         '. Watch for the next call for papers.';
      }
    );
  }

  function render() {
    var ms = deadline - new Date();

    if (ms <= 0) {
      var closedText = 'Submissions are now closed';
      if (out.textContent !== closedText) out.textContent = closedText;

      if (banner && !banner.classList.contains('deadline-closed')) {
        banner.classList.add('deadline-closed');
        document.body.classList.add('deadline-passed'); // hook for future CSS/JS
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

      closeInlineCallouts();
      return;
    }

    var mins  = Math.floor(ms / 60000);
    var days  = Math.floor(mins / 1440);
    var hours = Math.floor((mins % 1440) / 60);
    var parts = days > 0
      ? [plural(days, 'day'), plural(hours, 'hour')]
      : [plural(hours, 'hour'), plural(mins % 60, 'minute')];

    var text = parts.join(', ') + ' remaining';
    if (text !== lastCountdown) {
      lastCountdown = text;
      out.textContent = text;
    }
  }

  render();
  setInterval(render, 30000);
})();
