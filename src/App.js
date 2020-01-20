import React, {Component} from 'react';
import {
    Route,
    HashRouter
} from "react-router-dom";
import './index.css';
import TreeView from "./tree/tree";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchKey: "",
            searchResults: [],
            loadedEntity: [],
            loading: true,
            dates: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.endLoading = this.endLoading.bind(this);
        this.getSearchResults = this.getSearchResults.bind(this);
        this.getEntity = this.getEntity.bind(this);
        this.collectDatesForTimeline = this.collectDatesForTimeline.bind(this);
    }

    startLoading() {
        this.setState({loading: true});
    }

    endLoading() {
        this.setState({loading: false});
    }

    handleChange(key, value) {
        this.setState({[key]: value});
    }

    getSearchResults(searchKey) {
        this.startLoading();
        if (searchKey.length > 1) {
            let searchUrl = process.env.REACT_APP_SERVER_URL + 'api/search?query=';
            if (searchKey.includes(":")) {
                let searchArray = searchKey.split(":", 2);
                searchUrl += searchArray[1] + '&categories=' + searchArray[0];
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
                dates => this.collectDatesForTimeline()
            ).then(
                end => this.endLoading()
            );
        }

    }

    getEntity(title) {
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
        }).then(
            end => this.endLoading()
        );
    }

    collectDatesForTimeline() {
        const {searchResults} = this.state;

        let i, dates = [];

        function addDateToTimeline(item) {
            let newDate = item.date;
            if (!dates.includes(newDate)) {
                dates.push(newDate);
            }
        }

        if (searchResults) {
            for (i = 0; i < searchResults.length; i++) {
                let entity = searchResults[i];
                entity.attributes.organizations.forEach(addDateToTimeline);
                entity.attributes.titles.forEach(addDateToTimeline);
            }
            dates.sort();
        }

        this.setState({dates: dates});
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <HashRouter>
                        <Route path="/"
                               render={(props) => <TreeView {...props}
                                                            searchKey={this.state.searchKey}
                                                            handleChange={this.handleChange}
                                                            searchResults={this.state.searchResults}
                                                            getSearchResults={this.getSearchResults}
                                                            dates={this.state.dates}
                               />}
                        />
                    </HashRouter>
                </header>
            </div>
        );
    }
}

export default App;
