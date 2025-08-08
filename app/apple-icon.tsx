import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const contentType = 'image/png';
export const size = {
  width: 180,
  height: 180,
};

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '32px',
          overflow: 'hidden',
        }}
      >
        <img
          src="https://forge-space.vercel.app/forgespace-logo.png"
          alt="ForgeSpace Logo"
          style={{
            width: '120px',
            height: '120px',
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
