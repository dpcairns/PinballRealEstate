import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function ValueText(value) {
  return `${value}°C`;
}

const marks = [
  {
    value: 250000,
    label: '$250,000'
  },
  {
    value: 1500000,
    label: '$1.5 Mil'
  },
  {
    value: 3000000,
    label: '$3 Mil'
  },
];

const minDistance = 200000;

export default function CustomSlider({ setSignUpData, signUpData }) {
    
  const [value2, setValue2] = React.useState([0, 400000]);

  const handleChange2 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.max(newValue[0], 100000 - minDistance);
        setValue2([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue2([clamped - minDistance, clamped]);
      }
    } else {
      setValue2(newValue);
    }
    
    setSignUpData({
      ...signUpData,
      low_price: value2[0],
      high_price: value2[1]
    });

  };

  return (
    <Box sx={{ width: 300, display: 'flex' }}>
      <Slider
        getAriaLabel={() => 'Minimum distance shift'}
        value={value2}
        onChange={handleChange2}
        valueLabelDisplay="auto"
        getAriaValueText={ValueText}
        disableSwap
        min={0}
        max={3000000}
        step={50000}
        sx={{ color: '#40798c', margin: '10px', padding: '10px' }}
        marks={marks}
      />
    </Box>
  );
}