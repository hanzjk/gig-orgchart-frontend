import React, {Component} from "react";
import {css} from "@emotion/core";
import './header.css'
import CircleLoader from "react-spinners/CircleLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class Header extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {searchResults} = this.props;
        if (!searchResults) {
            return (
                <div className='loader-container'>
                    <div className='vertical-center'>
                        <CircleLoader
                            css={override}
                            size={250}
                            color={"#2593B8"}
                            loading={true}
                        />
                        <h1 className={'title'}>Organization Chart</h1>
                    </div>
                </div>
            );
        } else {
            return null
        }
    }
}

export default Header;
