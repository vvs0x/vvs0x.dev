import type { PlaygroundItem } from '../types';

/*
 * Entries with a `body` get a detail page at /playground/<id>.
 * Entries without one are placeholders: their cards are not clickable.
 *
 * Each body section becomes a heading in the text and an item in the
 * page's side menu. The texts below are draft copy.
 */

export const playground: PlaygroundItem[] = [
  {
    id: 'mac-mini-server',
    title: 'Mac Mini Server',
    category: 'Homelab',
    date: '2026-10-25',
    image: {
      src: '/images/mac_mini_server.webp',
      alt: 'A space grey Mac mini, seen from the front.',
      width: 3000,
      height: 1875,
    },
    body: [
      {
        heading: 'The setup',
        paragraphs: [
          'I wanted a server of my own to build on and run things from, so I bought a used Mac mini and turned it into a home server that runs around the clock. Ubuntu Server does the actual work, and I manage it over SSH from my MacBook.',
          'macOS is still installed alongside Ubuntu. Apple only delivers firmware updates through macOS, so when one comes out I boot into macOS, install it and switch back.',
        ],
      },
      {
        heading: 'Hardware',
        paragraphs: [
          'It’s a Mac mini from late 2018 (model A1993), the last Mac mini with an Intel processor.',
        ],
        list: [
          'CPU: Intel Core i7-8700B, 6 cores at 3.2 GHz, Turbo Boost up to 4.6 GHz',
          'Memory: 32 GB DDR4 at 2666 MHz',
          'Storage: 512 GB PCIe SSD',
          'Graphics: Intel UHD Graphics 630',
          'Network: 1 Gigabit Ethernet',
        ],
      },
      {
        heading: 'Hosting and deployment',
        paragraphs: [
          'The server hosts the website I built for my brother. Caddy serves the site, and a Cloudflare Tunnel connects it to the internet. The tunnel connects outward to Cloudflare.',
          'Deployments go through a self-hosted GitHub Actions runner on the same machine. When I push to the repository, the runner pulls the new code and copies it into place, and the new version is live. I never upload files by hand.',
        ],
      },
      {
        heading: 'Remote access',
        paragraphs: [
          'My first plan was plain WireGuard. While I was setting up the router for it, I found out that my connection runs on DS-Lite rather than full dual stack. I don’t get a public IPv4 address of my own, so WireGuard over IPv4 was out. IPv6 would work, but only from networks that support IPv6, and many hotel and public Wi-Fi networks still don’t. I switched to Tailscale, which works from any network because the devices connect outward, and I’ve used it since.',
        ],
      },
      {
        heading: 'Local LLM',
        paragraphs: [
          'I also run Qwen3.6 locally with llama.cpp. I knew from the start that this Mac mini, without a dedicated GPU or the unified memory of Apple’s M-series chips, couldn’t handle serious models, and at about 8 tokens per second it’s too slow for real work. It’s there so I can experiment with running models on my own hardware.',
        ],
      },
    ],
  },
  {
    id: 'aiko-frontend',
    title: 'Frontend',
    category: 'Web',
    date: '2026-11-07',
    image: {
      src: '/images/aiko_website.webp',
      alt: 'Homepage of aiko-audio.com: the AIKØ logo above a white wireframe wave on black, with the menu About, Music, Mixes, Dates and Bookings.',
      width: 3000,
      height: 1872,
    },
    body: [
      {
        heading: 'Background',
        paragraphs: [
          'My brother is starting out as a DJ and performs as AIKØ. I built his website to push him and give him a more professional presence. It covers who he is, his music and mixes, upcoming dates and bookings.',
        ],
      },
      {
        heading: 'Hosting',
        paragraphs: [
          'It runs on my Mac mini home server. Caddy serves it, a Cloudflare Tunnel makes it reachable, and every push to GitHub goes live automatically through a self-hosted runner.',
        ],
      },
    ],
    links: [{ label: 'Visit the site', href: 'https://aiko-audio.com' }],
  },
  {
    id: 'placeholder-1',
    title: 'Coming Soon...',
    category: 'Experiments',
    date: 'TBA',
    color: '#1a1a1a',
  },
];
