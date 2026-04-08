import { json, readJson } from '../lib/http.js';

export async function handleApiRequest(req, pathname, searchParams, res, service) {
  if (!pathname.startsWith('/api')) return false;

  if (pathname === '/api/health') return respond(res, 200, service.getHealth());
  if (pathname === '/api/meta') return respond(res, 200, service.getMeta());
  if (pathname === '/api/recommendations') return respond(res, 200, service.getRecommendations(searchParams));
  if (pathname === '/api/routes/single') return respond(res, 200, service.getSingleRoute(searchParams));
  if (pathname === '/api/routes/multi') return respond(res, 200, service.getMultiRoute(searchParams));
  if (pathname === '/api/facilities') return respond(res, 200, service.getFacilities(searchParams));
  if (pathname === '/api/diaries') return respond(res, 200, service.getDiaries(searchParams));
  if (pathname === '/api/diary-draft' && req.method === 'POST') {
    const body = await readJson(req);
    return respond(res, 200, service.saveDiaryDraft(body));
  }
  if (pathname.startsWith('/api/diaries/')) {
    const id = decodeURIComponent(pathname.replace('/api/diaries/', ''));
    const data = service.getDiaryDetail(id);
    return respond(res, data ? 200 : 404, data || { error: 'Diary not found' });
  }
  if (pathname === '/api/foods') return respond(res, 200, service.getFoods(searchParams));
  if (pathname.startsWith('/api/foods/')) {
    const id = decodeURIComponent(pathname.replace('/api/foods/', ''));
    const data = service.getFoodDetail(id);
    return respond(res, data ? 200 : 404, data || { error: 'Food not found' });
  }
  if (pathname.startsWith('/api/pois/')) {
    const id = decodeURIComponent(pathname.replace('/api/pois/', ''));
    const data = service.getPoiDetail(id);
    return respond(res, data ? 200 : 404, data || { error: 'POI not found' });
  }
  if (pathname === '/api/concert-plan') return respond(res, 200, service.getConcertPlan(searchParams));
  if (pathname === '/api/profile') return respond(res, 200, service.getProfile());
  if (pathname === '/api/team-room') return respond(res, 200, service.getTeamRoom(searchParams));

  return respond(res, 404, { error: 'Not found', path: pathname });
}

function respond(res, status, data) {
  json(res, status, data);
  return true;
}

