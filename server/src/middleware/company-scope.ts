import type { Request, Response, NextFunction } from "express";

// Ensures companyId is present on requests that need it
export function requireCompanyId(req: Request, res: Response, next: NextFunction): void {
  const companyId = req.query.companyId as string | undefined;
  if (!companyId) {
    res.status(400).json({ error: "companyId query parameter is required" });
    return;
  }
  next();
}
