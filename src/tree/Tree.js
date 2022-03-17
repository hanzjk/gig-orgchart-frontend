import React, {useEffect, useState} from "react";
import {withStyles} from '@mui/styles';
import {AnimatedTree} from 'react-tree-graph';
import './tree.css'
import HorizontalTimeline from 'react-horizontal-timeline';
import {getValueByDate} from "../helpers/getValueByDate";
import './timeline.css';
import {styles} from "./styles";
import {arrayIncludesElementsIncluding} from "../helpers/arrayIncludesElementsIncluding";
import {collectDatesForTimeline} from "./functions/collectDatesForTimeline";
import PopWindow from "./pop_window/PopWindow";
import {addNodeChildren} from "../functions/addNodeChildren";
import {handleNodeClick} from "../functions/handleNodeClick";
import {isChildMatchingSearchKeyFound} from "../functions/isChildMatchSearchKeyFound";
import {addChildToDataset} from "../functions/addChildToDataset";
import {sortSearchResults} from "../functions/sortSearchResults";
import {convertResultsToTreeNodes} from "../functions/convertResultsToTreeNodes";

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
        if (collapsed) {
            generateTreeDataStructure();
        }
    }, [collapsed, searchKey]);

    function generateTreeDataStructure() {
        if (searchResults) {
            const sortedSearchResults = sortSearchResults(searchResults);
            let [data, numberOfNodes] = convertResultsToTreeNodes(sortedSearchResults, searchKey, collapsed,
                timelineDatesArray, selectedDate, setSearchKey, setCollapsed, getEntity, handleClick);
            setTreeData(data);
            setTreeHeight(numberOfNodes * 18);
        }
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
