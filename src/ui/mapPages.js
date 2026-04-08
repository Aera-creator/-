import { concertPlan, planSingleRoute, queryFacilities, teamCollab } from '../services/systemService.js';

const points = {
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
  const page = document.body.dataset.page;
  if (page === 'map-route') renderRouteMap();
  if (page === 'map-facility') renderFacilityMap();
  if (page === 'map-concert') renderConcertMap();
  if (page === 'map-team') renderTeamMap();
}

function renderRouteMap() {
  const result = planSingleRoute({
    start: '杭州西湖',
    target: '灵隐寺',
    strategy: 'distance',
    transport: 'walk'
  });
  drawScene('#map-canvas', result.path, '路线可视化（路线规划模块）');
  setInfo('#map-info', `路径：${result.path.join(' → ')}，总成本：${result.total}`);
}

function renderFacilityMap() {
  const list = queryFacilities({ origin: '杭州西湖', category: '' }).slice(0, 4);
  const path = ['杭州西湖', ...list.map((x) => x.name).filter((name) => points[name])];
  drawScene('#map-canvas', path, '设施可视化（场所查询模块）');
  setInfo('#map-info', `附近设施：${list.map((x) => `${x.name}(${x.routeDistance})`).join('、')}`);
}

function renderConcertMap() {
  const data = concertPlan({ venue: '虹馆Live', timeLimitMin: 40 });
  drawScene('#map-canvas', data.route.path, '观演可视化（观演服务模块）');
  setInfo('#map-info', `打卡：${data.checkinRanking.map((x) => x.name).join('、')}；美食：${data.foodRanking
    .map((x) => x.name)
    .join('、')}`);
}

function renderTeamMap() {
  const data = teamCollab({ currentNode: '虹馆Live' });
  drawScene('#map-canvas', data.plannedPath, '协同可视化（多人协同模块）');
  setInfo('#map-info', `${data.alert} 当前路线：${data.plannedPath.join(' → ')}`);
}

function drawScene(selector, route, title) {
  const host = document.querySelector(selector);
  if (!host) return;
  const safeRoute = route.filter((name) => points[name]);
  const lines = [];
  for (let i = 0; i < safeRoute.length - 1; i += 1) {
    const a = points[safeRoute[i]];
    const b = points[safeRoute[i + 1]];
    lines.push(`<line x1="${a[0]}%" y1="${a[1]}%" x2="${b[0]}%" y2="${b[1]}%" stroke="#1a73e8" stroke-width="2.5" />`);
  }

  const nodes = safeRoute.map((name, idx) => {
    const p = points[name];
    return `<g>
      <circle cx="${p[0]}%" cy="${p[1]}%" r="${idx === 0 ? 8 : 6}" fill="${idx === 0 ? '#16a34a' : '#1a73e8'}" />
      <text x="${p[0]}%" y="${p[1] - 2}%" text-anchor="middle" fill="#0f172a" font-size="11">${name}</text>
    </g>`;
  });

  host.innerHTML = `
    <div class="map-title">${title}</div>
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

function setInfo(selector, text) {
  const host = document.querySelector(selector);
  if (host) host.textContent = text;
}
