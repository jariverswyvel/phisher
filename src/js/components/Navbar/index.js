import React, {Component, Fragment} from 'react';
import {objectOf, any, func, bool} from 'prop-types';
import {Link} from 'react-router-dom';

import './index.css';
import ProfileInfo from './ProfileInfo';
import {removetoken} from '../../lib/phisherClient';

class Navbar extends Component {
    state = {
        showSideMenu: false
    };

    componentDidMount() {
        window.addEventListener(`click`, this.handleClose);
    }

    componentWillUnmount() {
        window.removeEventListener(`click`, this.handleClose);
    }

    handleClose = ({target}) => {
        if (
            this.bannerMenuWrapper &&
            this.bannerMenu &&
            (!this.bannerMenu.contains(target) && !this.bannerMenuWrapper.contains(target))
        ) {
            this.handleShowMenu();
        }
    };

    handleShowSideMenu = () => {
        const {showSideMenu} = this.state;
        this.setState({showSideMenu: !showSideMenu});
    };

    render() {
        const {user, switchThemes, darkTheme} = this.props;
        const {showSideMenu} = this.state;

        return (
            <Fragment>
                <header className={`header ${darkTheme ? `dark-theme` : ``}`}>
                    <Link to="/">
                        <div className="menu-wrapper flex-center">
                            <i className="far fa-adjust" />
                            <h2>Phisherman</h2>
                        </div>
                    </Link>
                    <ProfileInfo
                        darkTheme={darkTheme}
                        handleShowSideMenu={this.handleShowSideMenu}
                        showSideMenu={showSideMenu}
                        switchThemes={switchThemes}
                        user={user}
                    />
                </header>
                <aside className={`aside-menu ${darkTheme ? `dark-theme` : ``} ${showSideMenu ? `` : `slide-right`}`}>
                    <div className="aside-arrow pointer" onClick={this.handleShowSideMenu}>
                        <i className={`fal fa-angle-${showSideMenu ? `right` : `left`}`} />
                    </div>
                    {showSideMenu && (
                        <Fragment>
                            <header className="aside-header pointer">
                                <ProfileInfo
                                    darkTheme={darkTheme}
                                    handleShowSideMenu={this.handleShowSideMenu}
                                    showSideMenu={showSideMenu}
                                    switchThemes={switchThemes}
                                    user={user}
                                />
                            </header>
                            <nav className="aside-menu-nav">
                                <ul className="nav-list">
                                    <Link to="/">
                                        <li className="nav-list-item flex-center space-between pointer">
                                            <p>Campaigns</p>
                                            <i className="header-icon fal fa-bullhorn" />
                                        </li>
                                    </Link>
                                    <Link to="/targets">
                                        <li className="nav-list-item flex-center space-between pointer">
                                            <p>Targets</p>
                                            <i className="fal fa-users" />
                                        </li>
                                    </Link>

                                    <Link to="/credits">
                                        <li className="nav-list-item flex-center space-between pointer">
                                            <p>Credits</p>
                                            <i className="far fa-coins" />
                                        </li>
                                    </Link>

                                    <Link to="/settings/profile">
                                        <li className="nav-list-item flex-center space-between pointer">
                                            <p>Settings</p>
                                            <i className="fal fa-wrench" />
                                        </li>
                                    </Link>
                                    <li className="nav-list-item flex-center space-between pointer" onClick={switchThemes}>
                                        <p>Dark theme</p>
                                        <i className={`fal fa-toggle-${darkTheme ? `on` : `off`}`} />
                                    </li>
                                    <Link to="/login">
                                        <li className="nav-list-item flex-center space-between pointer" onClick={removetoken}>
                                            <p>Log out</p>
                                            <i className="fal fa-sign-out" />
                                        </li>
                                    </Link>
                                </ul>
                            </nav>
                        </Fragment>
                    )}
                </aside>
            </Fragment>
        );
    }
}

Navbar.propTypes = {
    user: objectOf(any).isRequired,
    switchThemes: func.isRequired,
    darkTheme: bool.isRequired
};

export default Navbar;
