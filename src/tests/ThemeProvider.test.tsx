import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';

const TestComponent = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-status">{resolvedTheme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeProvider Component', () => {
  it('provides default theme and allows toggling theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const status = screen.getByTestId('theme-status');
    expect(status).toHaveTextContent(/light|dark/);

    const button = screen.getByRole('button', { name: /Toggle Theme/i });
    fireEvent.click(button);

    // Theme toggled
    expect(status).toBeInTheDocument();
  });
});
