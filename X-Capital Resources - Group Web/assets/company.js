// Renders a company landing page from data.js. The page sets window.PAGE = { slug, base }.
(function(){
  const B = window.Brand, { XCR, esc, fmtInt, fmtRand, mark, href } = B;
  const page = window.PAGE, c = XCR[page.slug], base = page.base;
  const on = B.onColor(c.color);
  const phase = B.phaseOf(c.slug);
  const corp = XCR.corp;

  document.documentElement.style.setProperty('--c', c.color);
  document.title = `${c.name} | X-Capital Resources`;

  // ---- Figures (all from the plan's ten-year model) ----
  const start = c.revenue.findIndex(v => v > 0);
  const y10Head = c.headcount[9], y10Rev = c.revenue[9];
  const totalHead = B.groupHeadcount[9], totalRev = B.groupRevenue[9];
  const jobsShare = y10Head / totalHead * 100, revShare = y10Rev / totalRev * 100;
  const growth = y10Rev / c.revenue[start];
  const yr3 = Math.min(start + 2, 9);
  const rankJobs = B.ORDER.map(s => XCR[s]).sort((a, b) => b.headcount[9] - a.headcount[9]).findIndex(x => x.slug === c.slug) + 1;
  const ord = n => n + (['th','st','nd','rd'][(n % 100 > 10 && n % 100 < 14) ? 0 : (n % 10 < 4 ? n % 10 : 0)] || 'th');

  const siblings = B.ORDER.filter(s => s !== c.slug && c.worksWith.includes(B.KEYWORDS[s]));
  const idx = B.ORDER.indexOf(c.slug), prev = XCR[B.ORDER[(idx + B.ORDER.length - 1) % B.ORDER.length]], next = XCR[B.ORDER[(idx + 1) % B.ORDER.length]];

  const bigBars = `<svg viewBox="60 50 40 45" aria-hidden="true" style="position:absolute; right:-40px; bottom:-30px; width:min(520px,70vw); opacity:.16; fill:${on}">
      <polygon points="64,92 73,92 73,79 68.5,73 64,79"/><polygon points="76,92 85,92 85,71 80.5,65 76,71"/><polygon points="88,92 97,92 97,61 92.5,55 88,61"/></svg>`;

  const stat = (v, k, opts = {}) => `<div class="stat" ${opts.tile ? `style="--tile:${opts.tile}"` : ''}>
      <div class="v">${opts.pre || ''}${v}${opts.unit ? `<small>${opts.unit}</small>` : ''}</div>
      <div class="k">${k}</div>${opts.bar != null ? `<div class="bar"><i style="width:${Math.max(2, opts.bar)}%"></i></div>` : ''}</div>`;
  const cnt = (n, dec = 0) => `<span data-count="${n}" data-dec="${dec}">${dec ? n.toFixed(dec) : fmtInt(n)}</span>`;
  const revM = y10Rev >= 1000 ? { v: cnt(y10Rev / 1000, 2), unit: 'bn' } : { v: cnt(y10Rev), unit: 'm' };

  const about = [
    ['01', 'What we focus on', c.focus],
    ['02', 'Who we serve', c.customer],
    ['03', 'What we give back', c.society],
    ['04', 'The opportunity', c.opportunity]
  ];

  const margin = c.slug !== 'edu' ? '' : `
  <section id="products" style="padding-top:0">
    <div class="wrap">
      <div class="sec-head"><div class="eyebrow">Our products</div><h2 class="serif">Margin, from X-Capital Resources: Education</h2>
        <p>Margin is Education's study-coaching app for families, and part of X-Capital Resources Group through Education.</p></div>
      <div class="margin-feature">
        <div class="mf-copy">
          <div class="mf-brand"><img src="${base}margin/icon-192.png" alt="" width="56" height="56"><div><b>Margin</b><span>Study coaching for families</span></div></div>
          <p class="mf-lead serif">Turn a report card into a conversation, a study plan and a tip worth trying.</p>
          <ul class="mf-list">
            <li>Snap a photo of a report card, or type the marks in</li>
            <li>Get a plain-language summary, coaching questions and a study plan</li>
            <li>Separate parent, child and caregiver views, with copy written for each</li>
            <li>Schedule study sessions straight into the family calendar</li>
          </ul>
          <div class="mf-cta"><a class="pill" href="${base}margin/landing.html">Visit Margin →</a><a class="ghost" href="${base}margin/margin.html">Open the app</a></div>
        </div>
        <div class="mf-stats">
          ${stat('R59', 'per child, per month', { tile: c.color })}
          ${stat('3', 'free coaching sessions a month on the Free plan', { tile: '#F2775A' })}
          ${stat('5% / 10%', 'off the 2nd / 3rd child on one account', { tile: corp.color })}
          ${stat('3', 'views: parent, child and caregiver', { tile: '#2F6FED' })}
        </div>
      </div>
      <div class="lineage" aria-label="Ownership line">
        <a href="${href('corp', base)}" style="--l:${corp.color}">X-Capital Resources Group</a><i>→</i>
        <a href="#top" style="--l:${c.color}">X-Capital Resources: Education</a><i>→</i>
        <a href="${base}margin/landing.html" style="--l:#1F2A3C">Margin</a>
      </div>
    </div>
  </section>`;

  const html = `
  ${B.header(page)}
  <main id="top">
    <div class="hero" style="background:${c.color}; color:${on}">
      ${bigBars}
      <div class="wrap hero-in">
        <div class="hero-copy">
          <div class="crumbs"><a href="${href('corp', base)}">X-Capital Resources Group</a> <span>/</span> ${esc(c.name)}</div>
          <div class="eyebrow" style="opacity:.85">${esc(c.sector)}</div>
          <h1 class="serif">${esc(c.name)}</h1>
          <p class="tagline serif">“${esc(c.tagline)}”</p>
          <div class="chips">
            <span class="chip">Phase ${phase.n} · ${esc(phase.name)}</span>
            <span class="chip">Launch ${c.launchYear}</span>
            <span class="chip">${fmtInt(y10Head)} jobs by 2036</span>
          </div>
          <a class="owned" href="${href('corp', base)}#structure">${mark(corp.color, B.INK)}Owned by X-Capital Resources Group</a>
        </div>
        <div class="hero-badge">
          <div class="badge-tile">${mark(c.color, B.INK)}</div>
          <div class="sticker s1" style="background:${corp.color}; color:${B.INK}"><b>${ord(rankJobs)}</b> largest employer in the group</div>
          <div class="sticker s2"><b>${c.margin}%</b> target EBITDA margin</div>
        </div>
      </div>
    </div>

    <section id="numbers">
      <div class="wrap">
        <div class="sec-head"><div class="eyebrow">By the numbers</div><h2 class="serif">Where ${esc(c.name)} is heading</h2>
          <p>Ten-year targets from the group plan, from launch in ${c.launchYear} to 2036.</p></div>
        <div class="stats four">
          ${stat(cnt(y10Head), 'people employed by 2036')}
          ${stat(revM.v, 'annual revenue target, 2036', { pre: 'R', unit: revM.unit })}
          ${stat(cnt(c.margin, 1), 'target EBITDA margin', { unit: '%' })}
          ${stat(cnt(growth, 0), `revenue growth, ${YEAR(start)} to 2036`, { unit: '×' })}
          ${stat(cnt(jobsShare, 1), "of the group's 15 000-job target", { unit: '%', bar: jobsShare, tile: corp.color })}
          ${stat(cnt(revShare, 1), 'of group revenue in 2036', { unit: '%', bar: revShare, tile: corp.color })}
          ${stat(cnt(c.headcount[yr3]), `team size by ${YEAR(yr3)}, year three`)}
          ${stat(String(c.launchYear), `launch year, Phase ${phase.n} (${phase.years})`, { tile: corp.color })}
        </div>
        <div class="charts" style="margin-top:18px">
          <div id="chRev"></div>
          <div id="chHead"></div>
        </div>
      </div>
    </section>

    <section id="about" style="padding-top:0">
      <div class="wrap">
        <div class="sec-head"><div class="eyebrow">Who we are</div><h2 class="serif">What ${esc(c.name)} does</h2>
          <p>${esc(B.expand(c.overview))}</p></div>
        <div class="cards about">
          ${about.map(([n, h, p]) => `<div class="card"><div class="num" style="color:${c.color}">${n}</div><h3>${h}</h3><p>${esc(p)}</p></div>`).join('')}
        </div>
      </div>
    </section>

    ${margin}

    <section id="plan" class="plan-band">
      <div class="wrap">
        <div class="sec-head"><div class="eyebrow">The first three years</div><h2 class="serif">The plan, year by year</h2>
          <p>Launches in ${c.launchYear}. These are the first three years of work set out in the group plan.</p></div>
        <div class="timeline">
          ${c.years.map((y, i) => `<div class="tl"><div class="tl-head"><span class="dot">${i + 1}</span><b>${esc(y.year)}</b></div>
            <ul>${y.items.map(it => `<li>${esc(B.expand(it))}</li>`).join('')}</ul></div>`).join('')}
        </div>
      </div>
    </section>

    <section>
      <div class="wrap two">
        <div>
          <div class="eyebrow" style="color:${c.color}">Sister companies</div>
          <h2 class="serif" style="font-size:clamp(26px,3.4vw,36px); margin:10px 0 14px">How we work with the group</h2>
          <p class="muted">${esc(B.expand(c.worksWith))}</p>
          <div class="sibs">${siblings.map(s => `<a href="${href(s, base)}" style="--s:${XCR[s].color}">${mark(XCR[s].color, B.INK)}<span>${esc(XCR[s].name)}</span></a>`).join('')}</div>
        </div>
        <figure class="bench">
          <div class="eyebrow" style="color:${corp.color}">The proven playbook</div>
          <blockquote class="serif">${esc(c.benchmark)}</blockquote>
        </figure>
      </div>
    </section>

    <section id="ownership" style="padding-top:0">
      <div class="wrap">
        <div class="own-band">
          <div class="own-tree">
            <a class="own-parent" href="${href('corp', base)}">${mark(corp.color, B.PAPER)}<span><small>Holding company · owner</small>X-Capital Resources Group</span></a>
            <div class="own-stem"></div>
            <div class="own-kids">${B.ORDER.map(s => `<a href="${href(s, base)}" title="${esc(XCR[s].name)}" class="${s === c.slug ? 'me' : ''}" style="--k:${XCR[s].color}; --on:${B.onColor(XCR[s].color)}">${s === c.slug ? esc(c.name) : ''}</a>`).join('')}</div>
          </div>
          <div class="own-copy">
            <h2 class="serif">Owned by X-Capital Resources Group</h2>
            <p>${esc(B.fullName(c))} is one of eleven operating companies owned by X-Capital Resources Group, the group's holding company. The holding company funds it, provides shared treasury, legal, HR, IT and governance services, and sets the order in which the group's companies launch.</p>
            <div class="prevnext">
              <a href="${href(prev.slug, base)}" style="--k:${prev.color}">← ${esc(prev.name)}</a>
              <a href="${href(next.slug, base)}" style="--k:${next.color}">${esc(next.name)} →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  ${B.footer(page)}`;

  function YEAR(i){ return B.YEARS[i]; }

  document.getElementById('app').innerHTML = html;

  const labels = B.YEARS.slice(start).map(String);
  B.columnChart(document.getElementById('chRev'), {
    title: 'Revenue target', sub: `R million per year, ${labels[0]}–2036`, unit: 'Revenue',
    labels, values: c.revenue.slice(start), color: c.color,
    fmt: (v, axis) => axis ? (v >= 1000 ? 'R' + (v / 1000) + 'bn' : 'R' + Math.round(v) + 'm') : fmtRand(v)
  });
  B.columnChart(document.getElementById('chHead'), {
    title: 'Team size', sub: `People employed, ${labels[0]}–2036`, unit: 'Headcount',
    labels, values: c.headcount.slice(start), color: c.color,
    fmt: v => fmtInt(v)
  });
  B.countUp(document);
})();
