export function isChildMatchingSearchKeyFound(searchKeyLowerCase, title, childMatchingSearchKeyFound) {
    return (!searchKeyLowerCase || (searchKeyLowerCase && (title.toLowerCase().includes(searchKeyLowerCase) || childMatchingSearchKeyFound)))
}