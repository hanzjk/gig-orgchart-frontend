import React, {Component} from "react";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tree from 'react-tree-graph';
import './tree.css'

const styles = theme => ({
    container: {
        minHeight: '100vh',
        backgroundColor: '#eeeeee',
        padding: '10px'
    },
    searchResult: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        color: 'black',
        textAlign: 'left',
        margin: '10px',
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

    render() {
        const {classes, searchResults} = this.props;

        let numberOfNodes = 0;
        let data = {
            name: 'Organization Chart',
            children: searchResults ? searchResults.map((entity) => {
                return {
                    name: entity.title,
                    children: entity.links ? entity.links.map((link) => {
                        numberOfNodes++;
                        return {
                            name: link
                        }
                    }) : []
                }
            }) : []
        };

        return (
            <div className="content">
                <div className="custom-container">
                    <Paper className={classes.searchResult} elevation={1}>
                        <Typography variant="h4" component="h4">
                            Organization Chart
                        </Typography>
                        <div className="custom-container" style={{overflow: "auto"}}>
                            <Tree
                                data={data}
                                height={numberOfNodes * 15}
                                width={1500}
                                svgProps={{
                                    className: 'custom'
                                }}
                                margins={{bottom: 10, left: 20, right: 350, top: 10}}
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
