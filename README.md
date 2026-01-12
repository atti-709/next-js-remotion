# Next.js + Remotion Player Integration

A Next.js application that displays Remotion video compositions using the Remotion Player component. This project imports compositions from a separate Git repository (`@getmoments/remotion-rendering`).

## 💡 Recommended: GitLab Package Registry

**Better approach available!** Instead of git installation, we recommend using GitLab Package Registry for:
- ✅ No credentials in package.json
- ✅ Standard `npm install` workflow  
- ✅ Proper versioning (1.0.0, 1.1.0, etc.)
- ✅ Easier team collaboration

**See [GITLAB_PACKAGE_SETUP.md](./GITLAB_PACKAGE_SETUP.md) for the complete guide.**

---

## 🚀 Quick Start (Current Git-based Method)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
GITLAB_TOKEN=your-username:your-token
```

### 3. Install Remotion Compositions

**Important:** The `@getmoments/remotion-rendering` package is NOT in package.json to avoid committing credentials. Install it manually:

```bash
# Make GITLAB_TOKEN available to npm
export $(cat .env | grep -v '^#' | xargs)

# Install the package (--no-save prevents adding to package.json)
npm install --no-save git+https://${GITLAB_TOKEN}@git.ximilar.com/getmoments/video/remotion-rendering.git#exports
```

Or use the update script (recommended):

```bash
./update-remotion.sh
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

> **Note:** You'll need to run step 3 after cloning the repo, as `@getmoments/remotion-rendering` won't be automatically installed.

## 📦 How It Works

This project uses **Git Repository Installation** to import Remotion compositions:

1. **Remotion Repository** (`remotion-rendering`) contains your video compositions
2. **This Next.js App** imports and displays them using `@remotion/player`
3. **Git-based installation** keeps the repos separate but connected
4. **Manual installation** prevents credentials from being committed to git

> **Why not in package.json?** To avoid committing GitLab credentials, `@getmoments/remotion-rendering` must be installed manually using the `./update-remotion.sh` script or npm install command with environment variables.

### Architecture

```
remotion-rendering (Git Repo)           next-js-remotion (This Project)
├── src/                                ├── app/
│   ├── exports.ts (exports all)   →   │   └── page.tsx (imports & displays)
│   └── compositions/                   ├── package.json (installs from git)
│       └── intro/                      └── .env (credentials)
│           └── IntroComposition.tsx
```

## 🎬 Using Compositions

### Import a Composition

```typescript
'use client';

import { Player } from '@remotion/player';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const IntroComposition = dynamic(
  () => import('@getmoments/remotion-rendering').then((mod) => ({ default: mod.IntroComposition })),
  { ssr: false }
);

export default function MyPage() {
  const props = {
    videoUrl: 'https://example.com/video.mp4',
    logoYOffsetPx: 0,
    logoScale: 1,
    // ... other props
  };

  return (
    <Player
      component={IntroComposition}
      inputProps={props}
      durationInFrames={150}
      compositionWidth={1080}
      compositionHeight={1920}
      fps={25}
      controls
    />
  );
}
```

### Key Points

- ✅ Use `'use client'` directive (Player is client-side only)
- ✅ Use `dynamic()` import with `{ ssr: false }` to prevent SSR errors
- ✅ Wrap Player in `{isMounted &&` for hydration safety (optional but recommended)

## 🔄 Updating Compositions

When you make changes to your Remotion compositions:

### Option 1: Use Update Script

```bash
./update-remotion.sh
```

This script:
1. Loads your `.env` file
2. Clears npm cache
3. Reinstalls the latest from git
4. Clears Next.js cache

### Option 2: Manual Update

```bash
npm cache clean --force
npm uninstall @getmoments/remotion-rendering
npm install git+https://${GITLAB_TOKEN}@git.ximilar.com/getmoments/video/remotion-rendering.git#exports
rm -rf .next
```

## 📋 Project Structure

```
next-js-remotion/
├── app/
│   ├── page.tsx              # Main demo page with IntroComposition
│   ├── remotion-git/         # Git integration example
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── .env                      # GitLab credentials (not committed)
├── package.json              # Dependencies
├── next.config.js            # Next.js config (transpiles remotion packages)
├── tsconfig.json             # TypeScript config
├── update-remotion.sh        # Update script
└── README.md                 # This file
```

## 🔧 Configuration

### next.config.js

```javascript
module.exports = {
  transpilePackages: ['remotion', '@remotion/player', '@getmoments/remotion-rendering'],
};
```

Ensures Remotion packages are properly transpiled for Next.js.

### tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@getmoments/remotion-rendering": ["./node_modules/@getmoments/remotion-rendering/src/exports.ts"]
    }
  }
}
```

Path mapping for clean imports and TypeScript support.

## 🎨 Player Props

Common Player configuration options:

```typescript
<Player
  component={MyComposition}
  inputProps={props}              // Props for your composition
  durationInFrames={150}          // Length in frames
  compositionWidth={1080}         // Width in pixels
  compositionHeight={1920}        // Height in pixels
  fps={25}                        // Frames per second
  controls={true}                 // Show controls
  loop={false}                    // Loop playback
  autoPlay={false}                // Auto start
  style={{ height: '80vh' }}      // Custom styling
/>
```

For vertical video (portrait): Use `compositionWidth={1080}` and `compositionHeight={1920}`

## 🐛 Troubleshooting

### "measureText() can only be called in a browser"

**Solution**: Use dynamic import with SSR disabled:

```typescript
const MyComp = dynamic(
  () => import('@getmoments/remotion-rendering').then(m => ({ default: m.MyComp })),
  { ssr: false }
);
```

### "Multiple versions of Remotion detected"

**Solution**: Ensure all Remotion packages use the same version in `package.json`:

```json
{
  "dependencies": {
    "remotion": "4.0.404",
    "@remotion/player": "4.0.404",
    "@remotion/fonts": "4.0.404",
    // ... all same version
  }
}
```

### Composition Not Updating

**Solution**: Clear caches and reinstall:

```bash
./update-remotion.sh
```

### Cannot Find Module '@getmoments/remotion-rendering'

**Solution**: The package needs to be installed manually (it's not in package.json):

```bash
./update-remotion.sh
```

Or manually:
```bash
export $(cat .env | grep -v '^#' | xargs)
npm install git+https://${GITLAB_TOKEN}@git.ximilar.com/getmoments/video/remotion-rendering.git#exports
```

Check that:
1. `.env` file has correct `GITLAB_TOKEN`
2. Package is installed: `npm list @getmoments/remotion-rendering`
3. Path mapping in `tsconfig.json` is correct

## 📚 Available Compositions

Check your `remotion-rendering` repository's `src/exports.ts` to see all available compositions.

Example imports:

```typescript
import { IntroComposition } from '@getmoments/remotion-rendering';
import { GMIntroComposition } from '@getmoments/remotion-rendering';
import { MosaicComposition } from '@getmoments/remotion-rendering';
import { OverlayComposition } from '@getmoments/remotion-rendering';
// ... etc
```

## 🔐 Security

- ✅ `.env` file is in `.gitignore` - credentials never committed
- ✅ Use `${GITLAB_TOKEN}` in package.json instead of hardcoded credentials
- ✅ For production, use environment variables in your deployment platform

## 🚢 Deployment

### Vercel / Netlify / etc.

1. Add `GITLAB_TOKEN` as an environment variable in your deployment settings
2. Deploy normally - the build will use the environment variable

### Environment Variables

Set these in your deployment platform:

```
GITLAB_TOKEN=your-username:your-token
```

## 📖 Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [Remotion Player API](https://www.remotion.dev/docs/player)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎯 Common Use Cases

### Programmatic Control

```typescript
const playerRef = useRef<PlayerRef>(null);

// Play/Pause
playerRef.current?.play();
playerRef.current?.pause();

// Seek to frame
playerRef.current?.seekTo(50);

// Get current frame
const frame = playerRef.current?.getCurrentFrame();
```

### Multiple Compositions

```typescript
<div>
  <Player component={Intro} durationInFrames={150} ... />
  <Player component={Outro} durationInFrames={120} ... />
</div>
```

### Dynamic Props

```typescript
const [videoUrl, setVideoUrl] = useState('...');

<Player
  component={IntroComposition}
  inputProps={{ videoUrl, name: 'User' }}
  ...
/>
```

## 💡 Tips

1. **Always use dynamic imports** for compositions to avoid SSR issues
2. **Match frame rates** between your video source and Player fps
3. **Use vertical dimensions** (1080×1920) for portrait videos
4. **Clear .next cache** when compositions don't update
5. **Check browser console** for helpful error messages from Remotion

## 📝 Development Workflow

1. Make changes in `remotion-rendering` repo
2. Commit and push to the `exports` branch
3. Run `./update-remotion.sh` in this project
4. Test with `npm run dev`
5. Deploy when ready

---

**Need help?** Check the example pages in `/app` directory or refer to Remotion's documentation.
