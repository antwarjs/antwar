import React from 'react';
import moment from 'moment';

const Moment = ({
  className,
  datetime,
  format = 'D MMM YYYY'
}) => (
  <time dateTime={datetime} className={className}>
    {moment(datetime).format(format)}
  </time>
);

export default Moment;
