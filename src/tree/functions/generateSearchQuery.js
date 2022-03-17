import {ApiRoutes, getServerUrl} from "../../server";

export function generateSearchQuery(searchParam) {
  let searchUrl = getServerUrl(ApiRoutes.search);
  if (searchParam.includes(":")) {
    let searchArray = searchParam.split(":", 2);
    searchUrl += searchArray[1] + '&categories=' + searchArray[0];
  } else {
    searchUrl += searchParam;
  }
  return searchUrl
}
