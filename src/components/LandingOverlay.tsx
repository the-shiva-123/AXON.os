import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Bot, Layers3, Sparkles } from 'lucide-react';

type LandingOverlayProps = {
  isExiting: boolean;
  onGetStarted: () => void;
};

const quickActions = ['Build Web App', 'Analyze Code', 'Explore Canvas'];

const featureCards = [
  {
    title: 'AI-First Design',
    description: 'Prototype agent workflows with a focused, structured canvas for rapid experimentation.',
    icon: Sparkles,
  },
  {
    title: 'Live Visual Feedback',
    description: 'Validate every move with execution previews and contextual suggestions for each artifact.',
    icon: Bot,
  },
  {
    title: 'Operational Clarity',
    description: 'Keep your system readable and intentional with a calmer, production-friendly workflow loop.',
    icon: Layers3,
  },
];

export function LandingOverlay({ isExiting, onGetStarted }: LandingOverlayProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    let rafId = 0;

    const handleScroll = () => {
      if (rafId) return;

      rafId = window.requestAnimationFrame(() => {
        setIsScrolled(overlay.scrollTop > 18);
        rafId = 0;
      });
    };

    handleScroll();
    overlay.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      overlay.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={overlayRef} className={`studio-landing-overlay ${isExiting ? 'studio-landing-overlay--exiting' : ''}`}>
      <div className="studio-landing-shell">
        <header className={`studio-navbar ${isScrolled ? 'studio-navbar--scrolled' : ''}`} aria-label="Main navigation">
          <div className="studio-brand" role="img" aria-label="Studio Showcase brand mark">
            <div className="studio-logo-wrap">
              <span className="studio-logo-core" />
              <span className="studio-logo-ring" />
            </div>
            <span className="studio-brand-name">Studio Showcase</span>
          </div>

          <nav className="studio-nav-links" aria-label="Primary navigation">
            <a href="#overview">Overview</a>
            <a href="#features">Features</a>
            <a href="#docs">Docs</a>
          </nav>

          <button type="button" className="studio-primary-button" onClick={onGetStarted}>
            Get Started
          </button>
        </header>

        <main className="studio-landing-body">
          <section className="studio-hero" id="overview">
            <div className="studio-hero-copy">
              <span className="studio-eyebrow">AI systems studio</span>
              <h1>
                Design intelligent experiences
                <span className="studio-gradient-text">with clarity and momentum.</span>
              </h1>
              <p>
                Build, test, and refine your next generation of AI-powered workflows with a calmer,
                more thoughtful operating canvas.
              </p>

              <div className="studio-prompt-box" aria-label="Prompt composer">
                <div className="studio-prompt-header">
                  <div className="studio-dots">
                    <span className="studio-dot dot-red" />
                    <span className="studio-dot dot-yellow" />
                    <span className="studio-dot dot-green" />
                  </div>
                  <span className="studio-chip">Creative Workflow</span>
                </div>

                <div className="studio-prompt-body">
                  <span className="studio-prompt-label">Prompt</span>
                  <div className="studio-prompt-text">Design a polished onboarding flow for a modern AI product studio.</div>
                </div>
              </div>

              <div className="studio-action-pills" aria-label="Suggested actions">
                {quickActions.map((action) => (
                  <button key={action} type="button" className="studio-pill-button">
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div className="studio-preview-panel" aria-label="Workspace preview">
              <div className="studio-preview-card">
                <div className="studio-preview-toolbar">
                  <div className="studio-preview-tabs">
                    <span className="studio-tab active">Overview</span>
                    <span className="studio-tab">Canvas</span>
                    <span className="studio-tab">Deploy</span>
                  </div>
                  <div className="studio-preview-actions">
                    <span className="studio-mini-badge" />
                    <span className="studio-mini-badge soft" />
                  </div>
                </div>

                <div className="studio-preview-body">
                  <aside className="studio-side-nav">
                    <span className="studio-side-item active" />
                    <span className="studio-side-item" />
                    <span className="studio-side-item" />
                    <span className="studio-side-item" />
                  </aside>

                  <div className="studio-canvas-area">
                    <div className="studio-canvas-header">
                      <div className="studio-canvas-title" />
                      <div className="studio-canvas-status" />
                    </div>

                    <div className="studio-canvas-grid">
                      <div className="studio-node large warm" />
                      <div className="studio-node medium" />
                      <div className="studio-node small" />
                      <div className="studio-node medium warm" />
                      <div className="studio-node large" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="studio-feature-grid" id="features">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title} className="studio-feature-card" style={{ animationDelay: `${index * 110}ms` }}>
                  <div className="studio-feature-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </section>

          <section className="studio-docs-panel" id="docs" aria-label="Documentation overview">
            <div className="studio-docs-copy">
              <span className="studio-docs-eyebrow">Docs</span>
              <h3>Everything you need to launch with confidence.</h3>
            </div>
            <div className="studio-docs-list">
              <span>Architecture</span>
              <span>Prompting</span>
              <span>Deployment</span>
            </div>
            <div className="studio-docs-link" aria-label="Open docs">
              <ArrowUpRight size={16} strokeWidth={2.1} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
