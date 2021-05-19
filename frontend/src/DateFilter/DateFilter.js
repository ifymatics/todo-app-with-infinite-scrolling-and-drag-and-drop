

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({

    filter: {
        color: 'white',
        padding: '0 1rem'
      },
      
      filter__control: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1rem 0'
      },
      
      filter_label: {
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      },
      
      filter_select: {
        font: 'inherit',
        padding: '0.5rem 3rem',
        fontWeight: 'bold',
          borderRadius: '6px'
      }
}));

const DateFilter = ({dateFilterHandler, selected}) => {
    
  const classes = useStyles();

  return (
    <div className={classes.filter}>
      <div className={classes.filter__control}>
        <label className={classes.filter_label}>Filter by year</label>
        <select className={classes.filter_select} value={selected} onChange={e=> dateFilterHandler(e.target.value)}>
          <option value='All'>All</option>
          <option value='today'>today</option>
         
        </select>
      </div>
    </div>
  );
}
export default DateFilter;