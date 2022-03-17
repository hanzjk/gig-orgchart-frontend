import React, {useEffect, useState} from "react";
import {withStyles} from '@mui/styles';
import Paper from '@mui/material/Paper';
import {AnimatedTree} from 'react-tree-graph';
import './tree.css'
import HorizontalTimeline from 'react-horizontal-timeline';
import {getValueByDate} from "../helpers/getValueByDate";
import './timeline.css';
import {styles} from "./styles";
import {arrayIncludesElementsIncluding} from "../helpers/arrayIncludesElementsIncluding";
import {collectDatesForTimeline} from "./functions/collectDatesForTimeline";
import PopWindow from "./pop_window/PopWindow";

function TreeView(props) {

    const {
        classes,
        searchKey, setSearchKey,
        searchResults, setSearchResults,
        loadedEntity, setLoadedEntity,
        isLoading, setIsLoading,
        getSearchResults, getEntity
    } = props;

    const rootTree = {keyVal: "root", name: "Government of Sri Lanka", children: []};

    const [selectedDate, setSelectedDate] = useState(0);
    const [previousDate, setPreviousDate] = useState(0);
    const [treeHeight, setTreeHeight] = useState(0);
    const [collapsed, setCollapsed] = useState([]);
    const [timelineDatesArray, setTimelineDatesArray] = useState([]);
    const [treeData, setTreeData] = useState(rootTree);
    const [anchorElement, setAnchorElement] = useState(null);
    const [isOpen, setIsOpen] = useState(false);


    function handleClick(target) {
        setAnchorElement(target);
        setIsOpen(true);
    }

    function handleClose() {
        setAnchorElement(null);
        setIsOpen(false);
    }

    useEffect(() => {
        if (!searchResults) {
            getSearchResults("OrgChart:");
        } else {
            const datesArray = collectDatesForTimeline(searchResults);
            setTimelineDatesArray(datesArray);
            setSelectedDate(datesArray.length - 1);
        }
    }, [searchResults]);

    useEffect(() => {
        if (selectedDate) {
            generateTreeDataStructure();
        }
    }, [selectedDate]);


    useEffect(() => {
        if (selectedDate) {
            generateTreeDataStructure();
        }
    }, [selectedDate]);

    useEffect(() => {
        if (collapsed) {
            generateTreeDataStructure();
        }
    }, [collapsed, searchKey]);

    function generateTreeDataStructure() {
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
            for (let entity of sortedSearchResults) {

                let organizations = null;
                let organizationsValue = getValueByDate(entity?.attributes?.organizations?.values, timelineDatesArray[selectedDate]);
                let title = getValueByDate(entity?.attributes?.titles?.values, timelineDatesArray[selectedDate]);
                let entityCollapsed = collapsed.includes(entity.title);

                if (organizationsValue !== "") {
                    organizations = JSON.parse(organizationsValue) || [];
                }
                let childrenMatchingSearchKey = arrayIncludesElementsIncluding(organizations, searchKeyLowerCase);
                let childMatchingSearchKeyFound = childrenMatchingSearchKey?.length > 0;
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
                                            setSearchKey("")
                                        } else {
                                            let index = collapseList.indexOf(entity.title);

                                            if (index > -1) {
                                                collapseList.splice(index, 1);
                                            }
                                        }
                                    } else {
                                        collapseList.push(entity.title);
                                    }
                                    setCollapsed(collapseList);
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
                                        onClick: (event) => {
                                            setSearchKey(link);
                                            const currentTarget = event.currentTarget;
                                            getEntity(link, () => handleClick(currentTarget));
                                        }
                                    },
                                }
                            }) : []
                        })
                    }
                }
            }

        }
        setTreeData(data);
        setTreeHeight(numberOfNodes * 18);
    }

    if (searchResults) {
        return (
            <div className="content">
                <div className="custom-container">
                    <div id="timeline" className={classes.timeline}>
                        <HorizontalTimeline
                            styles={{background: '#242424', foreground: '#2593B8', outline: '#dfdfdf'}}
                            index={selectedDate}
                            indexClick={(index) => {
                                setSelectedDate(index);
                                setPreviousDate(selectedDate);
                            }}
                            values={timelineDatesArray}/>
                    </div>
                    <AnimatedTree
                        data={treeData}
                        height={treeHeight}
                        width={1500}
                        svgProps={{
                            className: 'custom'
                        }}
                        margins={{bottom: 20, left: 20, right: 500, top: 20}}
                        animated
                        keyProp={"keyVal"}
                    />
                    <PopWindow
                        isOpen={isOpen}
                        anchorElement={anchorElement}
                        handleClose={handleClose}
                        loadedEntity={loadedEntity}
                    />
                </div>
            </div>
        );
    } else {
        return <div/>
    }
}

export default withStyles(styles)(TreeView);
