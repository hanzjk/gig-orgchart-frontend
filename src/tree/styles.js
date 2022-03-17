export const styles = theme => ({
    treeContainer: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        color: 'white',
        textAlign: 'left',
        margin: '10px',
        backgroundColor: '#242424',
    },
    timeline: {
        height: '70px',
        margin: '10px'
    },
});