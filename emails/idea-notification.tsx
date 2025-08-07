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

interface IdeaNotificationEmailProps {
  recipientName: string;
  actorName: string;
  actorEmail: string;
  ideaTitle: string;
  ideaDescription: string;
  workspaceName: string;
  actionType: 'created' | 'updated' | 'commented' | 'phase_changed';
  actionDetails?: string;
  ideaUrl: string;
  phase?: string;
  comment?: string;
}

export const IdeaNotificationEmail = ({
  recipientName = 'there',
  actorName = 'John Doe',
  actorEmail = 'john@example.com',
  ideaTitle = 'Revolutionary App Idea',
  ideaDescription = 'An innovative solution to everyday problems',
  workspaceName = 'My Workspace',
  actionType = 'created',
  actionDetails = '',
  ideaUrl = 'https://ForgeSpace.com/ideas/123',
  phase = 'inception',
  comment = '',
}: IdeaNotificationEmailProps) => {
  const getActionText = () => {
    switch (actionType) {
      case 'created':
        return 'created a new idea';
      case 'updated':
        return 'updated an idea';
      case 'commented':
        return 'commented on an idea';
      case 'phase_changed':
        return `moved an idea to ${phase} phase`;
      default:
        return 'updated an idea';
    }
  };

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

  const previewText = `${actorName} ${getActionText()} in ${workspaceName}`;

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

          <Heading style={h1}>New Activity in {workspaceName}</Heading>

          <Text style={heroText}>Hi {recipientName},</Text>

          <Text style={text}>
            <strong>{actorName}</strong> ({actorEmail}) {getActionText()} in
            your workspace.
          </Text>

          <Section style={ideaCard}>
            <div style={ideaHeader}>
              <Text style={ideaTitleStyle}>{ideaTitle}</Text>
              {phase && (
                <span
                  style={{
                    ...phaseBadge,
                    backgroundColor: getPhaseColor(phase),
                  }}
                >
                  {phase.replace('_', ' ')}
                </span>
              )}
            </div>
            <Text style={ideaDescriptionStyle}>{ideaDescription}</Text>

            {comment && (
              <Section style={commentSection}>
                <Text style={commentLabel}>Comment:</Text>
                <Text style={commentText}>"{comment}"</Text>
              </Section>
            )}

            {actionDetails && (
              <Text style={actionDetailsText}>{actionDetails}</Text>
            )}
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={ideaUrl}>
              View Idea
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            You're receiving this because you're a member of the {workspaceName}{' '}
            workspace. You can manage your notification preferences in your{' '}
            <Link href="https://ForgeSpace.com/settings" style={link}>
              account settings
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

export default IdeaNotificationEmail;

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

const ideaCard = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const ideaHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
};

const ideaTitleStyle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
  flex: '1',
};

const phaseBadge = {
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '500',
  padding: '4px 8px',
  borderRadius: '4px',
  textTransform: 'capitalize' as const,
};

const ideaDescriptionStyle = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};

const commentSection = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  padding: '12px',
  margin: '16px 0 0',
};

const commentLabel = {
  color: '#374151',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const commentText = {
  color: '#374151',
  fontSize: '14px',
  fontStyle: 'italic',
  lineHeight: '1.5',
  margin: '0',
};

const actionDetailsText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '12px 0 0',
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
