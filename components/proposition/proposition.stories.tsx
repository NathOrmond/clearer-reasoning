import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import Proposition from '../../components/proposition/proposition.client';

const meta = {
  title: 'Components/Proposition',
  component: Proposition,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Proposition>;

export default meta;
type Story = StoryObj<typeof meta>;


export const myButton: Story = {
  args: {
    description: 'This is a proposition',
    inputValue: 'This is the input value',
    onChange: action('Input changed'),
  },
};

