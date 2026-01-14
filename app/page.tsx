'use client';

import { Player, PlayerRef } from '@remotion/player';
import { useCallback, useState, useRef, useEffect } from 'react';
import { DEFAULT_FPS, DEFAULT_IS_HORIZONTAL, defaultResolution, IntroComposition, OverlayPosition, PreviewComposition, sharedConstants } from '@getmoments/remotion-rendering';
import { Input, ALL_FORMATS, BlobSource } from 'mediabunny';

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState<{
    durationInFrames: number;
    width: number;
    height: number;
    fps: number;
  } | null>(null);
  const [fpsError, setFpsError] = useState<string | null>(null);
  const playerRef = useRef<PlayerRef>(null);

  const previewProps: any = {
    // Shared video URL
    // videoUrl: "https://remotion.media/video.mp4",
    videoUrl: 'https://s3.eu-central-1.wasabisys.com/getmoments-static/remotion_placeholders/RockWerchter2025_vertical.mov',
    videoStartFrame: 0,
    transparentVideoUrl: 'https://s3.eu-central-1.wasabisys.com/getmoments-static/events/sziget/2025/intro/intro.webm',

    // INTRO props
    logoYOffsetPx: 0,
    logoScale: 1,
    logoStartFromSec: 1.0,
    logoEndAtSec: 5.0,
    logoFadeInDurationSec: 0,
    logoFadeOutDurationSec: 0,

    nameShow: true,
    name: 'Alex Johnson',
    nameYOffsetPx: sharedConstants.NAME_Y_OFFSET_PX,
    nameCustomTextBeforeName: 'by',
    nameStartFromSec: 1.7,
    nameEndAtSec: 5,
    nameLineHeightPx: undefined,

    nameFontUrl: sharedConstants.NAME_FONT_URL,
    nameFontWeight: sharedConstants.NAME_FONT_WEIGHT,
    nameFontColorHex: sharedConstants.NAME_FONT_COLOR_HEX,
    nameFontBgColorHex: '#000000',
    nameFontSizePx: sharedConstants.NAME_FONT_SIZE_PX,
    nameUpperCase: sharedConstants.NAME_UPPER_CASE,
    nameUseShadow: true,

    nameSplitDelaySec: 0,
    nameFadeInDurationSec: 0.1,
    nameFadeOutDurationSec: 0.1,

    // OVERLAY props
    overlayOnlyForUgc: false,
    overlayStartFrame: 0,
    overlayImageUrl:
      'https://s3.eu-central-1.wasabisys.com/getmoments-static/remotion_placeholders/rev-calling-watermark.png',
    overlayImagePosition:
      sharedConstants.OVERLAY_IMAGE_POSITION as OverlayPosition,
    overlayImageScale: 1.0,
    overlayImageOpacity: sharedConstants.OVERLAY_IMAGE_OPACITY,
    overlayText: 'Atti',
    overlayFontUrl: sharedConstants.OVERLAY_FONT_URL,
    overlayFontWeight: sharedConstants.OVERLAY_FONT_WEIGHT,
    overlayFontSizePx: sharedConstants.OVERLAY_FONT_SIZE_PX,
    overlayFontColorHex: sharedConstants.OVERLAY_FONT_COLOR_HEX,
    overlayTextPosition:
      sharedConstants.OVERLAY_TEXT_POSITION as OverlayPosition,
    overlayTextPaddingPx: sharedConstants.OVERLAY_TEXT_PADDING_PX,
    overlayTextOpacity: sharedConstants.OVERLAY_TEXT_OPACITY,
  };

  useEffect(() => {
    setIsMounted(true);

    // Fetch video metadata using mediabunny
    const fetchVideoMetadata = async () => {
      try {
        const response = await fetch(previewProps.videoUrl);
        const blob = await response.blob();

        const input = new Input({
          source: new BlobSource(blob),
          formats: ALL_FORMATS,
        });

        const durationInSeconds = await input.computeDuration();
        const videoTrack = await input.getPrimaryVideoTrack();
        
        if (durationInSeconds && videoTrack) {
          const { displayWidth, displayHeight } = videoTrack;
          
          // Derive FPS from packet stats
          const packetStats = await videoTrack.computePacketStats(50);
          const fps = packetStats?.averagePacketRate ?? null;
          
          console.log('Video metadata:', { displayWidth, displayHeight, fps, durationInSeconds });
          
          if (fps === null) {
            setFpsError('Unable to determine FPS from video');
            return;
          }
          
          // Check if FPS is DEFAULT_FPS
          if (Math.abs(fps - DEFAULT_FPS) > 0.1) {
            setFpsError(`Video FPS is ${fps.toFixed(2)}. Only ${DEFAULT_FPS} FPS is supported.`);
          } else {
            setFpsError(null);
          }
          
          const durationInFrames = Math.round(durationInSeconds * fps);
          
          setVideoMetadata({
            durationInFrames,
            width: displayWidth,
            height: displayHeight,
            fps: Math.round(fps),
          });
        }
      } catch (error) {
        console.error('Error fetching video metadata:', error);
        setFpsError(`Error loading video metadata: ${error}`);
        // Fallback to default values
        setVideoMetadata({
          durationInFrames: 150,
          width: defaultResolution(DEFAULT_IS_HORIZONTAL).width,
          height: defaultResolution(DEFAULT_IS_HORIZONTAL).height,
          fps: DEFAULT_FPS,
        });
      }
    };

    fetchVideoMetadata();
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
        
        {fpsError && (
          <div style={{
            padding: '16px',
            marginBottom: '20px',
            backgroundColor: '#dc2626',
            color: 'white',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
          }}>
            ⚠️ {fpsError}
          </div>
        )}
        
          <div style={{ marginBottom: '20px' }}>
            {isMounted && videoMetadata ? (
              <Player
                ref={playerRef}
                // component={PreviewComposition}
                component={IntroComposition}
                inputProps={{
                  videoUrl: previewProps.videoUrl,
                }}
                durationInFrames={videoMetadata.durationInFrames}
                compositionWidth={videoMetadata.width}
                compositionHeight={videoMetadata.height}
                fps={videoMetadata.fps}
                style={{
                  height: '80vh',
                  maxHeight: '900px',
                  width: 'auto',
                  margin: '0 auto',
                }}
                controls
                loop
              />
            ) : (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                opacity: 0.7 
              }}>
                Loading video metadata...
              </div>
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
