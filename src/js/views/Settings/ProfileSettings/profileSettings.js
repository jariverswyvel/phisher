import React, {Component, Fragment} from 'react';
import Input from '../../../components/Input';
import {objectOf, any, func} from 'prop-types';
import {update_profile} from '../../../lib/phisherClient';
import Button from '../../../components/Button';
import './profileSettings.css';

class ProfileSettings extends Component {
    state = {
        user: this.props.user
    };

    handleUpdateProfile = (e, cb) => {
        e.preventDefault();
        const {user} = this.state;
        update_profile(user, ({message}) => message === `Success` && cb && cb());
    };

    onChange = ({target: {value, name}}) => {
        const {user} = this.state;
        this.setState({user: {...user, [name]: value}});
    };

    render() {
        const {user} = this.state;
        const {fetchProfile} = this.props;

        if (user) {
            return (
                <Fragment>
                    <h2 className="active-settings-title">Profile</h2>
                    <section className="settings-section">
                        <form onSubmit={e => this.handleUpdateProfile(e, fetchProfile)}>
                            <div className="flex-center space-between">
                                <Input
                                    name="firstname"
                                    onChange={this.onChange}
                                    rowSpan="double"
                                    title="firstname"
                                    value={user.firstname}
                                />
                                <Input
                                    name="lastname"
                                    onChange={this.onChange}
                                    rowSpan="double"
                                    title="lastname"
                                    value={user.lastname}
                                />
                            </div>
                            <Input
                                disabled
                                name="username"
                                onChange={this.onChange}
                                rowSpan="double"
                                title="username"
                                value={user.username}
                            />
                            <Input name="email" onChange={this.onChange} title="email" value={user.email} />
                            <Input
                                name="company"
                                onChange={this.onChange}
                                rowSpan="double"
                                title="company"
                                value={user.company}
                            />

                            <Button onClick={e => this.handleUpdateProfile(e, fetchProfile)} title="Update profile" />
                        </form>
                    </section>
                </Fragment>
            );
        } else return null;
    }
}

ProfileSettings.propTypes = {
    user: objectOf(any).isRequired,
    fetchProfile: func.isRequired
};

export default ProfileSettings;
