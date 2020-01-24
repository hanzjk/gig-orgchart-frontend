import React, {Component} from "react";
import {css} from "@emotion/core";
import CircleLoader from "react-spinners/CircleLoader";
import {withStyles} from '@material-ui/core/styles';
import {fade} from "@material-ui/core/styles/colorManipulator";
import Typography from "@material-ui/core/Typography/Typography";
import InputBase from "@material-ui/core/InputBase/InputBase";
import Grid from '@material-ui/core/Grid';

const styles = theme => ({

});

class Sankey extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        // this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.props.getSearchResults("OrgChart:");
    }

    render() {
        const {classes, searchResults} = this.props;
        const {searchText} = this.state;
        return (
            <div>
                <script src="https://unpkg.com/d3-array@1"></script>
                <script src="https://unpkg.com/d3-collection@1"></script>
                <script src="https://unpkg.com/d3-path@1"></script>
                <script src="https://unpkg.com/d3-shape@1"></script>
                <script src="https://unpkg.com/d3-sankey@0"></script>
                <script>

                    var sankey = d3.sankey();

                </script>
            </div>
        )

    }
}

export default withStyles(styles)(Sankey);
