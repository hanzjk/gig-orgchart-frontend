import {arrayIncludesElementsIncluding, getValueByDate} from "../../index";

export function generateTreeDataStructure(props, state) {

    const {searchResults, searchKey} = props;
    const {value, collapsed, dates} = state;

    let data = {
        keyVal: "root",
        name: 'Government of Sri Lanka',
        children: []
    };

    let numberOfNodes = 10;
    let searchKeyLowerCase = searchKey ? searchKey.toLowerCase() : null;

    if (searchResults) {
        let sortedSearchResults = searchResults.slice();
        sortedSearchResults?.sort((a, b) => (a.title > b.title) ? 1 : -1);
        for (let entity of sortedSearchResults){

            let organizations = null;
            let organizationsValue = getValueByDate(entity?.attributes?.organizations?.values, dates[value]);
            let title = getValueByDate(entity?.attributes?.titles?.values, dates[value]);
            let entityCollapsed = collapsed.includes(entity.title);

            if (organizationsValue !== "") {
                organizations = JSON.parse(organizationsValue) || [];
            }
            let childrenMatchingSearchKey = arrayIncludesElementsIncluding(organizations, searchKeyLowerCase);
            let childMatchingSearchKeyFound = childrenMatchingSearchKey.length > 0;
            let shouldCollapse = (organizations && entityCollapsed) || childMatchingSearchKeyFound;

            if (!searchKeyLowerCase || (searchKeyLowerCase && (title.toLowerCase().includes(searchKeyLowerCase) || childMatchingSearchKeyFound))) {
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
                            onClick: (event, node) => {
                                let collapseList = collapsed.slice();
                                if (collapseList.includes(entity.title)) {
                                    if (searchKey !== '') {
                                        this.props.handleChange('searchKey', '');
                                    } else {
                                        let index = collapseList.indexOf(entity.title);

                                        if (index > -1) {
                                            collapseList.splice(index, 1);
                                        }
                                    }
                                } else {
                                    collapseList.push(entity.title);
                                }
                                this.setState({collapsed: collapseList}, this.generateTreeDataStructure);
                            },

                        },
                        children: shouldCollapse ? organizations.map((link) => {
                            let shouldHighlight = childrenMatchingSearchKey.includes(link) || !childMatchingSearchKeyFound;
                            return {
                                keyVal: title + link,
                                name: link,
                                pathProps: {className: shouldHighlight ? 'link' : 'link link-inactive'},
                                gProps: {
                                    className: shouldHighlight ? 'node node-focused' : 'node node-inactive',
                                    onClick: (event, node) => {
                                        this.props.handleChange('searchKey', link);
                                        let eventTarget = event.currentTarget;
                                        this.props.getEntity(link, (e) => this.handleClick(eventTarget));
                                    }
                                },
                            }
                        }) : []
                    })
                }
            }
        }

    }

    return {treeData: data, treeHeight: numberOfNodes * 18};
}