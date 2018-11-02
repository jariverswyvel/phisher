import React, {Component, Fragment} from 'react';
import {objectOf, any, func} from 'prop-types';
import {update_smtp, update_profile} from '../../../lib/phisherClient';
import {isValidPassword} from '../../../lib/helpers';
import Input from '../../../components/Input';
import './mailSettings.css';
import Button from '../../../components/Button';
import Switch from '../../../components/Switch';

class MailSettings extends Component {
    state = {
        user: this.props.user,
        showHostError: false,
        showUserError: false,
        showPortError: false,
        showPasswordError: false,
        showConfirmPasswordError: false
    };

    componentDidMount() {
        const {user} = this.state;
        if (!user.smtp) {
            this.setState({user: {...user, smtp: {port: 587, user: ``, pass: ``, host: ``, secure: false}}});
        }
    }

    handleUpdateProfile = (e, cb) => {
        e.preventDefault();
        const {
            user,
            user: {
                smtp: {user: smtpUser, pass, port, host}
            },
            confirmPassword
        } = this.state;

        if (smtpUser !== `` && !smtpUser) {
            this.setState({showUserError: true});
        } else {
            this.setState({showUserError: false});
        }

        if (smtpUser !== `` && port !== `` && host !== `` && isValidPassword(pass) && pass === confirmPassword) {
            update_smtp(user, ({message}) => message === `Success` && cb && cb());
        }

        update_profile(user, data => console.log(data));
    };

    onChange = ({target: {value, name}}) => {
        const {
            user,
            user: {smtp}
        } = this.state;

        this.setState({user: {...user, smtp: {...smtp, [name]: value}}});
    };

    onChangePassword = ({target: {value, name}}) => this.setState({[name]: value});

    handleSwitch = (name, checked) => {
        if (name === `secure`) {
            const {
                user,
                user: {smtp}
            } = this.state;

            this.setState({user: {...user, smtp: {...smtp, [name]: checked}}});
        } else if (name === `public_smtp`) {
            const {user} = this.state;
            this.setState({user: {...user, [name]: checked}});
        }
    };

    render() {
        const {
            user,
            user: {smtp},
            showHostError,
            showUserError,
            showPortError,
            showPasswordError,
            showConfirmPasswordError
        } = this.state;

        console.log(user);

        const {fetchProfile} = this.props;

        if (user && user.smtp) {
            return (
                <Fragment>
                    <h2 className="active-settings-title">Outgoing mail server &#40;SMTP&#41; </h2>
                    <section className="settings-section">
                        <form onSubmit={e => this.handleUpdateProfile(e, fetchProfile)}>
                            <Switch
                                checked={user.public_smtp}
                                name="public_smtp"
                                onSwitch={this.handleSwitch}
                                rowSpan="double"
                                title="Public mail server"
                            />
                            {!user.public_smtp && (
                                <Fragment>
                                    <div className="flex-center space-between">
                                        <Input
                                            errorText="Please fill in a host."
                                            name="host"
                                            onChange={this.onChange}
                                            rowSpan="double"
                                            showError={showHostError}
                                            title="Host name"
                                            value={smtp.host}
                                        />
                                        <Input
                                            errorText="Please fill in a port."
                                            name="port"
                                            onChange={this.onChange}
                                            rowSpan="double"
                                            showError={showPortError}
                                            title="Host port(587)"
                                            value={smtp.port}
                                        />
                                    </div>
                                    <Input
                                        errorText="Please fill in a username."
                                        name="user"
                                        onChange={this.onChange}
                                        showError={showUserError}
                                        title="Username"
                                        value={smtp.user}
                                    />
                                    <div className="flex-center space-between">
                                        <Input
                                            errorText="Password must at least contain 1 capital letter, 1 number and must be at least 8 characters long."
                                            name="pass"
                                            onChange={this.onChange}
                                            rowSpan="double"
                                            showError={showPasswordError}
                                            title="New password"
                                            type="password"
                                        />
                                        <Input
                                            errorText="Passwords must be equal"
                                            name="confirmPassword"
                                            onChange={this.onChangePassword}
                                            rowSpan="double"
                                            showError={showConfirmPasswordError}
                                            title="Confirm new password"
                                            type="password"
                                        />
                                    </div>
                                    <Switch
                                        checked={smtp.secure}
                                        name="secure"
                                        onSwitch={this.handleSwitch}
                                        rowSpan="double"
                                        title="Secure &#40;SSL&#41;"
                                    />
                                </Fragment>
                            )}

                            <Button onClick={e => this.handleUpdateProfile(e, fetchProfile)} title="Update mail server" />
                        </form>
                    </section>
                </Fragment>
            );
        } else return null;
    }
}

MailSettings.propTypes = {
    user: objectOf(any).isRequired,
    fetchProfile: func.isRequired
};

export default MailSettings;
