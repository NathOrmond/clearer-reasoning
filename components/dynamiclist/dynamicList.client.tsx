'use client';
import React, { ChangeEvent, useState } from 'react';
import Proposition from '../proposition/proposition.client';

interface PropositionData {
  description: string;
  inputValue: string;
}

const DynamicList: React.FC = () => {
  const [list, setList] = useState<PropositionData[]>([{ description: '', inputValue: '' }]);

  const handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const newList = [...list];
    newList[index].inputValue = event.target.value;
    setList(newList);
  };

  const addProposition = () => {
    setList(prevList => [...prevList, { description: '', inputValue: '' }]);
  };

  return (
    <div 
    >
      {list.map((item, index) => (
        <Proposition
          key={index}
          description={item.description}
          inputValue={item.inputValue}
          onChange={handleChange(index)}
        />
      ))}
      <button onClick={addProposition}>Add Proposition</button>
    </div>
  );
};

export default DynamicList;