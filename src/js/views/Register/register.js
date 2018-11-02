import React, {Component} from 'react';
import Input from '../../components/Input';
import {objectOf, any, bool} from 'prop-types';
import {register, login} from '../../lib/phisherClient';
import './register.css';
import {isValidateEmail, isValidPassword} from '../../lib/helpers';
import Button from '../../components/Button';

class Register extends Component {
    state = {
        showFirstNameError: false,
        showLastNameError: false,
        showEmailError: false,
        showPasswordError: false,
        showConfirmPasswordError: false,
        firstNameError: `Please fill in a firstname.`,
        lastNameError: `Please fill in a lastname.`,
        emailError: `Please fill in a valid email.`,
        passwordError: `Password must at least contain 1 capital letter, 1 number and must be at least 8 characters long.`,
        confirmPasswordError: `Passwords must be equal.`
    };

    onChange = ({target: {value, name}}) => this.setState({[name]: value});

    _register = e => {
        e.preventDefault();
        const {firstname, lastname, company, email, password, confirmPassword} = this.state;

        if (firstname === `` || !firstname) {
            this.setState({showFirstNameError: true});
        } else {
            this.setState({showFirstNameError: false});
        }

        if (lastname === `` || !lastname) {
            this.setState({showLastNameError: true});
        } else {
            this.setState({showLastNameError: false});
        }

        if (!isValidateEmail(email)) {
            this.setState({showEmailError: true});
        } else {
            this.setState({showEmailError: false});
        }

        if (!isValidPassword(password)) {
            this.setState({showPasswordError: true});
        } else {
            this.setState({showPasswordError: false});
        }

        if (password !== confirmPassword) {
            this.setState({showConfirmPasswordError: true});
        } else {
            this.setState({showConfirmPasswordError: false});
        }

        if (
            firstname &&
            lastname &&
            isValidateEmail(email) &&
            password &&
            isValidPassword(password) &&
            password === confirmPassword
        ) {
            register(
                firstname,
                lastname,
                email,
                password,
                company,
                ({message}) =>
                    message === `Success` &&
                    login(email, password, ({message}) => message === `Success` && this.props.history.push(`/`))
            );
        }
    };

    render() {
        const {
            showError,
            firstNameError,
            lastNameError,
            emailError,
            errorText,
            confirmPasswordError,
            passwordError,
            showFirstNameError,
            showLastNameError,
            showEmailError,
            showPasswordError,
            showConfirmPasswordError
        } = this.state;

        const {darkTheme} = this.props;

        return (
            <main className={darkTheme ? `dark-theme-light-bg` : ``}>
                <div className="login-container">
                    <form className={`register ${darkTheme ? `dark-theme-register` : ``}`} onSubmit={this._register}>
                        <div className="login-logo register-logo">
                            <i className="far fa-adjust" />
                        </div>
                        <div className="login-inputs">
                            <div className="flex-center space-between" style={{width: `100%`}}>
                                <Input
                                    errorText={firstNameError}
                                    name="firstname"
                                    onChange={this.onChange}
                                    placeholder=""
                                    required
                                    rowSpan="double"
                                    showError={showFirstNameError}
                                    title="firstname"
                                />
                                <Input
                                    errorText={lastNameError}
                                    name="lastname"
                                    onChange={this.onChange}
                                    required
                                    rowSpan="double"
                                    showError={showLastNameError}
                                    title="lastname"
                                />
                            </div>
                            <Input
                                errorText={emailError}
                                name="email"
                                onChange={this.onChange}
                                placeholder=""
                                required
                                showError={showEmailError}
                                title="email"
                            />
                            <div className="flex-center space-between" style={{width: `100%`}}>
                                <Input
                                    errorText={errorText}
                                    name="company"
                                    onChange={this.onChange}
                                    placeholder=""
                                    rowSpan="double"
                                    showError={showError}
                                    title="company"
                                />
                            </div>
                            <div className="flex-center space-between" style={{width: `100%`}}>
                                <Input
                                    errorText={passwordError}
                                    name="password"
                                    onChange={this.onChange}
                                    required
                                    rowSpan="double"
                                    showError={showPasswordError}
                                    title="password"
                                    type="password"
                                />
                                <Input
                                    errorText={confirmPasswordError}
                                    name="confirmPassword"
                                    onChange={this.onChange}
                                    required
                                    rowSpan="double"
                                    showError={showConfirmPasswordError}
                                    title="confirm password"
                                    type="password"
                                />
                            </div>
                        </div>
                        <Button onClick={this._register} title="Register" />
                    </form>
                </div>
            </main>
        );
    }
}

Register.propTypes = {
    history: objectOf(any).isRequired,
    darkTheme: bool.isRequired
};

export default Register;
