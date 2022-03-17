export function getValueByDate(values, date) {
    // sort values by date
    if (values === null) {
        return ""
    }

    let sortedValues = sortValues(values);
    // pick the value with highest date lower than or equal to the given date
    let selectedValue = "";
    for (let sortedValue of sortedValues) {

        if (sortedValue.date <= date) {
            return sortedValue?.value_string;
        }
    }
    //return the raw
    return selectedValue
}

export function sortValues(values) {
    let sortedValues = values;
    sortedValues.sort((a, b) => (a.date < b.date) ? 1 : -1);
    return sortedValues
}