'use client';
import { ChangeEvent, FC } from 'react';
import styles from './Proposition.module.css';

interface PropositionProps {
  description: string;
  inputValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Proposition: FC<PropositionProps> = ({ description, inputValue, onChange }) => {
  return (
    <div className={styles.container}>
      <p className={styles.description}>
        {description}
      </p>
      <input type="text" value={inputValue} 
      onChange={onChange} 
      className={styles.input} />
    </div>
  );
};

export default Proposition;