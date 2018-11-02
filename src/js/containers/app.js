import React, {Fragment} from 'react';
import {hot} from 'react-hot-loader';
import {objectOf, any} from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Consumer} from '../contexts/phisherContext';
import Routes from '../routes';
import Navbar from '../components/Navbar';
import {fetchtoken} from '../lib/phisherClient';
import Login from '../views/Login/login';
import Register from '../views/Register/register';

const App = ({location: {pathname}, history}) => {
    return (
        <Consumer>
            {({user, fetchProfile, darkTheme, switchThemes}) => {
                if (fetchtoken()) {
                    return (
                        user && (
                            <Fragment>
                                {pathname !== `/login` &&
                                    pathname !== `/register` && (
                                        <Navbar darkTheme={darkTheme} switchThemes={switchThemes} user={user} />
                                    )}
                                <Routes darkTheme={darkTheme} fetchProfile={fetchProfile} history={history} pathname={pathname} />
                            </Fragment>
                        )
                    );
                } else if (pathname === `/register`) {
                    return <Register darkTheme={darkTheme} history={history} />;
                } else return <Login darkTheme={darkTheme} fetchProfile={fetchProfile} history={history} />;
            }}
        </Consumer>
    );
};

App.propTypes = {
    location: objectOf(any).isRequired,
    history: objectOf(any).isRequired
};

export default hot(module)(withRouter(App));
