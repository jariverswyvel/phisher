import React from 'react';
import {objectOf, any, func, bool} from 'prop-types';
import './target.css';
import ActionButton from '../../../components/ActionButton';

const Target = ({target, deleteTarget, selectTarget, darkTheme}) => {
    const {name, email} = target;
    return (
        <li className={`target flex-center space-between ${darkTheme ? `dark-theme` : ``}`}>
            <div className="target-info">
                <p className="ellipsis target-name">{name}</p>
                <p className="ellipsis target-email">{email}</p>
            </div>
            <div className="flex-center target-actions">
                <ActionButton icon={<i className="fal fa-pencil-alt" />} onClick={() => selectTarget(target)} />
                <ActionButton confirm icon={<i className="fal fa-trash-alt" />} onClick={deleteTarget} red />
            </div>
        </li>
    );
};

Target.propTypes = {
    target: objectOf(any).isRequired,
    deleteTarget: func.isRequired,
    selectTarget: func.isRequired,
    darkTheme: bool
};

Target.defaultProps = {
    darkTheme: false
};

export default Target;
