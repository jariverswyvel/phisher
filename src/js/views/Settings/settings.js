import React, {Component} from 'react';
import {objectOf, any} from 'prop-types';
import {Link} from 'react-router-dom';
import './settings.css';
import BillingSettings from './BillingSettings/billingSettings';
import ProfileSettings from './ProfileSettings/profileSettings';
import {Consumer} from '../../contexts/phisherContext';
import MailSettings from './MailSettings/mailsettings';

class Settings extends Component {
    state = {
        activeSettingsView: this.props.location.pathname.split(`/`).pop()
    };

    componentDidMount() {
        document.title = `Phisherman | Settings`;
    }

    handleSettingClick = activeSettingsView => this.setState({activeSettingsView});

    render() {
        const {activeSettingsView} = this.state;

        return (
            <Consumer>
                {({user, fetchProfile, darkTheme}) => (
                    <div className="settings-container">
                        <aside className="settings-nav">
                            <div className="settings-nav-items">
                                <Link to="/settings/profile">
                                    <div
                                        className={`settings-list-item pointer ${
                                            activeSettingsView === `profile` ? `settings-list-item-active` : ``
                                        }`}
                                        onClick={() => this.handleSettingClick(`profile`)}>
                                        Profile
                                    </div>
                                </Link>
                                <Link to="/settings/billing">
                                    <div
                                        className={`settings-list-item pointer ${
                                            activeSettingsView === `billing` ? `settings-list-item-active` : ``
                                        }`}
                                        onClick={() => this.handleSettingClick(`billing`)}>
                                        Billing {!user.card && <i className="fas fa-exclamation" />}
                                    </div>
                                </Link>
                                <Link to="/settings/mail">
                                    <div
                                        className={`settings-list-item pointer ${
                                            activeSettingsView === `mail` ? `settings-list-item-active` : ``
                                        }`}
                                        onClick={() => this.handleSettingClick(`mail`)}>
                                        Mail server {!user.smtp && <i className="fas fa-exclamation" />}
                                    </div>
                                </Link>
                            </div>
                        </aside>

                        <div className={`active-settings-container ${darkTheme ? `dark-theme` : ``}`}>
                            {activeSettingsView === `profile` && (
                                <ProfileSettings darkTheme={darkTheme} fetchProfile={fetchProfile} user={user} />
                            )}
                            {activeSettingsView === `billing` && (
                                <BillingSettings darkTheme={darkTheme} fetchProfile={fetchProfile} user={user} />
                            )}
                            {activeSettingsView === `mail` && (
                                <MailSettings darkTheme={darkTheme} fetchProfile={fetchProfile} user={user} />
                            )}
                        </div>
                    </div>
                )}
            </Consumer>
        );
    }
}

Settings.propTypes = {
    location: objectOf(any).isRequired
};

export default Settings;
