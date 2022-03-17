export const ApiRoutes = {
    search: 'api/search?query=',
    entity: 'api/get/',
};

export function getServerUrl(url) {
    return process.env.REACT_APP_SERVER_URL + url
}
