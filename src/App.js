import React, {useState} from 'react';
import {Route, Routes} from "react-router-dom";
import './index.css';
import Header from "./shared/header/Header";
import TreeView from "./tree/Tree";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {generateSearchQuery} from "./functions/generateSearchQuery";
import {ApiRoutes, getServerUrl} from "./server";

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
        isLoading, setIsLoading,
        getSearchResults, getEntity
    };


    function getSearchResults(searchInput) {
        setIsLoading(true);
        if (searchInput.length > 1) {
            let searchUrl = generateSearchQuery(searchInput);
            searchUrl += '&limit=0';

            fetch(searchUrl, {
                method: 'GET'
            }).then(results => {
                return results.json();
            }).then(data => {
                setSearchResults(data);
            }).then(
                setIsLoading(false)
            );
        }

    }

    function getEntity(title, callback) {
        setIsLoading(true);
        fetch(getServerUrl(ApiRoutes.entity) + title, {
            method: 'GET'
        }).then(results => {
            if (results.status === 200) {
                return results.json();
            }
            return null
        }).then(data => {
            setLoadedEntity(data);
            callback();
        }).then(
            setIsLoading(false)
        )
    }

    return (
        <ThemeProvider theme={appTheme}>
            <div className="App">
                <Routes>
                    <Route element={<Header {...app_props}/>}>
                        <Route index element={<TreeView {...app_props}/>}/>
                    </Route>
                </Routes>
            </div>
        </ThemeProvider>
    );
}

export default App;
