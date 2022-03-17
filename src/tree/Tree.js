import React, {useEffect, useState, useCallback} from "react";
import {withStyles} from '@mui/styles';
import {AnimatedTree} from 'react-tree-graph';
import './tree.css'
import HorizontalTimeline from 'react-horizontal-timeline';
import './timeline.css';
import {styles} from "./styles";
import {collectDatesForTimeline} from "./functions/collectDatesForTimeline";
import PopWindow from "./pop_window/PopWindow";
import {sortSearchResults} from "../functions/sortSearchResults";
import {convertResultsToTreeNodes} from "../functions/convertResultsToTreeNodes";

function TreeView(props) {

    const {classes, searchKey, searchResults, getSearchResults, setSearchKey, getEntity, loadedEntity} = props;

    const rootTree = {keyVal: "root", name: "Government of Sri Lanka", children: []};

    const [selectedDate, setSelectedDate] = useState(0);
    const [treeHeight, setTreeHeight] = useState(0);
    const [collapsed, setCollapsed] = useState([]);
    const [timelineDatesArray, setTimelineDatesArray] = useState([]);
    const [treeData, setTreeData] = useState(rootTree);
    const [anchorElement, setAnchorElement] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const props_for_pop_window = {isOpen, anchorElement, setAnchorElement, setIsOpen, loadedEntity};


    const generateTreeDataStructure = useCallback(() => {
        if (searchResults) {
            const props_for_tree_view = {
                searchKey, collapsed, timelineDatesArray, selectedDate,
                setSearchKey, setCollapsed, getEntity, setAnchorElement, setIsOpen
            };

            const sortedSearchResults = sortSearchResults(searchResults);
            let [data, numberOfNodes] = convertResultsToTreeNodes(sortedSearchResults, props_for_tree_view);
            setTreeData(data);
            setTreeHeight(numberOfNodes * 18);
        }
    }, [searchResults, searchKey, collapsed, timelineDatesArray, selectedDate,
        setSearchKey, setCollapsed, getEntity, setAnchorElement, setIsOpen]);

    useEffect(() => {
        if (!searchResults) {
            getSearchResults("OrgChart:");
        } else {
            const datesArray = collectDatesForTimeline(searchResults);
            setTimelineDatesArray(datesArray);
            setSelectedDate(datesArray.length - 1);
        }
    }, [searchResults, getSearchResults]);

    useEffect(() => {
        if (selectedDate || collapsed) {
            generateTreeDataStructure();
        }
    }, [selectedDate, collapsed, searchKey, generateTreeDataStructure]);

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
                    <PopWindow {...props_for_pop_window}/>
                </div>
            </div>
        );
    } else {
        return <div/>
    }
}

export default withStyles(styles)(TreeView);
