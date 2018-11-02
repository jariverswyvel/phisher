import React, {Component, createContext} from 'react';
import {node} from 'prop-types';
import {fetch_profile} from '../lib/phisherClient';
export const {Provider, Consumer} = createContext();

export class PhisherProvider extends Component {
    state = {
        loggedIn: false,
        darkTheme: localStorage.getItem(`darkTheme`) === `true` ? true : false,
        user: null
    };

    componentDidMount() {
        this.fetchProfile();
    }

    fetchProfile = cb => fetch_profile(({user}) => this.setState({user}, () => cb && cb()));

    switchThemes = () => {
        const {darkTheme} = this.state;
        localStorage.setItem(`darkTheme`, darkTheme === true ? `false` : `true`);
        this.setState({darkTheme: !darkTheme});
    };

    render() {
        return (
            <Provider
                value={{
                    ...this.state,
                    fetchProfile: this.fetchProfile,
                    switchThemes: this.switchThemes
                }}>
                {this.props.children}
            </Provider>
        );
    }
}

PhisherProvider.propTypes = {
    children: node.isRequired
};
