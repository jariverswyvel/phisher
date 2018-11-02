import React from 'react';
import {string, bool, func, objectOf, any} from 'prop-types';
import './index.css';

const SmartPeople = ({addAssignee, person, picture, removable, removeAssignee, darkTheme}) => {
    const {_id, name, email} = person;

    const calculateInitials = name => {
        return name
            .split(` `)
            .map(part => part.substring(0, 1).toUpperCase())
            .join(``);
    };

    return (
        <li
            className="smart-people-item flex-center space-between"
            onClick={e => {
                removable ? removeAssignee(_id) : addAssignee(person);
                e.stopPropagation();
            }}>
            <div className="smart-people-wrapper flex-center">
                <div className="people-image unselectable">
                    {picture ? (
                        <img src={picture} />
                    ) : (
                        <p className={`label-initials ${darkTheme ? `dark` : ``}`}>{calculateInitials(name)}</p>
                    )}
                </div>
                <div className="people-names">
                    <p className="people-name unselectable">{name}</p>
                    <p className="people-username unselectable">{email}</p>
                </div>
            </div>
        </li>
    );
};

SmartPeople.propTypes = {
    addAssignee: func,
    person: objectOf(any).isRequired,
    picture: string,
    removable: bool,
    removeAssignee: func,
    darkTheme: bool
};

SmartPeople.defaultProps = {
    addAssignee: () => false,
    removable: false,
    removeAssignee: () => false,
    darkTheme: false,
    picture: null
};

export default SmartPeople;
