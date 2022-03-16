import React, {Component} from "react";
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Tree from 'react-tree-graph';
import './tree.css'
import HorizontalTimeline from 'react-horizontal-timeline';
import {sortValues} from "../index";
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import './timeline.css';
import {generateTreeDataStructure} from "./functions/generate_tree_data_structure";

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
            open: false,
            sortedParents: null
        };

        this.generateDataStructure = this.generateDataStructure.bind(this);
        this.collectDatesForTimeline = this.collectDatesForTimeline.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setSortedParents = this.setSortedParents.bind(this);

    }

    handleClick = eventTarget => {
        this.setState({anchorEl: eventTarget, open: true});
    };

    handleClose = () => {
        this.setState({anchorEl: null, open: false});
    };

    componentDidMount() {
        this.props.getSearchResults("OrgChart:");
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.searchResults !== this.props.searchResults) {
            this.collectDatesForTimeline();
        }
        if (prevState.dates !== this.state.dates) {
            this.generateDataStructure();
        }
        if (prevProps.searchKey !== this.props.searchKey) {
            this.generateDataStructure();
        }

        if (prevProps.loadedEntity !== this.props.loadedEntity) {
            this.setSortedParents();
        }

    }

    generateDataStructure() {
        const stateObj = generateTreeDataStructure(this.props, this.state);
        this.setState(stateObj);
    }

    collectDatesForTimeline() {
        const {searchResults} = this.props;

        let dates = [];

        function addDateToTimeline(item) {
            let newDate = item.date;
            if (!dates.includes(newDate)) {
                dates.push(newDate);
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
            dates.sort();
        }

        this.setState({dates: dates, value: dates.length - 1});
    }

    setSortedParents() {
        const {loadedEntity} = this.props;
        let sortedParents = null;
        if (loadedEntity?.attributes?.parent) {
            sortedParents = sortValues(loadedEntity.attributes.parent.values);
        }

        this.setState({sortedParents: sortedParents});
    }

    render() {
        const {classes, searchResults, loadedEntity} = this.props;
        const {value, treeData, treeHeight, dates, anchorEl, open, sortedParents} = this.state;

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
                                        this.setState({value: index, previous: value}, this.generateDataStructure);
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
}

TreeView.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TreeView);
