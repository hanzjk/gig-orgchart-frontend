import {convertEntityToTreeNode} from "./convertEntityToTreeNode";

export function convertResultsToTreeNodes(resultsData, props) {

    const {searchKey} = props;

    let data = {
        keyVal: "root",
        name: 'Government of Sri Lanka',
        children: []
    };
    let numberOfNodes = 10;
    let searchKeyLowerCase = searchKey ? searchKey.toLowerCase() : null;

    for (let entity of resultsData) {
        [data, numberOfNodes] = convertEntityToTreeNode(entity, searchKeyLowerCase,
            numberOfNodes, data, props)

    }

    return [data, numberOfNodes]
}