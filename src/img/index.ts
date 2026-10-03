import fs from 'fs';
import path from 'path';

export const beard = fs.readFileSync(path.join(__dirname, 'beard.svg'), 'utf8');

export const arrow = {
  down: fs.readFileSync(path.join(__dirname, 'arrows', 'down.svg'), 'utf8'),
  right: fs.readFileSync(path.join(__dirname, 'arrows', 'right.svg'), 'utf8'),
};

export const social: { readonly [icon: string]: string } = {
  github: fs.readFileSync(path.join(__dirname, 'social', 'github.svg'), 'utf8'),
  linkedin: fs.readFileSync(path.join(__dirname, 'social', 'linkedin.svg'), 'utf8'),
  mastodon: fs.readFileSync(path.join(__dirname, 'social', 'mastodon.svg'), 'utf8'),
};
