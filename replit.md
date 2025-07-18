# TryneX E-commerce Platform

## Overview

TryneX is a comprehensive premium e-commerce platform built with modern web technologies. The application features a React frontend with TypeScript, shadcn/ui components, and Tailwind CSS for styling, paired with a Node.js/Express backend using Drizzle ORM for database operations with PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand for client-side state (cart, wishlist, language)
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **Language**: TypeScript with ESM modules
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with JSON responses

### Design System
- **Theme**: Ultra-modern classic design with gold accents (#d4af37)
- **Color Scheme**: White, black, and gold with CSS custom properties
- **Typography**: System fonts with careful hierarchy
- **Responsiveness**: Mobile-first approach with Tailwind breakpoints

## Key Components

### Frontend Components
1. **Header**: Fixed navigation with search, language toggle, cart/wishlist counters
2. **Hero Section**: Full-screen banner with background images and CTAs
3. **Product Cards**: Interactive product displays with wishlist, quick view, and cart actions
4. **Cart Modal**: Multi-step checkout process with payment method selection
5. **Category Navigation**: Filterable product browsing with price ranges
6. **Order Tracking**: Real-time order status updates
7. **Newsletter**: Email subscription with backend integration

### Backend Services
1. **Product Management**: CRUD operations for products and categories
2. **Order Processing**: Order creation, tracking, and status management
3. **Promo Code System**: Discount validation and management
4. **Newsletter**: Email subscription handling
5. **Review System**: Customer feedback and ratings
6. **Blog System**: Content management for blog posts

### Database Schema
- **Products**: Name, description, price, images, categories, variants, stock
- **Categories**: Hierarchical organization with Bengali translations
- **Orders**: Customer info, items, payment details, delivery tracking
- **Users**: Authentication and profile management
- **Reviews**: Product ratings and customer feedback
- **Promos**: Discount codes with expiration and usage limits

## Data Flow

### Product Catalog Flow
1. Products are stored in PostgreSQL with Drizzle ORM
2. Frontend fetches products via React Query
3. Real-time filtering and searching without page reloads
4. Category-based navigation with dynamic loading

### Order Processing Flow
1. Customer adds items to cart (stored in Zustand)
2. Multi-step checkout process collects customer info
3. Order submitted to backend with unique order ID generation
4. Order confirmation and tracking status updates
5. Optional WhatsApp integration for communication

### Authentication Flow
1. User registration/login through backend API
2. Session management with PostgreSQL store
3. Protected routes for order history and account management

## External Dependencies

### Core Dependencies
- **@radix-ui/react-***: Accessible UI component primitives
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database ORM
- **zustand**: Lightweight state management
- **wouter**: Minimal routing library
- **tailwindcss**: Utility-first CSS framework
- **vite**: Build tool and development server

### Database
- **PostgreSQL**: Primary database (configured for Neon/Supabase)
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-kit**: Database migrations and schema management

### UI and Styling
- **class-variance-authority**: Component variant management
- **clsx**: Conditional class name utility
- **tailwind-merge**: Tailwind class merging utility
- **lucide-react**: Icon library

### Development Tools
- **TypeScript**: Type safety and developer experience
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (implicit)

## Deployment Strategy

### Frontend Deployment
- **Platform**: Netlify (static site hosting)
- **Build Command**: `npm run build`
- **Build Output**: `dist/public` directory
- **Environment Variables**: Supabase URL and API keys

### Backend Deployment
- **Platform**: Render (free tier)
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment Variables**: 
  - `DATABASE_URL`: PostgreSQL connection string
  - `NODE_ENV`: production
  - `SESSION_SECRET`: For session management

### Database Deployment
- **Primary**: Neon or Supabase PostgreSQL
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Serverless-compatible connection pooling

### Development Workflow
1. **Local Development**: `npm run dev` starts both frontend and backend
2. **Database Changes**: `npm run db:push` applies schema changes
3. **Type Safety**: Shared schema definitions between frontend and backend
4. **Hot Reloading**: Vite provides instant feedback during development

The architecture supports scalable e-commerce operations with modern development practices, type safety, and responsive design optimized for the Bangladeshi market with Bengali language support.