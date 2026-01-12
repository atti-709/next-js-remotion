# Next.js + Remotion Player Integration

A Next.js application that displays Remotion video compositions using the Remotion Player component. This project imports compositions from a separate Git repository (`@getmoments/remotion-rendering`).

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure npm Registry

Create `.npmrc` in the project root:

```ini
@getmoments:registry=https://git.ximilar.com/api/v4/packages/npm/
//git.ximilar.com/api/v4/packages/npm/:_authToken=${GITLAB_TOKEN}
```

### 3. Install Dependencies

```bash
npm install
```

This will install all packages including `@getmoments/remotion-rendering` from the GitLab Package Registry.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 How It Works

This project uses **GitLab Package Registry** to import Remotion compositions:

1. **Remotion Repository** publishes to GitLab Package Registry with semantic versioning
2. **This Next.js App** imports the package via npm like any other dependency
3. **Authentication** uses `.npmrc` with GitLab token (gitignored, not committed)
4. **Standard npm workflow** - just `npm install` works

### Benefits

- ✅ **No credentials in package.json** - Only in `.npmrc` (gitignored)
- ✅ **Semantic versioning** - Proper version management (1.0.0, 1.1.0, etc.)
- ✅ **Standard npm commands** - `npm install`, `npm update` work normally
- ✅ **Team friendly** - Simple setup for new developers

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
import { IntroComposition } from '@getmoments/remotion-rendering';

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
- ✅ Import compositions directly from the package

## 🔄 Updating Compositions

### When a New Version is Published

After your Remotion repository publishes a new version to GitLab Package Registry:

```bash
# Export token
export $(cat .env | grep -v '^#' | xargs)

# Update to latest version
npm update @getmoments/remotion-rendering

# Or update to a specific version
npm install @getmoments/remotion-rendering@1.2.0

# Clear Next.js cache
rm -rf .next

# Run dev server
npm run dev
```

### Version Management

The package uses semantic versioning:
- **Patch** (1.0.0 → 1.0.1): Bug fixes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible  
- **Major** (1.0.0 → 2.0.0): Breaking changes

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

### Composition Not Updating After Package Update

**Solution**: Clear Next.js cache and reinstall:

```bash
rm -rf .next node_modules
npm install
```

### Cannot Find Module '@getmoments/remotion-rendering'

**Solution**: Check authentication and installation:

```bash
# Verify token is set
export $(cat .env | grep -v '^#' | xargs)
echo $GITLAB_TOKEN  # Should show your token

# Install the package
npm install

# Verify installation
npm list @getmoments/remotion-rendering
```

Check that:
1. `.env` file has correct `GITLAB_TOKEN`
2. `.npmrc` is configured for GitLab registry
3. Your GitLab token has `read_api` or `api` scope
4. Package is in `package.json` dependencies

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
- ✅ `.npmrc` is in `.gitignore` - registry auth never committed
- ✅ Token only in environment variables, never in code
- ✅ For production, set `GITLAB_TOKEN` in your deployment platform's environment variables

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

### In Remotion Repository

1. Make changes to compositions
2. Update version: `npm version patch` (or `minor`/`major`)
3. Commit and push: `git push origin main --tags`
4. Publish to registry: `npm publish`

### In This Next.js Project

1. Update package: `npm update @getmoments/remotion-rendering`
2. Test with `npm run dev`
3. Commit and deploy when ready

### Automated Publishing (Optional)

Set up GitLab CI in your Remotion repo to auto-publish on tags - see your Package Registry documentation for details.

---

**Need help?** Check the example pages in `/app` directory or refer to Remotion's documentation.
