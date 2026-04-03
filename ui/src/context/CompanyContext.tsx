import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Company } from "@forge/shared/types";
import { useCompanies } from "../api/companies.js";

interface CompanyContextValue {
  companies: Company[];
  activeCompany: Company | null;
  setActiveCompany: (company: Company) => void;
  isLoading: boolean;
}

const CompanyContext = createContext<CompanyContextValue>({
  companies: [],
  activeCompany: null,
  setActiveCompany: () => {},
  isLoading: true,
});

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { data: companies = [], isLoading } = useCompanies();
  const [activeCompany, setActiveCompanyState] = useState<Company | null>(null);

  // Auto-select first company
  useEffect(() => {
    if (!activeCompany && companies.length > 0) {
      const saved = localStorage.getItem("forge:activeCompanyId");
      const found = saved ? companies.find((c) => c.id === saved) : null;
      setActiveCompanyState(found ?? companies[0]);
    }
  }, [companies, activeCompany]);

  const setActiveCompany = (company: Company) => {
    setActiveCompanyState(company);
    localStorage.setItem("forge:activeCompanyId", company.id);
  };

  return (
    <CompanyContext.Provider value={{ companies, activeCompany, setActiveCompany, isLoading }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanyContext() {
  return useContext(CompanyContext);
}
