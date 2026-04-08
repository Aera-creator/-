const basePois = [
  { id: 'poi-westlake', name: '杭州西湖', category: '景点', tags: ['自然', '湖景', '拍照'], heat: 98, rating: 4.9, area: '杭州' },
  { id: 'poi-lingyin', name: '灵隐寺', category: '景点', tags: ['文化', '祈福', '历史'], heat: 90, rating: 4.8, area: '杭州' },
  { id: 'poi-zju', name: '浙江大学紫金港', category: '学校', tags: ['校园', '人文', '骑行'], heat: 82, rating: 4.7, area: '杭州' },
  { id: 'poi-bund', name: '上海外滩', category: '景点', tags: ['夜景', '建筑', '打卡'], heat: 96, rating: 4.9, area: '上海' },
  { id: 'poi-shu', name: '四川大学望江', category: '学校', tags: ['校园', '银杏', '历史'], heat: 76, rating: 4.6, area: '成都' },
  { id: 'svc-hospital', name: '景区医疗服务点', category: '服务设施', tags: ['医疗', '应急'], heat: 70, rating: 4.5, area: '杭州' },
  { id: 'svc-market', name: '湖滨超市', category: '服务设施', tags: ['超市', '补给'], heat: 65, rating: 4.3, area: '杭州' },
  { id: 'svc-wc', name: '断桥公厕', category: '服务设施', tags: ['卫生间', '便民'], heat: 84, rating: 4.2, area: '杭州' },
  { id: 'checkin-musicwall', name: '音乐涂鸦墙', category: '打卡点', tags: ['演唱会', '拍照', '社交'], heat: 88, rating: 4.7, area: '上海' },
  { id: 'checkin-riverwalk', name: '江畔灯光步道', category: '打卡点', tags: ['夜景', '散步', '拍照'], heat: 91, rating: 4.8, area: '上海' }
];

const cityCatalog = [
  {
    area: '杭州',
    scenic: ['九溪烟树', '太子湾公园', '龙井村', '湘湖湿地', '运河拱宸桥'],
    schools: ['杭州师范大学', '浙江工业大学', '中国美术学院'],
    checkin: ['湖滨银泰天台', '钱江新城城市阳台'],
    facilities: ['游客服务中心', '地铁换乘点', '城市驿站']
  },
  {
    area: '上海',
    scenic: ['豫园城隍庙', '武康路', '徐家汇书院', '前滩休闲公园', '苏河湾步道'],
    schools: ['复旦大学邯郸路', '同济大学四平路', '华东师范大学中山北路'],
    checkin: ['M50创意园', '外白渡桥观景台'],
    facilities: ['城市医疗点', '24小时便利站', '旅客休息区']
  },
  {
    area: '成都',
    scenic: ['宽窄巷子', '东郊记忆', '望江楼公园', '锦江夜游码头', '天府艺术公园'],
    schools: ['电子科技大学清水河', '西南交通大学犀浦', '西南财经大学柳林'],
    checkin: ['太古里街拍角', '府河音乐阶梯'],
    facilities: ['应急服务站', '游客补给店', '公共卫生站']
  }
];

const scenicTags = ['夜景', '文化', '建筑', '自然', '城市漫步', '拍照'];
const schoolTags = ['校园', '骑行', '人文', '学习氛围', '历史'];

function generatePois() {
  const generated = [];
  let index = 1;
  for (const city of cityCatalog) {
    for (const name of city.scenic) {
      generated.push({
        id: `gen-scenic-${index}`,
        name,
        category: '景点',
        tags: pickTags(scenicTags, 3),
        heat: randomInt(68, 97),
        rating: randomFloat(4.2, 4.9),
        area: city.area
      });
      index += 1;
    }
    for (const name of city.schools) {
      generated.push({
        id: `gen-school-${index}`,
        name,
        category: '学校',
        tags: pickTags(schoolTags, 3),
        heat: randomInt(60, 90),
        rating: randomFloat(4.1, 4.8),
        area: city.area
      });
      index += 1;
    }
    for (const name of city.checkin) {
      generated.push({
        id: `gen-checkin-${index}`,
        name,
        category: '打卡点',
        tags: ['拍照', '社交', '夜景'],
        heat: randomInt(70, 95),
        rating: randomFloat(4.3, 4.9),
        area: city.area
      });
      index += 1;
    }
    for (const name of city.facilities) {
      generated.push({
        id: `gen-service-${index}`,
        name: `${city.area}${name}`,
        category: '服务设施',
        tags: ['便民', '服务'],
        heat: randomInt(55, 82),
        rating: randomFloat(4.0, 4.6),
        area: city.area
      });
      index += 1;
    }
  }

  return generated;
}

const baseFoods = [
  { id: 'food-soupbun', name: '阿福汤包', cuisine: '江浙菜', shop: '湖滨店', heat: 92, rating: 4.8, near: '杭州西湖' },
  { id: 'food-hotpot', name: '深夜火锅局', cuisine: '火锅', shop: '人民广场店', heat: 94, rating: 4.7, near: '上海外滩' },
  { id: 'food-noodle', name: '老街牛肉面', cuisine: '面食', shop: '灵隐路店', heat: 79, rating: 4.5, near: '灵隐寺' },
  { id: 'food-dessert', name: '月光甜品社', cuisine: '甜品', shop: '江景店', heat: 86, rating: 4.6, near: '上海外滩' },
  { id: 'food-snack', name: '演出后夜宵摊', cuisine: '小吃', shop: '场馆南门', heat: 90, rating: 4.4, near: '虹馆Live' }
];

const cuisinePool = ['火锅', '江浙菜', '川菜', '烧烤', '甜品', '轻食', '面食', '日料'];
const foodNearPool = ['杭州西湖', '灵隐寺', '上海外滩', '虹馆Live', '武康路', '东郊记忆'];

function generateFoods() {
  const items = [];
  for (let i = 0; i < 32; i += 1) {
    const cuisine = cuisinePool[i % cuisinePool.length];
    const near = foodNearPool[i % foodNearPool.length];
    items.push({
      id: `gen-food-${i + 1}`,
      name: `${near}${cuisine}推荐店${i + 1}`,
      cuisine,
      shop: `旗舰店${(i % 9) + 1}`,
      heat: randomInt(62, 97),
      rating: randomFloat(4.0, 4.9),
      near
    });
  }
  return items;
}

const diaryTemplates = [
  '今天的线路非常顺，先逛{place}，再去{place2}，最后在{food}收尾。',
  '如果你喜欢拍照和城市漫步，这条路线在{place}附近非常值得尝试。',
  '团队出行建议先约在{place}集合，避开高峰后再去{place2}。',
  '散场后从{place}步行到{food}，体验很好，等待时间也可控。'
];

function generateDiaries() {
  const authors = ['小夏', '阿诚', '小柠', '路远', '禾苗', '青木', '渡口', 'Echo'];
  const destinationPool = ['上海外滩', '杭州西湖', '灵隐寺', '武康路', '东郊记忆', '九溪烟树'];
  const foodPool = ['深夜火锅局', '阿福汤包', '月光甜品社'];
  const result = [];

  for (let i = 0; i < 24; i += 1) {
    const destination = destinationPool[i % destinationPool.length];
    const place2 = destinationPool[(i + 2) % destinationPool.length];
    const food = foodPool[i % foodPool.length];
    const tpl = diaryTemplates[i % diaryTemplates.length];
    const body = tpl.replace('{place}', destination).replace('{place2}', place2).replace('{food}', food);

    result.push({
      id: `gen-diary-${i + 1}`,
      title: `${destination}行程记录 #${i + 1}`,
      author: authors[i % authors.length],
      destination,
      body,
      heat: randomInt(350, 2500),
      rating: randomFloat(4.0, 5.0)
    });
  }
  return result;
}

export const pois = basePois.concat(generatePois());
export const foods = baseFoods.concat(generateFoods());
export const diaries = [
  {
    id: 'd1',
    title: '观演前的上海一日线路',
    author: '小夏',
    destination: '上海外滩',
    body: '中午到外滩，下午去音乐涂鸦墙拍照，晚上去虹馆Live看演唱会，散场后吃火锅。',
    heat: 1600,
    rating: 4.9
  },
  {
    id: 'd2',
    title: '西湖慢行与校园骑行',
    author: '阿诚',
    destination: '杭州西湖',
    body: '早上西湖环线，午后转场浙大，晚上湖滨散步，适合轻松节奏旅行。',
    heat: 1040,
    rating: 4.7
  },
  {
    id: 'd3',
    title: '灵隐寺祈福路线实测',
    author: '小柠',
    destination: '灵隐寺',
    body: '灵隐寺附近补给点多，建议先去医疗服务点再进山，回程可以吃老街牛肉面。',
    heat: 880,
    rating: 4.6
  }
].concat(generateDiaries());

export const graphEdges = [
  ['杭州西湖', '灵隐寺', { distance: 7, time: 18, crowd: 1.2, walkOnly: false }],
  ['杭州西湖', '浙江大学紫金港', { distance: 10, time: 22, crowd: 1.1, walkOnly: false }],
  ['杭州西湖', '断桥公厕', { distance: 1, time: 3, crowd: 1.0, walkOnly: true }],
  ['断桥公厕', '湖滨超市', { distance: 1.5, time: 5, crowd: 1.0, walkOnly: true }],
  ['灵隐寺', '景区医疗服务点', { distance: 0.8, time: 2, crowd: 1.0, walkOnly: true }],
  ['灵隐寺', '老街牛肉面', { distance: 1.7, time: 6, crowd: 1.1, walkOnly: true }],
  ['杭州西湖', '阿福汤包', { distance: 2.0, time: 7, crowd: 1.0, walkOnly: false }],
  ['上海外滩', '虹馆Live', { distance: 6, time: 16, crowd: 1.3, walkOnly: false }],
  ['虹馆Live', '音乐涂鸦墙', { distance: 1.2, time: 4, crowd: 1.4, walkOnly: true }],
  ['虹馆Live', '江畔灯光步道', { distance: 1.6, time: 6, crowd: 1.2, walkOnly: true }],
  ['音乐涂鸦墙', '深夜火锅局', { distance: 1.1, time: 5, crowd: 1.1, walkOnly: true }],
  ['江畔灯光步道', '月光甜品社', { distance: 1.3, time: 4, crowd: 1.0, walkOnly: true }],
  ['上海外滩', '深夜火锅局', { distance: 2.2, time: 8, crowd: 1.3, walkOnly: false }],
  ['上海外滩', '武康路', { distance: 5.5, time: 15, crowd: 1.2, walkOnly: false }],
  ['武康路', 'M50创意园', { distance: 3.3, time: 11, crowd: 1.1, walkOnly: false }],
  ['武康路', '外白渡桥观景台', { distance: 4.0, time: 12, crowd: 1.3, walkOnly: false }],
  ['杭州西湖', '九溪烟树', { distance: 6.2, time: 18, crowd: 1.1, walkOnly: false }],
  ['九溪烟树', '龙井村', { distance: 2.4, time: 9, crowd: 1.0, walkOnly: true }],
  ['成都宽窄巷子', '东郊记忆', { distance: 7.1, time: 20, crowd: 1.2, walkOnly: false }]
];

export const concerts = [
  {
    id: 'c1',
    venue: '虹馆Live',
    city: '上海',
    startTime: '19:30',
    endTime: '22:00',
    crowdByPeriod: { preShow: 1.2, postShow: 1.6 },
    checkins: ['音乐涂鸦墙', '江畔灯光步道', '外白渡桥观景台'],
    foodCandidates: ['深夜火锅局', '月光甜品社', '演出后夜宵摊']
  }
];

export const users = [
  {
    id: 'u1',
    name: '演出党小李',
    interests: ['夜景', '演唱会', '美食'],
    behaviorVector: [90, 75],
    level: 3,
    exp: 320
  },
  {
    id: 'u2',
    name: '校园控小周',
    interests: ['校园', '骑行', '人文'],
    behaviorVector: [45, 88],
    level: 2,
    exp: 180
  },
  {
    id: 'u3',
    name: '文化旅小王',
    interests: ['文化', '祈福', '历史'],
    behaviorVector: [70, 60],
    level: 4,
    exp: 520
  },
  {
    id: 'u4',
    name: '城市漫步阿青',
    interests: ['建筑', '街拍', '夜景'],
    behaviorVector: [84, 70],
    level: 2,
    exp: 210
  },
  {
    id: 'u5',
    name: '路线控Mia',
    interests: ['高效路线', '规划', '打卡'],
    behaviorVector: [63, 95],
    level: 5,
    exp: 730
  }
];

export const teamState = {
  teamId: 't1',
  members: ['演出党小李', '校园控小周', '文化旅小王'],
  candidatePoints: ['上海外滩', '虹馆Live', '音乐涂鸦墙', '深夜火锅局'],
  vote: {
    A: 2,
    B: 1
  },
  plannedPath: ['上海外滩', '虹馆Live', '音乐涂鸦墙', '深夜火锅局']
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  const val = Math.random() * (max - min) + min;
  return Number(val.toFixed(1));
}

function pickTags(pool, size) {
  const picked = [];
  while (picked.length < size) {
    const candidate = pool[randomInt(0, pool.length - 1)];
    if (!picked.includes(candidate)) picked.push(candidate);
  }
  return picked;
}
