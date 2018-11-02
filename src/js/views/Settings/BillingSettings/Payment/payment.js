import React from 'react';
import {objectOf, any, bool} from 'prop-types';
import './payment.css';
import {parserData, formatDateTextual} from '../../../../lib/helpers';

const Payment = ({payment, darkTheme}) => {
    const {amount, created_on, currency, method} = payment;

    const determineCurrency = () => {
        switch (currency) {
            case `usd`:
                return `$`;
            case `pnd`:
                return `£`;
            case `eur`:
            default:
                return `€`;
        }
    };

    return (
        <li className={`payment ${darkTheme ? `dark-theme-light-bg` : ``}`}>
            <div className="payment-date">{formatDateTextual(created_on)}</div>
            <div>
                amount: {determineCurrency()} {parserData(amount)}
            </div>
            <div>method: {method}</div>
        </li>
    );
};

Payment.propTypes = {
    payment: objectOf(any).isRequired,
    darkTheme: bool
};

Payment.defaultProps = {
    darkTheme: false
};

export default Payment;
