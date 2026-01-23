export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login/`,
    SIGNUP: `${API_BASE_URL}/auth/signup/`,
    LOGOUT: `${API_BASE_URL}/auth/logout/`,
    ME: `${API_BASE_URL}/auth/me/`,
    REFRESH: `${API_BASE_URL}/auth/token/refresh/`,
  },
  TRIAGE: {
    ASSESS: `${API_BASE_URL}/triage/assess/`,
    HISTORY: `${API_BASE_URL}/triage/history/`,
    DETAIL: (id: number) => `${API_BASE_URL}/triage/${id}/`,
  },
  CONSULTATION: {
    START: `${API_BASE_URL}/consultation/start/`,
    UPDATE: (id: number) => `${API_BASE_URL}/consultation/${id}/update/`,
    COMPLETE: (id: number) => `${API_BASE_URL}/consultation/${id}/complete/`,
    HISTORY: `${API_BASE_URL}/consultation/history/`,
    ACTIVE: `${API_BASE_URL}/consultation/active/`,
  },
  PROFILE: {
    GET: `${API_BASE_URL}/profile/`,
    UPDATE: `${API_BASE_URL}/profile/update/`,
  },
  REPORTS: {
    LIST: `${API_BASE_URL}/reports/`,
    DETAIL: (id: number) => `${API_BASE_URL}/reports/${id}/`,
    GENERATE: `${API_BASE_URL}/reports/generate/`,
  },
  FACILITIES: {
    RECOMMEND: `${API_BASE_URL}/facilities/recommend/`,
    SEARCH: `${API_BASE_URL}/facilities/search/`,
  },
  DIETARY: {
    RECOMMENDATIONS: `${API_BASE_URL}/dietary/recommendations/`,
  },
};
