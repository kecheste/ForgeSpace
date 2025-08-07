import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WeeklyDigestEmailProps {
  userName: string;
  weekStart: string;
  weekEnd: string;
  stats: {
    ideasCreated: number;
    ideasUpdated: number;
    commentsAdded: number;
    workspacesActive: number;
  };
  recentIdeas: Array<{
    title: string;
    workspace: string;
    phase: string;
    url: string;
  }>;
  topWorkspaces: Array<{
    name: string;
    activity: number;
    url: string;
  }>;
}

export const WeeklyDigestEmail = ({
  userName = 'there',
  weekStart = 'January 1',
  weekEnd = 'January 7',
  stats = {
    ideasCreated: 3,
    ideasUpdated: 7,
    commentsAdded: 12,
    workspacesActive: 2,
  },
  recentIdeas = [
    {
      title: 'Mobile App Redesign',
      workspace: 'Design Team',
      phase: 'refinement',
      url: '#',
    },
    {
      title: 'AI Integration',
      workspace: 'Tech Team',
      phase: 'planning',
      url: '#',
    },
  ],
  topWorkspaces = [
    { name: 'Design Team', activity: 15, url: '#' },
    { name: 'Tech Team', activity: 12, url: '#' },
  ],
}: WeeklyDigestEmailProps) => {
  const previewText = `Your ForgeSpace weekly digest: ${stats.ideasCreated} new ideas, ${stats.commentsAdded} comments`;

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'inception':
        return '#3b82f6';
      case 'refinement':
        return '#f59e0b';
      case 'planning':
        return '#f97316';
      case 'execution_ready':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src="https://ForgeSpace.com/logo.png"
              width="120"
              height="36"
              alt="ForgeSpace"
              style={logo}
            />
          </Section>

          <Heading style={h1}>Your Weekly Innovation Digest</Heading>

          <Text style={heroText}>Hi {userName},</Text>

          <Text style={text}>
            Here's what happened in your ForgeSpace workspaces from {weekStart}{' '}
            to {weekEnd}.
          </Text>

          {/* Stats Section */}
          <Section style={statsSection}>
            <Heading style={h2}>This Week's Activity</Heading>
            <div style={statsGrid}>
              <div style={statItem}>
                <div style={statNumber}>{stats.ideasCreated}</div>
                <div style={statLabel}>New Ideas</div>
              </div>
              <div style={statItem}>
                <div style={statNumber}>{stats.ideasUpdated}</div>
                <div style={statLabel}>Ideas Updated</div>
              </div>
              <div style={statItem}>
                <div style={statNumber}>{stats.commentsAdded}</div>
                <div style={statLabel}>Comments Added</div>
              </div>
              <div style={statItem}>
                <div style={statNumber}>{stats.workspacesActive}</div>
                <div style={statLabel}>Active Workspaces</div>
              </div>
            </div>
          </Section>

          {/* Recent Ideas */}
          {recentIdeas.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>Recent Ideas</Heading>
              {recentIdeas.map((idea, index) => (
                <div key={index} style={ideaItem}>
                  <div style={ideaHeader}>
                    <Text style={ideaTitle}>{idea.title}</Text>
                    <span
                      style={{
                        ...phaseBadge,
                        backgroundColor: getPhaseColor(idea.phase),
                      }}
                    >
                      {idea.phase.replace('_', ' ')}
                    </span>
                  </div>
                  <Text style={ideaWorkspace}>{idea.workspace}</Text>
                  <Link href={idea.url} style={ideaLink}>
                    View Idea →
                  </Link>
                </div>
              ))}
            </Section>
          )}

          {/* Top Workspaces */}
          {topWorkspaces.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>Most Active Workspaces</Heading>
              {topWorkspaces.map((workspace, index) => (
                <div key={index} style={workspaceItem}>
                  <div style={workspaceInfo}>
                    <Text style={workspaceName}>{workspace.name}</Text>
                    <Text style={workspaceActivity}>
                      {workspace.activity} activities
                    </Text>
                  </div>
                  <Link href={workspace.url} style={workspaceLink}>
                    Visit →
                  </Link>
                </div>
              ))}
            </Section>
          )}

          <Section style={buttonContainer}>
            <Button style={button} href="https://ForgeSpace.com">
              Open ForgeSpace
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            You're receiving this weekly digest because you have it enabled in
            your{' '}
            <Link href="https://ForgeSpace.com/settings" style={link}>
              notification settings
            </Link>
            .
          </Text>

          <Text style={footerText}>
            <Link href="https://ForgeSpace.com/help" style={link}>
              Help Center
            </Link>{' '}
            •{' '}
            <Link href="https://ForgeSpace.com/unsubscribe" style={link}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WeeklyDigestEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const logoContainer = {
  textAlign: 'center' as const,
  margin: '0 0 40px',
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '1.25',
  margin: '24px 0 16px',
};

const heroText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
};

const text = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '16px 0',
};

const section = {
  margin: '32px 0',
};

const statsSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '16px',
};

const statItem = {
  textAlign: 'center' as const,
  padding: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '6px',
};

const statNumber = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 4px',
};

const statLabel = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '500',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const ideaItem = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px',
  margin: '12px 0',
};

const ideaHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const ideaTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
  flex: '1',
};

const phaseBadge = {
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: '500',
  padding: '3px 6px',
  borderRadius: '4px',
  textTransform: 'capitalize' as const,
};

const ideaWorkspace = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0 0 8px',
};

const ideaLink = {
  color: '#3b82f6',
  fontSize: '12px',
  fontWeight: '500',
  textDecoration: 'none',
};

const workspaceItem = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px',
  margin: '12px 0',
};

const workspaceInfo = {
  flex: '1',
};

const workspaceName = {
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const workspaceActivity = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0',
};

const workspaceLink = {
  color: '#3b82f6',
  fontSize: '12px',
  fontWeight: '500',
  textDecoration: 'none',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '8px 0',
};

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
};
