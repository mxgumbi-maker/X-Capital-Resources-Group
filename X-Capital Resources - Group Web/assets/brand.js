// Shared brand + layout helpers for the X-Capital Resources Group site.
// Depends on window.XCR from data.js. Every page sets window.PAGE = { slug, base }.
(function(){
  const XCR = window.XCR;
  const INK = '#14161A', PAPER = '#F7F7F5';

  // Operating companies in organogram order (phase by phase).
  const PHASES = [
    { n:1, name:'Foundation', years:'Year 1–2', ids:['sma','ppl'] },
    { n:2, name:'Reinvest', years:'Year 2–3', ids:['tech','incu'] },
    { n:3, name:'Scale', years:'Year 3–5', ids:['edu','kids','fin','rnd'] },
    { n:4, name:'Capital-Intensive Buildout', years:'Year 5–10', ids:['prop','agri','nrg'] }
  ];
  const ORDER = PHASES.flatMap(p => p.ids);
  const YEARS = Array.from({length:10}, (_, i) => 2027 + i);

  // Short names used to find sibling mentions in "works closely with" copy.
  const KEYWORDS = { tech:'Technology', rnd:'Research', prop:'Properties', edu:'Education', ppl:'People',
    sma:'Marketing Agency', incu:'Incubation', kids:'Kids', fin:'Financial Services', agri:'Agriculture', nrg:'Energy' };

  // The plan text uses internal short codes; show readers the company names instead.
  const CODES = { CORP:'the holding company', TECH:'Technology', RND:'Research & Development', PROP:'Properties', EDU:'Education',
    PPL:'People', SMA:'Social & Marketing Agency', INCU:'Incubation', KIDS:'Kids', FIN:'Financial Services', AGRI:'Agriculture', NRG:'Energy & Infrastructure' };
  const expand = s => String(s).replace(/\b(CORP|TECH|RND|PROP|EDU|PPL|SMA|INCU|KIDS|FIN|AGRI|NRG)\b/g, m => CODES[m]);

  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const href = (slug, base) => slug === 'corp' ? base + 'index.html' : base + 'companies/' + slug + '.html';
  const fullName = c => c.slug === 'corp' ? 'X-Capital Resources Group' : 'X-Capital Resources: ' + c.name;
  const phaseOf = slug => PHASES.find(p => p.ids.includes(slug));

  const sum = arr => arr.reduce((a, b) => a + b, 0);
  const groupHeadcount = YEARS.map((_, i) => sum(Object.values(XCR).map(c => c.headcount[i])));
  const groupRevenue = YEARS.map((_, i) => sum(Object.values(XCR).map(c => c.revenue[i])));

  const fmtInt = n => Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
  const fmtRand = m => m >= 1000 ? 'R' + (m / 1000).toFixed(2) + 'bn' : 'R' + (m < 10 ? m.toFixed(1) : fmtInt(m)) + 'm';

  // Pick ink or paper text for a brand colour background (WCAG contrast).
  function lum(hex){
    const v = hex.replace('#','').match(/../g).map(h => { const c = parseInt(h,16)/255; return c <= .03928 ? c/12.92 : Math.pow((c+.055)/1.055, 2.4); });
    return .2126*v[0] + .7152*v[1] + .0722*v[2];
  }
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
  const onColor = hex => contrast(hex, '#FFFFFF') >= 4.5 ? '#FFFFFF' : INK;

  // The mark: EB Garamond Bold 'X' + three-bar pointed growth motif (logo pack v3 geometry).
  function mark(color, xFill){
    return `<svg class="mk" viewBox="0 0 100 100" role="img" aria-label="X-Capital Resources mark">
      <text x="50" y="78" font-family="'EB Garamond',Georgia,serif" font-weight="700" font-size="86" text-anchor="middle" fill="${xFill || 'currentColor'}">X</text>
      <g fill="${color}">
        <polygon points="64,92 73,92 73,79 68.5,73 64,79"/>
        <polygon points="76,92 85,92 85,71 80.5,65 76,71"/>
        <polygon points="88,92 97,92 97,61 92.5,55 88,61"/>
      </g></svg>`;
  }

  function lockup(c, base, opts = {}){
    const sub = c.slug === 'corp' ? 'Group Holding &amp; Corporate' : esc(c.label);
    return `<a class="lockup" href="${opts.href || href(c.slug, base)}" aria-label="${esc(fullName(c))}">
      ${mark(c.color)}
      <span class="wm"><b>X-CAPITAL RESOURCES</b><span style="color:${opts.subColor || c.color}">${sub}</span></span></a>`;
  }

  function rail(base, current){
    return `<nav class="rail" aria-label="Group companies">${['corp', ...ORDER].map(s => {
      const c = XCR[s];
      return `<a href="${href(s, base)}" class="${s === current ? 'on' : ''}" style="background:${c.color}" title="${esc(fullName(c))}"></a>`;
    }).join('')}</nav>`;
  }

  function header(page){
    const c = XCR[page.slug], b = page.base;
    const links = page.slug === 'corp'
      ? `<a class="hide-sm" href="#structure">Ownership</a><a class="hide-sm" href="#companies">Companies</a><a class="hide-sm" href="#growth">Growth</a><a class="hide-sm" href="#roadmap">Roadmap</a>`
      : `<a class="hide-sm" href="#numbers">Numbers</a><a class="hide-sm" href="#about">About</a><a class="hide-sm" href="#plan">Plan</a><a class="pill" href="${href('corp', b)}#structure">${mark(XCR.corp.color, PAPER).replace('class="mk"', 'class="mk" style="width:20px;height:20px"')}Group</a>`;
    return `${rail(b, page.slug)}<header class="top"><div class="wrap nav">${lockup(c, b)}<nav class="navlinks">${links}</nav></div></header>`;
  }

  function footer(page){
    const b = page.base;
    return `<footer class="site"><div class="wrap">
      <div class="foot-grid">
        <div>
          ${lockup(XCR.corp, b, { subColor: XCR.corp.color }).replace('class="lockup"', 'class="lockup" style="color:#F7F7F5"')}
          <p style="margin:18px 0 0; font-size:14px; max-width:36ch">X-Capital Resources Group is the holding company. It owns all eleven operating companies listed here.</p>
          <p style="margin:12px 0 0; font-family:'Fraunces',serif; color:#C9A24B; font-size:16px">Building Wealth. Building People. Building a Legacy.</p>
        </div>
        <div>
          <h4>The group</h4>
          <div class="foot-cos">${['corp', ...ORDER].map(s => `<a href="${href(s, b)}"><i style="background:${XCR[s].color}"></i>${esc(s === 'corp' ? 'Holding & Corporate Office' : XCR[s].name)}</a>`).join('')}</div>
        </div>
      </div>
      <div class="foot-note">
        <span>© ${new Date().getFullYear()} X-Capital Resources Group. All operating companies are owned by X-Capital Resources Group.</span>
        <span>Figures are modelled targets from the group's ten-year plan (2027–2036), not reported results.</span>
      </div></div></footer>`;
  }

  // ---------- Charts: single-series SVG bars with hover tooltips + table view ----------
  function columnChart(el, { title, sub, labels, values, color, fmt, unit }){
    const W = 560, H = 230, L = 44, R = 8, T = 12, B = 26;
    const max = Math.max(...values) || 1;
    const nice = niceMax(max), ticks = 4;
    const bw = (W - L - R) / values.length, gap = Math.max(6, bw * .28);
    const y = v => T + (H - T - B) * (1 - v / nice);
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}"><g class="grid">`;
    for (let i = 0; i <= ticks; i++){ const v = nice * i / ticks; svg += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/>`; }
    svg += `</g><g class="axis">`;
    for (let i = 0; i <= ticks; i++){ const v = nice * i / ticks; svg += `<text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${fmt(v, true)}</text>`; }
    labels.forEach((l, i) => { if (labels.length <= 10 || i % 2 === 0) svg += `<text x="${L + bw * i + bw / 2}" y="${H - 6}" text-anchor="middle">${esc(l)}</text>`; });
    svg += `</g>`;
    values.forEach((v, i) => {
      const x = L + bw * i + gap / 2, w = bw - gap, top = y(v), h = (H - B) - top, r = Math.min(4, w / 2, h);
      const d = h <= 0 ? '' : `M${x},${H - B} V${top + r} Q${x},${top} ${x + r},${top} H${x + w - r} Q${x + w},${top} ${x + w},${top + r} V${H - B} Z`;
      svg += `<path class="mark" data-i="${i}" d="${d}" fill="${color}"/>`;
    });
    // Direct label on the last (peak) bar only.
    const li = values.length - 1;
    svg += `<text class="lbl" x="${L + bw * li + bw / 2}" y="${y(values[li]) - 7}" text-anchor="middle">${fmt(values[li])}</text>`;
    values.forEach((v, i) => { svg += `<rect class="hit" data-i="${i}" x="${L + bw * i}" y="${T}" width="${bw}" height="${H - T - B}"/>`; });
    svg += `</svg>`;
    el.classList.add('chart');
    el.innerHTML = `<h3>${esc(title)}</h3><div class="sub">${esc(sub)}</div>${svg}<div class="tip"></div>
      <details><summary>View as table</summary><table><thead><tr><th>Year</th><th>${esc(unit)}</th></tr></thead><tbody>${labels.map((l, i) => `<tr><td>${esc(l)}</td><td>${fmt(values[i])}</td></tr>`).join('')}</tbody></table></details>`;
    wireHover(el, i => `<b>${fmt(values[i])}</b>${esc(labels[i])} · ${esc(unit)}`);
  }

  function barList(el, { title, sub, rows, color, fmt }){
    // Horizontal bars in HTML (text stays at its CSS size at any width); one hue, names as labels.
    const max = Math.max(...rows.map(r => r.value)) || 1;
    el.classList.add('chart');
    el.innerHTML = `<h3>${esc(title)}</h3><div class="sub">${esc(sub)}</div>
      <div class="hbars" role="img" aria-label="${esc(title)}">${rows.map((r, i) => `
        <div class="hb"><span class="hb-l">${esc(r.label)}</span>
          <span class="hb-t"><i class="mark" data-i="${i}" style="width:${Math.max(.5, r.value / max * 100)}%; background:${r.color || color}"></i><b>${fmt(r.value)}</b></span>
          <span class="hit" data-i="${i}"></span></div>`).join('')}</div><div class="tip"></div>`;
    wireHover(el, i => `<b>${fmt(rows[i].value)}</b>${esc(rows[i].label)}${rows[i].note ? ' · ' + esc(rows[i].note) : ''}`);
  }

  function wireHover(el, html){
    const tip = el.querySelector('.tip'), svg = el.querySelector('svg, .hbars');
    el.querySelectorAll('.hit').forEach(h => {
      h.addEventListener('mouseenter', () => {
        const i = h.dataset.i, m = el.querySelector(`.mark[data-i="${i}"]`);
        el.classList.add('hovering'); el.querySelectorAll('.mark.on').forEach(x => x.classList.remove('on')); if (m) m.classList.add('on');
        const mb = (m || h).getBoundingClientRect(), eb = el.getBoundingClientRect();
        tip.innerHTML = html(+i);
        tip.style.left = Math.min(Math.max(mb.left + mb.width / 2 - eb.left, 70), eb.width - 70) + 'px';
        tip.style.top = (mb.top - eb.top) + 'px';
        tip.style.opacity = 1;
      });
    });
    svg.addEventListener('mouseleave', () => { el.classList.remove('hovering'); tip.style.opacity = 0; });
  }

  function niceMax(v){
    const p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
  }

  // Count-up for stat tiles: <span data-count="1234" data-dec="1">
  function countUp(root){
    const els = root.querySelectorAll('[data-count]');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const show = (e, v) => { const d = +(e.dataset.dec || 0); e.textContent = d ? v.toFixed(d) : fmtInt(v); };
    if (reduce || !('IntersectionObserver' in window)){ els.forEach(e => show(e, +e.dataset.count)); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return; io.unobserve(en.target);
      const e = en.target, to = +e.dataset.count, t0 = performance.now(), dur = 1100;
      const step = t => { const k = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - k, 3); show(e, to * ease); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }), { threshold: .4 });
    els.forEach(e => { show(e, 0); io.observe(e); });
  }

  window.Brand = { XCR, PHASES, ORDER, YEARS, KEYWORDS, esc, expand, href, fullName, phaseOf, sum, groupHeadcount, groupRevenue,
    fmtInt, fmtRand, onColor, mark, lockup, header, footer, columnChart, barList, countUp, INK, PAPER };
})();
