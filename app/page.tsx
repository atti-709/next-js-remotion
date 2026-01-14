'use client';

import { Player, PlayerRef } from '@remotion/player';
import { useCallback, useState, useRef, useEffect } from 'react';
import { PreviewComposition } from '@getmoments/remotion-rendering';

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePlay = useCallback(() => {
    setPlaying(true);
    playerRef.current?.play();
  }, []);

  const handlePause = useCallback(() => {
    setPlaying(false);
    playerRef.current?.pause();
  }, []);

  const handlePreviousFrame = useCallback(() => {
    if (playerRef.current) {
      const currentFrame = playerRef.current.getCurrentFrame();
      playerRef.current.seekTo(Math.max(0, currentFrame - 1));
    }
  }, []);

  const handleNextFrame = useCallback(() => {
    if (playerRef.current) {
      const currentFrame = playerRef.current.getCurrentFrame();
      playerRef.current.seekTo(currentFrame + 1);
    }
  }, []);

  const previewProps: any = {
    // Video props
    videoUrl: 'https://s3.eu-central-1.wasabisys.com/getmoments-static/remotion_placeholders/RockWerchter2025_vertical.mov',
    transparentVideoUrl: 'https://s3.eu-central-1.wasabisys.com/getmoments-static/events/sziget/2025/intro/intro.webm',
    
    // Logo props
    logoYOffsetPx: 0,
    logoScale: 1,
    logoFadeInDurationSec: 1,
    logoFadeOutDurationSec: 1,
    
    // Name props
    nameShow: true,
    name: 'Demo User',
    nameYOffsetPx: -100,
    nameFontColorHex: '#ffffff',
    nameFontSizePx: 48,
    nameUpperCase: false,
    nameUseShadow: true,
    nameSplitDelaySec: 0.1,
    nameFadeInDurationSec: 0,
    nameFadeOutDurationSec: 0,
    
    // Overlay props
    overlayUrl: 'https://s3.eu-central-1.wasabisys.com/getmoments-static/events/sziget/2025/intro/intro.webm',
    overlayYOffsetPx: 0,
    overlayScale: 1,
    overlayOnlyForUgc: false,
  };

  return (
    <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '16px', fontWeight: 'bold' }}>
        Remotion Player Demo
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '40px', opacity: 0.8 }}>
        This Next.js app displays Remotion compositions using the Player component.
      </p>

      <div
        style={{
          backgroundColor: '#1e293b',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>
          PreviewComposition
        </h2>
        
          <div style={{ marginBottom: '20px' }}>
            {isMounted && (
              <Player
                ref={playerRef}
                component={PreviewComposition}
                inputProps={previewProps}
                durationInFrames={150}
                compositionWidth={1080}
                compositionHeight={1920}
                fps={25}
                style={{
                  height: '80vh',
                  maxHeight: '900px',
                  width: 'auto',
                  margin: '0 auto',
                }}
                controls
                loop
              />
            )}
          </div>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>
            Player Controls
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handlePlay}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#10b981',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              ▶️ Play
            </button>
            <button
              onClick={handlePause}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#ef4444',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              ⏸️ Pause
            </button>
            <button
              onClick={handlePreviousFrame}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '2px solid #3b82f6',
                backgroundColor: 'transparent',
                color: '#3b82f6',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              ⬅️ Previous Frame
            </button>
            <button
              onClick={handleNextFrame}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '2px solid #3b82f6',
                backgroundColor: 'transparent',
                color: '#3b82f6',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Next Frame ➡️
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '40px',
          padding: '24px',
          backgroundColor: '#334155',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>
          ✅ Success!
        </h3>
        <p style={{ lineHeight: '1.8', opacity: 0.9 }}>
          Your PreviewComposition is now loaded from the @getmoments/remotion-rendering repository
          and displaying in the Remotion Player. You can add more compositions by
          importing them from &apos;@getmoments/remotion-rendering&apos; and adding more Player components.
        </p>
      </div>
    </main>
  );
}
