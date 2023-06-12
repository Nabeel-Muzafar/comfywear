import React, { useState } from 'react';
import { Select, MenuItem, TextField, Button, InputLabel } from '@mui/material';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Theme CSS file
import axios from 'axios';
const options = ['Wapdatown', 'Warehouse', 'Township'];

export default function Report() {
    const [location, setLocation] = useState('');
    const [selectedRange, setSelectedRange] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
      ]);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };


  const handleSubmit = () => {
    // Handle form submission here
    console.log('Location:', location);
    // console.log('Date Range:', selectedRange[0].endDate);
    const endDate = selectedRange[0].endDate;
    const startDate = selectedRange[0].startDate;
    const formattedEndDate = formatDate(endDate);
    const formattedStartDate = formatDate(startDate);
    console.log(formattedStartDate,formattedEndDate);


    const data = {
        location,
        startDate:formattedStartDate,
        endDate: formattedEndDate,
      };
    
      axios.post('/api/report', data)
        .then(response => {
          // Handle the response from the backend
          console.log(response.data);
        })
        .catch(error => {
          // Handle any error that occurs during the API request
          console.error(error);
        });
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <div>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select labelId="demo-simple-select-label" value={location} onChange={handleLocationChange} fullWidth label="Branch">
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </div>
      <DateRangePicker
  ranges={selectedRange}
  onChange={ranges => setSelectedRange([ranges.selection])}
/>

      <div style={{ marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  )
}
