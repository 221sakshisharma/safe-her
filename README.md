# SafeHer - AI Safety Platform

A Next.js-powered safety application designed to provide real-time safety intelligence, emergency assistance, and community support.

## Features

- **Dashboard**: Real-time safety overview with risk predictions and activity tracking
- **Safety Map**: Interactive map showing safety zones and real-time alerts
- **SOS Emergency**: Quick access emergency alert system
- **AI Assistant**: Intelligent safety recommendations and support
- **Safe Routes**: AI-powered route planning with safety considerations
- **Community**: Connect with other users and share safety information

## Tech Stack

- **Framework**: Next.js 16.1.6 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── app-shell.tsx   # Main app layout
│   ├── dashboard-view.tsx
│   ├── map-view.tsx
│   ├── sos-view.tsx
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── public/             # Static assets
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
```

## Development

The application uses:
- Client-side rendering for interactive features
- Responsive design for mobile and desktop
- Accessible UI components following WAI-ARIA standards
- Type-safe development with TypeScript

## Contributing

Contributions are welcome! Please follow the existing code style and ensure all tests pass before submitting a pull request.

## License

Private project - All rights reserved
