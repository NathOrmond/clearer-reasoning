import React from 'react';
import styles from './actionButton.module.css';

interface ActionButtonProps {
  text: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick }) => {
  return (
    <button className={styles.button}>
      {text}
    </button>
  );
};

export default ActionButton;