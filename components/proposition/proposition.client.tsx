import { Box, TextField, Typography } from '@mui/material';
import { ChangeEvent, FC } from 'react';

interface PropositionProps {
  description: string;
  inputValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Proposition: FC<PropositionProps> = ({ description, inputValue, onChange }) => {
  return (
    <Box 
      sx={
        { 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          minWidth: '30rem', 
        }
      }
    >
      <Typography variant="body1">
        {description}
      </Typography>
      <TextField
        variant="outlined"
        value={inputValue}
        onChange={onChange}
        sx={{ backgroundColor: 'white'}}
        inputProps={{ style: { textAlign: 'center' } }}
        multiline
        minRows={1}
        maxRows={5}
      />
    </Box>
  );
};

export default Proposition;