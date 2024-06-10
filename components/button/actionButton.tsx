import React from 'react';
import styles from './actionButton.module.css';

export interface ActionButtonProps {
  text: string;
  clickHandler: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, clickHandler }) => {
  return (
    <button 
      className={styles.button}
      onClick={clickHandler}
    >
      {text}
    </button>
  );
};

export default ActionButton;