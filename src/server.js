const API_URL = window?.configs?.serviceURL ? window.configs.serviceURL : "/";

export const ApiRoutes = {
    search: 'api/search?query=',
    entity: 'api/get/',
};

export function getServerUrl(url) {
    return API_URL + url
}
