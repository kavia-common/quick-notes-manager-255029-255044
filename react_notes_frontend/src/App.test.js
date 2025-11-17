import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header and input', () => {
  render(<App />);
  expect(screen.getByText(/Quick Notes/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Write a quick note/i)).toBeInTheDocument();
});
