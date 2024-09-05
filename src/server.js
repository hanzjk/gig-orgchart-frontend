export const ApiRoutes = {
    search: 'search?query=',
    entity: 'get/',
};

export function getServerUrl(url) {
    return process.env.REACT_APP_SERVER_URL + url
}
