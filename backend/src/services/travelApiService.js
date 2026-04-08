export function createTravelApiService(repository) {
  return {
    getHealth() {
      return { ok: true, service: 'travel-system-api' };
    },

    getMeta() {
      return repository.getMeta();
    },

    getRecommendations(searchParams) {
      return repository.recommendPois({
        query: searchParams.get('query') || '',
        category: searchParams.get('category') || '',
        interests: searchParams.get('interests') || '夜景 演唱会 美食',
        k: Number(searchParams.get('k') || 10)
      });
    },

    getSingleRoute(searchParams) {
      return repository.getSingleRoute({
        start: searchParams.get('start') || '',
        target: searchParams.get('target') || '',
        strategy: searchParams.get('strategy') || 'distance',
        transport: searchParams.get('transport') || 'walk'
      });
    },

    getMultiRoute(searchParams) {
      return repository.getMultiRoute({
        start: searchParams.get('start') || '',
        targets: searchParams.get('targets') || '',
        strategy: searchParams.get('strategy') || 'distance'
      });
    },

    getFacilities(searchParams) {
      return repository.getFacilities({
        origin: searchParams.get('origin') || '',
        category: searchParams.get('category') || ''
      });
    },

    getDiaries(searchParams) {
      return repository.getDiaries({
        keyword: searchParams.get('keyword') || '',
        sortBy: searchParams.get('sortBy') || 'heat'
      });
    },

    saveDiaryDraft(body) {
      return repository.saveDiaryDraft(body.text || '');
    },

    getDiaryDetail(id) {
      return repository.getDiaryDetail(id);
    },

    getFoods(searchParams) {
      return repository.getFoods({
        query: searchParams.get('query') || '',
        cuisine: searchParams.get('cuisine') || '',
        near: searchParams.get('near') || '',
        k: Number(searchParams.get('k') || 10)
      });
    },

    getFoodDetail(id) {
      return repository.getFoodDetail(id);
    },

    getPoiDetail(id) {
      return repository.getPoiDetail(id);
    },

    getConcertPlan(searchParams) {
      return repository.getConcertPlan({
        venue: searchParams.get('venue') || '虹馆Live',
        timeLimitMin: searchParams.get('timeLimitMin') || '40'
      });
    },

    getProfile() {
      return repository.getProfile();
    },

    getTeamRoom(searchParams) {
      return repository.getTeamRoom(searchParams.get('currentNode') || '虹馆Live');
    }
  };
}

