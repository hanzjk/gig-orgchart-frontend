import React, {useEffect, useState} from "react";
import {withStyles} from '@mui/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import {Tree} from 'react-tree-graph';
import './tree.css'
import HorizontalTimeline from 'react-horizontal-timeline';
import {getValueByDate, sortValues} from "../helpers/getValueByDate";
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import './timeline.css';
import {styles} from "./styles";
import {arrayIncludesElementsIncluding} from "../helpers/arrayIncludesElementsIncluding";

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
    const [dates, setDates] = useState([]);
    const [treeData, setTreeData] = useState(rootTree);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [sortedParents, setSortedParents] = useState(null);

    function handleClick(target) {
        setAnchorEl(target);
        setIsOpen(true);
    }

    function handleClose() {
        setAnchorEl(null);
        setIsOpen(false);
    }

    useEffect(() => {
        if (!searchResults) {
            getSearchResults("OrgChart:");
        } else {
            collectDatesForTimeline();
        }
    }, [searchResults]);

    useEffect(() => {
        if (selectedDate) {
            generateTreeDataStructure();
            loadSortedParents();
        }
    }, [selectedDate]);

    useEffect(() => {
        if (collapsed) {
            generateTreeDataStructure();
        }
    }, [collapsed, searchKey]);

    function collectDatesForTimeline() {
        let datesArray = [];

        function addDateToTimeline(item) {
            let newDate = item.date;
            if (!datesArray.includes(newDate)) {
                datesArray.push(newDate);
            }
        }

        if (searchResults) {
            for (let entity of searchResults) {
                entity?.attributes?.organizations?.values?.forEach(addDateToTimeline);
                if (!entity?.attributes?.titles) {
                    console.log(entity)
                }
                entity?.attributes?.titles?.values?.forEach(addDateToTimeline);
            }
            datesArray.sort();
        }
        setDates(datesArray);
        setSelectedDate(datesArray.length - 1);
    }

    function loadSortedParents() {
        let parents = null;
        if (loadedEntity?.attributes?.parent) {
            parents = sortValues(loadedEntity?.attributes?.parent?.values);
        }
        setSortedParents(parents);
    }

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
                let organizationsValue = getValueByDate(entity?.attributes?.organizations?.values, dates[selectedDate]);
                let title = getValueByDate(entity?.attributes?.titles?.values, dates[selectedDate]);
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
                    <Paper className={classes.header} elevation={1}>
                        <div id="timeline" className={classes.timeline}>
                            <HorizontalTimeline
                                styles={{background: 'rgb(36,36,36)', foreground: '#2593B8', outline: '#dfdfdf'}}
                                index={selectedDate}
                                indexClick={(index) => {
                                    setSelectedDate(index);
                                    setPreviousDate(selectedDate);
                                }}
                                values={dates}/>
                        </div>
                    </Paper>
                    <Paper className={classes.treeContainer} style={{paddingTop: '200px'}} elevation={1}>
                        <Tree
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
                    </Paper>
                    <Popover
                        style={{maxHeight: '80%'}}
                        id={'popover'}
                        open={isOpen}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                    >
                        <Typography variant="h5">{loadedEntity?.title}<br/><br/></Typography>
                        <Typography>Parent:</Typography>
                        {sortedParents &&
                        <VerticalTimeline>
                            {sortedParents?.map((parent) => (
                                <VerticalTimelineElement
                                    key={parent.date}
                                    className="vertical-timeline-element--work"
                                    contentStyle={{background: '#3fb3d9', color: '#fff', fontSize: '10px'}}
                                    contentArrowStyle={{borderRight: '7px solid  #2593b8'}}
                                    date={parent?.date?.split('T')[0]}
                                >
                                    <p>{parent.value_string}</p>
                                </VerticalTimelineElement>
                            ))}
                        </VerticalTimeline>}
                        <Typography><br/>Last Updated: {loadedEntity?.updated_at}</Typography>
                    </Popover>
                </div>
            </div>
        );
    } else {
        return <div/>
    }
}

export default withStyles(styles)(TreeView);
