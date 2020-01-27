import React, {Component} from "react";
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Tree from 'react-tree-graph';
import './tree.css'
import HorizontalTimeline from 'react-horizontal-timeline';
import {arrayIncludesElementsIncluding, getValueByDate, sortValues} from "../index";
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import './timeline.css';

const styles = theme => ({
    header: {
        position: 'fixed',
        left: '10px',
        right: '10px',
        backgroundColor: 'rgba(36,36,36,0.8)',
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        color: 'white',
        textAlign: 'left',
        margin: '47px -10px -10px -10px',
    },
    treeContainer: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        color: 'white',
        textAlign: 'left',
        margin: '10px',
        backgroundColor: '#242424',
    },
    timeline: {
        height: '70px',
        margin: '10px'
    },
});

class TreeView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            previous: 0,
            collapsed: [],
            treeHeight: 0,
            dates: [],
            treeData: {
                keyVal: "root",
                name: '',
                children: []
            },
            anchorEl: null,
            open: false
        };

        this.generateTreeDataStructure = this.generateTreeDataStructure.bind(this);
        this.collectDatesForTimeline = this.collectDatesForTimeline.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);

    }

    handleClick = event => {
        this.setState({anchorEl: event.currentTarget, open: Boolean(event.currentTarget)});
    };

    handleClose = () => {
        this.setState({anchorEl: null, open: Boolean(null)});
    };

    componentDidMount() {
        this.props.getSearchResults("OrgChart:");
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.searchResults !== this.props.searchResults) {
            this.collectDatesForTimeline();
        }
        if (prevState.dates !== this.state.dates) {
            this.generateTreeDataStructure();
        }
        if (prevProps.searchKey !== this.props.searchKey) {
            this.generateTreeDataStructure();
        }

    }

    collectDatesForTimeline() {
        const {searchResults} = this.props;

        let i, dates = [];

        function addDateToTimeline(item) {
            let newDate = item.date;
            if (!dates.includes(newDate)) {
                dates.push(newDate);
            }
        }

        if (searchResults) {
            for (i = 0; i < searchResults.length; i++) {
                let entity = searchResults[i];
                entity.attributes.organizations.forEach(addDateToTimeline);
                if (entity.attributes.titles === undefined) {
                    console.log(entity)
                }
                entity.attributes.titles.forEach(addDateToTimeline);
            }
            dates.sort();
        }

        this.setState({dates: dates, value: dates.length - 1});
    }

    generateTreeDataStructure() {

        const {searchResults, searchKey} = this.props;
        const {value, collapsed, dates} = this.state;

        let data = {
            keyVal: "root",
            name: 'Government of Sri Lanka',
            children: []
        };

        let numberOfNodes = 10, searchKeyLowerCase = searchKey ? searchKey.toLowerCase() : null;

        if (searchResults) {
            let i, sortedSearchResults = searchResults.slice();
            sortedSearchResults.sort((a, b) => (a.title > b.title) ? 1 : -1);
            for (i = 0; i < sortedSearchResults.length; i++) {

                let organizations = null, entity = sortedSearchResults[i];
                let organizationsValue = getValueByDate(entity.attributes.organizations, dates[value]);
                let title = getValueByDate(entity.attributes.titles, dates[value]);
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
                                    if (searchKey !== '') {
                                        this.props.handleChange('searchKey', '');
                                    } else {
                                        let collapseList = collapsed.slice();
                                        if (collapseList.includes(entity.title)) {
                                            let index = collapseList.indexOf(entity.title);

                                            if (index > -1) {
                                                collapseList.splice(index, 1);
                                            }
                                        } else {
                                            collapseList.push(entity.title);
                                        }
                                        this.setState({collapsed: collapseList}, this.generateTreeDataStructure);
                                    }
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
                                            this.props.getEntity(link);
                                            this.handleClick(event)
                                        }
                                    },
                                }
                            }) : []
                        })
                    }
                }
            }

        }

        this.setState({treeData: data, treeHeight: numberOfNodes * 18});
    }

    render() {
        const {classes, searchResults, loadedEntity} = this.props;
        const {value, treeData, treeHeight, dates, anchorEl, open} = this.state;
        let sortedParents = null;
        if (loadedEntity) {
            for (let i = 0; i < loadedEntity.attributes.length; i++) {
                if (loadedEntity.attributes[i].name === "parent") {
                    sortedParents = sortValues(loadedEntity.attributes[i].values);
                    break;
                }
            }
        }

        if (searchResults) {
            return (
                <div className="content">
                    <div className="custom-container">
                        <Paper className={classes.header} elevation={1}>
                            <div id="timeline" className={classes.timeline}>
                                <HorizontalTimeline
                                    styles={{background: '#242424', foreground: '#2593B8', outline: '#dfdfdf'}}
                                    index={value}
                                    indexClick={(index) => {
                                        console.log(index, dates[index]);
                                        this.setState({value: index, previous: value}, this.generateTreeDataStructure);
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
                            id={'popover'}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={this.handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                        >
                            <Typography variant="h5">{loadedEntity ? loadedEntity.title : ''}<br/><br/></Typography>
                            <Typography>Parent:</Typography>
                            <VerticalTimeline>
                                {sortedParents ? sortedParents.map((parent) => (
                                    <VerticalTimelineElement
                                        className="vertical-timeline-element--work"
                                        contentStyle={{background: 'rgb(33, 150, 243)', color: '#fff', fontSize: '10px'}}
                                        contentArrowStyle={{borderRight: '7px solid  rgb(33, 150, 243)'}}
                                        date={parent.date ? parent.date.split('T')[0] : ''}
                                    >
                                        <p>{parent.raw_value}</p>
                                    </VerticalTimelineElement>
                                )) : null}
                            </VerticalTimeline>
                            <Typography><br/>Last Updated: {loadedEntity ? loadedEntity.updated_at : ''}</Typography>
                        </Popover>
                    </div>
                </div>
            );
        } else {
            return null
        }
    }
}

TreeView.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TreeView);
