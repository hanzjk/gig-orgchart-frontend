export function handleNodeClick(collapsed, searchKey, setSearchKey, entity, setCollapsed) {
    let collapseList = collapsed.slice();
    if (collapseList.includes(entity.title)) {
        if (searchKey !== '') {
            setSearchKey("")
        } else {
            let index = collapseList.indexOf(entity.title);

            if (index > -1) {
                collapseList.splice(index, 1);
            }
        }
    } else {
        collapseList.push(entity.title);
    }
    setCollapsed(collapseList);
}