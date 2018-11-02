import React from 'react';
import {arrayOf, any, string} from 'prop-types';
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import './index.css';

const Barchart = ({data, className}) => (
    <div className={`barchart-container ` + className}>
        <ResponsiveContainer>
            <BarChart data={data} height={300} margin={{top: 5, right: 65, left: 10, bottom: 5}}>
                <XAxis dataKey="average" stroke="#565656" />
                <YAxis allowDecimals stroke="#565656" />
                <Tooltip cursor={{fill: `rgba(65, 119, 192, 0.1)`}} />
                <Bar dataKey="targets" fill="#4177c0" />
                <Bar dataKey="opened" fill="#97cc51" />
                <Bar dataKey="clicked" fill="#dd3224" />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

Barchart.propTypes = {
    data: arrayOf(any).isRequired,
    className: string
};

Barchart.defaultProps = {
    className: ``
};

export default Barchart;
