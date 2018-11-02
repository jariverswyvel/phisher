import React from 'react';
import {func, bool} from 'prop-types';
import './index.css';
import {Consumer} from '../../contexts/phisherContext';

const Confirm = ({onDelete, onCancel, show}) => {
    if (show) {
        return (
            <Consumer>
                {({darkTheme}) => (
                    <div className={`banner-menu confirm-container ${darkTheme ? `dark-theme` : ``}`}>
                        <ul className="banner-menu-list">
                            <li
                                className="banner-menu-list-item flex-center space-between pointer unselectable"
                                onClick={() => {
                                    onDelete();
                                    onCancel();
                                }}>
                                Delete <i className="fal fa-trash-alt" />
                            </li>
                            <li
                                className="banner-menu-list-item pointer flex-center space-between unselectable"
                                onClick={() => {
                                    onCancel();
                                }}>
                                Cancel <i className="fas fa-ban" />
                            </li>
                        </ul>
                    </div>
                )}
            </Consumer>
        );
    } else {
        return null;
    }
};

Confirm.propTypes = {
    onDelete: func.isRequired,
    onCancel: func.isRequired,
    show: bool
};

Confirm.defaultProps = {
    show: false
};

export default Confirm;
