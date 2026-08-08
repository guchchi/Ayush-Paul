# Design System & Styling Architecture

## CSS Framework
- **Tailwind CSS v4**: No traditional `tailwind.config.js` required; `@tailwindcss/vite` handles compiling.
- Class merging: Utilizes `cn()` utility from `src/lib/utils.ts` combining `clsx` and `tailwind-merge`.

## Motion & Micro-interactions
- Library: `motion/react`
- Presets: Predefined `EASING` and `DURATION` constants configured in `src/lib/motion-presets.ts`.

## UI Components
- Reusable workspace shell components (e.g., `Module3Shell`, `PortfolioSystemShell`).
- Dark-mode optimized color tokens and responsive grid layouts.
