import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


export function getValueByDate(values, date) {
    // sort values by date
    if (values === null) {
        return ""
    }

    let sortedValues = values;
    sortedValues.sort((a, b) => (a.start_date < b.start_date) ? 1 : -1);
    // pick the value with highest date lower than or equal to the given date
    let i;
    let selectedValue = "";
    for (i = 0; i < sortedValues.length; i++) {

        if (sortedValues[i].start_date <= date) {
            selectedValue = sortedValues[i].raw_value;
            break
        }
    }
    //return the raw
    return selectedValue
}