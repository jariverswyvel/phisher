import React from 'react';
import {objectOf, any, func, number, bool} from 'prop-types';
import './pack.css';

const Pack = ({pack, onClick, index, darkTheme}) => {
    const {name, credits, pack: packName, price, currency} = pack;

    const coinIcons = [];

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

    for (let i = 0; i < index + 1; i++) {
        coinIcons.push(<i className="far fa-coins" key={i} />);
    }

    return (
        <li
            className={`pack pointer ${darkTheme ? `dark-theme-light-bg` : ``}`}
            onClick={() => onClick(credits, packName, price)}>
            <div className="pack-price-banner">
                <p className="unselectable">
                    {determineCurrency()} {price}
                </p>
            </div>
            <div>{coinIcons.map(icon => icon)}</div>
            <p className="pack-name unselectable">
                {packName === `PACKINF` ? (
                    <span className="pack-inf-name">
                        <i className="far fa-infinity" /> Pack
                    </span>
                ) : (
                    name
                )}
            </p>
        </li>
    );
};

Pack.propTypes = {
    pack: objectOf(any).isRequired,
    onClick: func.isRequired,
    index: number.isRequired,
    darkTheme: bool
};

Pack.defaultProps = {
    darkTheme: false
};

export default Pack;
