import React from 'react';
import {string, bool, func, objectOf, any} from 'prop-types';
import {Switch, Route, Redirect} from 'react-router-dom';
import Dashboard from '../views/Dashboard/dashboard';
import Campaign from '../views/Campaign/campaign';
import ErrorPage from '../views/Error';
import Settings from '../views/Settings/settings';
import Credits from '../views/Credits/credits';
import Targets from '../views/Targets/targets';

const Routes = ({pathname, darkTheme, fetchProfile, history}) => {
    return (
        <main className={darkTheme ? `dark-theme-light-bg` : ``}>
            <Switch>
                <Route component={Dashboard} exact path="/" />
                <Route
                    exact
                    path="/campaigns/:campaign_id"
                    render={props => <Campaign {...props} darkTheme={darkTheme} history={history} updateProfile={fetchProfile} />}
                />
                <Route component={Settings} path="/settings" />
                <Route component={Credits} path="/credits" />
                <Route path="/targets" render={props => <Targets {...props} darkTheme={darkTheme} />} />
                {pathname === `/login` && <Redirect to="/" />}
                <Route component={ErrorPage} />
            </Switch>
        </main>
    );
};

Routes.propTypes = {
    pathname: string.isRequired,
    history: objectOf(any).isRequired,
    darkTheme: bool.isRequired,
    fetchProfile: func.isRequired
};

export default Routes;
