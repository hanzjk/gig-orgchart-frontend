import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App/>, document.getElementById('root'));

export function sortValues(values) {
    let sortedValues = values;
    sortedValues.sort((a, b) => (a.date < b.date) ? 1 : -1);
    return sortedValues
}

export function getValueByDate(values, date) {
    // sort values by date
    if (values === null) {
        return ""
    }

    let sortedValues = sortValues(values);
    // pick the value with highest date lower than or equal to the given date
    let i;
    let selectedValue = "";
    for (let sortedValue of sortedValues) {

        if (sortedValue.date <= date) {
            return sortedValue?.value_string;
        }
    }
    //return the raw
    return selectedValue
}

export function arrayIncludesElementsIncluding(array, searchKey) {
    if (!array) {
        return null
    }
    let result = [];
    for (let item of array) {
        if (item.toLowerCase().includes(searchKey)) {
            result.push(item);
        }
    }
    return result;
}