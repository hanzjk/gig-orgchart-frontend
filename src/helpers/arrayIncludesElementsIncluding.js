/*
Iterate through elements in an array while checking if a given searchKey is included in any of the elements
 */
export function arrayIncludesElementsIncluding(array, searchKey) {
    if (!array) {
        return null
    }
    let result = [];
    for (let item of array) {
        if (item.toLowerCase().includes(searchKey)) {
            result.push(item);
        }
    }
    return result;
}