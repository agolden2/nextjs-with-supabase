import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation error",
      details: err.errors,
    });
    return;
  }

  if (err instanceof Error) {
    console.error(`[Error] ${req.method} ${req.path}:`, err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
}
