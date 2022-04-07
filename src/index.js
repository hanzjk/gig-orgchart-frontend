import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom'

const routerBaseName = process.env.PUBLIC_URL;

ReactDOM.render(
    <BrowserRouter basename={routerBaseName}>
        <App/>
    </BrowserRouter>,
    document.getElementById('root')
);
