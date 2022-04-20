export function collectDatesForTimeline(searchResults) {
    let datesArray = [];

    function addDateToTimeline(item) {
        let newDate = item.date;
        if (!datesArray.includes(newDate)) {
            datesArray.push(newDate);
        }
    }

    if (searchResults) {
        for (let entity of searchResults) {
            entity?.attributes?.organizations?.values?.forEach(addDateToTimeline);
            if (!entity?.attributes?.titles) {
            }
            entity?.attributes?.titles?.values?.forEach(addDateToTimeline);
        }
        datesArray.sort();
    }
    return datesArray
}