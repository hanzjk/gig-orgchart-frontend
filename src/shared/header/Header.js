import React, {useState} from "react";
import CircleLoader from "react-spinners/CircleLoader";
import {withStyles} from '@mui/styles';
import Typography from "@mui/material/Typography/Typography";
import InputBase from "@mui/material/InputBase/InputBase";
import Grid from '@mui/material/Grid';
import {styles} from "./styles";
import AppBar from "@mui/material/AppBar/AppBar";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import {Outlet} from "react-router-dom";

function Header(props) {
    const {classes, setSearchKey, isLoading} = props;
    const [searchText, setSearchText] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        setSearchKey(searchText);
    }

    if (isLoading) {  // view loader
        return (
            <div className={classes.loaderContainer}>
                <h1 className={classes.loadingTitle}>Organization Chart</h1>
                <div className={classes.verticalCenter}>
                    <CircleLoader
                        size={250}
                        color={"#2593B8"}
                        loading={true}
                    />
                </div>
            </div>
        );
    } else { //view header
        return (
            <div>
                <AppBar position="static" style={{marginTop: 0}}>
                    <Toolbar className={classes.appBar}>
                        <Grid container className={classes.header} spacing={2}>
                            <Grid container>
                                <Typography variant="h4" component="h4">
                                    Organization Chart
                                </Typography>
                                <div className={classes.search}>
                                    <form id="search-form" onSubmit={handleSubmit} noValidate autoComplete="off">
                                        <InputBase
                                            id="searchInput"
                                            name="search"
                                            placeholder="Search…"
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            sx={{color: "black",}}
                                            classes={{
                                                root: classes.inputRoot,
                                                input: classes.inputInput,
                                            }}
                                        />
                                    </form>
                                </div>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Outlet/>
            </div>
        )
    }
}

export default withStyles(styles)(Header);