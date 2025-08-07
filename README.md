# 🚀 ForgeSpace - AI-Powered Idea Development Platform

<div align="center">

![ForgeSpace Logo](https://img.shields.io/badge/ForgeSpace-Idea%20Development%20Platform-purple?style=for-the-badge&logo=lightbulb)

**Transform Your Ideas Into Reality**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.53.0-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=flat-square)](https://clerk.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT%203.5%20Turbo-green?style=flat-square&logo=openai)](https://openai.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

</div>

---

## 📖 About ForgeSpace

ForgeSpace is a comprehensive AI-powered platform designed to help teams and individuals develop ideas from concept to implementation. Built with modern web technologies, it provides collaborative workspaces, AI-driven analysis, visual whiteboarding, and structured development phases.

### ✨ Key Features

- **🤖 AI-Powered Analysis** - Get instant insights into your ideas' potential with advanced AI analysis
- **👥 Collaborative Workspaces** - Build and refine ideas together with your team in dedicated workspaces
- **🎨 Visual Whiteboarding** - Create mindmaps, flowcharts, and timelines with our integrated whiteboard
- **📊 Progress Tracking** - Track ideas through different phases from inception to execution
- **🔧 Development Tools** - Access essential tools for idea development and project management
- **📧 Real-time Notifications** - Stay updated with email notifications and real-time collaboration
- **🎯 Phase Management** - Structured approach with inception, refinement, planning, and execution phases

### 🏗️ Architecture

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Next.js API routes with Supabase for database and real-time features
- **Authentication**: Clerk for secure user management
- **AI Integration**: OpenAI GPT-3.5 Turbo for idea analysis
- **Email**: Resend for transactional emails
- **Real-time**: Supabase real-time subscriptions
- **UI Components**: Radix UI with custom shadcn/ui components

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+ or pnpm
- Supabase account
- Clerk account
- OpenAI API key (optional, for AI features)
- Resend account (optional, for email notifications)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kecheste/ForgeSpace.git
   cd forgespace
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure your environment variables** (see [Environment Variables](#environment-variables) section)

5. **Set up the database**

   ```bash
   # Run the SQL scripts in the scripts/ folder in your Supabase dashboard
   # or use the Supabase CLI
   ```

6. **Start the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional Variables

```bash
# OpenAI API (for AI analysis features)
OPENAI_API_KEY=your_openai_api_key

# Resend (for email notifications)
RESEND_API_KEY=your_resend_api_key

# Environment
NODE_ENV=development
```

### Setting up External Services

#### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. Run the SQL scripts from the `scripts/` folder in your Supabase SQL editor

#### 2. Clerk Setup

1. Create a new application at [clerk.com](https://clerk.com)
2. Configure your authentication settings
3. Add your domain to the allowed origins

#### 3. OpenAI Setup (Optional)

1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Add it to your environment variables for AI analysis features

#### 4. Resend Setup (Optional)

1. Create an account at [resend.com](https://resend.com)
2. Get your API key for email notifications

---

## 🧪 Testing

ForgeSpace includes comprehensive testing with Vitest and Testing Library.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit      # Unit tests only
npm run test:integration  # Integration tests only
```

### Test Structure

```
tests/
├── unit/           # Unit tests for components and utilities
├── integration/    # Integration tests for API endpoints
├── mocks/          # Test mocks and handlers
└── utils/          # Test utilities and helpers
```

### Writing Tests

```typescript
// Example test for a component
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IdeaCard } from '@/components/idea-card';

describe('IdeaCard', () => {
  it('renders idea title and description', () => {
    const idea = {
      id: '1',
      title: 'Test Idea',
      description: 'Test Description',
      phase: 'inception' as const,
      tags: ['test'],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: 'user1',
      workspace_id: 'workspace1'
    };

    render(<IdeaCard idea={idea} />);

    expect(screen.getByText('Test Idea')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
```

---

## 📚 Usage Tutorials

### 🎯 Getting Started with Ideas

1. **Create Your First Idea**
   - Navigate to `/dashboard/ideas/new`
   - Fill in the idea title and description
   - Add relevant tags
   - Select the initial phase (Inception)
   - Click "Create Idea"

2. **Analyze Your Idea**
   - Go to `/dashboard/analyzer`
   - Enter your idea details
   - Get AI-powered insights on viability, feasibility, and recommendations
   - Review similar concepts and improvement suggestions

3. **Track Progress**
   - Move your idea through phases: Inception → Refinement → Planning → Execution
   - Add comments and updates at each phase
   - Monitor development metrics

### 👥 Working with Workspaces

1. **Create a Workspace**
   - Go to `/dashboard/workspaces/new`
   - Choose between Personal or Team workspace
   - Add workspace description
   - Invite team members (for team workspaces)

2. **Collaborate**
   - Invite team members via email
   - Assign roles (Owner, Admin, Member, Viewer)
   - Share ideas and whiteboards within the workspace

3. **Manage Permissions**
   - Control access levels for different team members
   - Set workspace visibility and sharing settings

### 🎨 Using the Whiteboard

1. **Create a Whiteboard**
   - Navigate to `/dashboard/whiteboard`
   - Choose canvas type: Mindmap, Flowchart, Timeline, or Freeform
   - Name your canvas and add description

2. **Collaborate in Real-time**
   - Invite collaborators to your whiteboard
   - Work together in real-time
   - Save versions and track changes

3. **Export and Share**
   - Export your whiteboard as images
   - Share with team members
   - Link to related ideas

### 🤖 AI Analysis Features

1. **Idea Viability Analysis**
   - Get comprehensive scoring on multiple dimensions
   - Review technical feasibility and innovation level
   - Assess development time and resource requirements

2. **Phase Suggestions**
   - Receive AI-generated suggestions for each development phase
   - Get improvement recommendations
   - Identify potential challenges and solutions

3. **Similar Concepts**
   - Discover related ideas and concepts
   - Learn from existing implementations
   - Identify market opportunities

---

## 🏗️ Project Structure

```
ForgeSpace/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── providers/        # Context providers
├── lib/                  # Utility libraries
│   ├── api/              # API client functions
│   ├── services/         # Business logic services
│   └── supabase/         # Supabase configuration
├── scripts/              # Database migration scripts
├── tests/                # Test files
├── emails/               # Email templates
└── public/               # Static assets
```

### Key Directories

- **`app/`**: Next.js 13+ app router pages and API routes
- **`components/`**: Reusable React components
- **`lib/`**: Utility functions, API clients, and services
- **`scripts/`**: Database migration and setup scripts
- **`tests/`**: Comprehensive test suite
- **`emails/`**: Email templates for notifications

---

## 🔄 Development Workflow

### Code Quality

```bash
# Type checking
npm run check-types

# Linting
npm run check-lint

# Formatting
npm run format

# All checks
npm run check-format && npm run check-lint && npm run check-types
```

### Git Hooks

The project uses Husky for pre-commit hooks:

```bash
# Install git hooks
npm run prepare
```

### Database Migrations

When making database changes:

1. Create a new SQL script in `scripts/`
2. Update the database types in `lib/supabase/types.ts`
3. Test the migration locally
4. Deploy to production

---

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Configure build settings for Next.js
- **Railway**: Deploy with automatic environment variable management
- **Self-hosted**: Use Docker or direct deployment

### Environment Setup for Production

1. Set all required environment variables
2. Configure custom domains in Clerk and Supabase
3. Set up email domain verification in Resend
4. Configure CORS settings in Supabase

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add JSDoc comments for complex functions
- Write tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: Check the `/dashboard/help` page in the app
- **Issues**: Report bugs and feature requests on GitHub
- **Discussions**: Join our community discussions
- **Email**: Contact me at abenidevworking@gmail.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Clerk](https://clerk.com/) for authentication
- [OpenAI](https://openai.com/) for AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tldraw](https://tldraw.com/) for the whiteboard functionality

---

<div align="center">

**Made with ❤️ by the ForgeSpace Team**

[![GitHub stars](https://img.shields.io/github/stars/kecheste/ForgeSpace?style=social)](https://github.com/kecheste/ForgeSpace)
[![GitHub forks](https://img.shields.io/github/forks/kecheste/ForgeSpace?style=social)](https://github.com/kecheste/ForgeSpace)
[![GitHub issues](https://img.shields.io/github/issues/kecheste/ForgeSpace)](https://github.com/kecheste/ForgeSpace/issues)

</div>
