import React from 'react';
import {arrayOf, any, string} from 'prop-types';
import {BarChart, Bar, Brush, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {formatDateWithTime, formatDate} from '../../../lib/helpers';
import './index.css';

const BarchartWithTimeline = ({data, className}) => (
    <div className={`barchart-timeline-container ` + className}>
        <ResponsiveContainer>
            <BarChart data={data} height={300} margin={{top: 5, right: 65, left: 10, bottom: 5}}>
                <XAxis dataKey="run" stroke="#565656" tickFormatter={tick => formatDateWithTime(tick)} />
                <YAxis allowDecimals={false} stroke="#565656" />
                <Tooltip cursor={{fill: `rgba(65, 119, 192, 0.1)`}} />
                <Legend verticalAlign="top" wrapperStyle={{lineHeight: `40px`}} />
                <Brush dataKey="run" height={30} stroke="#4177c0" tickFormatter={tick => formatDate(tick)} />
                <Bar dataKey="opened" fill="#97cc51" />
                <Bar dataKey="clicked" fill="#dd3224" />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

BarchartWithTimeline.propTypes = {
    data: arrayOf(any).isRequired,
    className: string
};

BarchartWithTimeline.defaultProps = {
    className: ``
};

export default BarchartWithTimeline;
