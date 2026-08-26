export type Config = {
  readonly description: string;
  readonly keywords: readonly string[];
  readonly name: string;
  readonly path?: string;
  readonly scripts?: string;
  readonly styles: string;
  readonly subtitle?: string;
  readonly title: string;
  readonly url: string;
}

export const config: Config = {
  description: 'Technologist, DevOps, Developer, Site Reliability Engineer, all kinds of wizardry.',
  keywords: [
    'javascript', 'typescript', 'go', 'kubernetes', 'fullstack', 'software', 'engineer', 'web', 'developer', 'devops',
    'php', 'ruby', 'python', 'html', 'scss', 'css', 'cloudfoundry', 'london', 'cv', 'resume', 'aws',
  ],
  name: 'Rafal Proszowski',
  styles: '',
  title: 'Software Engineer',
  url: 'https://www.paroxp.com/',
};
