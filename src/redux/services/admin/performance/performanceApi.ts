import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---

export interface PerformanceStats {
  avg_completion_rate: number;
  avg_attendance_rate: number | null;
  total_tasks_completed: number;
  active_employees: number;
}

export interface PerformerBase {
  id: number;
  name: string;
  email: string;
  performance_score: number;
  tasks_completed: number;
  completion_rate: number;
  attendance: number | null;
}

export interface RankingResult extends PerformerBase {
  rank: number;
  overdue: number;
  status: "At Risk" | "Top Performer" | "Average" | string; // Adjust based on all possible backend values
}

export interface PerformanceRankingResponse {
  period: "today" | "weekly" | "monthly" | "yearly";
  stats: PerformanceStats;
  top_performer: PerformerBase;
  rankings: {
    count: number;
    next: string | null;
    previous: string | null;
    results: RankingResult[];
  };
}

interface PerformanceQueryParams {
  period?: "today" | "weekly" | "monthly" | "yearly";
  page?: number;
}

// --- API Slice ---

export const performanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET: Admin Performance Rankings and Stats
     * Based on: /api/admin/performance/?period=weekly&page=2
     */
    getPerformanceRankings: builder.query<
      PerformanceRankingResponse,
      PerformanceQueryParams
    >({
      query: (params) => ({
        url: "/admin/performance/",
        method: "GET",
        params: {
          period: params.period || "weekly",
          page: params.page || 1,
        },
      }),
      // Using "Performance" as a tag for cache invalidation if needed
      providesTags: (result) =>
        result
          ? [
              ...result.rankings.results.map(({ id }) => ({
                type: "Performance" as const,
                id,
              })),
              { type: "Performance", id: "LIST" },
            ]
          : [{ type: "Performance", id: "LIST" }],
    }),
  }),
});

export const { useGetPerformanceRankingsQuery } = performanceApi;
