import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Predict link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Predict/i);
  expect(linkElement).toBeInTheDocument();
});
