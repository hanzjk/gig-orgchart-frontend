import React, {Component} from "react";
import {css} from "@emotion/core";
import CircleLoader from "react-spinners/CircleLoader";
import {withStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";

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
    }
});

class Header extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {classes, loading} = this.props;
        if (loading) {
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
        } else {
            return (
                <div className={classes.header}>
                    <Typography variant="h4" component="h4">
                        Organization Chart
                    </Typography>
                </div>
            )
        }
    }
}

export default withStyles(styles)(Header);
