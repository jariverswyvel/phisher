import React from 'react';
import {string, func, bool, objectOf, any, oneOfType} from 'prop-types';
import './index.css';
import {Consumer} from '../../contexts/phisherContext';

const Input = ({
    title,
    placeholder,
    onChange,
    type,
    name,
    showError,
    errorText,
    value,
    onEnter,
    inputStyle,
    required,
    disabled,
    rowSpan
}) => {
    const handleKeyPress = e => e.key === `Enter` && onEnter();

    return (
        <Consumer>
            {({darkTheme}) => (
                <div className={`${rowSpan}-row`}>
                    {title && (
                        <label className="input-title" htmlFor={`input-${name}`}>
                            {title}
                            {required && <span className="required-input">*</span>}
                        </label>
                    )}
                    <div className="input-holder">
                        <input
                            className={`form-input ${darkTheme ? `dark-theme-light-bg` : ``} ${showError ? `error-input` : ``}`}
                            disabled={disabled}
                            id={`input-${name}`}
                            name={name}
                            onChange={onChange}
                            onKeyPress={handleKeyPress}
                            placeholder={placeholder}
                            style={inputStyle}
                            type={type}
                            value={value}
                        />
                    </div>
                    {showError && <div className="error-input-message">{errorText}</div>}
                </div>
            )}
        </Consumer>
    );
};

Input.propTypes = {
    title: string,
    placeholder: string,
    onChange: func,
    type: string,
    name: string,
    showError: bool,
    errorText: string,
    value: oneOfType([any]),
    onEnter: func,
    inputStyle: objectOf(any),
    required: bool,
    disabled: bool,
    rowSpan: string
};

Input.defaultProps = {
    title: null,
    placeholder: ``,
    onChange: () => false,
    type: `text`,
    name: ``,
    showError: false,
    errorText: ``,
    value: undefined,
    onEnter: () => false,
    inputStyle: {},
    required: false,
    disabled: false,
    rowSpan: `single`
};

export default Input;
