import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import React from 'react';

export interface ActionButtonProps {
  text: string;
  clickHandler: () => void;
  sx?: SxProps<Theme>;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, clickHandler, sx }) => {
  return (
    <Button variant="contained" color="primary" onClick={clickHandler} sx={sx}>
      {text}
    </Button>
  );
};

export default ActionButton;