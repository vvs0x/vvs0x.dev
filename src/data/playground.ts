import type { PlaygroundItem } from '../types';

/*
 * Entries with a `body` get a detail page at /playground/<id>.
 * Entries without one are placeholders and show "Coming soon".
 */
export const playground: PlaygroundItem[] = [
  {
    id: 'ui-abstraction',
    title: 'Why I stopped using component libraries.',
    excerpt: 'Eventually they obscure the fundamental architecture.',
    category: 'Thoughts',
    type: 'thought',
    colSpan: 2,
  },
  {
    id: 'fluid-sim',
    title: 'WebGL Fluid Dynamics',
    category: 'Experiments',
    type: 'experiment',
    color: '#0f172a',
  },
  {
    id: 'rust-cli',
    title: 'Log Parser in Rust',
    category: 'Open Source',
    type: 'experiment',
    color: '#1e293b',
  },
  {
    id: 'observer-hook',
    title: 'useScrollReveal()',
    category: 'Snippets',
    type: 'thought',
  },
  {
    id: 'generative-001',
    title: 'Generative Noise Maps',
    category: 'Experiments',
    type: 'experiment',
    color: '#334155',
  },
];
