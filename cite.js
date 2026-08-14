/* cite.js — citation widget: reads ScholarlyArticle JSON-LD, renders APA/Chicago/BibTeX with copy buttons */
document.addEventListener('DOMContentLoaded', function () {
  var widget = document.getElementById('cite-widget');
  if (!widget) return;

  var ldScript = document.querySelector('script[type="application/ld+json"]');
  if (!ldScript) return;

  var metadata;
  try {
    metadata = JSON.parse(ldScript.textContent);
  } catch (e) {
    return;
  }
  if (metadata['@type'] !== 'ScholarlyArticle') return;

  function escapeAttr(s) {
    return String(s || '').replace(/"/g, '&quot;');
  }

  function authorList(m) {
    return (m.author || []).map(function (a) { return a.name; });
  }

  function lastFirst(name) {
    var parts = name.trim().split(' ');
    var last = parts.pop();
    return last + ', ' + parts.map(function (p) { return p.charAt(0) + '.'; }).join(' ');
  }

  function formatAPA(m) {
    var authors = authorList(m).map(lastFirst).join(', ');
    var year = (m.datePublished || '').slice(0, 4);
    var journal = (m.isPartOf && m.isPartOf.isPartOf && m.isPartOf.isPartOf.name) || 'Andover Economic Review';
    return authors + ' (' + year + '). ' + m.name + '. ' + journal + '. ' + (m.sameAs || m.url || '');
  }

  function formatChicago(m) {
    var authors = authorList(m).join(', ');
    var year = (m.datePublished || '').slice(0, 4);
    var journal = (m.isPartOf && m.isPartOf.isPartOf && m.isPartOf.isPartOf.name) || 'Andover Economic Review';
    return authors + '. "' + m.name + '." ' + journal + ' (' + year + '). ' + (m.sameAs || m.url || '');
  }

  function formatBibTeX(m) {
    var firstAuthor = authorList(m)[0] || 'Unknown';
    var key = (firstAuthor.split(' ').pop() || 'aer') + ((m.datePublished || '').slice(0, 4));
    var authors = authorList(m).map(lastFirst).join(' and ');
    var year = (m.datePublished || '').slice(0, 4);
    return '@article{' + key.toLowerCase() + ',\n' +
      '  author = {' + authors + '},\n' +
      '  title = {' + m.name + '},\n' +
      '  journal = {Andover Economic Review},\n' +
      '  year = {' + year + '},\n' +
      '  url = {' + (m.sameAs || m.url || '') + '}\n' +
      '}';
  }

  var formats = {
    APA: formatAPA(metadata),
    Chicago: formatChicago(metadata),
    BibTeX: formatBibTeX(metadata)
  };

  widget.innerHTML =
    '<h3>Cite this article</h3>' +
    '<div class="cite-formats">' +
    Object.keys(formats).map(function (name) {
      var text = formats[name];
      return (
        '<div class="cite-format">' +
        '<span class="cite-label">' + name + '</span>' +
        '<code class="cite-text">' + text.replace(/</g, '&lt;') + '</code>' +
        '<button class="cite-copy btn btn-ghost" data-text="' + escapeAttr(text) + '">Copy</button>' +
        '</div>'
      );
    }).join('') +
    '</div>';

  widget.querySelectorAll('.cite-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(btn.dataset.text).then(function () {
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
      });
    });
  });
});
