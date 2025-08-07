# 🤝 Contributing to ForgeSpace

Thank you for your interest in contributing to ForgeSpace! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Feature Requests](#feature-requests)
- [Bug Reports](#bug-reports)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

### Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to a positive environment for our community include:

- Using welcoming and inclusive language
- Being respectful of differing opinions, viewpoints, and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior include:

- The use of sexualized language or imagery, and sexual attention or advances
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.

---

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

- Node.js 18+ installed
- Git installed
- A GitHub account
- Basic knowledge of React, TypeScript, and Next.js

### Fork and Clone

1. **Fork the repository**
   - Go to [ForgeSpace GitHub repository](https://github.com/kecheste/ForgeSpace)
   - Click the "Fork" button in the top right
   - This creates a copy of the repository under your GitHub account

2. **Clone your fork**

   ```bash
   git clone https://github.com/kecheste/ForgeSpace.git
   cd forgespace
   ```

3. **Add the original repository as upstream**
   ```bash
   git remote add upstream https://github.com/kecheste/ForgeSpace.git
   ```

---

## 🔧 Development Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Environment Setup

1. **Copy environment variables**

   ```bash
   cp .env.example .env.local
   ```

2. **Configure your environment variables**
   - See the [Environment Variables section in README.md](../README.md#environment-variables)
   - Set up Supabase, Clerk, and other required services

### 3. Database Setup

1. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL scripts from the `scripts/` folder in your Supabase SQL editor

### 4. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

---

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` type - use proper typing
- Use interfaces for object shapes
- Use enums for constants

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// ❌ Avoid
const user: any = { id: '1', name: 'John' };
```

### React Components

- Use functional components with hooks
- Use TypeScript for props
- Follow the naming convention: PascalCase for components
- Export components as default when possible

```typescript
// ✅ Good
interface IdeaCardProps {
  idea: Idea;
  onEdit?: (id: string) => void;
}

export default function IdeaCard({ idea, onEdit }: IdeaCardProps) {
  return (
    <div className="idea-card">
      <h3>{idea.title}</h3>
      <p>{idea.description}</p>
    </div>
  );
}
```

### File Naming

- Use kebab-case for file names
- Use PascalCase for component files
- Use camelCase for utility files

```
✅ Good
- idea-card.tsx
- IdeaCard.tsx
- utils.ts
- api-client.ts

❌ Avoid
- ideaCard.tsx
- idea_card.tsx
- Utils.ts
```

### Import Organization

```typescript
// 1. React and Next.js imports
import React from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';

// 3. Internal components and utilities
import { Button } from '@/components/ui/button';
import { ideasAPI } from '@/lib/api/ideas';

// 4. Types and interfaces
import type { Idea } from '@/lib/supabase/types';
```

### CSS and Styling

- Use Tailwind CSS for styling
- Follow the utility-first approach
- Use custom CSS sparingly
- Maintain consistent spacing and colors

```tsx
// ✅ Good
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900">Ideas</h2>
  <Button variant="outline" size="sm">
    Add Idea
  </Button>
</div>
```

---

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for all new features
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

```typescript
// ✅ Good test example
describe('IdeaCard', () => {
  it('displays idea title and description correctly', () => {
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

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    const idea = { /* ... */ };

    render(<IdeaCard idea={idea} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledWith(idea.id);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test files
npm test IdeaCard.test.tsx
```

---

## 🔄 Pull Request Process

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write clean, well-documented code
- Add tests for new functionality
- Update documentation if needed
- Follow the code style guidelines

### 3. Commit Your Changes

Use conventional commit messages:

```bash
# ✅ Good commit messages
git commit -m "feat: add idea search functionality"
git commit -m "fix: resolve whiteboard collaboration issue"
git commit -m "docs: update README with new features"
git commit -m "test: add tests for idea validation"

# ❌ Avoid
git commit -m "update stuff"
git commit -m "fix bug"
```

### 4. Push Your Branch

```bash
git push origin feature/your-feature-name
```

### 5. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill out the pull request template
5. Submit the pull request

### 6. Pull Request Template

```markdown
## Description

Brief description of the changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Checklist

- [ ] I have tested this locally
- [ ] I have updated the documentation
- [ ] I have added/updated tests
- [ ] My code follows the project's style guidelines
```

### 7. Review Process

- All pull requests require at least one review
- Address any feedback from reviewers
- Make sure all tests pass
- Ensure code coverage is maintained

---

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** for solutions
3. **Try to reproduce the issue** in a clean environment

### Issue Template

```markdown
## Bug Report

### Description

A clear and concise description of what the bug is.

### Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### Expected Behavior

A clear and concise description of what you expected to happen.

### Actual Behavior

A clear and concise description of what actually happened.

### Environment

- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 22]

### Additional Context

Add any other context about the problem here.
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Request

### Problem Statement

A clear and concise description of what problem this feature would solve.

### Proposed Solution

A clear and concise description of what you want to happen.

### Alternative Solutions

A clear and concise description of any alternative solutions or features you've considered.

### Additional Context

Add any other context or screenshots about the feature request here.
```

### Feature Request Guidelines

- **Be specific** about the problem you're trying to solve
- **Provide context** about why this feature is needed
- **Consider the impact** on existing functionality
- **Think about implementation** complexity

---

## 📚 Documentation

### Contributing to Documentation

- Keep documentation up to date with code changes
- Use clear, concise language
- Include code examples where appropriate
- Follow the existing documentation style

### Documentation Types

1. **Code Documentation**
   - Use JSDoc comments for functions and classes
   - Document complex business logic
   - Explain non-obvious code decisions

2. **User Documentation**
   - Update README.md for new features
   - Add usage examples
   - Include screenshots for UI changes

3. **API Documentation**
   - Document new API endpoints
   - Include request/response examples
   - Document error codes and messages

---

## 🎯 Areas for Contribution

### High Priority

- Bug fixes and performance improvements
- Security enhancements
- Accessibility improvements
- Test coverage improvements

### Medium Priority

- New features and enhancements
- UI/UX improvements
- Documentation updates
- Code refactoring

### Low Priority

- Cosmetic changes
- Minor text updates
- Experimental features

---

## 🏆 Recognition

Contributors will be recognized in the following ways:

- **GitHub Contributors** - All contributors will appear in the repository's contributors list
- **Release Notes** - Significant contributions will be mentioned in release notes
- **Documentation** - Contributors may be mentioned in documentation for their contributions

---

## 📞 Getting Help

If you need help with contributing:

- **GitHub Issues** - Create an issue for questions or problems
- **GitHub Discussions** - Use discussions for general questions
- **Documentation** - Check the README and code comments
- **Community** - Join our community channels

---

## 🙏 Thank You

Thank you for contributing to ForgeSpace! Your contributions help make this platform better for everyone. Whether you're fixing bugs, adding features, or improving documentation, every contribution is valuable.

---

<div align="center">

**Happy Contributing! 🚀**

</div>
