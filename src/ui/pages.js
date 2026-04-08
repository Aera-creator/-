import {
  buildProfile,
  compressDiary,
  concertPlan,
  getDiaryDetail,
  getFoodDetail,
  getPOIDetail,
  getSystemMeta,
  getTeamRoom,
  planMultiRoute,
  planSingleRoute,
  queryFacilities,
  recommendFood,
  recommendPOI,
  searchDiaries,
  teamCollab
} from '../services/apiClient.js';

const state = {
  interests: '夜景 演唱会 美食 文化'
};

const mapPoints = {
  杭州西湖: [20, 70],
  灵隐寺: [28, 48],
  浙江大学紫金港: [40, 30],
  断桥公厕: [22, 62],
  湖滨超市: [24, 56],
  景区医疗服务点: [31, 44],
  上海外滩: [68, 68],
  虹馆Live: [78, 48],
  音乐涂鸦墙: [83, 40],
  江畔灯光步道: [74, 38],
  深夜火锅局: [88, 34],
  月光甜品社: [71, 31]
};

init();

function init() {
  bindCommon();
  const page = document.body.dataset.page;
  if (page === 'home') void renderHome();
  if (page === 'account') bindAccount();
  if (page === 'recommend') bindRecommend();
  if (page === 'route') bindRoute();
  if (page === 'facility') bindFacility();
  if (page === 'diary') bindDiary();
  if (page === 'food') bindFood();
  if (page === 'concert') bindConcert();
  if (page === 'profile') bindProfile();
  if (page === 'team') bindTeam();
  if (page === 'poi-detail') bindPoiDetail();
  if (page === 'diary-detail') bindDiaryDetail();
  if (page === 'food-detail') bindFoodDetail();
  if (page === 'team-room') bindTeamRoom();
}

function bindCommon() {
  const topbar = document.querySelector('.topbar');
  if (topbar && !topbar.querySelector('.omnibox')) {
    const box = document.createElement('div');
    box.className = 'omnibox';
    box.innerHTML = '<span>Search</span><input type="text" placeholder="搜索地点、美食、游记、路线" />';
    const account = topbar.querySelector('.account');
    topbar.insertBefore(box, account);
  }

  setupAccountEntry();

  const page = document.body.dataset.page;
  document.querySelectorAll('.nav a').forEach((a) => {
    if (a.dataset.page === page) a.classList.add('active');
  });
}

function setupAccountEntry() {
  const account = document.querySelector('.account');
  if (!account || account.dataset.bound === '1') return;
  account.dataset.bound = '1';
  account.innerHTML = `
    <a class="account-entry" href="./account.html" aria-label="进入账户中心">
      <span class="avatar">AL</span>
      <span>Aera Lin · 账户中心</span>
    </a>
  `;
}

async function renderHome() {
  const meta = await getSystemMeta();
  setHtml(
    '#home-stats',
    `
      <div class="stat"><b>可用功能</b><p>${meta.moduleCount}</p></div>
      <div class="stat"><b>已收录地点</b><p>${meta.poiCount}</p></div>
      <div class="stat"><b>附近餐厅</b><p>${meta.foodCount}</p></div>
      <div class="stat"><b>社区内容</b><p>${meta.diaryCount}</p></div>
      <div class="stat"><b>路线节点</b><p>${meta.graphNodeCount}</p></div>
      <div class="stat"><b>我的等级</b><p>Lv.3</p></div>
    `
  );
}

function bindAccount() {
  const output = document.querySelector('#account-output');
  document.querySelector('#save-account')?.addEventListener('click', () => {
    state.interests = value('#user-interests') || state.interests;
    setHtml(
      '#account-output',
      `
      <div class="item">
        <h4>设置已保存</h4>
        <p>昵称：${escapeHtml(value('#user-name') || '旅行者')}</p>
        <p>手机号：${escapeHtml(value('#user-phone') || '未填写')}</p>
        <p>常驻城市：${escapeHtml(value('#user-city') || '未填写')}</p>
        <p>邮箱：${escapeHtml(value('#user-email') || '未填写')}</p>
        <p>旅行偏好：${toChips(state.interests)}</p>
      </div>
    `
    );
  });

  document.querySelector('#save-avatar-page')?.addEventListener('click', () => {
    const link = value('#account-avatar-link');
    const txt = link ? '头像已更新。' : '头像设置已保存。';
    setHtml('#account-output', `<div class="item"><h4>头像设置</h4><p>${txt}</p></div>`);
  });

  document.querySelector('#save-password-page')?.addEventListener('click', () => {
    const pwd = value('#account-password');
    const txt = pwd.length >= 6 ? '密码修改成功。' : '密码至少 6 位。';
    setHtml('#account-output', `<div class="item"><h4>安全设置</h4><p>${txt}</p></div>`);
  });

  document.querySelector('#logout-page')?.addEventListener('click', () => {
    setHtml('#account-output', '<div class="item"><h4>会话状态</h4><p>已退出登录（演示）。</p></div>');
  });

  if (output) {
    output.innerHTML = '<p>修改资料、偏好或安全设置后，结果会在这里显示。</p>';
  }
}

function bindRecommend() {
  document.querySelectorAll('#recommend-quick-tags .chip-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelector('#poi-query').value = btn.dataset.query || '';
    });
  });

  document.querySelector('#run-poi')?.addEventListener('click', async () => {
    const list = await recommendPOI({
      query: value('#poi-query'),
      category: value('#poi-category'),
      interests: value('#poi-interests') || state.interests,
      k: 10
    });
    renderCards(
      '#poi-output',
      list.map(
        (x) => `
      <div class="item">
        <h4>${escapeHtml(x.name)}</h4>
        <p>${escapeHtml(x.area)} · ${escapeHtml(x.category)}</p>
        <p>推荐理由：${toChips(x.tags)}</p>
        <p>热度 ${x.heat} · 评分 ${x.rating}</p>
        <p><a class="inline-link" href="./poi-detail.html?id=${encodeURIComponent(x.id)}">查看详情</a></p>
      </div>`
      )
    );
  });
}

function bindRoute() {
  drawInlineMap('#route-map-canvas', ['杭州西湖', '灵隐寺'], '路线概览');
  setMapInfo('#route-map-info', '默认展示：杭州西湖 → 灵隐寺');

  document.querySelector('#run-route')?.addEventListener('click', async () => {
    const result = await planSingleRoute({
      start: value('#route-start'),
      target: value('#route-target'),
      strategy: value('#route-strategy'),
      transport: value('#route-mode') || 'walk'
    });
    if (result.error) return setHtml('#route-output', `<p class="warn">${result.error}</p>`);
    setHtml(
      '#route-output',
      `<div class="item"><h4>快速导航结果</h4><p class="route">${result.path
        .map(escapeHtml)
        .join(' → ')}</p><p>预计强度：${result.total}</p><p>适合已经确定今天核心目的地时直接使用。</p></div>`
    );
    drawInlineMap('#route-map-canvas', result.path, '路线概览');
    setMapInfo('#route-map-info', `当前路线：${result.path.join(' → ')}；预计强度：${result.total}`);
  });

  document.querySelector('#run-multi-route')?.addEventListener('click', async () => {
    const result = await planMultiRoute({
      start: value('#route-start'),
      targets: value('#multi-targets'),
      strategy: value('#route-strategy')
    });
    setHtml(
      '#route-output',
      `<div class="item"><h4>多点行程结果</h4><p class="route">${result.path
        .map(escapeHtml)
        .join(' → ')}</p><p>停留点：${result.visited} · 预计强度：${result.total}</p><p>适合把景点、服务点和补给点串在同一天里。</p></div>`
    );
    drawInlineMap('#route-map-canvas', result.path, '多点行程概览');
    setMapInfo('#route-map-info', `多点路线：${result.path.join(' → ')}；预计强度：${result.total}`);
  });
}

function bindFacility() {
  drawInlineMap('#facility-map-canvas', ['杭州西湖'], '周边服务分布');
  setMapInfo('#facility-map-info', '点击“查找周边”后显示附近可达设施。');

  const rangeInput = document.querySelector('#facility-range');
  const rangeLabel = document.querySelector('#facility-range-label');
  if (rangeInput && rangeLabel) {
    rangeInput.addEventListener('input', () => {
      rangeLabel.textContent = rangeInput.value;
    });
  }

  document.querySelectorAll('#facility-quick-tags .chip-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelector('#facility-category').value = btn.dataset.category || '';
    });
  });

  document.querySelector('#run-facility')?.addEventListener('click', async () => {
    const maxRange = Number(value('#facility-range') || 5);
    const list = (await queryFacilities({ origin: value('#facility-origin'), category: value('#facility-category') })).filter(
      (x) => Number.parseFloat(x.routeDistance) <= maxRange
    );
    renderCards(
      '#facility-output',
      list.map(
        (x) => `<div class="item"><h4>${escapeHtml(x.name)}</h4><p>${escapeHtml(x.area)} · ${toChips(x.tags)}</p><p>步行距离：${x.routeDistance}</p></div>`
      )
    );
    const mapPath = ['杭州西湖', ...list.slice(0, 4).map((x) => x.name)];
    drawInlineMap('#facility-map-canvas', mapPath, '周边服务分布');
    setMapInfo('#facility-map-info', `已找到：${list.slice(0, 6).map((x) => x.name).join('、') || '暂无匹配设施'}`);
  });
}

function bindDiary() {
  document.querySelector('#run-diary-search')?.addEventListener('click', async () => {
    const list = await searchDiaries({ keyword: value('#diary-keyword'), sortBy: value('#diary-sort') });
    renderCards(
      '#diary-output',
      list.slice(0, 10).map(
        (x) =>
          `<div class="item"><h4>${escapeHtml(x.title)}</h4><p>${escapeHtml(x.destination)} · 作者 ${escapeHtml(
            x.author
          )}</p><p>${escapeHtml(x.body)}</p><p>热度 ${x.heat} · 评分 ${x.rating}</p><p><a class="inline-link" href="./diary-detail.html?id=${encodeURIComponent(
            x.id
          )}">查看详情</a></p></div>`
      )
    );
  });

  document.querySelector('#run-diary-compress')?.addEventListener('click', async () => {
    const r = await compressDiary(value('#diary-text'));
    setHtml(
      '#diary-output',
      `<div class="item"><h4>草稿已保存</h4><p>标题：${escapeHtml(value('#diary-title') || '未命名游记')}</p><p>内容已完成存储处理。</p><p>文本长度：${r.binary.length}</p></div>`
    );
  });
}

function bindFood() {
  const budgetInput = document.querySelector('#food-budget');
  const budgetLabel = document.querySelector('#food-budget-label');
  if (budgetInput && budgetLabel) {
    budgetInput.addEventListener('input', () => {
      budgetLabel.textContent = budgetInput.value;
    });
  }

  document.querySelectorAll('#food-cuisine-tags .chip-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelector('#food-cuisine').value = btn.dataset.cuisine || '';
    });
  });

  document.querySelector('#run-food')?.addEventListener('click', async () => {
    const budgetText = document.querySelector('#food-budget-label')?.textContent || '80';
    const list = await recommendFood({
      query: value('#food-query'),
      cuisine: value('#food-cuisine'),
      near: value('#food-near'),
      k: 10
    });
    renderCards(
      '#food-output',
      list.map(
        (x) =>
          `<div class="item"><h4>${escapeHtml(x.name)}</h4><p>${escapeHtml(x.cuisine)} · ${escapeHtml(
            x.shop
          )}</p><p>附近位置：${escapeHtml(x.near)}</p><p>热度 ${x.heat} · 评分 ${x.rating}</p><p>参考预算：${budgetText} 元/人</p><p><a class="inline-link" href="./food-detail.html?id=${encodeURIComponent(
            x.id
          )}">查看详情</a></p></div>`
      )
    );
  });
}

function bindConcert() {
  drawInlineMap('#concert-map-canvas', ['上海外滩', '虹馆Live'], '演出动线概览');
  setMapInfo('#concert-map-info', '默认展示：上海外滩 → 虹馆Live。');

  document.querySelector('#run-concert')?.addEventListener('click', async () => {
    const data = await concertPlan({ venue: value('#concert-venue'), timeLimitMin: value('#concert-time-limit') });
    if (data.error) return setHtml('#concert-output', `<p class="warn">${data.error}</p>`);
    setHtml(
      '#concert-output',
      `<div class="item"><h4>${escapeHtml(data.concert.venue)} 当天方案</h4><p>建议提前 ${
        data.adviseDepartureMin
      } 分钟出发</p><p class="route">${data.route.path.map(escapeHtml).join(
        ' → '
      )}</p><p>演出前可去：${data.checkinRanking.map((x) => x.name).join('、')}</p><p>散场后可选：${data.foodRanking
        .map((x) => x.name)
        .join('、')}</p></div>`
    );
    drawInlineMap('#concert-map-canvas', data.route.path, '演出动线概览');
    setMapInfo(
      '#concert-map-info',
      `打卡：${data.checkinRanking.map((x) => x.name).join('、')}；聚餐：${data.foodRanking.map((x) => x.name).join('、')}`
    );
  });
}

function bindProfile() {
  document.querySelector('#run-profile')?.addEventListener('click', async () => {
    const list = await buildProfile();
    renderCards(
      '#profile-output',
      list.map(
        (u) => `<div class="item"><h4>${escapeHtml(u.name)}</h4><p>等级 Lv.${u.level} · 风格 ${profileStyleLabel(
          u.cluster
        )}</p><p>${toChips(u.interests)}</p><p>${u.exp} / ${u.nextLevelExp}</p><p>${escapeHtml(u.annualMemory)}</p></div>`
      )
    );
  });
}

function bindTeam() {
  drawInlineMap('#team-map-canvas', ['上海外滩', '虹馆Live', '音乐涂鸦墙', '深夜火锅局'], '共享路线概览');
  setMapInfo('#team-map-info', '默认展示当前小队路线。');

  document.querySelector('#run-team')?.addEventListener('click', async () => {
    const data = await teamCollab({ currentNode: value('#team-current-node') });
    setHtml(
      '#team-output',
      `<div class="item"><h4>当前小队安排</h4><p>当前选择：${escapeHtml(data.voted)}</p><p class="route">${data.plannedPath
        .map(escapeHtml)
        .join(' → ')}</p><p class="${data.deviation.deviated ? 'warn' : ''}">${escapeHtml(data.alert)}</p><p><a class="inline-link" href="./team-room.html?node=${encodeURIComponent(
        data.currentNode
      )}">进入小队房间</a></p></div>`
    );
    drawInlineMap('#team-map-canvas', data.plannedPath, '共享路线概览');
    setMapInfo('#team-map-info', `${data.alert} 当前节点：${data.currentNode}`);
  });
}

async function bindPoiDetail() {
  const id = getParam('id');
  const data = await getPOIDetail(id);
  if (!data) return renderMissing('#poi-detail-output', '未找到对应地点。');
  setText('#poi-detail-name', data.poi.name);
  setText('#poi-detail-sub', `${data.poi.area} · ${data.poi.category}`);
  setHtml('#poi-detail-tags', toChips(data.poi.tags));
  setText('#poi-detail-rating', `热度 ${data.poi.heat} · 评分 ${data.poi.rating}`);
  renderCards(
    '#poi-detail-output',
    [
      `<div class="item"><h4>适合人群</h4><p>${escapeHtml(data.poi.tags.join('、'))} 爱好者更容易喜欢这里。</p></div>`,
      `<div class="item"><h4>下一步建议</h4><p><a class="inline-link" href="./route.html">去做行程规划</a> · <a class="inline-link" href="./facility.html">查看周边服务</a></p></div>`
    ].concat(
      data.relatedDiaries.slice(0, 2).map(
        (item) => `<div class="item"><h4>相关游记：${escapeHtml(item.title)}</h4><p>${escapeHtml(item.body)}</p></div>`
      )
    )
  );
  renderCards(
    '#poi-related-foods',
    data.nearbyFoods.map(
      (item) => `<div class="item"><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(item.cuisine)} · ${escapeHtml(
        item.shop
      )}</p></div>`
    )
  );
  renderCards(
    '#poi-related-services',
    data.nearbyServices.map(
      (item) => `<div class="item"><h4>${escapeHtml(item.name)}</h4><p>步行距离：${escapeHtml(item.routeDistance)}</p></div>`
    )
  );
}

async function bindDiaryDetail() {
  const id = getParam('id');
  const data = await getDiaryDetail(id);
  if (!data) return renderMissing('#diary-detail-output', '未找到对应游记。');
  setText('#diary-detail-title', data.diary.title);
  setText('#diary-detail-meta', `${data.diary.destination} · 作者 ${data.diary.author}`);
  setText('#diary-detail-body', data.diary.body);
  setText('#diary-detail-stats', `热度 ${data.diary.heat} · 评分 ${data.diary.rating}`);
  renderCards(
    '#diary-detail-output',
    data.relatedPois.map(
      (item) => `<div class="item"><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(item.area)} · ${escapeHtml(item.category)}</p></div>`
    )
  );
  renderCards(
    '#diary-related-foods',
    data.relatedFoods.map(
      (item) => `<div class="item"><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(item.cuisine)} · ${escapeHtml(
        item.near
      )}</p></div>`
    )
  );
}

async function bindFoodDetail() {
  const id = getParam('id');
  const data = await getFoodDetail(id);
  if (!data) return renderMissing('#food-detail-output', '未找到对应餐厅。');
  setText('#food-detail-name', data.food.name);
  setText('#food-detail-meta', `${data.food.cuisine} · ${data.food.shop}`);
  setText('#food-detail-near', `附近位置：${data.food.near}`);
  setText('#food-detail-rating', `热度 ${data.food.heat} · 评分 ${data.food.rating}`);
  renderCards(
    '#food-detail-output',
    data.nearbyPois.map(
      (item) => `<div class="item"><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(item.area)} · ${escapeHtml(item.category)}</p></div>`
    )
  );
  renderCards(
    '#food-related-diaries',
    data.relatedDiaries.map(
      (item) => `<div class="item"><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.body)}</p></div>`
    )
  );
}

async function bindTeamRoom() {
  const currentNode = getParam('node') || '虹馆Live';
  const data = await getTeamRoom(currentNode);
  setText('#team-room-name', data.roomName);
  setText('#team-room-meta', `当前集合点：${data.currentNode}`);
  setText('#team-room-alert', data.alert);
  drawInlineMap('#team-room-map', data.plannedPath, '小队共享路线');
  renderCards(
    '#team-room-members',
    data.members.map(
      (member) => `<div class="item"><h4>${escapeHtml(member)}</h4><p>${
        data.activeMembers.includes(member) ? '状态正常，已同步路线。' : '等待再次同步位置。'
      }</p></div>`
    )
  );
  renderCards(
    '#team-room-plan',
    data.nextStops.map((stop, index) => `<div class="item"><h4>下一站 ${index + 1}</h4><p>${escapeHtml(stop)}</p></div>`)
  );
}

function renderCards(selector, cards) {
  if (!cards.length) return setHtml(selector, '<p>暂无结果</p>');
  setHtml(selector, `<div class="cards">${cards.join('')}</div>`);
}

function value(selector) {
  return document.querySelector(selector)?.value?.trim() || '';
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name) || '';
}

function setHtml(selector, html) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = html;
}

function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function renderMissing(selector, message) {
  setHtml(selector, `<p>${escapeHtml(message)}</p>`);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function toChips(values) {
  const items = Array.isArray(values) ? values : String(values).split(/[，,\s]+/).filter(Boolean);
  return items.map((x) => `<span class="chip">${escapeHtml(x)}</span>`).join('');
}

function profileStyleLabel(cluster) {
  if (cluster === 0) return '城市探索';
  if (cluster === 1) return '校园漫游';
  if (cluster === 2) return '文化体验';
  return '综合出游';
}

function drawInlineMap(selector, route, title) {
  const host = document.querySelector(selector);
  if (!host) return;
  const safeRoute = route.filter((name) => mapPoints[name]);
  const lines = [];
  for (let i = 0; i < safeRoute.length - 1; i += 1) {
    const a = mapPoints[safeRoute[i]];
    const b = mapPoints[safeRoute[i + 1]];
    lines.push(`<line x1="${a[0]}%" y1="${a[1]}%" x2="${b[0]}%" y2="${b[1]}%" stroke="#1a73e8" stroke-width="2.5" />`);
  }

  const nodes = safeRoute.map((name, idx) => {
    const p = mapPoints[name];
    return `<g>
      <circle cx="${p[0]}%" cy="${p[1]}%" r="${idx === 0 ? 8 : 6}" fill="${idx === 0 ? '#16a34a' : '#1a73e8'}" />
      <text x="${p[0]}%" y="${p[1] - 2}%" text-anchor="middle" fill="#0f172a" font-size="11">${name}</text>
    </g>`;
  });

  host.innerHTML = `
    <div class="map-title">${escapeHtml(title)}</div>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="map-svg">
      <defs>
        <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#d9e1ef" stroke-width="0.15"/>
        </pattern>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#grid)"/>
      ${lines.join('')}
      ${nodes.join('')}
    </svg>
  `;
}

function setMapInfo(selector, text) {
  const host = document.querySelector(selector);
  if (host) host.textContent = text;
}
