import React, {Component} from "react";
import CircleLoader from "react-spinners/CircleLoader";
import {withStyles} from '@mui/styles';
import Typography from "@mui/material/Typography/Typography";
import InputBase from "@mui/material/InputBase/InputBase";
import Grid from '@mui/material/Grid';
import {styles} from "./styles";

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.handleChange('searchKey', this.state.searchText);
    }

    handleChange(key, value) {
        this.setState({[key]: value});
    }

    render() {
        const {classes, loading} = this.props;
        const {searchText} = this.state;
        if (loading) {  // view loader
            return (
                <div className={classes.loaderContainer}>
                    <div className={classes.verticalCenter}>
                        <CircleLoader
                            size={250}
                            color={"#2593B8"}
                            loading={true}
                        />
                        <h1 className={classes.title}>Organization Chart</h1>
                    </div>
                </div>
            );
        } else { //view header
            return (
                <Grid container className={classes.header} spacing={2}>
                    <Grid container>
                        <Typography variant="h4" component="h4">
                            Organization Chart
                        </Typography>
                        <div className={classes.search}>
                            <form id="search-form" onSubmit={this.handleSubmit} noValidate autoComplete="off">
                                <InputBase
                                    name="search"
                                    placeholder="Search…"
                                    value={searchText}
                                    onChange={(e) => this.handleChange("searchText", e.target.value)}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                />
                            </form>
                        </div>
                    </Grid>
                </Grid>
            )
        }
    }
}

export default withStyles(styles)(Header);
