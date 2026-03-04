import { render, screen } from '@testing-library/react';
import Page from '../app/page';

describe('Home Page', () => {
  it('renders correctly', () => {
    render(<Page />);
    // Check for the heading text.
    expect(screen.getByText(/To get started, edit the page.tsx file./i)).toBeInTheDocument();
  });
});
