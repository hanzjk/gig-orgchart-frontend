export function addNodeChildren(title, organizations, childrenMatchingSearchKey, childMatchingSearchKeyFound, setSearchKey, getEntity, handleClick) {
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
                    getEntity(link, () => handleClick(currentTarget));
                }
            },
        }
    })
}