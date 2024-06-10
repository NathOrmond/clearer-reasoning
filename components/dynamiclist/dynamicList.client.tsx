'use client';
import { Box, Typography } from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import ActionButton from '../button/actionButton';
import Proposition from '../proposition/proposition.client';

interface PropositionData {
  description: string;
  inputValue: string;
}

const DynamicList: React.FC = () => {
  const [list, setList] = useState<PropositionData[]>([{ description: '', inputValue: '' }]);
  const [conclusion, setConclusion] = useState('');

  const handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const newList = [...list];
    newList[index].inputValue = event.target.value;
    setList(newList);
  };

  const handleConclusionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConclusion(event.target.value);
  };

  const addProposition = () => {
    setList(prevList => [...prevList, { description: '', inputValue: '' }]);
  };

  const removeProposition = () => {
    setList(prevList => prevList.slice(0, -1));
  };

  return (
    <div>

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <ActionButton 
          text="Add Premise" 
          clickHandler={addProposition} 
          sx={{ ml: 8 }}  
        />
        {list.length > 1 &&
          <ActionButton
            text="Remove Premise"
            clickHandler={removeProposition}
            sx={{ backgroundColor: 'red', color: 'white' }}
          />}
        <ActionButton
          text="Analyse"
          clickHandler={() => { }}
          sx={{ backgroundColor: 'green', color: 'white' }}
        />
      </Box>

      {list.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ width: '50px' }}>
            P-{index + 1}
          </Typography>
          <Proposition
            description={item.description}
            inputValue={item.inputValue}
            onChange={handleChange(index)}
          />
        </Box>
      ))}
     
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body1" sx={{ width: '50px' }}>
          C
        </Typography>
        <Proposition
          description=""
          inputValue={conclusion}
          onChange={handleConclusionChange}
        />
      </Box>
    </div>
  );
};

export default DynamicList;