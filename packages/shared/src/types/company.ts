import type { COMPANY_STATUSES } from "../constants.js";

export type CompanyStatus = (typeof COMPANY_STATUSES)[number];

export interface Company {
  id: string;
  name: string;
  slug: string;
  status: CompanyStatus;
  description: string | null;
  logoUrl: string | null;
  missionStatement: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyInput {
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  missionStatement?: string;
}

export interface UpdateCompanyInput {
  name?: string;
  status?: CompanyStatus;
  description?: string;
  logoUrl?: string;
  missionStatement?: string;
}
