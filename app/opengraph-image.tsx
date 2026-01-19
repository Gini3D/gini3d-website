import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Gini3D - Adorable 3D Printed Creations';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 30%, #fbcfe8 60%, #f9a8d4 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 60,
          fontSize: 60,
          opacity: 0.5,
        }}
      >
        🎀
      </div>
      <div
        style={{
          position: 'absolute',
          top: 80,
          right: 100,
          fontSize: 50,
          opacity: 0.5,
        }}
      >
        💖
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 120,
          fontSize: 45,
          opacity: 0.5,
        }}
      >
        ✨
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          right: 80,
          fontSize: 55,
          opacity: 0.5,
        }}
      >
        🎀
      </div>

      {/* Pink Guinea Pigs */}
      <div
        style={{
          marginBottom: 20,
          display: 'flex',
          gap: 40,
        }}
      >
        <svg width="100" height="100" viewBox="0 0 32 32" fill="none">
          <ellipse cx="16" cy="17" rx="14" ry="12" fill="#f9a8d4" />
          <ellipse cx="5" cy="8" rx="4" ry="5" fill="#f472b6" />
          <ellipse cx="5" cy="8" rx="2.5" ry="3" fill="#fbcfe8" />
          <ellipse cx="27" cy="8" rx="4" ry="5" fill="#f472b6" />
          <ellipse cx="27" cy="8" rx="2.5" ry="3" fill="#fbcfe8" />
          <circle cx="10" cy="15" r="3" fill="#1f2937" />
          <circle cx="11" cy="14" r="1" fill="white" />
          <circle cx="22" cy="15" r="3" fill="#1f2937" />
          <circle cx="23" cy="14" r="1" fill="white" />
          <ellipse cx="16" cy="21" rx="3" ry="2" fill="#ec4899" />
          <path d="M14 24 Q16 26 18 24" stroke="#be185d" strokeWidth="1.5" fill="none" />
          <ellipse cx="7" cy="20" rx="2" ry="1.5" fill="#f472b6" opacity="0.6" />
          <ellipse cx="25" cy="20" rx="2" ry="1.5" fill="#f472b6" opacity="0.6" />
        </svg>
        <svg width="100" height="100" viewBox="0 0 32 32" fill="none">
          <ellipse cx="16" cy="17" rx="14" ry="12" fill="#f9a8d4" />
          <ellipse cx="5" cy="8" rx="4" ry="5" fill="#f472b6" />
          <ellipse cx="5" cy="8" rx="2.5" ry="3" fill="#fbcfe8" />
          <ellipse cx="27" cy="8" rx="4" ry="5" fill="#f472b6" />
          <ellipse cx="27" cy="8" rx="2.5" ry="3" fill="#fbcfe8" />
          <circle cx="10" cy="15" r="3" fill="#1f2937" />
          <circle cx="11" cy="14" r="1" fill="white" />
          <circle cx="22" cy="15" r="3" fill="#1f2937" />
          <circle cx="23" cy="14" r="1" fill="white" />
          <ellipse cx="16" cy="21" rx="3" ry="2" fill="#ec4899" />
          <path d="M14 24 Q16 26 18 24" stroke="#be185d" strokeWidth="1.5" fill="none" />
          <ellipse cx="7" cy="20" rx="2" ry="1.5" fill="#f472b6" opacity="0.6" />
          <ellipse cx="25" cy="20" rx="2" ry="1.5" fill="#f472b6" opacity="0.6" />
        </svg>
      </div>

      {/* Logo text */}
      <div
        style={{
          fontSize: 90,
          fontWeight: 'bold',
          color: '#ec4899',
          marginBottom: 10,
          textShadow: '2px 2px 0 white',
        }}
      >
        Gini3D
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 36,
          color: '#9d174d',
          marginBottom: 30,
        }}
      >
        Adorable 3D Printed Creations
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 24,
          color: '#be185d',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span>⚡</span>
        <span>Powered by Nostr & Bitcoin Lightning</span>
        <span>⚡</span>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          fontSize: 20,
          color: '#be185d',
          opacity: 0.8,
        }}
      >
        By Nini & Gabby 💜
      </div>
    </div>,
    {
      ...size,
    }
  );
}
