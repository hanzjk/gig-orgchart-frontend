import {convertEntityToTreeNode} from "./convertEntityToTreeNode";

export function convertResultsToTreeNodes(resultsData, searchKey, collapsed, timelineDatesArray, selectedDate,
                                          setSearchKey, setCollapsed, getEntity, handleClick) {
    let data = {
        keyVal: "root",
        name: 'Government of Sri Lanka',
        children: []
    };
    let numberOfNodes = 10;
    let searchKeyLowerCase = searchKey ? searchKey.toLowerCase() : null;

    for (let entity of resultsData) {
        [data, numberOfNodes] = convertEntityToTreeNode(entity, collapsed, timelineDatesArray, selectedDate, searchKeyLowerCase,
            numberOfNodes, searchKey, setSearchKey, setCollapsed, getEntity, handleClick, data)

    }

    return [data, numberOfNodes]
}