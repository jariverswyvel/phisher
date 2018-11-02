import React from 'react';
import {func, string} from 'prop-types';
import './index.css';
import {Consumer} from '../../contexts/phisherContext';

const Button = ({title, onClick}) => {
    return (
        <Consumer>
            {({darkTheme}) => (
                <button className={`phisher-button pointer ${darkTheme ? `dark-button` : ``}`} onClick={onClick} type="submit">
                    {title}
                </button>
            )}
        </Consumer>
    );
};

Button.propTypes = {
    title: string.isRequired,
    onClick: func
};

Button.defaultProps = {
    onClick: () => false
};

export default Button;
