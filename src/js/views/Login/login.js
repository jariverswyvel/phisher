import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {objectOf, func, any, bool} from 'prop-types';
import {login} from '../../lib/phisherClient';
import './login.css';

import Input from '../../components/Input';
import Button from '../../components/Button';

class Login extends Component {
    state = {
        email: ``,
        password: ``,
        errorText: `Email and / or password is incorrect.`,
        showError: false
    };

    _login = e => {
        e.preventDefault();
        const {email, password} = this.state;
        const {history, fetchProfile} = this.props;
        login(email, password, ({message}) => {
            if (message === `Success`) {
                fetchProfile(() => history.push(`/`));
            } else if (message === `Failed`) {
                this.setState({showError: true});
            }
        });
    };

    onChange = ({target: {value, name}}) => this.setState({[name]: value});

    render() {
        const {showError, errorText} = this.state;
        const {user, darkTheme} = this.props;
        if (!user)
            return (
                <main className={darkTheme ? `dark-theme-light-bg` : ``}>
                    <div className="login-container">
                        <form className={`login ${darkTheme ? `dark-theme-login` : ``}`} onSubmit={this._login}>
                            <div className="login-logo">
                                <i className="far fa-adjust" />
                            </div>
                            <div className="login-inputs">
                                <Input
                                    errorText={errorText}
                                    name="email"
                                    onChange={this.onChange}
                                    placeholder=""
                                    showError={showError}
                                    title="email"
                                />
                                <Input
                                    errorText={errorText}
                                    name="password"
                                    onChange={this.onChange}
                                    showError={showError}
                                    title="password"
                                    type="password"
                                />
                            </div>
                            <Button onClick={this._login} title="Login" />
                        </form>
                    </div>
                </main>
            );
        else return <Redirect to="/" />;
    }
}

Login.propTypes = {
    history: objectOf(any).isRequired,
    fetchProfile: func.isRequired,
    user: objectOf(any),
    darkTheme: bool.isRequired
};

Login.defaultProps = {
    user: null
};

export default Login;
