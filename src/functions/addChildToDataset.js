import {handleNodeClick} from "./handleNodeClick";
import {addNodeChildren} from "./addNodeChildren";

export function addChildToDataset(title, shouldCollapse, organizations, numberOfNodes, entity,
                                  childrenMatchingSearchKey, childMatchingSearchKeyFound, data, props) {
    const {searchKey, collapsed, setSearchKey, setCollapsed,} = props;

    if (title !== "" && !title.includes(" - Terminated on ")) {
        numberOfNodes += shouldCollapse ? organizations.length : 1;
        let childClass = 'node';
        let pathClass = 'link';
        if (collapsed.length > 0) {
            childClass = "node node-inactive";
            pathClass = 'link link-inactive';
        }
        if (shouldCollapse) {
            childClass = "node node-focused";
            pathClass = 'link';
        }
        data.children.push({
            title: entity.title,
            keyVal: title,
            name: title,
            pathProps: {className: pathClass},
            gProps: {
                className: childClass,
                onClick: () => handleNodeClick(collapsed, searchKey, setSearchKey, entity, setCollapsed),

            },
            children: shouldCollapse ? addNodeChildren(
                title, organizations, childrenMatchingSearchKey, childMatchingSearchKeyFound,
                props) : []
        })
    }
    return [data, numberOfNodes]
}