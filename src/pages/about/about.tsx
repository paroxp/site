import React, { ReactElement, ReactNode } from 'react';

import { arrow } from '../../img';
import { Footer, Header, Link } from '../layout';

function ordinalSuffix(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return 'th';
  }

  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function formatLong(date: Date): string {
  const day = date.getUTCDate();
  const month = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' }).format(date);

  return `${month} ${day}${ordinalSuffix(day)} ${date.getUTCFullYear()}`;
}

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', { month: 'long', timeZone: 'UTC', year: 'numeric' }).format(date);
}

function formatYear(date: Date): string {
  return String(date.getUTCFullYear());
}

type BaseExperienceProperties = {
  readonly title: string;
  readonly start: Date;
  readonly finish?: Date;
  readonly nonPrintable?: boolean;
  readonly children?: ReactNode;
};

type ExperienceProperties = BaseExperienceProperties & {
  readonly hasEmbeddedExperience?: boolean;
  readonly organisation: string;
  readonly organisationURL: string;
};

type TermProperties = {
  readonly start: Date;
  readonly finish?: Date;
  readonly format: (date: Date) => string;
};

function Term(props: TermProperties): ReactElement {
  const range = (format: (date: Date) => string): string =>
    `${format(props.start)} - ${!props.finish ? 'present' : format(props.finish)}`;

  return <time dateTime={props.start.toISOString().slice(0, 10)} title={range(formatLong)}>
    {range(props.format)}
  </time>;
}

function Experience(props: ExperienceProperties): ReactElement {
  return <details data-details={props.nonPrintable ? 'no-print' : ''} open>
    <summary>
      <span className="icon closed" dangerouslySetInnerHTML={{ __html: arrow.right }} />
      <span className="icon open" dangerouslySetInnerHTML={{ __html: arrow.down }} />

      <Term start={props.start} finish={props.finish} format={formatYear} />
      <span className={props.hasEmbeddedExperience ? 'no-print' : ''}>: {}
        <strong>
          {props.title}
        </strong> at
      </span> <Link href={props.organisationURL}>{props.organisation}</Link> {}
      <span className="link" aria-hidden>( {props.organisationURL} )</span>
    </summary>

    {props.children}

  </details>;
}

function EmbeddedExperience(props: BaseExperienceProperties): ReactElement {
  return <div className="embedded">
    <Term start={props.start} finish={props.finish} format={formatMonthYear} />: {}
    <strong>{props.title}</strong>

    {props.children}
  </div>;
}

const skills: readonly (readonly [string, readonly string[]])[] = [
  ['Application Development', ['Go', 'TypeScript', 'Node.js', 'NGINX']],
  ['Infrastructure & Cloud', ['Kubernetes', 'Terraform', 'AWS', 'CloudFoundry']],
  ['Databases & Storage', ['Postgres', 'MySQL', 'Redis', 'DynamoDB']],
  ['DevOps & Security', ['Git', 'Docker', 'CI/CD', 'Testing']],
  ['Monitoring & Observability', ['Grafana', 'Prometheus', 'Datadog', 'Dynatrace']],
  ['Frontend & Web', ['React', 'Angular', 'Koa.js', 'Express.js']],
];

export function About(): ReactElement {
  return <>
    <Header page="about" />
    <main id="about">
      <section id="summary">
        <h3>Professional summary</h3>

        <p>
          I'm a highly experienced Site Reliability Engineer with extensive experience of providing technical leadership
          across teams and projects, committed to maintaining cutting edge technical skills and up-to-date industry
          knowledge. I'm eager to learn and always after new exciting opportunities and challenges.
        </p>
      </section>

      <section id="skills">
        <h3>Skills</h3>

        <div data-skills>
          {skills.map(([group, items]) => <div key={group}>
            <strong>{group}</strong>

            {items.map((item, index) => <React.Fragment key={item}>
              {index > 0 ? ', ' : ''}<span>{item}</span>
            </React.Fragment>)}
          </div>)}
        </div>
      </section>

      <section id="timeline">
        <h3>Experience</h3>

        <Experience
          start={new Date('2016-08-08')}
          title="Head of Platform and Reliability Engineering"
          hasEmbeddedExperience={true}
          organisation="Government Digital Service"
          organisationURL="https://gds.blog.gov.uk">
          <EmbeddedExperience
            start={new Date('2025-05-01')}
            title="Head of Platform and Reliability Engineering">

          </EmbeddedExperience>
          <EmbeddedExperience
            start={new Date('2022-03-23')}
            finish={new Date('2025-05-01')}
            title="Lead SRE">
            <ul>
              <li>
                Lead the Site Reliability Engineering capabilities across multiple teams, managed workload, provided
                guidance and mentorship to junior team members
              </li>
              <li>
                Collaborated with cross-functional teams including software development, IT operations, and security
                teams to improve reliability, scalability, and security of infrastructure and the surrounding processes
              </li>
              <li>
                Developed and implemented proactive monitoring and alerting systems to ensure that issues are caught
                before they become critical
              </li>
              <li>
                Worked with development teams to ensure that software releases are properly tested, validated and
                deployed in production environments
              </li>
              <li>
                Developed and maintained documentation for infrastructure and processes related to Site Reliability
                Engineering
              </li>
              <li>
                Participated in incident response and post-mortem analysis to identify the root cause of problems and
                implement preventative measures to avoid similar incidents in the future
              </li>
              <li>
                Ensured compliance with industry standards and best practices related to Site Reliability Engineering
                and serverless systems
              </li>
              <li>
                Evaluated and implemented new technologies and tools that can help improve system performance and
                reliability
              </li>
              <li>
                Worked and Communicated with senior management and stakeholders regarding the strategy, progress and
                status of Site Reliability Engineering initiatives providing guidance at various levels
              </li>
              <li>
                Contributed and assisted in building the support model for the programme, setting out the strategy for
                running critical service sustainably and reliably
              </li>
            </ul>
          </EmbeddedExperience>

          <EmbeddedExperience
            start={new Date('2016-08-08')}
            finish={new Date('2022-03-22')}
            title="Senior SRE and Tech Lead">
            <ul>
              <li>
                Technical Lead for GOV.UK PaaS platform serving 200+ government organizations. Architected and
                delivered critical infrastructure components including admin portal used by the platform users and
                adopted by similar platforms in the industry, automated billing system processing monthly recharge, and
                inter-cell IPSec encryption layer improving security posture. Managed platform reliability for 2.5k
                applications and 2k backing services with 99.999% uptime.
              </li>
              <li>
                Architected and led the design and development of various components for the Kubernetes platform
                including service operator, signed docker images, deployment and smoke testing pipelines
              </li>
              <li>
                Worked with Senior Management, Product Managers, User Researchers, UI and Content Designers to
                understand user needs and design, plan and prioritise multiple streams of work to improve the platform
              </li>
              <li>
                Provided expert advice to PaaS tenants across government and the wider public sector to help them get
                the most out of the platform and to establish best practice patterns and approaches. Feeding learnings
                from this support back into the team to help identify unmet needs
              </li>
              <li>
                Developed GOV.UK PaaS and Build &amp; Run processes with the use of Terraform, AWS, Concourse,
                Kubernetes, CloudFoundry, Bosh, YAML, Go, Shell Scripts, Postgres
              </li>
              <li>
                Developed web applications for GOV.UK PaaS tenants with the use of Go, Node.js, TypeScript, Sinatra,
                JS, Webpack
              </li>
              <li>
                Worked with Secure Continuous Delivery system using Git and GPG encryption to ensure integrity of
                developer commits prior to deployment
              </li>
              <li>
                Line managed and mentored colleagues through career progression, more demanding tasks and new
                responsibilities
              </li>
              <li>Troubleshoot complex network and systems issues through being on support or a incident lead</li>
              <li>Actively patched various CVE's, performed security audits, triaged risks and pen-test findings</li>
              <li>Collaborated with NCSC on improving the designs and architecture for an international system</li>
              <li>
                In-depth pair programming to build shared knowledge, onboard colleagues to complex systems and share
                the burden of more demanding tasks
              </li>
              <li>
                Presented and demonstrated at show and tells, knowledge shares, meet-ups, conferences and online panels
                and podcasts
              </li>
              <li>
                Driving progression, well being, and best working practices for the team
              </li>
              <li>Worked in an Agile - Kanban and Scrum environments</li>
              <li>
                Used and managed ticketing system Pivotal Tracker for project management which involved creating epics
                and stories
              </li>
            </ul>
          </EmbeddedExperience>
        </Experience>

        <Experience
          start={new Date('2015-11-30')}
          finish={new Date('2016-08-05')}
          title="Frontend Developer"
          organisation="FLIP Sports"
          organisationURL="http://flipsports.com">
          <ul>
            <li>Worked on a rewards system with the use of Angular, Ionic, JWT, OIDC, Python, AWS, Postgres</li>
            <li>Delivered services in a form of REST APIs, Web Applications, Metric collectors</li>
            <li>Mainly focussed on the Frontend aspect of the projects</li>
            <li>Helped out with certain python micro services</li>
            <li>Helped out with PHP projects</li>
            <li>Used ticketing system JIRA for project management</li>
          </ul>
        </Experience>

        <Experience
          start={new Date('2013-06-17')}
          finish={new Date('2015-11-27')}
          title="Developer"
          organisation="HurstDEV"
          organisationURL="https://github.com/jamiefdhurst">
          <ul>
            <li>Worked with variety of clients on different needs, solutions and technologies</li>
            <li>Been able to choose a stack for each project to satisfy needs</li>
            <li>
              Worked with PHP, MySQL, Laravel, CakePHP, jQuery, Node.js, Gulp, Grunt, Ansible, Vagrant, NGINX,
              Ubuntu Server, Puppet, Shell Scripts
            </li>
            <li>Delivered services in a form of REST APIs, eCommerce Stores, CMS, Web Applications, Chat</li>
            <li>Helped out junior members of the team in progression</li>
            <li>Helped out in recruitment process</li>
            <li>Solved interesting problems to satisfy clients needs</li>
            <li>Been on call for certain clients</li>
            <li>Used ticketing systems Codebase and JIRA for project management</li>
          </ul>
        </Experience>

        <Experience
          start={new Date('2012-09-17')}
          finish={new Date('2013-06-14')}
          title="Junior Web Developer"
          organisation="Surreal Creative"
          organisationURL="https://whysurreal.com">
          <ul>
            <li>Worked with variety of clients on different needs, solutions and technologies</li>
            <li>Worked with PHP, MySQL, CodeIgniter, Laravel, JavaScript, jQuery, Vagrant, Puppet, Chef</li>
            <li>Solved interesting problems to satisfy client needs</li>
            <li>Used ticketing system Pivotal Tracker, Codebase and Bootcamp for project management</li>
          </ul>
        </Experience>

        <Experience
          start={new Date('2009-09-14')}
          finish={new Date('2012-06-14')}
          title="Extended Diploma in IT"
          organisation="Newcastle College"
          organisationURL="https://www.ncl-coll.ac.uk"
          nonPrintable={true}>
            <ul>
            <li>
              Worked on Exciting modules:
              <ul>
                <li>Unit 1: Communication and Employability Skills for IT</li>
                <li>Unit 2: Computer Systems</li>
                <li>Unit 3: Information Systems</li>
                <li>Unit 4: Impact of the Use of IT on Business Systems</li>
                <li>Unit 5: Managing Networks</li>
                <li>Unit 6: Software Design and Development</li>
                <li>Unit 7: Organisational Systems Security</li>
                <li>Unit 8: e-Commerce</li>
                <li>Unit 9: Computer Networks</li>
                <li>Unit 10: Communication Technologies</li>
                <li>Unit 11: Systems Analysis and Design</li>
                <li>Unit 12: IT Technical Support</li>
                <li>Unit 13: IT Systems Troubleshooting and Repair</li>
              </ul>
            </li>
            <li>
              Did few projects in PHP on the side in exchange for games
              <ul>
                <li>Local Game Shop website</li>
                <li>A tool to generate websites for my class colleagues to pass their modules</li>
              </ul>
            </li>
            <li>Completed with an impressive result of Triple Distinction (D*DD)</li>
          </ul>
        </Experience>

        <h3>Hobbies &amp; Interests</h3>

        <p>
          IT, Technology, Software Development, Gaming, Open Source, Sci-Fi, Fantasy,
          comic books.
        </p>

        <p>Making things open, making things better.</p>
      </section>
    </main>
    <Footer />
  </>;
}
