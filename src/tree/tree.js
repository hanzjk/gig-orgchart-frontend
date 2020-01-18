import React, {Component} from "react";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tree from 'react-tree-graph';
import './tree.css'
import HorizontalTimeline from 'react-horizontal-timeline';

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
        minHeight: '100vh',
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

    componentDidMount() {
        this.props.handleChange("searchKey", this.props.match.params.searchKey);
        this.props.getSearchResults("OrgChart:");
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.searchKey !== this.props.match.params.searchKey) {
            this.props.getSearchResults("OrgChart:");
        }
    }


    state = {value: 0, previous: 0, collapsed: []};

    render() {
        const {classes, searchResults} = this.props;
        const state = this.state;

        let dates = [];
        let numberOfNodes = 0;

        function addDateToTimeline(item, index) {
            let newDate = item.start_date;
            if (!dates.includes(newDate)) {
                dates.push(newDate);
            }
        }

        function getValueByDate(values, date) {
            // sort values by date
            if (values === null) {
                return ""
            }

            let sortedValues = values;
            sortedValues.sort((a, b) => (a.start_date < b.start_date) ? 1 : -1);
            // pick the value with highest date lower than or equal to the given date
            let i;
            let selectedValue = "";
            for (i = 0; i < sortedValues.length; i++) {

                if (sortedValues[i].start_date <= date) {
                    selectedValue = sortedValues[i].raw_value;
                    break
                }
            }
            //return the raw
            return selectedValue
        }

        let data = {
            keyVal: "root",
            name: 'Organization Chart',
            children: []
        };

        // add dates first
        let i;
        for (i = 0; i < searchResults.length; i++) {
            let entity = searchResults[i];
            entity.attributes.organizations.forEach(addDateToTimeline);
            entity.attributes.titles.forEach(addDateToTimeline);
        }
        dates.sort();

        if (searchResults) {
            let i;
            for (i = 0; i < searchResults.length; i++) {
                let entity = searchResults[i];
                entity.attributes.organizations.forEach(addDateToTimeline);
                entity.attributes.titles.forEach(addDateToTimeline);
                let organizations = [];
                let organizationsValue = getValueByDate(entity.attributes.organizations, dates[state.value]);
                let title = getValueByDate(entity.attributes.titles, dates[state.value]);

                if (organizationsValue !== "" && state.collapsed.includes(entity.title)) {
                    organizations = JSON.parse(organizationsValue);
                }
                if (title !== "") {
                    numberOfNodes += organizations.length + 1;
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
                                let collapseList = state.collapsed;
                                if (collapseList.includes(entity.title)) {
                                    let index = collapseList.indexOf(entity.title);

                                    if (index > -1) {
                                        collapseList.splice(index, 1);
                                    }
                                } else {
                                    collapseList.push(entity.title);
                                }
                                this.setState({collapsed: collapseList});
                            },

                        }
                    })
                }
            }

        }

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
                                index={this.state.value}
                                indexClick={(index) => {
                                    console.log(dates[index]);
                                    this.setState({value: index, previous: this.state.value});
                                }}
                                values={dates}/>
                        </div>
                    </Paper>
                    <Paper className={classes.searchResult} style={{paddingTop: '200px'}} elevation={1}>
                        <div className="custom-container" style={{overflow: "auto"}}>
                            <Tree
                                data={data}
                                height={numberOfNodes * 15}
                                width={1500}
                                svgProps={{
                                    className: 'custom'
                                }}
                                margins={{bottom: 10, left: 20, right: 350, top: 10}}
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

TreeView.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TreeView);
