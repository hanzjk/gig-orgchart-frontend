import {getValueByDate} from "../helpers/getValueByDate";
import {arrayIncludesElementsIncluding} from "../helpers/arrayIncludesElementsIncluding";
import {isChildMatchingSearchKeyFound} from "./isChildMatchSearchKeyFound";
import {addChildToDataset} from "./addChildToDataset";

export function convertEntityToTreeNode(entity, searchKeyLowerCase, numberOfNodes, data, props) {

    const {collapsed, timelineDatesArray, selectedDate} = props;

    let organizations = [];
    let organizationsValue = getValueByDate(entity?.attributes?.organizations?.values, timelineDatesArray[selectedDate]);
    let title = getValueByDate(entity?.attributes?.titles?.values, timelineDatesArray[selectedDate]);
    let entityCollapsed = collapsed.includes(entity.title);

    if (organizationsValue !== "") {
        organizations = JSON.parse(organizationsValue) || [];
    }
    let childrenMatchingSearchKey = arrayIncludesElementsIncluding(organizations, searchKeyLowerCase);
    let childMatchingSearchKeyFound = childrenMatchingSearchKey?.length > 0;
    let shouldCollapse = (organizations && entityCollapsed) || childMatchingSearchKeyFound;

    if (isChildMatchingSearchKeyFound(searchKeyLowerCase, title, childMatchingSearchKeyFound)) {
        [data, numberOfNodes] = addChildToDataset(title, shouldCollapse, organizations, numberOfNodes, entity,
            childrenMatchingSearchKey, childMatchingSearchKeyFound, data, props);
    }

    return [data, numberOfNodes]
}