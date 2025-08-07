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

interface WorkspaceInvitationEmailProps {
  inviterName: string;
  inviterEmail: string;
  workspaceName: string;
  workspaceDescription?: string;
  role: string;
  inviteUrl: string;
  recipientName?: string;
}

export const WorkspaceInvitationEmail = ({
  inviterName,
  workspaceName,
  workspaceDescription,
  role,
  inviteUrl,
  recipientName,
}: WorkspaceInvitationEmailProps) => {
  const safeInviterName = inviterName || 'A team member';
  const safeWorkspaceName = workspaceName || 'a workspace';
  const safeRole = role || 'member';
  const safeRecipientName = recipientName || 'there';
  const safeInviteUrl = inviteUrl || 'https://forgespace.com';

  const previewText = `${safeInviterName} invited you to join ${safeWorkspaceName} on ForgeSpace`;

  const formatRole = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Administrator';
      case 'member':
        return 'Member';
      case 'viewer':
        return 'Viewer';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const displayRole = formatRole(safeRole);

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src={`${process.env.NEXT_PUBLIC_APP_URL || 'https://forgespace.com'}/logo.png`}
              width="120"
              height="36"
              alt="ForgeSpace"
              style={logo}
            />
          </Section>

          <Heading style={h1}>You're invited to collaborate!</Heading>

          <Text style={heroText}>Hi {safeRecipientName},</Text>

          <Text style={text}>
            <strong>{safeInviterName}</strong> has invited you to join the{' '}
            <strong>{safeWorkspaceName}</strong> workspace on ForgeSpace as a{' '}
            <strong>{displayRole}</strong>.
          </Text>

          {workspaceDescription && (
            <Section style={descriptionSection}>
              <Text style={descriptionText}>"{workspaceDescription}"</Text>
            </Section>
          )}

          <Section style={buttonContainer}>
            <Button style={button} href={safeInviteUrl}>
              Accept Invitation
            </Button>
          </Section>

          <Text style={text}>
            ForgeSpace is a collaborative platform for transforming ideas into
            execution-ready plans. In this workspace, you'll be able to:
          </Text>

          <Section style={featureList}>
            <Text style={featureItem}>
              • Create and develop ideas through structured phases
            </Text>
            <Text style={featureItem}>
              • Collaborate with team members in real-time
            </Text>
            <Text style={featureItem}>
              • Get AI-powered insights and suggestions
            </Text>
            <Text style={featureItem}>
              • Track progress from concept to execution
            </Text>
            {safeRole === 'admin' && (
              <Text style={featureItem}>
                • Manage workspace settings and members
              </Text>
            )}
            {safeRole === 'viewer' && (
              <Text style={featureItem}>
                • View and comment on ideas and progress
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            If you weren't expecting this invitation, you can safely ignore this
            email. The invitation will expire in 7 days.
          </Text>

          <Text style={footerText}>
            Need help? Visit our{' '}
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://forgespace.com'}/help`}
              style={link}
            >
              Help Center
            </Link>{' '}
            or reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WorkspaceInvitationEmail;

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

const descriptionSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const descriptionText = {
  color: '#6b7280',
  fontSize: '14px',
  fontStyle: 'italic',
  lineHeight: '1.5',
  margin: '0',
  textAlign: 'center' as const,
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

const featureList = {
  margin: '16px 0',
};

const featureItem = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '4px 0',
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
