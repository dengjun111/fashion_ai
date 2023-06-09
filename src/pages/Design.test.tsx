import React from 'react';
import { render, screen } from '@testing-library/react';
import Design from './Design';

test('renders learn react link', () => {
  render(<Design />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
