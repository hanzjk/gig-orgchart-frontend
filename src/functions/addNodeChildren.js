export function addNodeChildren(title, organizations, childrenMatchingSearchKey, childMatchingSearchKeyFound, props) {
    const {setSearchKey, getEntity, setAnchorElement, setIsOpen} = props;
    return organizations.map((link) => {
        let shouldHighlight = childrenMatchingSearchKey.includes(link) || !childMatchingSearchKeyFound;
        return {
            keyVal: title + link,
            name: link,
            pathProps: {className: shouldHighlight ? 'link' : 'link link-inactive'},
            gProps: {
                className: shouldHighlight ? 'node node-focused' : 'node node-inactive',
                onClick: (event) => {
                    setSearchKey(link);
                    const currentTarget = event.currentTarget;
                    getEntity(link, () => handleClick(currentTarget, setAnchorElement, setIsOpen));
                }
            },
        }
    })
}

function handleClick(target, setAnchorElement, setIsOpen) {
    setAnchorElement(target);
    setIsOpen(true);
}