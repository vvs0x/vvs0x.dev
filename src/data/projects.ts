import type { Project } from '../types';

/*
 * Entries with a `body` get a detail page at /projects/<id>.
 * Entries without one are placeholders and show "Coming soon".
 *
 * Each body section becomes a heading in the text and an item in the
 * page's side menu. The texts below are draft copy.
 */

export const projects: Project[] = [
  {
    id: 'automated-portfolio-pipeline',
    title: 'Automated Portfolio Pipeline',
    category: 'Automation',
    date: '2026-07-10',
    image: {
      src: '/images/automated_portfolio_pipeline.webp',
      alt: 'Google Apps Script editor showing the getData function of the Automated Portfolio Pipeline.',
      width: 3000,
      height: 1872,
    },
    body: [
      {
        heading: 'Why I built it',
        paragraphs: [
          'I keep a Google Sheets dashboard for my portfolio: number of shares per position, average cost, fees, dividends, realised gains. For a long time I filled it by hand. After every trade I opened the broker statement, found the right numbers and copied them over one by one. It was tedious, easy to get wrong, and the kind of chore that gets postponed until the sheet is out of date.',
          'The goal was a workflow where none of that copying is left to me. The trades happen at the broker, and the dashboard updates itself.',
        ],
      },
      {
        heading: 'What it does',
        paragraphs: [
          'A Google Apps Script that pulls my Interactive Brokers activity into the dashboard without me touching it. It requests a Flex Query statement, waits for the report to be generated, retries on the transient error codes the API is known for, and only then parses the XML.',
          'Broker exports change column order and labels over time, so the script locates header rows and columns by label instead of by position. The raw statement is dumped to a separate sheet for auditing, and only the cleaned rows are written into the dashboard.',
        ],
      },
      {
        heading: 'How I built it',
        paragraphs: [
          'I am not fluent in JavaScript, and I did not pretend to be. I designed and tested the whole solution in Python first, where I could reason about the steps comfortably: fetching the statement, handling the retries, normalising the columns. Once the logic was right, I translated it into JavaScript for Apps Script, since that is what runs inside Google Sheets.',
          'AI helped me throughout, both with the translation and with the parts of Apps Script I had never touched. I treated it as a pair programmer, not an autopilot: every function was read, run against real statements and adjusted until I understood why it worked.',
        ],
      },
      {
        heading: 'Outcome',
        paragraphs: [
          'A small project, but it removed a recurring manual task, and the dashboard is now trustworthy because no number in it was typed by hand. It is also the kind of foundation the backtesting work builds on.',
        ],
      },
    ],
  },
  {
    id: 'placeholder-1',
    title: 'Coming Soon...',
    category: 'Finance',
    date: 'TBA',
    color: '#1a1a1a',
  },
  {
    id: 'placeholder-2',
    title: 'Coming Soon...',
    category: 'Database',
    date: 'TBA',
    color: '#2a2a2a',
  },
];
