import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client.js";
import { queryKeys } from "./queryKeys.js";
import type { Agent, OrgNode } from "@forge/shared/types";

export function useAgents(companyId?: string) {
  return useQuery({
    queryKey: queryKeys.agents(companyId),
    queryFn: () =>
      apiFetch<Agent[]>(`/api/agents${companyId ? `?companyId=${companyId}` : ""}`),
  });
}

export function useAgent(id: string) {
  return useQuery({
    queryKey: queryKeys.agent(id),
    queryFn: () => apiFetch<Agent>(`/api/agents/${id}`),
    enabled: !!id,
  });
}

export function useOrgChart(companyId: string) {
  return useQuery({
    queryKey: queryKeys.org(companyId),
    queryFn: () => apiFetch<OrgNode[]>(`/api/org?companyId=${companyId}`),
    enabled: !!companyId,
  });
}

export function usePauseAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<Agent>(`/api/agents/${id}/pause`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["agents"] }),
  });
}

export function useResumeAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<Agent>(`/api/agents/${id}/resume`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["agents"] }),
  });
}
