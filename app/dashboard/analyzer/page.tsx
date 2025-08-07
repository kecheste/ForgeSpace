'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  Loader2,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface ViabilityAnalysis {
  viabilityScore: number;
  creativityPotential: number;
  technicalFeasibility: number;
  innovationLevel: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  developmentTime: string;
  complexityLevel: string;
  requiredResources: string;
  similarConcepts: Array<{
    name: string;
    relevance: number;
    strengths: string[];
    limitations: string[];
  }>;
  improvementSuggestions: Array<{
    title: string;
    description: string;
    impact: 'Low' | 'Medium' | 'High';
    effort: 'Low' | 'Medium' | 'High';
  }>;
  recommendations: string[];
}

const defaultAnalysis: ViabilityAnalysis = {
  viabilityScore: 0,
  creativityPotential: 0,
  technicalFeasibility: 0,
  innovationLevel: 0,
  riskLevel: 'Medium',
  developmentTime: 'TBD',
  complexityLevel: 'TBD',
  requiredResources: 'TBD',
  similarConcepts: [],
  improvementSuggestions: [],
  recommendations: [],
};

export default function IdeaAnalyzer() {
  const [analysis, setAnalysis] = useState<ViabilityAnalysis>(defaultAnalysis);
  const [loading, setLoading] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [category, setCategory] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [currentPhase, setCurrentPhase] = useState('inception');
  const [analysisHistory, setAnalysisHistory] = useState<ViabilityAnalysis[]>(
    []
  );
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const analyzeIdea = async () => {
    if (!ideaTitle.trim() || !ideaDescription.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both title and description for analysis.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: ideaTitle,
          description: ideaDescription,
          phase: currentPhase,
          tags: [category, targetAudience].filter(Boolean),
          category,
          targetAudience,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysis(result);
      setAnalysisHistory((prev) => [result, ...prev.slice(0, 4)]);

      toast({
        title: 'Analysis Complete',
        description: `Viability Score: ${result.viabilityScore}/100`,
      });

      setShowDialog(false);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Please try again or check your connection.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'High':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur">
        <div className="flex-1">
          <h1 className="text-lg font-medium">Idea Development Analyzer</h1>
          <p className="text-sm text-muted-foreground">
            Powered by AI to evaluate and improve your ideas
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Brain className="mr-2 h-4 w-4" />
              Analyze New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Analyze Your Idea</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Idea Title *</label>
                <Input
                  placeholder="e.g., AI-powered learning assistant"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  placeholder="Describe your idea in detail..."
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    placeholder="e.g., Technology, Education"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Audience</label>
                  <Input
                    placeholder="e.g., Students, Professionals"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Development Phase</label>
                <select
                  value={currentPhase}
                  onChange={(e) => setCurrentPhase(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option
                    className="bg-gray-100 text-gray-700"
                    value="inception"
                  >
                    Inception - Just an idea
                  </option>
                  <option
                    className="bg-gray-100 text-gray-700"
                    value="refinement"
                  >
                    Refinement - Validating concept
                  </option>
                  <option
                    className="bg-gray-200 text1gray-700"
                    value="planning"
                  >
                    Planning - Detailed planning
                  </option>
                  <option
                    className="bg-gray-200 text1gray-700"
                    value="execution_ready"
                  >
                    Execution Ready - Ready to build
                  </option>
                </select>
              </div>

              <Button
                onClick={analyzeIdea}
                disabled={
                  loading || !ideaTitle.trim() || !ideaDescription.trim()
                }
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Run AI Analysis
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-6">
          {/* Analysis Status */}
          {analysis.viabilityScore === 0 && !loading && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground mb-4">
                  Enter your idea details and get an AI-powered development
                  analysis
                </p>
                <Button onClick={() => setShowDialog(true)}>
                  <Brain className="mr-2 h-4 w-4" />
                  Start Analysis
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Score Cards */}
          {analysis.viabilityScore > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:border-primary transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Viability
                    </CardTitle>
                    <div className="p-1 rounded-md bg-blue-500/10 text-blue-500">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getScoreColor(analysis.viabilityScore)}`}
                  >
                    {analysis.viabilityScore}/100
                  </div>
                  <Progress value={analysis.viabilityScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="hover:border-primary transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Creativity
                    </CardTitle>
                    <div className="p-1 rounded-md bg-green-500/10 text-green-500">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getScoreColor(analysis.creativityPotential)}`}
                  >
                    {analysis.creativityPotential}/100
                  </div>
                  <Progress
                    value={analysis.creativityPotential}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card className="hover:border-primary transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Technical
                    </CardTitle>
                    <div className="p-1 rounded-md bg-purple-500/10 text-purple-500">
                      <Zap className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getScoreColor(analysis.technicalFeasibility)}`}
                  >
                    {analysis.technicalFeasibility}/100
                  </div>
                  <Progress
                    value={analysis.technicalFeasibility}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card className="hover:border-primary transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Innovation
                    </CardTitle>
                    <div className="p-1 rounded-md bg-orange-500/10 text-orange-500">
                      <Target className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getScoreColor(analysis.innovationLevel)}`}
                  >
                    {analysis.innovationLevel}/100
                  </div>
                  <Progress value={analysis.innovationLevel} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analysis Sections */}
          {analysis.viabilityScore > 0 && (
            <Tabs defaultValue="overview">
              <TabsList className="w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="development">Development</TabsTrigger>
                <TabsTrigger value="similar">Similar Concepts</TabsTrigger>
                <TabsTrigger value="improvements">Improvements</TabsTrigger>
                <TabsTrigger value="recommendations">
                  Recommendations
                </TabsTrigger>
              </TabsList>

              <div className="pt-4">
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="hover:border-primary transition-colors">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Development Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                          <span className="text-sm">Development Time</span>
                          <span className="font-medium">
                            {analysis.developmentTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                          <span className="text-sm">Complexity Level</span>
                          <span className="font-medium">
                            {analysis.complexityLevel}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                          <span className="text-sm">Required Resources</span>
                          <span className="font-medium">
                            {analysis.requiredResources}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:border-primary transition-colors">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Risk Assessment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                          <span className="text-sm">Risk Level</span>
                          <Badge className={getRiskColor(analysis.riskLevel)}>
                            {analysis.riskLevel} Risk
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">AI-powered analysis</span>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            Development-focused insights
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="development" className="space-y-4">
                  <Card className="hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Development Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 rounded-md hover:bg-muted/50">
                        <h3 className="font-medium mb-2">
                          Technical Feasibility Score
                        </h3>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={analysis.technicalFeasibility}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium">
                            {analysis.technicalFeasibility}/100
                          </span>
                        </div>
                      </div>
                      <div className="p-3 rounded-md hover:bg-muted/50">
                        <h3 className="font-medium mb-2">
                          Key Development Factors
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li>• Technical complexity and requirements</li>
                          <li>• Development timeline and resources</li>
                          <li>• Implementation challenges</li>
                          <li>• Required skills and expertise</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="similar" className="space-y-4">
                  {analysis.similarConcepts.length > 0 ? (
                    analysis.similarConcepts.map((concept, index) => (
                      <Card
                        key={index}
                        className="hover:border-primary transition-colors"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>{concept.name}</CardTitle>
                            <Badge variant="outline">
                              {concept.relevance}% relevant
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Strengths</h4>
                            <ul className="text-sm space-y-2">
                              {concept.strengths.map((strength, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Limitations</h4>
                            <ul className="text-sm space-y-2">
                              {concept.limitations.map((limitation, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50"
                                >
                                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  {limitation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          No similar concepts available
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="improvements" className="space-y-4">
                  {analysis.improvementSuggestions.length > 0 ? (
                    analysis.improvementSuggestions.map((suggestion, index) => (
                      <Card
                        key={index}
                        className="hover:border-primary transition-colors"
                      >
                        <CardHeader>
                          <CardTitle>{suggestion.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            {suggestion.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  suggestion.impact === 'High'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {suggestion.impact} Impact
                              </Badge>
                              <Badge
                                variant={
                                  suggestion.effort === 'High'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                              >
                                {suggestion.effort} Effort
                              </Badge>
                            </div>
                            <Button variant="ghost" size="sm" className="group">
                              Explore{' '}
                              <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <ChevronRight className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          No improvement suggestions available
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  {analysis.recommendations.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          AI Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysis.recommendations.map(
                            (recommendation, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50"
                              >
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <p className="text-sm">{recommendation}</p>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          No recommendations available
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          )}

          {/* Analysis History */}
          {analysisHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisHistory.slice(1).map((hist, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${getScoreColor(hist.viabilityScore).replace('text-', 'bg-')}`}
                        />
                        <span className="text-sm">Analysis #{index + 1}</span>
                      </div>
                      <Badge variant="outline">{hist.viabilityScore}/100</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
