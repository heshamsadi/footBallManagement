# 🗺️ Mapping Suite - Next.js

A Next.js mapping application with Google Maps integration, built with TypeScript, Tailwind CSS, and Zustand for state management.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (preferred package manager)
- Google Maps API Key

### Environment Setup

1. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

2. Add your Google Maps API key to `.env.local`:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

### Installation & Development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the development server:

   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Development Commands

| Command              | Description              |
| -------------------- | ------------------------ |
| `pnpm dev`           | Start development server |
| `pnpm build`         | Build for production     |
| `pnpm start`         | Start production server  |
| `pnpm lint`          | Run ESLint               |
| `pnpm format`        | Check code formatting    |
| `pnpm format:fix`    | Fix code formatting      |
| `pnpm test`          | Run tests                |
| `pnpm test:watch`    | Run tests in watch mode  |
| `pnpm test:coverage` | Run tests with coverage  |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx           # Back-office home
│   └── globals.css
├── components/            # Pure UI components
│   └── MapWrapper.tsx
├── lib/
│   └── map/              # Map providers
│       ├── MapProvider.ts
│       └── google/
│           └── GoogleMapsProvider.ts
└── store/                # Zustand stores
    └── map.ts
```

## 🧪 Testing

This project uses Jest and React Testing Library. Tests are located in the `/tests` directory and mirror the `/src` structure.

- Component tests ensure proper rendering and functionality
- Integration tests verify map initialization and state management
- Coverage threshold is set to 80% for all metrics

## 📋 Phase 0 Features

- ✅ Google Maps integration with locked zoom and disabled interactions
- ✅ Zustand store for map state management
- ✅ TypeScript strict mode with comprehensive type safety
- ✅ Tailwind CSS for styling (no inline styles)
- ✅ Jest testing with React 18 StrictMode compatibility
- ✅ ESLint with Airbnb configuration + Prettier
- ✅ Pre-commit hooks for code quality

## 🔗 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
