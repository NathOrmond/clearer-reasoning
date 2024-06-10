import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import ActionButton from '../../components/button/actionButton';

const meta = {
  title: 'Components/ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;


export const myButton: Story = {
  args: {
    text: 'Click me',
    clickHandler: action('Button clicked'),
  },
};

