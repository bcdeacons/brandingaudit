/**
 * Branding Audit Widget
 * Drop-in embeddable script — mirrors the Website Audit panel architecture.
 * Config: window.baConfig = { ajaxUrl: '...', nonce: '...', action: '...' }
 */
(function (window, document) {
  'use strict';

  var cfg = window.baConfig || {};
  var BRAND_ORANGE = '#f07c44';
  var BRAND_ORANGE_HOVER = '#d96e3d';

  /* ─── Styles ─────────────────────────────────────────────────────────── */
  var CSS = [
    '#ba-btn{',
      'position:fixed;bottom:24px;right:92px;z-index:999998;',
      'width:52px;height:52px;border-radius:50%;background:' + BRAND_ORANGE + ';',
      'color:#fff;border:none;cursor:pointer;',
      'box-shadow:0 4px 18px rgba(0,0,0,.28);',
      'display:flex;align-items:center;justify-content:center;',
      'transition:transform .2s,background .2s;padding:0;',
    '}',
    '#ba-btn:hover{background:' + BRAND_ORANGE_HOVER + ';transform:scale(1.07)}',
    '#ba-panel{',
      'position:fixed;top:0;right:-430px;width:410px;height:100vh;',
      'background:#fff;z-index:999999;',
      'box-shadow:-4px 0 28px rgba(0,0,0,.16);',
      'display:flex;flex-direction:column;',
      'transition:right .32s cubic-bezier(.4,0,.2,1);',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
      'font-size:13px;color:#1e293b;line-height:1.4;',
    '}',
    '#ba-panel.ba-open{right:0}',
    '#ba-header{',
      'padding:14px 18px;background:' + BRAND_ORANGE + ';color:#fff;',
      'display:flex;align-items:center;justify-content:space-between;flex-shrink:0;',
    '}',
    '#ba-header h2{margin:0;font-size:15px;font-weight:700;letter-spacing:-.2px}',
    '#ba-close{',
      'background:none;border:none;color:#fff;cursor:pointer;',
      'font-size:20px;line-height:1;padding:0 0 0 8px;opacity:.75;',
    '}',
    '#ba-close:hover{opacity:1}',
    '#ba-url-bar{',
      'padding:10px 18px;background:#fff7f2;border-bottom:1px solid #e2e8f0;flex-shrink:0;',
    '}',
    '#ba-url-bar label{display:block;font-size:11px;font-weight:600;color:#64748b;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px}',
    '#ba-url-input{',
      'width:100%;box-sizing:border-box;',
      'border:1px solid #cbd5e1;border-radius:6px;',
      'padding:7px 10px;font-size:12px;',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
      'color:#1e293b;background:#fff;outline:none;',
    '}',
    '#ba-url-input:focus{border-color:' + BRAND_ORANGE + ';box-shadow:0 0 0 3px rgba(240,124,68,.15)}',
    '#ba-score-bar{',
      'padding:14px 18px;background:#fffaf7;border-bottom:1px solid #e2e8f0;',
      'display:flex;align-items:center;gap:14px;flex-shrink:0;',
    '}',
    '.ba-score-circle{',
      'width:54px;height:54px;border-radius:50%;',
      'display:flex;align-items:center;justify-content:center;',
      'font-size:20px;font-weight:800;color:#fff;flex-shrink:0;',
    '}',
    '.ba-score-circle.good{background:#22c55e}',
    '.ba-score-circle.warn{background:#f59e0b}',
    '.ba-score-circle.bad{background:#ef4444}',
    '.ba-score-circle.neutral{background:#94a3b8}',
    '.ba-overall-info{flex:1;min-width:0}',
    '.ba-overall-info strong{display:block;font-size:13px;font-weight:700;margin-bottom:2px}',
    '.ba-overall-info span{color:#64748b;font-size:11.5px}',
    '#ba-run-btn{',
      'padding:7px 13px;background:' + BRAND_ORANGE + ';color:#fff;border:none;',
      'border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;',
      'white-space:nowrap;flex-shrink:0;',
    '}',
    '#ba-run-btn:hover{background:' + BRAND_ORANGE_HOVER + '}',
    '#ba-run-btn:disabled{opacity:.55;cursor:default}',
    '#ba-body{overflow-y:auto;flex:1;padding:8px 0}',
    '.ba-section{margin-bottom:2px}',
    '.ba-section-header{',
      'display:flex;align-items:center;gap:8px;',
      'padding:10px 18px;cursor:pointer;user-select:none;',
      'border-left:3px solid transparent;',
    '}',
    '.ba-section-header:hover{background:#fff7f2}',
    '.ba-section-header.good{border-color:#22c55e}',
    '.ba-section-header.warn{border-color:#f59e0b}',
    '.ba-section-header.bad{border-color:#ef4444}',
    '.ba-section-header.neutral{border-color:#94a3b8}',
    '.ba-section-icon{font-size:15px}',
    '.ba-section-name{flex:1;font-weight:600;font-size:13px}',
    '.ba-section-score{',
      'font-size:11px;font-weight:700;padding:2px 8px;',
      'border-radius:12px;color:#fff;',
    '}',
    '.ba-section-score.good{background:#22c55e}',
    '.ba-section-score.warn{background:#f59e0b}',
    '.ba-section-score.bad{background:#ef4444}',
    '.ba-chevron{font-size:9px;color:#94a3b8;transition:transform .2s;margin-left:2px}',
    '.ba-section-header.expanded .ba-chevron{transform:rotate(90deg)}',
    '.ba-section-body{display:none;padding:2px 18px 12px}',
    '.ba-section-body.visible{display:block}',
    '.ba-check{',
      'display:flex;align-items:flex-start;gap:8px;',
      'padding:6px 0;border-bottom:1px solid #f1f5f9;',
    '}',
    '.ba-check:last-child{border-bottom:none}',
    '.ba-check-icon{font-size:13px;flex-shrink:0;margin-top:1px}',
    '.ba-check-text{flex:1;min-width:0}',
    '.ba-check-title{font-weight:600;font-size:12px;color:#1e293b}',
    '.ba-check-detail{color:#64748b;font-size:11.5px;margin-top:1px}',
    '.ba-palette-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}',
    '.ba-swatch{',
      'width:20px;height:20px;border-radius:4px;',
      'border:1px solid rgba(0,0,0,.12);flex-shrink:0;',
    '}',
    '.ba-tag-row{display:flex;gap:4px;flex-wrap:wrap;margin-top:5px}',
    '.ba-tag{',
      'font-size:10.5px;padding:2px 7px;border-radius:10px;',
      'background:#f1f5f9;color:#475569;font-weight:500;',
    '}',
    '#ba-footer{',
      'padding:9px 18px;border-top:1px solid #e2e8f0;',
      'font-size:10.5px;color:#94a3b8;text-align:center;flex-shrink:0;',
    '}',
    '.ba-spinner{',
      'display:inline-block;width:12px;height:12px;',
      'border:2px solid rgba(255,255,255,.4);border-top-color:#fff;',
      'border-radius:50%;animation:ba-spin .6s linear infinite;',
      'vertical-align:middle;margin-right:5px;',
    '}',
    '@keyframes ba-spin{to{transform:rotate(360deg)}}',
    '@media(max-width:440px){#ba-panel{width:100vw}}',
  ].join('');

  /* ─── Helpers ────────────────────────────────────────────────────────── */
  function scoreClass(n) {
    return n >= 80 ? 'good' : n >= 50 ? 'warn' : 'bad';
  }

  function makeChecker(checks, ptsRef) {
    return function check(label, pass, warn, detail, weight) {
      weight = weight || 10;
      ptsRef.total += weight;
      if (pass) ptsRef.earned += weight;
      else if (warn) ptsRef.earned += weight / 2;
      checks.push({
        pass: pass ? 'pass' : warn ? 'warn' : 'fail',
        label: label,
        detail: detail
      });
    };
  }

  function textOf(el) {
    return el ? el.textContent.trim() : '';
  }

  function attrOf(el, attr) {
    return el ? (el.getAttribute(attr) || '') : '';
  }

  function getCleanAuditDoc() {
    var clone = document.documentElement.cloneNode(true);
    var parser = new DOMParser();
    var cleanDoc = parser.parseFromString(clone.outerHTML, 'text/html');

    var nodes = cleanDoc.querySelectorAll(
      '#ba-btn, #ba-panel, #ba-widget-style, [data-ba-ignore="true"]'
    );

    for (var i = 0; i < nodes.length; i++) {
      nodes[i].remove();
    }

    return cleanDoc;
  }

  /* ─── Audit: Brand Identity ──────────────────────────────────────────── */
  function auditIdentity(doc) {
    var checks = [];
    var pts = { earned: 0, total: 0 };
    var check = makeChecker(checks, pts);

    var favicon = doc.querySelector(
      'link[rel="icon"],link[rel="shortcut icon"],link[rel="apple-touch-icon"]'
    );
    check(
      'Favicon',
      !!favicon,
      false,
      favicon
        ? 'Favicon found: ' + attrOf(favicon, 'href').slice(0, 60)
        : 'No favicon link found — add <link rel="icon"> for brand recognition in browser tabs',
      12
    );

    var appleIcon = doc.querySelector('link[rel="apple-touch-icon"]');
    check(
      'Apple Touch Icon',
      !!appleIcon,
      false,
      appleIcon
        ? 'apple-touch-icon present: ' + attrOf(appleIcon, 'href').slice(0, 50)
        : 'No apple-touch-icon — add one so your brand looks great on iOS home screens',
      8
    );

    var themeColor = doc.querySelector('meta[name="theme-color"]');
    check(
      'Theme color meta',
      !!themeColor,
      false,
      themeColor
        ? 'theme-color = "' + attrOf(themeColor, 'content') + '"'
        : 'No <meta name="theme-color"> — set your brand color for mobile browser chrome',
      8
    );

    var logoSelectors = [
      'header img', '.header img', '#header img',
      '.navbar img', '.nav-logo img', '.site-header img',
      'img.logo', 'img[class*="logo"]', 'img[id*="logo"]',
      'img[alt*="logo" i]', 'img[src*="logo" i]',
      'header svg', '.header svg', 'svg.logo', 'svg[class*="logo"]',
      'a[class*="logo"] img', 'a[id*="logo"] img',
      '.brand img', '.brand svg'
    ].join(',');

    var logoEl = doc.querySelector(logoSelectors);
    check(
      'Logo in header',
      !!logoEl,
      false,
      logoEl
        ? 'Logo element found in header/nav area'
        : 'No logo detected in header — ensure your logo is in a <header> or .navbar element',
      12
    );

    var siteNameEl = doc.querySelector('meta[property="og:site_name"]');
    var siteName = attrOf(siteNameEl, 'content');
    check(
      'og:site_name',
      !!siteName,
      false,
      siteName
        ? 'og:site_name = "' + siteName + '"'
        : 'Missing og:site_name — add it so social cards show your brand name',
      8
    );

    var schemas = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    var hasOrgSchema = schemas.some(function (s) {
      try {
        var data = JSON.parse(s.textContent);
        var types = [].concat(data['@type'] || []);
        return types.some(function (t) {
          return /organization|localbusiness|brand|corporation/i.test(t);
        });
      } catch (e) {
        return false;
      }
    });

    check(
      'Schema.org Organization markup',
      hasOrgSchema,
      false,
      hasOrgSchema
        ? 'Organization/LocalBusiness JSON-LD found'
        : 'No Organization schema — add Schema.org Organization markup with name, logo, and url',
      10
    );

    return { score: Math.round((pts.earned / pts.total) * 100), checks: checks };
  }

  /* ─── Audit: Brand Messaging ─────────────────────────────────────────── */
  function auditMessaging(doc) {
    var checks = [];
    var pts = { earned: 0, total: 0 };
    var check = makeChecker(checks, pts);

    var h1s = doc.querySelectorAll('h1');
    var h1Text = h1s.length > 0 ? textOf(h1s[0]) : '';
    check(
      'Brand headline (H1)',
      h1s.length === 1 && h1Text.length >= 10,
      h1s.length > 0 && h1Text.length > 0,
      h1s.length === 0
        ? 'No H1 found — add a clear headline that communicates your brand value'
        : h1Text.length < 10
          ? 'H1 is very short: "' + h1Text + '" — expand into a compelling brand statement'
          : '"' + h1Text.slice(0, 65) + (h1Text.length > 65 ? '…' : '') + '"',
      12
    );

    var h2s = doc.querySelectorAll('h2');
    var tagline = h2s.length > 0 ? textOf(h2s[0]) : '';
    check(
      'Subheadline / tagline',
      !!tagline && tagline.length >= 8,
      !!tagline,
      tagline
        ? '"' + tagline.slice(0, 65) + (tagline.length > 65 ? '…' : '') + '"'
        : 'No H2 found — add a supporting tagline beneath your headline',
      8
    );

    var CTA_RE = /get started|sign up|contact us|buy now|book( a| now)?|try( it)? free|free trial|learn more|get (a )?quote|request (a )?demo|schedule|subscribe|download|join now|start (a |your )?free/i;
    var allLinks = Array.from(doc.querySelectorAll('a,button'));
    var ctaEls = allLinks.filter(function (el) {
      return CTA_RE.test(textOf(el));
    });

    check(
      'Call-to-action (CTA)',
      ctaEls.length >= 2,
      ctaEls.length >= 1,
      ctaEls.length === 0
        ? 'No clear CTA text found — add buttons like “Get Started” or “Contact Us”'
        : ctaEls.length + ' CTA element(s) found: ' +
          ctaEls.slice(0, 3).map(function (el) {
            return '“' + textOf(el).slice(0, 25) + '”';
          }).join(', '),
      12
    );

    var bodyText = textOf(doc.body || doc.documentElement);
    var phoneFound = /(\+?1[\s.\-]?)?(\(?\d{3}\)?[\s.\-]?)\d{3}[\s.\-]?\d{4}/.test(bodyText);
    var emailFound = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(bodyText);

    check(
      'Contact info in content',
      phoneFound && emailFound,
      phoneFound || emailFound,
      (phoneFound ? '✓ Phone number ' : '✗ No phone ') +
      '  ' +
      (emailFound ? '✓ Email address ' : '✗ No email ') +
      '— visible contact details build trust',
      10
    );

    var paras = Array.from(doc.querySelectorAll('p'));
    var hasValueProp = paras.some(function (p) {
      var t = textOf(p);
      return t.length >= 80;
    });

    check(
      'Value proposition copy',
      hasValueProp,
      false,
      hasValueProp
        ? 'Descriptive paragraph copy found — good for communicating brand value'
        : 'No substantial paragraph found — add copy explaining what you do and for whom',
      10
    );

    return { score: Math.round((pts.earned / pts.total) * 100), checks: checks };
  }

  /* ─── Audit: Visual Consistency ─────────────────────────────────────── */
  function auditVisual(doc) {
    var checks = [];
    var pts = { earned: 0, total: 0 };
    var check = makeChecker(checks, pts);
    var palette = [];

    var FONT_PROVIDERS = [
      { pattern: 'fonts.googleapis.com', label: 'Google Fonts' },
      { pattern: 'fonts.bunny.net', label: 'Bunny Fonts' },
      { pattern: 'use.typekit.net', label: 'Adobe Fonts' },
      { pattern: 'cloud.typography.com', label: 'H&Co Fonts' },
      { pattern: 'use.fontawesome.com', label: 'Font Awesome' },
      { pattern: 'rsms.me/inter', label: 'Inter (rsms)' }
    ];

    var fontLinks = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    var foundFonts = [];

    FONT_PROVIDERS.forEach(function (fp) {
      var match = fontLinks.find(function (l) {
        return (l.getAttribute('href') || '').indexOf(fp.pattern) !== -1;
      });
      if (match) foundFonts.push(fp.label);
    });

    var styleEls = Array.from(doc.querySelectorAll('style'));
    styleEls.forEach(function (s) {
      FONT_PROVIDERS.forEach(function (fp) {
        if (s.textContent.indexOf(fp.pattern) !== -1 && foundFonts.indexOf(fp.label) === -1) {
          foundFonts.push(fp.label);
        }
      });
    });

    check(
      'Custom web fonts',
      foundFonts.length >= 1,
      false,
      foundFonts.length > 0
        ? 'Font(s) loaded: ' + foundFonts.join(', ')
        : 'No web font provider detected — consider a custom font to reinforce brand identity',
      8
    );

    var fontFamilyMatches = [];
    styleEls.forEach(function (s) {
      var matches = s.textContent.match(/font-family\s*:\s*([^;}{]+)/gi) || [];
      matches.forEach(function (m) {
        var val = m.replace(/font-family\s*:\s*/i, '').trim().split(',')[0].trim().replace(/['"]/g, '');
        if (val && fontFamilyMatches.indexOf(val) === -1) fontFamilyMatches.push(val);
      });
    });

    var distinctFonts = fontFamilyMatches.length;
    check(
      'Font family count',
      distinctFonts <= 3,
      distinctFonts <= 5,
      distinctFonts === 0
        ? 'Could not detect inline font-family declarations'
        : distinctFonts + ' distinct font-family value(s) detected (ideal ≤ 3 for brand consistency)',
      8
    );

    var hasCSSVars = styleEls.some(function (s) {
      return s.textContent.indexOf('--') !== -1 && s.textContent.indexOf('var(--') !== -1;
    });

    check(
      'CSS custom properties (design tokens)',
      hasCSSVars,
      false,
      hasCSSVars
        ? 'CSS custom properties (--variables) found — good use of design tokens'
        : 'No CSS custom properties found — consider --color-brand variables for brand consistency',
      8
    );

    var inlineStyles = doc.querySelectorAll('[style]');
    check(
      'Inline style usage',
      inlineStyles.length < 15,
      inlineStyles.length < 60,
      inlineStyles.length === 0
        ? 'No inline styles — excellent use of CSS classes'
        : inlineStyles.length + ' element(s) have inline styles — move to CSS classes for consistency',
      6
    );

    var themeColor = doc.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      var tc = attrOf(themeColor, 'content');
      if (tc) palette.push(tc);
    }

    styleEls.forEach(function (s) {
      var rootBlock = s.textContent.match(/:root\s*\{([^}]+)\}/);
      if (!rootBlock) return;

      var varMatches = rootBlock[1].match(/--[a-z\-]*(color|primary|brand|accent|secondary)[^:]*:\s*(#[0-9a-fA-F]{3,8}|rgb[^;]+|hsl[^;]+)/gi) || [];
      varMatches.slice(0, 8).forEach(function (m) {
        var val = m.split(':').slice(1).join(':').trim().replace(/;$/, '');
        if (val && palette.indexOf(val) === -1) palette.push(val);
      });
    });

    check(
      'Brand color palette defined',
      palette.length >= 1,
      false,
      palette.length > 0
        ? palette.length + ' brand color(s) detected via CSS variables or theme-color'
        : 'No brand colors found in CSS variables — define --color-primary etc. in :root',
      8
    );

    var ogImage = doc.querySelector('meta[property="og:image"]');
    check(
      'Social share image (og:image)',
      !!ogImage,
      false,
      ogImage
        ? 'og:image = "' + attrOf(ogImage, 'content').slice(0, 55) + (attrOf(ogImage, 'content').length > 55 ? '…' : '') + '"'
        : 'No og:image — add a branded 1200×630 image for social shares',
      10
    );

    return { score: Math.round((pts.earned / pts.total) * 100), checks: checks, palette: palette };
  }

  /* ─── Audit: Social Presence ─────────────────────────────────────────── */
  function auditSocial(doc) {
    var checks = [];
    var pts = { earned: 0, total: 0 };
    var check = makeChecker(checks, pts);

    var SOCIAL_MAP = {
      'facebook.com': 'Facebook',
      'twitter.com': 'Twitter',
      'x.com': 'X (Twitter)',
      'instagram.com': 'Instagram',
      'linkedin.com': 'LinkedIn',
      'youtube.com': 'YouTube',
      'tiktok.com': 'TikTok',
      'pinterest.com': 'Pinterest',
      'threads.net': 'Threads'
    };

    var allLinks = Array.from(doc.querySelectorAll('a[href]'));
    var foundNetworks = [];

    Object.keys(SOCIAL_MAP).forEach(function (domain) {
      var found = allLinks.some(function (a) {
        return (a.getAttribute('href') || '').indexOf(domain) !== -1;
      });
      if (found) foundNetworks.push(SOCIAL_MAP[domain]);
    });

    check(
      'Social media links',
      foundNetworks.length >= 3,
      foundNetworks.length >= 1,
      foundNetworks.length === 0
        ? 'No social media links found — link to your profiles to build audience connection'
        : foundNetworks.length + ' platform(s): ' + foundNetworks.join(', '),
      12
    );

    var ogTitle = doc.querySelector('meta[property="og:title"]');
    var ogDesc = doc.querySelector('meta[property="og:description"]');
    var ogImage = doc.querySelector('meta[property="og:image"]');
    var ogType = doc.querySelector('meta[property="og:type"]');
    var ogUrl = doc.querySelector('meta[property="og:url"]');

    var ogScore = [ogTitle, ogDesc, ogImage, ogType, ogUrl].filter(Boolean).length;
    var ogMissing = [];
    if (!ogTitle) ogMissing.push('og:title');
    if (!ogDesc) ogMissing.push('og:description');
    if (!ogImage) ogMissing.push('og:image');
    if (!ogType) ogMissing.push('og:type');
    if (!ogUrl) ogMissing.push('og:url');

    check(
      'Open Graph completeness',
      ogScore === 5,
      ogScore >= 3,
      ogScore === 5
        ? 'All 5 core OG tags present (title, description, image, type, url)'
        : 'Missing: ' + ogMissing.join(', '),
      12
    );

    var twitterCard = doc.querySelector('meta[name="twitter:card"]');
    var twitterImage = doc.querySelector('meta[name="twitter:image"]');
    check(
      'Twitter / X Card',
      !!twitterCard && !!twitterImage,
      !!twitterCard,
      twitterCard
        ? 'twitter:card = "' + attrOf(twitterCard, 'content') + '"' + (twitterImage ? '' : ' — add twitter:image for richer cards')
        : 'No twitter:card — add meta tags for better X/Twitter share appearance',
      10
    );

    var schemas = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    var hasSameAs = schemas.some(function (s) {
      try {
        var data = JSON.parse(s.textContent);
        return Array.isArray(data.sameAs) && data.sameAs.length > 0;
      } catch (e) {
        return false;
      }
    });

    check(
      'Schema.org sameAs (social profiles)',
      hasSameAs,
      false,
      hasSameAs
        ? 'sameAs array found in JSON-LD — search engines link your social profiles to your brand'
        : 'No sameAs in Schema.org — add your social URLs to the Organization sameAs array',
      8
    );

    return { score: Math.round((pts.earned / pts.total) * 100), checks: checks, networks: foundNetworks };
  }

  /* ─── Audit: Trust Signals ───────────────────────────────────────────── */
  function auditTrust(doc) {
    var checks = [];
    var pts = { earned: 0, total: 0 };
    var check = makeChecker(checks, pts);

    var allLinks = Array.from(doc.querySelectorAll('a[href]'));
    var bodyText = textOf(doc.body || doc.documentElement);

    var privacyLink = allLinks.find(function (a) {
      return /privacy/i.test(textOf(a)) || /privacy/i.test(a.getAttribute('href') || '');
    });
    check(
      'Privacy policy link',
      !!privacyLink,
      false,
      privacyLink
        ? 'Privacy link found: "' + textOf(privacyLink).slice(0, 40) + '"'
        : 'No privacy policy link — required for GDPR/CCPA compliance and user trust',
      12
    );

    var termsLink = allLinks.find(function (a) {
      return /terms|conditions/i.test(textOf(a)) || /terms|conditions/i.test(a.getAttribute('href') || '');
    });
    check(
      'Terms of service link',
      !!termsLink,
      false,
      termsLink
        ? 'Terms link found: "' + textOf(termsLink).slice(0, 40) + '"'
        : 'No terms of service link — important for setting user expectations',
      10
    );

    var hasCopyright = /©|&copy;|copyright/i.test(bodyText);
    check(
      'Copyright notice',
      hasCopyright,
      false,
      hasCopyright
        ? 'Copyright notice found in page content'
        : 'No copyright notice found — add © [Year] [Brand Name] to your footer',
      8
    );

    var aboutLink = allLinks.find(function (a) {
      return /\babout\b/i.test(textOf(a)) || /\/about/i.test(a.getAttribute('href') || '');
    });
    check(
      'About page link',
      !!aboutLink,
      false,
      aboutLink
        ? 'About link found: "' + textOf(aboutLink).slice(0, 40) + '"'
        : 'No about/company page link found — helps visitors understand who you are',
      8
    );

    var contactLink = allLinks.find(function (a) {
      return /\bcontact\b/i.test(textOf(a)) || /\/contact/i.test(a.getAttribute('href') || '');
    });
    check(
      'Contact page link',
      !!contactLink,
      false,
      contactLink
        ? 'Contact link found: "' + textOf(contactLink).slice(0, 40) + '"'
        : 'No contact page link — visitors need a clear way to reach you',
      10
    );

    var canonicalUrl =
      attrOf(doc.querySelector('link[rel="canonical"]'), 'href') ||
      attrOf(doc.querySelector('meta[property="og:url"]'), 'content') ||
      '';

    var protocol = canonicalUrl.indexOf('https://') === 0 ? 'https:' :
      canonicalUrl.indexOf('http://') === 0 ? 'http:' :
      window.location.protocol;

    check(
      'Served over HTTPS',
      protocol === 'https:',
      false,
      protocol === 'https:'
        ? 'Site is served over HTTPS — builds user trust and protects data'
        : 'Not HTTPS — switch immediately; browsers flag HTTP sites as “Not Secure”',
      12
    );

    var PROOF_RE = /testimonial|review|rating|star|\btrust\b|client|customer|case study|award/i;
    var hasProof = PROOF_RE.test(bodyText) ||
      !!doc.querySelector('[class*="testimonial"],[class*="review"],[class*="rating"],[class*="trust"],[itemtype*="Review"]');

    check(
      'Social proof / testimonials',
      hasProof,
      false,
      hasProof
        ? 'Social proof content or markup found on the page'
        : 'No testimonials, reviews, or ratings found — add social proof to build brand credibility',
      10
    );

    return { score: Math.round((pts.earned / pts.total) * 100), checks: checks };
  }

  /* ─── Global open function ───────────────────────────────────────────── */
  window.baOpenPanel = function () {
    var panel = document.getElementById('ba-panel');
    if (panel) {
      panel.classList.add('ba-open');
      setTimeout(function () {
        var input = document.getElementById('ba-url-input');
        if (input) input.focus();
      }, 100);
    }
  };

  /* ─── UI ─────────────────────────────────────────────────────────────── */
  function buildUI() {
    if (document.getElementById('ba-panel')) return;

    var style = document.createElement('style');
    style.id = 'ba-widget-style';
    style.setAttribute('data-ba-ignore', 'true');
    style.textContent = CSS;
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.id = 'ba-btn';
    btn.setAttribute('data-ba-ignore', 'true');
    btn.setAttribute('aria-label', 'Open Branding Audit');
    btn.title = 'Branding Audit';
    btn.innerHTML = '&#127775;';
    btn.addEventListener('click', function () {
      window.baOpenPanel();
    });
    document.body.appendChild(btn);

    var panel = document.createElement('div');
    panel.id = 'ba-panel';
    panel.setAttribute('data-ba-ignore', 'true');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Branding Audit Panel');
    panel.innerHTML = [
      '<div id="ba-header">',
        '<div><h2>&#127775; Branding Audit</h2></div>',
        '<button id="ba-close" aria-label="Close branding audit panel">&#x2715;</button>',
      '</div>',
      '<div id="ba-url-bar">',
        '<label for="ba-url-input">URL to audit</label>',
        '<input type="url" id="ba-url-input" placeholder="https://" autocomplete="off">',
      '</div>',
      '<div id="ba-score-bar">',
        '<div class="ba-score-circle neutral" id="ba-overall-score">?</div>',
        '<div class="ba-overall-info">',
          '<strong id="ba-overall-label">Ready to audit</strong>',
          '<span id="ba-overall-sub">Enter a URL above and click Run Audit</span>',
        '</div>',
        '<button id="ba-run-btn">Run Audit</button>',
      '</div>',
      '<div id="ba-body">',
        '<div id="ba-placeholder" style="padding:48px 20px;text-align:center;color:#94a3b8" data-ba-ignore="true">',
          '<div style="font-size:40px;margin-bottom:14px">&#127775;</div>',
          '<div style="font-weight:700;font-size:14px;color:#475569;margin-bottom:6px">No results yet</div>',
          '<div style="font-size:12px;line-height:1.6">Enter any URL or audit the current page,<br>then click <strong>Run Audit</strong>.</div>',
        '</div>',
      '</div>',
      '<div id="ba-footer">Branding Audit &bull; Identity, Messaging, Visual, Social &amp; Trust</div>',
    ].join('');
    document.body.appendChild(panel);

    document.getElementById('ba-url-input').value = window.location.href;

    document.getElementById('ba-close').addEventListener('click', function () {
      panel.classList.remove('ba-open');
    });

    document.getElementById('ba-run-btn').addEventListener('click', onRunAudit);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') panel.classList.remove('ba-open');
    });

    document.getElementById('ba-body').addEventListener('click', function (e) {
      var header = e.target.closest('.ba-section-header');
      if (!header) return;

      var key = header.getAttribute('data-section');
      var bodyEl = document.getElementById('ba-body-' + key);
      if (bodyEl) {
        bodyEl.classList.toggle('visible');
        header.classList.toggle('expanded');
      }
    });
  }

  function normalizeUrl(url) {
    url = (url || '').trim();
    if (url && url.indexOf('http') !== 0) url = 'https://' + url;
    return url;
  }

  function isSameOrigin(url) {
    try {
      var a = document.createElement('a');
      a.href = url;
      return a.hostname === window.location.hostname;
    } catch (e) {
      return false;
    }
  }

  function onRunAudit() {
    var runBtn = document.getElementById('ba-run-btn');
    var urlInput = document.getElementById('ba-url-input');
    var inputUrl = normalizeUrl(urlInput ? urlInput.value : window.location.href);

    runBtn.disabled = true;
    runBtn.innerHTML = '<span class="ba-spinner"></span>Auditing…';

    if (!inputUrl || isSameOrigin(inputUrl)) {
      setTimeout(function () {
        try {
          var cleanDoc = getCleanAuditDoc();
          runAuditOnDoc(cleanDoc, inputUrl || window.location.href);
        } catch (err) {
          console.error('[BrandingAudit]', err);
          showError('Audit failed: ' + err.message);
        }
        runBtn.disabled = false;
        runBtn.textContent = 'Re-run Audit';
      }, 60);
    } else {
      fetchAndAudit(inputUrl, runBtn);
    }
  }

  function fetchAndAudit(url, runBtn) {
    if (!cfg.ajaxUrl) {
      showError('Remote URL auditing is not configured. Please contact the site administrator.');
      runBtn.disabled = false;
      runBtn.textContent = 'Re-run Audit';
      return;
    }

    var data = new FormData();
    data.append('action', cfg.action || 'ba_fetch_url');
    data.append('nonce', cfg.nonce || '');
    data.append('url', url);

    fetch(cfg.ajaxUrl, { method: 'POST', body: data })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.success) throw new Error(json.data || 'Failed to fetch URL');
        var parser = new DOMParser();
        var doc = parser.parseFromString(json.data, 'text/html');
        runAuditOnDoc(doc, url);
      })
      .catch(function (err) {
        showError('Could not fetch "' + url + '": ' + err.message);
        console.error('[BrandingAudit]', err);
      })
      .finally(function () {
        runBtn.disabled = false;
        runBtn.textContent = 'Re-run Audit';
      });
  }

  function runAuditOnDoc(doc, url) {
    var results = {
      identity: auditIdentity(doc),
      messaging: auditMessaging(doc),
      visual: auditVisual(doc),
      social: auditSocial(doc),
      trust: auditTrust(doc)
    };
    renderResults(results, url);
  }

  function showError(msg) {
    var body = document.getElementById('ba-body');
    if (body) {
      body.innerHTML =
        '<div style="padding:32px 20px;text-align:center;color:#ef4444;font-size:13px">' +
        '<div style="font-size:32px;margin-bottom:10px">&#9888;&#65039;</div>' +
        '<div>' + msg + '</div></div>';
    }
  }

  function renderResults(results, auditedUrl) {
    var sections = [
      { key: 'identity', label: 'Identity', icon: '&#127981;' },
      { key: 'messaging', label: 'Messaging', icon: '&#128172;' },
      { key: 'visual', label: 'Visual', icon: '&#127912;' },
      { key: 'social', label: 'Social', icon: '&#128241;' },
      { key: 'trust', label: 'Trust', icon: '&#9989;' }
    ];

    var totalScore = sections.reduce(function (s, sec) {
      return s + results[sec.key].score;
    }, 0);

    var avg = Math.round(totalScore / sections.length);

    var scoreCircle = document.getElementById('ba-overall-score');
    scoreCircle.textContent = avg;
    scoreCircle.className = 'ba-score-circle ' + scoreClass(avg);

    var allChecks = sections.reduce(function (acc, s) {
      return acc.concat(results[s.key].checks);
    }, []);

    var passed = allChecks.filter(function (c) { return c.pass === 'pass'; }).length;
    var warned = allChecks.filter(function (c) { return c.pass === 'warn'; }).length;
    var failed = allChecks.filter(function (c) { return c.pass === 'fail'; }).length;

    document.getElementById('ba-overall-label').textContent =
      avg >= 80 ? 'Strong brand presence!' :
      avg >= 50 ? 'Brand needs improvement' :
      'Brand consistency issues found';

    document.getElementById('ba-overall-sub').textContent =
      passed + ' passed · ' + warned + ' warnings · ' + failed + ' failed';

    var footer = document.getElementById('ba-footer');
    if (footer && auditedUrl) {
      footer.textContent = 'Audited: ' + auditedUrl.replace(/^https?:\/\//, '').slice(0, 50);
    }

    var body = document.getElementById('ba-body');
    body.innerHTML = '';

    sections.forEach(function (sec) {
      var data = results[sec.key];
      var cls = scoreClass(data.score);

      var checksHTML = data.checks.map(function (c) {
        var icon = c.pass === 'pass' ? '&#9989;' : c.pass === 'warn' ? '&#9888;&#65039;' : '&#10060;';
        return [
          '<div class="ba-check">',
            '<span class="ba-check-icon">' + icon + '</span>',
            '<div class="ba-check-text">',
              '<div class="ba-check-title">' + c.label + '</div>',
              '<div class="ba-check-detail">' + c.detail + '</div>',
            '</div>',
          '</div>'
        ].join('');
      }).join('');

      if (sec.key === 'visual' && data.palette && data.palette.length > 0) {
        checksHTML += '<div style="margin-top:8px;font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.4px">Detected Brand Colors</div>';
        checksHTML += '<div class="ba-palette-row">';
        data.palette.forEach(function (color) {
          checksHTML += '<div class="ba-swatch" style="background:' + color + '" title="' + color + '"></div>';
        });
        checksHTML += '</div>';
      }

      if (sec.key === 'social' && data.networks && data.networks.length > 0) {
        checksHTML += '<div style="margin-top:8px;font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.4px">Found Profiles</div>';
        checksHTML += '<div class="ba-tag-row">';
        data.networks.forEach(function (n) {
          checksHTML += '<span class="ba-tag">' + n + '</span>';
        });
        checksHTML += '</div>';
      }

      var div = document.createElement('div');
      div.className = 'ba-section';
      div.innerHTML = [
        '<div class="ba-section-header ' + cls + '" data-section="' + sec.key + '">',
          '<span class="ba-section-icon">' + sec.icon + '</span>',
          '<span class="ba-section-name">' + sec.label + '</span>',
          '<span class="ba-section-score ' + cls + '">' + data.score + '</span>',
          '<span class="ba-chevron">&#9654;</span>',
        '</div>',
        '<div class="ba-section-body" id="ba-body-' + sec.key + '">' + checksHTML + '</div>'
      ].join('');

      body.appendChild(div);

      var hasProblem = data.checks.some(function (c) { return c.pass !== 'pass'; });
      if (hasProblem) {
        document.getElementById('ba-body-' + sec.key).classList.add('visible');
        div.querySelector('.ba-section-header').classList.add('expanded');
      }
    });
  }

  /* ─── Shortcode button binding ───────────────────────────────────────── */
  function bindShortcodeButtons() {
    var triggers = document.querySelectorAll('[data-ba-trigger="open"]');
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener('click', function (e) {
        e.preventDefault();
        window.baOpenPanel();
      });
    }
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        buildUI();
        bindShortcodeButtons();
      });
    } else {
      buildUI();
      bindShortcodeButtons();
    }
  }

  init();

}(window, document));
