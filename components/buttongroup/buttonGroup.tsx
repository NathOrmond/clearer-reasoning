import { Box } from '@mui/material';
import React from 'react';
import ActionButton, { ActionButtonProps } from '../button/actionButton';

interface ButtonGroupProps {
  buttons: ActionButtonProps[];
}

const ButtonGroupComponent: React.FC<ButtonGroupProps> = ({ buttons }) => {
  return (
    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
      {buttons.map((button, index) => (
        <ActionButton key={index} {...button} />
      ))}
    </Box>
  );
};

export default ButtonGroupComponent;