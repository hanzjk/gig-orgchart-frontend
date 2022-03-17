export const styles = theme => ({
    header: {
        position: 'fixed',
        top: '10px',
        left: '10px',
        right: '10px',
        backgroundColor: 'rgba(36,36,36,0.8)',
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
    loadingTitle:{
        position: 'relative',
        top:'40%',
    },
    verticalCenter: {
        position: 'relative',
        top: '50%',
        marginTop: '-250px',
        marginLeft:'-250px'
    },

    title: {
        marginTop: '-150px'
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: "#fff",
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