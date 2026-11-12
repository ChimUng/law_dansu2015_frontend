import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the civil-law assistant landing screen', () => {
  render(<App />);
  expect(screen.getByText(/Luật Minh Bạch/i)).toBeInTheDocument();
  expect(screen.getByText(/Hỏi luật rõ ràng/i)).toBeInTheDocument();
});
