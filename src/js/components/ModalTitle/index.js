import React from 'react';
import {node, string} from 'prop-types';

const ModalTitle = ({icon, title}) => {
    return (
        <h2 className="modal-title">
            {icon} {title}
        </h2>
    );
};

ModalTitle.propTypes = {
    title: string,
    icon: node
};

ModalTitle.defaultProps = {
    title: null,
    icon: null
};

export default ModalTitle;
