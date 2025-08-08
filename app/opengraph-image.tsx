import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ForgeSpace - AI-Powered Idea Development Platform';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
              overflow: 'hidden',
            }}
          >
            <img
              src="https://forge-space.vercel.app/forgespace-logo.png"
              alt="ForgeSpace Logo"
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain',
              }}
            />
          </div>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ForgeSpace
          </span>
        </div>

        {/* Main Title */}
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            margin: '0 0 20px 0',
            lineHeight: '1.1',
          }}
        >
          Transform Your Ideas
          <br />
          Into Reality
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '28px',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            margin: '0 0 40px 0',
            maxWidth: '800px',
          }}
        >
          AI-powered platform for idea development and team collaboration
        </p>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {[
            { icon: '🧠', text: 'AI Analysis' },
            { icon: '👥', text: 'Collaboration' },
            { icon: '🚀', text: 'Development' },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '32px' }}>{feature.icon}</span>
              <span
                style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500',
                }}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '500',
          }}
        >
          forge-space.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
