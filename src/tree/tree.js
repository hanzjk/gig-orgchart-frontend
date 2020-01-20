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
            treeData: {
                keyVal: "root",
                name: 'Organization Chart',
                children: []
            },
        };

        this.generateTreeDataStructure = this.generateTreeDataStructure.bind(this);

    }

    componentDidMount() {
        this.props.handleChange("searchKey", this.props.match.params.searchKey);
        this.props.getSearchResults("OrgChart:");
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.searchKey !== this.props.match.params.searchKey) {
            this.props.getSearchResults("OrgChart:");
        }
    }

    generateTreeDataStructure() {

        const {searchResults, dates} = this.props;
        const {value, collapsed} = this.state;

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
        const {classes, dates} = this.props;
        const {value, treeData, treeHeight} = this.state;

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
