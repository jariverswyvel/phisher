import React from 'react';
import {string, bool} from 'prop-types';
import './index.css';

const SmartLabel = ({name, picture, hideText, darkTheme}) => {
    const calculateInitials = name => {
        return name
            .split(` `)
            .map(part => part.substring(0, 1).toUpperCase())
            .join(``);
    };

    return (
        <li className="smart-label-item-wrapper flex-center">
            <div className="label-image unselectable" title={name}>
                {picture ? (
                    <img src={picture} />
                ) : (
                    <p className={`label-initials ${darkTheme ? `dark` : ``}`}>{calculateInitials(name)}</p>
                )}
            </div>
            {!hideText && (
                <div className="label-text">
                    <p className="label-text unselectable">{name}</p>
                </div>
            )}
        </li>
    );
};

SmartLabel.propTypes = {
    name: string.isRequired,
    picture: string,
    hideText: bool,
    darkTheme: bool
};

SmartLabel.defaultProps = {
    picture: null,
    hideText: false,
    darkTheme: false
};

export default SmartLabel;
