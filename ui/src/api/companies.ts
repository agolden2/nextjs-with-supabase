import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client.js";
import { queryKeys } from "./queryKeys.js";
import type { Company, CreateCompanyInput, UpdateCompanyInput } from "@forge/shared/types";

export function useCompanies() {
  return useQuery({
    queryKey: queryKeys.companies(),
    queryFn: () => apiFetch<Company[]>("/api/companies"),
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: queryKeys.company(id),
    queryFn: () => apiFetch<Company>(`/api/companies/${id}`),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCompanyInput) =>
      apiFetch<Company>("/api/companies", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useUpdateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateCompanyInput & { id: string }) =>
      apiFetch<Company>(`/api/companies/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}
