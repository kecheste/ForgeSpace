import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const contentType = 'image/png';
export const size = {
  width: 32,
  height: 32,
};

export default function Icon() {
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
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <img
          src="https://forge-space.vercel.app/forgespace-logo.png"
          alt="ForgeSpace Logo"
          style={{
            width: '24px',
            height: '24px',
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
