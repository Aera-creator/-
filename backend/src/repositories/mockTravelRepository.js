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
  searchDiaries
} from '../../../src/services/systemService.js';

export const mockTravelRepository = {
  getMeta: () => getSystemMeta(),
  recommendPois: (params) => recommendPOI(params),
  getSingleRoute: (params) => planSingleRoute(params),
  getMultiRoute: (params) => planMultiRoute(params),
  getFacilities: (params) => queryFacilities(params),
  getDiaries: (params) => searchDiaries(params),
  saveDiaryDraft: (text) => compressDiary(text),
  getDiaryDetail: (id) => getDiaryDetail(id),
  getFoods: (params) => recommendFood(params),
  getFoodDetail: (id) => getFoodDetail(id),
  getPoiDetail: (id) => getPOIDetail(id),
  getConcertPlan: (params) => concertPlan(params),
  getProfile: () => buildProfile(),
  getTeamRoom: (currentNode) => getTeamRoom(currentNode)
};

