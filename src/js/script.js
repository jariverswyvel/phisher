import 'whatwg-fetch';
import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {PhisherProvider} from './contexts/phisherContext';

import App from './containers/app';

const init = () =>
    render(
        <PhisherProvider>
            <Router>
                <App />
            </Router>
        </PhisherProvider>,
        document.querySelector(`.react-mount`)
    );

init();
