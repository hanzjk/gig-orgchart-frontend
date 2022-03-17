export function sortSearchResults(searchResults) {
    let sortedSearchResults = searchResults.slice();
    sortedSearchResults?.sort((a, b) => (a.title > b.title) ? 1 : -1);
    return sortedSearchResults;
}