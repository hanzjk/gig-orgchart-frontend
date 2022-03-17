import React, {useState} from "react";
import CircleLoader from "react-spinners/CircleLoader";
import {withStyles} from '@mui/styles';
import Typography from "@mui/material/Typography/Typography";
import InputBase from "@mui/material/InputBase/InputBase";
import Grid from '@mui/material/Grid';
import {styles} from "./styles";
import AppBar from "@mui/material/AppBar/AppBar";

function Header(props) {
    const {
        classes,
        searchKey, setSearchKey,
        searchResults, setSearchResults,
        loadedEntity, setLoadedEntity,
        isLoading, setIsLoading
    } = props;
    const [searchText, setSearchText] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        setSearchKey(searchText);

    }

    // if (isLoading) {  // view loader
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
    // } else { //view header
    //     return (
    //         <AppBar position="static" style={{marginTop: 0}}>
    //             <Grid container className={classes.header} spacing={2}>
    //                 <Grid container>
    //                     <Typography variant="h4" component="h4">
    //                         Organization Chart
    //                     </Typography>
    //                     <div className={classes.search}>
    //                         <form id="search-form" onSubmit={handleSubmit} noValidate autoComplete="off">
    //                             <InputBase
    //                                 name="search"
    //                                 placeholder="Search…"
    //                                 value={searchText}
    //                                 onChange={(e) => setSearchText(e.target.value)}
    //                                 classes={{
    //                                     root: classes.inputRoot,
    //                                     input: classes.inputInput,
    //                                 }}
    //                             />
    //                         </form>
    //                     </div>
    //                 </Grid>
    //             </Grid>
    //         </AppBar>
    //     )
    // }
}

export default withStyles(styles)(Header);
