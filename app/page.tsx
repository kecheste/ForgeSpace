'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Brain,
  Users,
  Wrench,
  Target,
  Star,
  Play,
  ArrowUpRight,
  ChevronRight,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'AI-Powered Analysis',
    description:
      "Get instant insights into your ideas' potential with our advanced AI analyzer",
    icon: Brain,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Collaborative Workspaces',
    description:
      'Build and refine ideas together with your team in dedicated workspaces',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Development Tools',
    description:
      'Access essential tools for idea development and project management',
    icon: Wrench,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    title: 'Progress Tracking',
    description:
      'Track your ideas through different phases from concept to implementation',
    icon: Target,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager',
    company: 'TechFlow',
    content:
      'ForgeSpace transformed how our team develops ideas. The AI analysis helps us make better decisions.',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Startup Founder',
    company: 'InnovateLab',
    content:
      'The collaborative workspaces and development tools have accelerated our idea-to-product pipeline.',
    rating: 5,
  },
  {
    name: 'Emily Watson',
    role: 'Design Lead',
    company: 'Creative Studio',
    content:
      'Finally, a platform that understands the creative process. The phase tracking is brilliant.',
    rating: 5,
  },
];

const stats = [
  { value: '10,000+', label: 'Ideas Developed' },
  { value: '500+', label: 'Active Teams' },
  { value: '95%', label: 'Success Rate' },
];

const pricing = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for individuals getting started',
    features: [
      '5 ideas per month',
      'Basic AI analysis',
      'Personal workspace',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For teams and serious creators',
    features: [
      'Unlimited ideas',
      'Advanced AI analysis',
      'Team workspaces',
      'Priority support',
      'Development tools',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For organizations with advanced needs',
    features: [
      'Everything in Pro',
      'Dedicated success manager',
      'Custom integrations',
      'On-premise options',
      'SLA guarantees',
    ],
  },
];

/**
 * Landing page for the application
 * @returns {JSX.Element} The JSX for the landing page
 */
export default function LandingPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
        <div className="absolute top-60 right-40 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <nav className="fixed w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ForgeSpace
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard/help">Help</Link>
              </Button>
              {user ? (
                <Button asChild>
                  <Link href="/dashboard" className="group">
                    <span className="mr-2">Go to App</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/dashboard" className="group">
                    <span className="mr-2">Sign In</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Badge variant="secondary" className="mb-6 shadow-sm">
              <Sparkles className="mr-2 h-3 w-3" />
              AI-Powered Idea Development
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Transform Your Ideas Into
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {' '}
                Reality
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              ForgeSpace is the ultimate platform for idea development. From
              concept to implementation, our AI-powered tools and collaborative
              workspaces help you build better ideas faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" asChild className="group">
                  <Link href="/dashboard">
                    <Play className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild className="group">
                  <Link href="/dashboard">
                    <Play className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    Get Started Free
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild className="group">
                <Link href="/dashboard/help">
                  <ArrowUpRight className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  Learn More
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 border shadow-xl overflow-hidden mx-auto max-w-4xl"
          >
            <div className="aspect-video bg-grid flex items-center justify-center p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 p-8 mb-6">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  ForgeSpace Workspace
                </h3>
                <p className="text-muted-foreground">
                  Your ideas visualized in our platform
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-background/50 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by innovative teams at
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-center">
            {[
              'TechFlow',
              'InnovateLab',
              'Creative Studio',
              'NextGen',
              'Visionary',
              'FutureWorks',
            ].map((company) => (
              <div
                key={company}
                className="flex items-center justify-center text-muted-foreground font-medium"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Build Great Ideas
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From initial concept to final implementation, ForgeSpace provides
              all the tools you need.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow-sm">
                  <CardHeader>
                    <div
                      className={`mx-auto mb-4 h-12 w-12 rounded-lg flex items-center justify-center ${feature.bgColor}`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-purple-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users have to say about ForgeSpace
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. No hidden fees.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  'relative',
                  plan.featured && 'md:transform md:scale-105 z-10'
                )}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <Card
                  className={cn(
                    'h-full border-0 shadow-sm hover:shadow-lg transition-shadow',
                    plan.featured ? 'border-2 border-purple-500' : ''
                  )}
                >
                  <CardHeader
                    className={cn(
                      'border-b',
                      plan.featured
                        ? 'bg-gradient-to-r from-purple-600/10 to-blue-600/10'
                        : ''
                    )}
                  >
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full mt-6 group"
                      size="lg"
                      variant={plan.featured ? 'default' : 'outline'}
                    >
                      Get Started
                      <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="text-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/50 dark:to-blue-900/50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl">
                  Ready to Build Something Amazing?
                </CardTitle>
                <CardDescription className="text-lg">
                  Join thousands of teams already using ForgeSpace to develop
                  their ideas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {user ? (
                    <Button size="lg" asChild className="group">
                      <Link href="/dashboard">
                        <Play className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        Go to Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <Button size="lg" asChild className="group">
                      <Link href="/dashboard">
                        <Play className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        Start Building Free
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" size="lg" asChild className="group">
                    <Link href="/dashboard/help">
                      <ArrowUpRight className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      View Demo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ForgeSpace
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                The ultimate platform for idea development and team
                collaboration.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <div className="space-y-2 text-sm">
                <Link
                  href="/dashboard/help"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ideas
                </Link>
                <Link
                  href="/dashboard/help"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Workspaces
                </Link>
                <Link
                  href="/dashboard/help"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  AI Analyzer
                </Link>
                <Link
                  href="/dashboard/help"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tools
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <div className="space-y-2 text-sm">
                <Link
                  href="/dashboard/help"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help
                </Link>
                <Link
                  href="/dashboard/help"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/dashboard/help"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
                <Link
                  href="/dashboard/help"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Connect</h3>
              <div className="space-y-2 text-sm">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Go to App
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/sign-up"
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign Up
                  </Link>
                )}
                <Link
                  href="/dashboard/help"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/dashboard/help"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </Link>
                <Link
                  href="/dashboard/help"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ForgeSpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
