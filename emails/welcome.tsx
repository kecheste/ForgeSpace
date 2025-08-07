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

interface WelcomeEmailProps {
  userName: string;
  userEmail: string;
}

export const WelcomeEmail = ({
  userName = 'there',
  userEmail = 'user@example.com',
}: WelcomeEmailProps) => {
  const previewText =
    'Welcome to ForgeSpace - Transform your ideas into reality';
  console.log(userEmail);

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

          <Heading style={h1}>Welcome to ForgeSpace! 🚀</Heading>

          <Text style={heroText}>Hi {userName},</Text>

          <Text style={text}>
            Welcome to ForgeSpace, the all-in-one idea development platform
            where you can turn raw ideas into fully developed projects or
            business plans. We're excited to have you on board!
          </Text>

          <Section style={featureSection}>
            <Heading style={h2}>What you can do with ForgeSpace:</Heading>

            <div style={featureGrid}>
              <div style={featureItem}>
                <div style={featureIcon}>💡</div>
                <div>
                  <Text style={featureTitle}>Idea Lifecycle Management</Text>
                  <Text style={featureDescription}>
                    Guide your ideas through structured phases from inception to
                    execution
                  </Text>
                </div>
              </div>

              <div style={featureItem}>
                <div style={featureIcon}>👥</div>
                <div>
                  <Text style={featureTitle}>Collaborative Workspaces</Text>
                  <Text style={featureDescription}>
                    Create team spaces with role-based access and real-time
                    collaboration
                  </Text>
                </div>
              </div>

              <div style={featureItem}>
                <div style={featureIcon}>📊</div>
                <div>
                  <Text style={featureTitle}>AI-Powered Analysis</Text>
                  <Text style={featureDescription}>
                    Get viability scores, market insights, and strategic
                    recommendations
                  </Text>
                </div>
              </div>

              <div style={featureItem}>
                <div style={featureIcon}>🔧</div>
                <div>
                  <Text style={featureTitle}>Integrated Tools</Text>
                  <Text style={featureDescription}>
                    Connect with Figma, GitHub, Slack, and other productivity
                    tools
                  </Text>
                </div>
              </div>
            </div>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href="https://ForgeSpace.com/ideas/new">
              Create Your First Idea
            </Button>
          </Section>

          <Section style={tipsSection}>
            <Heading style={h3}>Quick Start Tips:</Heading>
            <Text style={tipItem}>
              1. Create your first workspace to organize your ideas
            </Text>
            <Text style={tipItem}>
              2. Invite team members to collaborate on projects
            </Text>
            <Text style={tipItem}>
              3. Use the Feasibility Analyzer to validate your concepts
            </Text>
            <Text style={tipItem}>
              4. Explore the modular tools to enhance your workflow
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            Need help getting started? Check out our{' '}
            <Link href="https://ForgeSpace.com/help" style={link}>
              Help Center
            </Link>{' '}
            or watch our{' '}
            <Link href="https://ForgeSpace.com/tutorials" style={link}>
              video tutorials
            </Link>
            .
          </Text>

          <Text style={footerText}>
            Questions? Just reply to this email - we'd love to hear from you!
          </Text>

          <Text style={footerText}>
            Happy innovating! <br />
            The ForgeSpace Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.25',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '1.25',
  margin: '24px 0 16px',
};

const h3 = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '1.25',
  margin: '20px 0 12px',
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

const featureSection = {
  margin: '32px 0',
};

const featureGrid = {
  display: 'grid',
  gap: '16px',
};

const featureItem = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  margin: '8px 0',
};

const featureIcon = {
  fontSize: '24px',
  flexShrink: 0,
};

const featureTitle = {
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const featureDescription = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '1.4',
  margin: '0',
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

const tipsSection = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const tipItem = {
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
