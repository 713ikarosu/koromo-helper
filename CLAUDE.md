# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI fashion coordination app called "koromo-helper" built with Expo and React Native. The app suggests outfit coordination based on user preferences and weather information. The project is implemented in Japanese and targets users who want daily fashion recommendations.

## Key Development Commands

- **Start development server**: `npm start` or `npx expo start`
- **Run on specific platforms**:
  - Android: `npm run android`
  - iOS: `npm run ios`
  - Web: `npm run web`
- **Linting**: `npm run lint`
- **Type checking**: `npm run type-check`
- **Code formatting**: `npm run format`
- **Check formatting**: `npm run format:check`
- **Reset project**: `npm run reset-project`

## Architecture and Technology Stack

### Core Technologies

- **Framework**: Expo with React Native (v0.79.5)
- **UI Library**: Tamagui for styling and components
- **State Management**: Jotai for global state
- **Navigation**: Expo Router with file-based routing
- **Storage**: AsyncStorage for persistent data

### Project Structure

```
app/
├── (tabs)/          # Tab-based navigation screens
├── auth/            # Authentication screens (login, register)
├── preferences.tsx  # User preference settings
└── _layout.tsx      # Root navigation layout

components/
├── ui/              # Reusable UI components (Button, Card, Input, etc.)
└── [other components]

stores/
├── authStore.ts     # Authentication state management
└── preferenceStore.ts # User preferences state

services/
├── weatherService.ts # Weather API integration
└── outfitService.ts  # AI outfit generation service
```

### State Management with Jotai

- Authentication state is managed via `authStore.ts` with persistent storage
- User data includes: id, email, nickname, gender
- The app automatically redirects based on authentication state in the root layout

### UI and Styling

- Tamagui is configured with custom themes, animations, and fonts
- Uses Inter font family with different weights
- Supports both light and dark color schemes
- Custom components are built following Tamagui patterns
- All UI text is in Japanese

### Navigation Pattern

- File-based routing with Expo Router
- Tab navigation for main screens (Home, Settings)
- Stack navigation for authentication flow
- Authentication-based route protection in root layout

## Development Guidelines

### Communication Language

- **All conversations with developers should be conducted in Japanese**
- When asking questions or providing explanations, respond in Japanese
- Code comments and documentation should be in Japanese when appropriate
- Maintain Japanese language preference throughout the development process

### Authentication Flow

- Users must authenticate to access main app features
- Authentication state persists using AsyncStorage
- Root layout handles automatic redirection based on auth state

### Japanese Localization

- All user-facing text is in Japanese
- Screen titles use Japanese labels (e.g., "ホーム" for Home, "好み設定" for Preferences)
- Follow existing Japanese naming conventions

### Component Development

- Use Tamagui components and styling system
- Follow the established UI component patterns in `components/ui/`
- Maintain consistency with existing color scheme handling

### State Management

- Use Jotai atoms for global state
- Persist important data (user auth, preferences) with AsyncStorage
- Follow the established store patterns for new state requirements

### Weather and AI Integration

- Weather service integration for location-based recommendations
- AI outfit generation service for personalized suggestions
- Services are structured to support the core app functionality

## Testing and Quality

Run the following commands before committing changes to ensure code quality and consistency:

- `npm run lint` - ESLint for code quality
- `npm run type-check` - TypeScript type checking
- `npm run format:check` - Prettier code formatting check
- `npm run format` - Auto-format code with Prettier
