export const styles = theme => ({
    header: {
        position: 'fixed',
        top: '10px',
        left: '10px',
        right: '10px',
        backgroundColor: 'rgba(36,36,36,0.8)',
        padding: theme.spacing(2),
        color: 'white',
        textAlign: 'left',
        margin: '-10px',
        display: 'inline-block'
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
        marginTop: '5px',
        width: '100%',
        paddingLeft: theme.spacing(1.5)
    },
    inputInput: {
        padding: theme.spacing(1.5),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 400,
        },
    },
});