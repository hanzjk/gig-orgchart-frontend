import React, {useState} from 'react';
import {Route, Routes} from "react-router-dom";
import './index.css';
import Header from "./shared/header/Header";
import TreeView from "./tree/Tree";
import {ThemeProvider, createTheme} from '@mui/material/styles';

const appTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {

    const [searchKey, setSearchKey] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [loadedEntity, setLoadedEntity] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const app_props = {
        searchKey, setSearchKey,
        searchResults, setSearchResults,
        loadedEntity, setLoadedEntity,
        isLoading, setIsLoading
    };


    function getSearchResults(searchKey) {
        this.startLoading();
        if (searchKey.length > 1) {
            let searchUrl = process.env.REACT_APP_SERVER_URL + 'api/search?query=';
            if (searchKey.includes(":")) {
                let searchArray = searchKey.split(":", 2);
                searchUrl += searchArray[1] + '&attributes=titles,organizations&categories=' + searchArray[0];
            } else {
                searchUrl += searchKey;
            }
            searchUrl += '&limit=0';

            fetch(searchUrl, {
                method: 'GET'
            }).then(results => {
                return results.json();
            }).then(data => {
                this.handleChange("searchResults", data);
            }).then(
                end => this.endLoading()
            );
        }

    }

    function getEntity(title, callback) {
        this.startLoading();
        fetch(process.env.REACT_APP_SERVER_URL + 'api/get/' + title, {
            method: 'GET'
        }).then(results => {
            if (results.status === 200) {
                return results.json();
            }
            return null
        }).then(data => {
            this.handleChange("loadedEntity", data);
            callback();
        }).then(
            end => this.endLoading()
        )
    }

    return (
        <ThemeProvider theme={appTheme}>
            <div className="App">
                <Routes>
                    <Route index element={<Header {...app_props}/>}/>
                    {/*<Route path="/" element={<TreeView {...app_props}/>}/>*/}
                </Routes>
            </div>
        </ThemeProvider>
    );
}

export default App;
