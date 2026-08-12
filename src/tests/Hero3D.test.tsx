import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import FallbackHero from '../components/FallbackHero';
import Hero3D from '../components/Hero3D';
import { ThemeProvider } from '../components/ThemeProvider';

describe('FallbackHero Component', () => {
  it('renders fallback image with accessible aria-label and message', () => {
    render(
      <FallbackHero
        reason="WebGL is unavailable."
        ariaLabel="Static 2D Polyhedron Fallback"
      />
    );

    const fallbackImg = screen.getByRole('img', { name: /Static 2D Polyhedron Fallback/i });
    expect(fallbackImg).toBeInTheDocument();
    expect(screen.getByText(/Accessible Fallback Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/WebGL is unavailable./i)).toBeInTheDocument();
  });

  it('triggers retry callback when retry button is clicked', () => {
    const handleRetry = vi.fn();
    render(<FallbackHero reason="Device lost" onRetry={handleRetry} />);

    const retryBtn = screen.getByRole('button', { name: /Re-initialize 3D Scene/i });
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});

describe('Hero3D Component', () => {
  it('renders hero title and action buttons', () => {
    const handleExplore = vi.fn();
    render(
      <ThemeProvider>
        <Hero3D onExploreClick={handleExplore} />
      </ThemeProvider>
    );

    expect(screen.getByText(/Spacious, Minimal/i)).toBeInTheDocument();

    const exploreBtn = screen.getByRole('button', { name: /Explore Ecosystem/i });
    expect(exploreBtn).toBeInTheDocument();
    fireEvent.click(exploreBtn);
    expect(handleExplore).toHaveBeenCalledTimes(1);
  });
});
