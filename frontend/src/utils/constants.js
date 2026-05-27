const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  return "https://notezy-u585.onrender.com/api";
};

export const API_BASE_URL = getApiBaseUrl();

export const TOKEN_KEY = "enginotes_token";
export const USER_KEY = "enginotes_user";

export const ROUTES = {
  HOME: "/",
  BRANCHES: "/branches",
  BRANCH_DETAILS: "/branches/:universitySlug/:branchSlug",
  RESOURCES: "/resources",
  RESOURCE_DETAILS: "/resources/:id",
  SEARCH: "/search",
  PDF_VIEWER: "/viewer/:id",
  DASHBOARD: "/dashboard",
  SAVED_NOTES: "/dashboard/notes",
  DOWNLOADS: "/dashboard/downloads",
  PROFILE: "/dashboard/profile",
  AI_SUMMARY: "/ai/summary",
  AI_CHAT: "/ai/chat",
  PYQ_ANALYZER: "/ai/analyzer",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ABOUT: "/about",
  CONTACT: "/contact",
};
