import type { Project } from '../types';

/*
 * Entries with a `body` get a detail page at /projects/<id>.
 * Entries without one are placeholders and show "Coming soon".
 *
 * The body texts below are draft copy. Replace them with your own words.
 */

export const projects: Project[] = [
  {
    id: 'automated-ledger-pipeline',
    title: 'Automated Ledger Pipeline',
    category: 'Automation',
    date: '2026-07-10',
    image: {
      src: '/images/automated-ledger-pipeline.webp',
      alt: 'Google Apps Script editor showing the getData function of the Automated Ledger Pipeline.',
      width: 1600,
      height: 1000,
    },
    body: [
      'A Google Apps Script that pulls my Interactive Brokers activity into a Google Sheets ledger without me touching it. It requests a Flex Query statement, waits for the report to be generated, retries on the transient error codes the API is known for, and only then parses the XML.',
      'The interesting part is the normalisation step. Broker exports change column order and labels over time, so the script locates header rows and columns by label instead of by position, dumps the raw statement to a separate sheet for auditing, and writes the cleaned rows into the ledger.',
      'A small project, but it removed a weekly manual task, and it is the kind of foundation the backtesting work builds on.',
    ],
  },
  {
    id: 'backtesting-framework',
    title: 'Backtesting Framework',
    category: 'Finance',
    date: '2026-07-02',
    color: '#1a1a1a',
    body: [
      'A framework for testing trading ideas against historical data before risking anything on them. Strategies are plain functions that receive market data and portfolio state and return orders. The engine takes care of fills, costs and position tracking.',
      'The focus is on honest results: no look-ahead bias, transaction costs and slippage modelled explicitly, and every run reproducible from a config file and a data snapshot.',
    ],
  },
  {
    id: 'void-identity-system',
    title: 'Void Identity System',
    category: 'Design',
    color: '#2a2a2a',
  },
];
