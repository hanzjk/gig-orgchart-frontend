import React, {Component} from "react";
import {css} from "@emotion/core";
import CircleLoader from "react-spinners/CircleLoader";
import {withStyles} from '@material-ui/core/styles';
import {fade} from "@material-ui/core/styles/colorManipulator";
import Typography from "@material-ui/core/Typography/Typography";
import InputBase from "@material-ui/core/InputBase/InputBase";
import Grid from '@material-ui/core/Grid';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const styles = theme => ({
    header: {
        position: 'fixed',
        left: '10px',
        right: '10px',
        backgroundColor: 'rgba(36,36,36,0.8)',
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(2),
        color: 'white',
        textAlign: 'left',
        margin: '-10px',
        display: 'inline-block'
    },
    loaderContainer: {
        position: 'absolute',
        margin: 0,
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        textAlign: 'center',
        backgroundColor: '#242424'
    },

    verticalCenter: {
        position: 'relative',
        top: '50%',
        marginTop: '-137px',
    },

    title: {
        marginTop: '-150px'
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing(1.5),
        paddingRight: theme.spacing(),
        paddingBottom: theme.spacing(),
        paddingLeft: theme.spacing(),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 400,
        },
    },
});

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: 0,
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
                            css={override}
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
