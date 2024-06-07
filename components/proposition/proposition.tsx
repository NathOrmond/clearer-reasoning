import { FC } from 'react';

interface PropostionProps {
  buttonText: string;
  description: string;
  inputValue: string;
}

const Proposition: FC<PropostionProps> = ({ buttonText, description, inputValue }) => {
  return (
    <div>
      <p>{description}</p>
      <input type="text" value={inputValue} />
      <button>{buttonText}</button>
    </div>
  );
};

export default Proposition;