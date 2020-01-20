import React, {Component} from "react";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tree from 'react-tree-graph';
import './tree.css'
import HorizontalTimeline from 'react-horizontal-timeline';
import {getValueByDate} from "../index";

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
        margin: '10px',
    },
    container: {
        backgroundColor: '#eeeeee',
        padding: '10px'
    },
    searchResult: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        color: 'white',
        textAlign: 'left',
        margin: '10px',
        backgroundColor: '#242424',
    },
    paragraph: {
        margin: '15px 0'
    },
    link: {
        paddingRight: '10px'
    }
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
                name: 'Organization Chart',
                children: []
            },
        };

        this.generateTreeDataStructure = this.generateTreeDataStructure.bind(this);
        this.collectDatesForTimeline = this.collectDatesForTimeline.bind(this);

    }

    componentDidMount() {
        this.props.handleChange("searchKey", this.props.match.params.searchKey);
        this.props.getSearchResults("OrgChart:");
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.searchKey !== this.props.match.params.searchKey) {
            this.props.getSearchResults("OrgChart:");
        }
        if (prevProps.searchResults !== this.props.searchResults) {
            this.collectDatesForTimeline();
        }
        if (prevState.dates !== this.state.dates) {
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
                entity.attributes.titles.forEach(addDateToTimeline);
            }
            dates.sort();
        }

        this.setState({dates: dates,value:dates.length-1});
    }

    generateTreeDataStructure() {

        const {searchResults} = this.props;
        const {value, collapsed, dates} = this.state;

        let data = {
            keyVal: "root",
            name: 'Organization Chart',
            children: []
        };

        let numberOfNodes = 10;

        if (searchResults) {
            let i, sortedSearchResults = searchResults.slice();
            sortedSearchResults.sort((a, b) => (a.title > b.title) ? 1 : -1);
            for (i = 0; i < sortedSearchResults.length; i++) {
                let organizations = null, entity = sortedSearchResults[i];
                let organizationsValue = getValueByDate(entity.attributes.organizations, dates[value]);
                let title = getValueByDate(entity.attributes.titles, dates[value]);

                if (organizationsValue !== "" && collapsed.includes(entity.title)) {
                    organizations = JSON.parse(organizationsValue);
                }
                if (title !== "" && !title.includes(" - Terminated on ")) {
                    numberOfNodes += organizations ? organizations.length : 1;
                    data.children.push({
                        title: entity.title,
                        keyVal: title,
                        name: title,
                        children: organizations ? organizations.map((link) => {
                            return {
                                keyVal: title + link,
                                name: link,
                            }
                        }) : [],
                        gProps: {
                            className: 'node',
                            onClick: (event, node) => {
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
                            },

                        }
                    })
                }
            }

        }

        this.setState({treeData: data, treeHeight: numberOfNodes * 15});
    }

    render() {
        const {classes} = this.props;
        const {value, treeData, treeHeight, dates} = this.state;

        return (
            <div className="content">
                <div className="custom-container">
                    <Paper className={classes.header} elevation={1}>
                        <Typography variant="h4" component="h4">
                            Organization Chart
                        </Typography>
                        <div id="timeline" style={{height: '70px', margin: '10px'}}>
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
                    <Paper className={classes.searchResult} style={{paddingTop: '200px'}} elevation={1}>
                        <div className="custom-container" style={{overflow: "auto"}}>
                            <Tree
                                data={treeData}
                                height={treeHeight}
                                width={1500}
                                svgProps={{
                                    className: 'custom'
                                }}
                                margins={{bottom: 10, left: 20, right: 500, top: 10}}
                                animated
                                keyProp={"keyVal"}
                            />
                        </div>
                    </Paper>
                </div>
            </div>
        );
    }
}

TreeView
    .propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)

(
    TreeView
)
;
