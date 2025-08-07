// ForgeSpace Theme Configuration
// Comprehensive startup development platform theme

export const themeConfig = {
  // Primary brand colors
  brand: {
    primary: {
      purple: '#8B5CF6',
      pink: '#EC4899',
      blue: '#3B82F6',
      gradient: 'from-purple-500 to-pink-500',
      gradientHover: 'from-purple-600 to-pink-600',
    },
    secondary: {
      cyan: '#06B6D4',
      teal: '#14B8A6',
      emerald: '#10B981',
      gradient: 'from-cyan-500 to-teal-500',
    },
    accent: {
      orange: '#F97316',
      red: '#EF4444',
      yellow: '#EAB308',
      amber: '#F59E0B',
      gradient: 'from-orange-500 to-red-500',
    },
  },

  // Platform pillar categories and their colors
  pillars: {
    Foundation: {
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      color: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
      text: 'from-indigo-600 to-purple-600',
    },
    Collaboration: {
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      color: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
      text: 'from-blue-600 to-cyan-600',
    },
    Intelligence: {
      gradient: 'from-emerald-500 via-green-500 to-lime-500',
      color: 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500',
      text: 'from-emerald-600 to-green-600',
    },
    Development: {
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      color: 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500',
      text: 'from-orange-600 to-red-600',
    },
    Finance: {
      gradient: 'from-yellow-500 via-amber-500 to-orange-500',
      color: 'bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500',
      text: 'from-yellow-600 to-amber-600',
    },
    Legal: {
      gradient: 'from-slate-500 via-gray-500 to-zinc-500',
      color: 'bg-gradient-to-br from-slate-500 via-gray-500 to-zinc-500',
      text: 'from-slate-600 to-gray-600',
    },
    Marketing: {
      gradient: 'from-violet-500 via-purple-500 to-indigo-500',
      color: 'bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500',
      text: 'from-violet-600 to-purple-600',
    },
    HR: {
      gradient: 'from-rose-500 via-pink-500 to-purple-500',
      color: 'bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500',
      text: 'from-rose-600 to-pink-600',
    },
    Analytics: {
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      color: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500',
      text: 'from-cyan-600 to-blue-600',
    },
    Customer: {
      gradient: 'from-teal-500 via-emerald-500 to-green-500',
      color: 'bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500',
      text: 'from-teal-600 to-emerald-600',
    },
    Infrastructure: {
      gradient: 'from-sky-500 via-blue-500 to-indigo-500',
      color: 'bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500',
      text: 'from-sky-600 to-blue-600',
    },
    Enterprise: {
      gradient: 'from-gray-500 via-slate-500 to-zinc-500',
      color: 'bg-gradient-to-br from-gray-500 via-slate-500 to-zinc-500',
      text: 'from-gray-600 to-slate-600',
    },
  },

  // Phase colors for idea lifecycle
  phases: {
    Inception: {
      gradient: 'from-blue-500 to-cyan-500',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      text: 'from-blue-600 to-cyan-600',
    },
    Refinement: {
      gradient: 'from-purple-500 to-pink-500',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      text: 'from-purple-600 to-pink-600',
    },
    Planning: {
      gradient: 'from-orange-500 to-red-500',
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      text: 'from-orange-600 to-red-600',
    },
    'Execution Ready': {
      gradient: 'from-green-500 to-emerald-500',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      text: 'from-green-600 to-emerald-600',
    },
  },

  // Background gradients
  backgrounds: {
    primary:
      'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950',
    secondary:
      'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800',
    card: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800',
    loading:
      'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950',
    error:
      'bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-red-950 dark:via-pink-950 dark:to-purple-950',
  },

  // Text gradients
  text: {
    primary:
      'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
    secondary:
      'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent',
    accent:
      'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent',
    warning:
      'bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent',
  },

  // Button styles
  buttons: {
    primary:
      'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg',
    secondary:
      'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg',
    success:
      'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg',
    warning:
      'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg',
  },

  // Card styles
  cards: {
    default:
      'border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800',
    hover: 'hover:shadow-xl transition-all duration-300',
    interactive: 'group cursor-pointer overflow-hidden',
  },

  // Animation durations
  animations: {
    fast: 'duration-200',
    normal: 'duration-300',
    slow: 'duration-500',
  },

  // Spacing
  spacing: {
    section: 'space-y-6',
    card: 'space-y-4',
    item: 'space-y-2',
  },
};

// Helper function to get pillar colors
export const getPillarColors = (category: string) => {
  return (
    themeConfig.pillars[category as keyof typeof themeConfig.pillars] ||
    themeConfig.pillars.Foundation
  );
};

// Helper function to get phase colors
export const getPhaseColors = (phase: string) => {
  return (
    themeConfig.phases[phase as keyof typeof themeConfig.phases] ||
    themeConfig.phases.Inception
  );
};

// Helper function to get gradient classes
export const getGradientClasses = (type: 'bg' | 'text', gradient: string) => {
  const prefix = type === 'bg' ? 'bg-gradient-to-br' : 'bg-gradient-to-r';
  return `${prefix} ${gradient}`;
};
