#!/usr/bin/env bash
# Quick-win a11y fixes for andoverecon.org (findings #2-8 from audit)
# lab.html focus-visible/outline:none (#1, Critical) is skipped — needs manual review of 5 sites.
set -euo pipefail
cd "$(dirname "$0")"

# 4. Contrast fixes
perl -pi -e 's/--gold-light: #b8a94a;/--gold-light: #8c7d2f;/' style.css
perl -0pi -e 's/(\.footer-bottom \{[^}]*color: rgba\(255,255,255,)0\.4(\);)/${1}0.6${2}/s' style.css
perl -0pi -e 's/(\.lightbox-counter \{[^}]*color: rgba\(255, 255, 255, )0\.4(\);)/${1}0.6${2}/s' style.css
perl -0pi -e 's/(\.lightbox-credit \{[^}]*color: rgba\(255, 255, 255, )0\.3(\);)/${1}0.55${2}/s' style.css
perl -pi -e 's/color:#888; font-weight:600;/color:#666; font-weight:600;/' aes_template.html
perl -0pi -e 's/(\.fn-bar-text \{[^}]*color: rgba\(255,255,255,)0\.4(\);)/${1}0.6${2}/s' fed_challenge.html
perl -0pi -e 's/(\.script-end-marker \{[^}]*color: rgba\(255,255,255,)0\.18(\);)/${1}0.55${2}/s' fed_challenge.html

# 2 & 5. submit.html status messages + labels + Other-field labels
perl -pi -e 's/<div class="form-status success" id="status-success" style="display:none;">/<div class="form-status success" id="status-success" role="status" aria-live="polite" style="display:none;">/' submit.html
perl -pi -e 's/<div class="form-status error" id="status-error" style="display:none;">/<div class="form-status error" id="status-error" role="alert" aria-live="assertive" style="display:none;">/' submit.html

perl -0pi -e 's/(<input type="text" id="referral-other")/<label class="form-label" for="referral-other" id="referral-other-label" style="display:none;">Please specify<\/label>\n            ${1}/' submit.html
perl -0pi -e 's/(<input type="text" id="field-other")/<label class="form-label" for="field-other" id="field-other-label" style="display:none;">Please specify<\/label>\n              ${1}/' submit.html
perl -pi -e "s/fieldOther\.style\.display = isOther \? 'block' : 'none';/fieldOther.style.display = isOther ? 'block' : 'none';\n      document.getElementById('field-other-label').style.display = isOther ? 'block' : 'none';/" submit.html
perl -pi -e "s/referralOther\.style\.display = isOther \? 'block' : 'none';/referralOther.style.display = isOther ? 'block' : 'none';\n      document.getElementById('referral-other-label').style.display = isOther ? 'block' : 'none';/" submit.html

# 6. Gallery card title div -> h3
perl -pi -e 's/<div class="gallery-card-title">\$\{safe_title\}<\/div>/<h3 class="gallery-card-title">\${safe_title}<\/h3>/' gallery.html

# 7. Gallery filter buttons aria-pressed
perl -pi -e "s/(\s+)b\.classList\.remove\('active'\);/\$1b.classList.remove('active');\n\$1b.setAttribute('aria-pressed', 'false');/" gallery.html
perl -pi -e "s/(\s+)btn\.classList\.add\('active'\);/\$1btn.classList.add('active');\n\$1btn.setAttribute('aria-pressed', 'true');/" gallery.html

# 8. Journal logo -> decorative
perl -pi -e 's/alt="Andover Economic Review" style="height:58px/alt="" style="height:58px/' journal.html

# 9. index.html decorative ordinals
perl -pi -e 's/<span class="hero-split-index-num">(0[123])<\/span>/<span class="hero-split-index-num" aria-hidden="true">$1<\/span>/' index.html

echo "Done. Review diffs with: git diff"
