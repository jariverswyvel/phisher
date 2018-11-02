import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {func, objectOf, any, bool} from 'prop-types';
import './index.css';
import {formatAmount} from '../../../lib/helpers';
import {removetoken} from '../../../lib/phisherClient';

class ProfileInfo extends Component {
    state = {
        showMenu: false
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

    handleShowMenu = () => {
        const {showMenu} = this.state;
        this.setState({showMenu: !showMenu});
    };

    render() {
        const {darkTheme, user, switchThemes, handleShowSideMenu, showSideMenu} = this.props;
        const {showMenu} = this.state;

        return (
            <div className="banner-wrapper flex-center">
                <Link to="/credits">
                    <div className="credits-wrapper pointer">
                        <i className="far fa-coins" />
                        <span className="credits-amount" style={darkTheme ? {color: `gold`} : {}}>
                            {formatAmount(user.credits)}
                        </span>
                    </div>
                </Link>
                <div
                    className="profile-wrapper relative pointer"
                    onClick={this.handleShowMenu}
                    ref={node => (this.bannerMenuWrapper = node)}>
                    <div className="profile-name">
                        <p>{user.firstname}</p>
                    </div>
                    {!showSideMenu && (
                        <Fragment>
                            <div className="profile-options">
                                <i className="far fa-angle-down" />
                            </div>
                            {showMenu && (
                                <div
                                    className={`banner-menu ${darkTheme ? `dark-theme` : ``}`}
                                    ref={node => (this.bannerMenu = node)}>
                                    <span className="banner-triangle unselectable" style={darkTheme ? {color: `#292929`} : {}}>
                                        ▲
                                    </span>
                                    <ul className="banner-menu-list">
                                        <Link to="/settings/profile">
                                            <li
                                                className="banner-menu-list-item flex-center space-between pointer unselectable"
                                                onClick={this.handleShowMenu}>
                                                Settings <i className="fal fa-wrench" />
                                            </li>
                                        </Link>
                                        <Link to="/login">
                                            <li
                                                className="banner-menu-list-item pointer flex-center space-between unselectable"
                                                onClick={removetoken}>
                                                Log out <i className="fal fa-sign-out" />
                                            </li>
                                        </Link>
                                        <li
                                            className="banner-menu-list-item pointer flex-center space-between unselectable"
                                            onClick={switchThemes}>
                                            Dark theme
                                            <i className={`fal fa-toggle-${darkTheme ? `on` : `off`}`} />
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </Fragment>
                    )}
                </div>
                <div className="menu-icon pointer" onClick={handleShowSideMenu}>
                    <i className={`fal fa-${showSideMenu ? `times` : `bars`}`} />
                </div>
            </div>
        );
    }
}

ProfileInfo.propTypes = {
    switchThemes: func.isRequired,
    darkTheme: bool.isRequired,
    user: objectOf(any).isRequired,
    handleShowSideMenu: func.isRequired,
    showSideMenu: bool.isRequired
};

export default ProfileInfo;
