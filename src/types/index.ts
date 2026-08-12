export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorTheme = 'blue' | 'red' | 'green' | 'yellow';

export type ParticleDensity = 'low' | 'medium' | 'high';

export type MaterialType = 'glass' | 'metal' | 'standard';

export interface SceneControlsState {
  wireframe: boolean;
  rotationSpeed: number; // 0.1 to 3.0
  colorTheme: ColorTheme;
  particleDensity: ParticleDensity;
  autoRotate: boolean;
  materialType: MaterialType;
  modelType: 'quantum' | 'sphere' | 'torus' | 'gltf';
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'Cloud AI' | 'Pixel' | 'Workspace' | 'Quantum' | 'Android';
  description: string;
  features: string[];
  icon: string;
  badge?: string;
  metrics?: string;
  link: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: 'zap' | 'shield' | 'cpu' | 'sparkles' | 'globe' | 'layers';
  accentColor: string;
}

export interface HeroFallbackProps {
  reason?: string;
  onRetry?: () => void;
  ariaLabel?: string;
}

export interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}
