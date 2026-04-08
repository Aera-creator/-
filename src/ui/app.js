import {
  buildProfile,
  compressDiary,
  concertPlan,
  getSystemMeta,
  planMultiRoute,
  planSingleRoute,
  queryFacilities,
  recommendFood,
  recommendPOI,
  searchDiaries,
  teamCollab
} from '../services/systemService.js';

const state = { interests: '夜景 演唱会 美食 文化' };

const modules = [
  { id: 'module-user', label: '用户偏好' },
  { id: 'module-recommend', label: '旅游推荐' },
  { id: 'module-route', label: '路线规划' },
  { id: 'module-facility', label: '场所查询' },
  { id: 'module-diary', label: '日记管理' },
  { id: 'module-food', label: '美食推荐' },
  { id: 'module-concert', label: '观演专属' },
  { id: 'module-profile', label: '用户画像' },
  { id: 'module-team', label: '多人协同' }
];

init();

function init() {
  renderMeta();
  renderNav();
  bindActions();
  renderUserState();
}

function renderMeta() {
  const meta = getSystemMeta();
  const host = document.querySelector('#meta');
  host.innerHTML = [
    cardMeta('POI 总量', meta.poiCount),
    cardMeta('日记总量', meta.diaryCount),
    cardMeta('美食总量', meta.foodCount),
    cardMeta('图节点', meta.graphNodeCount),
    cardMeta('模块', meta.moduleCount),
    cardMeta('数据源', meta.dataMode === 'mock' ? '模拟数据' : 'API')
  ].join('');
}

function renderNav() {
  const nav = document.querySelector('#nav');
  nav.innerHTML = modules
    .map((m, i) => `<button class="${i === 0 ? 'active' : ''}" data-id="${m.id}">${m.label}</button>`)
    .join('');

  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    document.querySelectorAll('#nav button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.module').forEach((m) => m.classList.remove('active'));
    document.querySelector(`#${btn.dataset.id}`)?.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function bindActions() {
  document.querySelector('#save-interests').addEventListener('click', () => {
    state.interests = value('#user-interests') || state.interests;
    renderUserState();
  });

  document.querySelector('#run-poi').addEventListener('click', () => {
    const list = recommendPOI({
      query: value('#poi-query'),
      category: value('#poi-category'),
      interests: state.interests,
      k: 8
    });
    const html = list.length
      ? list
          .map(
            (item) => `
          <article class="result-card">
            <h4>${escapeHtml(item.name)}</h4>
            <div class="line">类别：${item.category} · 区域：${item.area}</div>
            <div class="line">热度：${item.heat} · 评分：${item.rating} · 综合分：${item.score}</div>
            <div>${item.tags.map((t) => `<span class="badge">${escapeHtml(t)}</span>`).join('')}</div>
          </article>
        `
          )
          .join('')
      : `<p class="tip">暂无匹配推荐，请修改关键词或类别。</p>`;
    setHtml('#poi-output', html);
  });

  document.querySelector('#run-route').addEventListener('click', () => {
    const result = planSingleRoute({
      start: value('#route-start'),
      target: value('#route-target'),
      strategy: value('#route-strategy'),
      transport: 'walk'
    });
    if (result.error) {
      setHtml('#route-output', `<p class="tip">${result.error}</p>`);
      return;
    }
    setHtml(
      '#route-output',
      `
      <article class="result-card">
        <h4>单目标路径</h4>
        <div class="line">策略：${labelStrategy(result.strategy)} · 总成本：${result.total}</div>
        <div class="path">${result.path.map(escapeHtml).join(' → ')}</div>
      </article>
      `
    );
  });

  document.querySelector('#run-multi-route').addEventListener('click', () => {
    const result = planMultiRoute({
      start: value('#route-start'),
      targets: value('#multi-targets'),
      strategy: value('#route-strategy')
    });
    setHtml(
      '#route-output',
      `
      <article class="result-card">
        <h4>多目标闭环路径</h4>
        <div class="line">访问点数量：${result.visited} · 总成本：${result.total}</div>
        <div class="path">${result.path.map(escapeHtml).join(' → ')}</div>
      </article>
      `
    );
  });

  document.querySelector('#run-facility').addEventListener('click', () => {
    const list = queryFacilities({ origin: value('#facility-origin'), category: value('#facility-category') });
    const html = list.length
      ? list
          .map(
            (item) => `
          <article class="result-card">
            <h4>${escapeHtml(item.name)}</h4>
            <div class="line">路径距离：${item.routeDistance}</div>
            <div>${item.tags.map((t) => `<span class="badge">${escapeHtml(t)}</span>`).join('')}</div>
          </article>
        `
          )
          .join('')
      : `<p class="tip">未找到可达设施，请更换起点或筛选条件。</p>`;
    setHtml('#facility-output', html);
  });

  document.querySelector('#run-diary-search').addEventListener('click', () => {
    const list = searchDiaries({ keyword: value('#diary-keyword'), sortBy: value('#diary-sort') });
    const html = list.length
      ? list
          .slice(0, 8)
          .map(
            (item) => `
          <article class="result-card">
            <h4>${escapeHtml(item.title)}</h4>
            <div class="line">作者：${escapeHtml(item.author)} · 目的地：${escapeHtml(item.destination)}</div>
            <div class="line">热度：${item.heat} · 评分：${item.rating}</div>
            <div class="line">${escapeHtml(item.body)}</div>
          </article>
        `
          )
          .join('')
      : `<p class="tip">未检索到匹配日记。</p>`;
    setHtml('#diary-output', `<div class="grid-result">${html}</div>`);
  });

  document.querySelector('#run-diary-compress').addEventListener('click', () => {
    const compressed = compressDiary(value('#diary-text'));
    setHtml(
      '#diary-output',
      `
      <article class="result-card">
        <h4>压缩结果</h4>
        <div class="line">压缩比（相对 8bit 文本）：${compressed.ratio}</div>
        <div class="line">编码字典大小：${Object.keys(compressed.dict).length}</div>
        <div class="line">二进制长度：${compressed.binary.length}</div>
      </article>
      `
    );
  });

  document.querySelector('#run-food').addEventListener('click', () => {
    const list = recommendFood({
      query: value('#food-query'),
      cuisine: value('#food-cuisine'),
      near: value('#food-near'),
      k: 8
    });
    const html = list.length
      ? list
          .map(
            (item) => `
          <article class="result-card">
            <h4>${escapeHtml(item.name)}</h4>
            <div class="line">菜系：${escapeHtml(item.cuisine)} · 店铺：${escapeHtml(item.shop)}</div>
            <div class="line">热度：${item.heat} · 评分：${item.rating} · 综合分：${item.score}</div>
            <div class="line">附近：${escapeHtml(item.near)}</div>
          </article>
        `
          )
          .join('')
      : `<p class="tip">暂无匹配美食，请放宽筛选条件。</p>`;
    setHtml('#food-output', html);
  });

  document.querySelector('#run-concert').addEventListener('click', () => {
    const data = concertPlan({
      venue: value('#concert-venue'),
      timeLimitMin: value('#concert-time-limit')
    });
    if (data.error) {
      setHtml('#concert-output', `<p class="tip">${data.error}</p>`);
      return;
    }
    setHtml(
      '#concert-output',
      `
      <article class="result-card">
        <h4>${escapeHtml(data.concert.venue)} · 观演组合方案</h4>
        <div class="line">时间：${data.concert.startTime} - ${data.concert.endTime} · 城市：${data.concert.city}</div>
        <div class="line">建议提前出发：${data.adviseDepartureMin} 分钟</div>
        <div class="path">场馆路径：${data.route.path.map(escapeHtml).join(' → ')}</div>
        <div class="line">推荐打卡：${data.checkinRanking.map((x) => x.name).join('、')}</div>
        <div class="line">散场美食：${data.foodRanking.map((x) => x.name).join('、')}</div>
      </article>
      `
    );
  });

  document.querySelector('#run-profile').addEventListener('click', () => {
    const profiles = buildProfile();
    setHtml(
      '#profile-output',
      profiles
        .map(
          (u) => `
        <article class="result-card">
          <h4>${escapeHtml(u.name)}</h4>
          <div class="line">聚类簇：${u.cluster} · 等级：Lv.${u.level}</div>
          <div class="line">经验值：${u.exp} / 下一等级：${u.nextLevelExp}</div>
          <div class="line">${escapeHtml(u.annualMemory)}</div>
        </article>
      `
        )
        .join('')
    );
  });

  document.querySelector('#run-team').addEventListener('click', () => {
    const data = teamCollab({ currentNode: value('#team-current-node') });
    setHtml(
      '#team-output',
      `
      <article class="result-card">
        <h4>协同状态</h4>
        <div class="line">当前节点：${escapeHtml(data.currentNode)} · 票选结果：${escapeHtml(data.voted)}</div>
        <div class="line">队伍成员：${data.members.map(escapeHtml).join('、')}</div>
        <div class="path">规划路径：${data.plannedPath.map(escapeHtml).join(' → ')}</div>
        <div class="line ${data.deviation.deviated ? 'tip' : ''}">${escapeHtml(data.alert)}</div>
      </article>
      `
    );
  });
}

function renderUserState() {
  setHtml(
    '#user-output',
    `
    <article class="result-card">
      <h4>当前偏好</h4>
      <div>${state.interests
        .split(/[，,\s]+/)
        .filter(Boolean)
        .map((x) => `<span class="badge">${escapeHtml(x)}</span>`)
        .join('')}</div>
      <div class="line">偏好已用于旅游推荐与观演模块。</div>
    </article>
  `
  );
}

function value(selector) {
  return document.querySelector(selector)?.value?.trim() || '';
}

function setHtml(selector, html) {
  const host = document.querySelector(selector);
  host.innerHTML = html;
}

function labelStrategy(strategy) {
  if (strategy === 'distance') return '最短距离';
  if (strategy === 'time') return '最短时间';
  if (strategy === 'crowd') return '拥堵规避';
  return strategy;
}

function cardMeta(label, value) {
  return `<div class="meta-item"><b>${label}</b><span>${value}</span></div>`;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
