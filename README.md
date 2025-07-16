# Bassita Frontend

A collaborative task management platform built with Next.js that makes teamwork simple and fun.

## 🚀 Features

- **Task Management**: Kanban-style boards with drag-and-drop functionality
- **Real-time Collaboration**: Live updates with WebSocket integration
- **Modern UI**: Dark-mode first with animated interactions
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Arabic Support**: Bilingual interface with RTL support

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **State Management**: Zustand for local state
- **Data Fetching**: TanStack Query (React Query)
- **Real-time**: Socket.io client
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🏗️ Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # Reusable UI components
├── lib/             # Utilities and configurations
├── hooks/           # Custom React hooks
├── stores/          # Zustand stores
├── queries/         # TanStack Query hooks
└── styles/          # Global styles and theme
```

## 🎨 Design System

The project follows the "Task Dance Floor" design philosophy:
- **Colors**: Dark mode with purple/pink gradient accents
- **Typography**: Fredoka One for headings, Inter for body text
- **Animations**: Subtle card rotations and hover effects
- **Theme**: Based on the Bassita brand guidelines

## 🚦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌍 Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## 🎯 Design Philosophy

Bassita (بسيطة) means "simple" in Arabic, reflecting our mission to make complex task management feel effortless and engaging. The UI embraces this philosophy with:

- **Simple interactions** that feel natural
- **Delightful animations** that provide feedback
- **Clean visual hierarchy** that reduces cognitive load
- **Culturally inclusive** design elements

## 🤝 Contributing

This project is part of the Bassita platform development. Follow the established patterns and conventions when adding new features.

## 📄 License

This project is part of the Bassita platform and is proprietary software.
