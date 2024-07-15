// test/App.test.js
import React from 'react';
import { render } from '@testing-library/react';
import App from '../src/App'; 

test('renders the app without crashing', () => {
  render(<App />);
});
