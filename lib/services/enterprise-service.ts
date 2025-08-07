import { createClient } from '@/lib/supabase/client';

export interface InnovationChallenge {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  department: string;
  prize: string;
  deadline: string;
  participants: number;
  submissions: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeInnovationKPI {
  user_id: string;
  employee_name: string;
  department: string;
  ideas_created: number;
  ideas_implemented: number;
  participation_rate: number;
  innovation_score: number;
  challenges_won: number;
  collaboration_score: number;
}

export interface DepartmentStats {
  department: string;
  total_ideas: number;
  participation_rate: number;
  implementation_rate: number;
  avg_innovation_score: number;
  active_challenges: number;
}

class EnterpriseService {
  private supabase = createClient();

  async createChallenge(
    challenge: Omit<InnovationChallenge, 'id' | 'created_at' | 'updated_at'>
  ): Promise<InnovationChallenge> {
    const { data, error } = await this.supabase
      .from('innovation_challenges')
      .insert(challenge)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getChallenges(status?: string): Promise<InnovationChallenge[]> {
    let query = this.supabase.from('innovation_challenges').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });
    if (error) throw error;
    return data || [];
  }

  async updateChallenge(
    id: string,
    updates: Partial<InnovationChallenge>
  ): Promise<InnovationChallenge> {
    const { data, error } = await this.supabase
      .from('innovation_challenges')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getEmployeeKPIs(department?: string): Promise<EmployeeInnovationKPI[]> {
    let query = this.supabase.from('employee_innovation_kpis').select('*');

    if (department) {
      query = query.eq('department', department);
    }

    const { data, error } = await query.order('innovation_score', {
      ascending: false,
    });
    if (error) throw error;
    return data || [];
  }

  async updateEmployeeKPI(
    userId: string,
    kpi: Partial<EmployeeInnovationKPI>
  ): Promise<EmployeeInnovationKPI> {
    const { data, error } = await this.supabase
      .from('employee_innovation_kpis')
      .upsert({ user_id: userId, ...kpi })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getDepartmentStats(): Promise<DepartmentStats[]> {
    const { data, error } = await this.supabase
      .from('department_stats')
      .select('*')
      .order('total_ideas', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createCrossTeamProject(project: {
    title: string;
    description: string;
    departments: string[];
    lead_user_id: string;
    deadline: string;
  }): Promise<unknown> {
    const { data, error } = await this.supabase
      .from('cross_team_projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getCrossTeamProjects(): Promise<unknown[]> {
    const { data, error } = await this.supabase
      .from('cross_team_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async calculateInnovationMetrics(): Promise<{
    totalIdeas: number;
    participationRate: number;
    implementationRate: number;
    avgInnovationScore: number;
    topPerformer: EmployeeInnovationKPI | null;
  }> {
    const kpis = await this.getEmployeeKPIs();
    const totalEmployees = kpis.length;
    const totalIdeas = kpis.reduce((sum, kpi) => sum + kpi.ideas_created, 0);
    const totalImplemented = kpis.reduce(
      (sum, kpi) => sum + kpi.ideas_implemented,
      0
    );
    const avgScore =
      kpis.reduce((sum, kpi) => sum + kpi.innovation_score, 0) / totalEmployees;
    const participationRate =
      (kpis.filter((kpi) => kpi.participation_rate > 0).length /
        totalEmployees) *
      100;

    const topPerformer = kpis.length > 0 ? kpis[0] : null;

    return {
      totalIdeas,
      participationRate,
      implementationRate:
        totalIdeas > 0 ? (totalImplemented / totalIdeas) * 100 : 0,
      avgInnovationScore: avgScore,
      topPerformer,
    };
  }
}

export const enterpriseService = new EnterpriseService();
