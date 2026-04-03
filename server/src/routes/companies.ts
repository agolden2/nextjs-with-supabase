import { Router } from "express";
import { eq } from "drizzle-orm";
import { companies } from "@forge/db/schema";
import { createCompanySchema, updateCompanySchema } from "@forge/shared/validators";
import { getDb } from "@forge/db/client";

const router = Router();

// GET /api/companies
router.get("/", async (_req, res, next) => {
  try {
    const db = getDb();
    const result = await db.select().from(companies).orderBy(companies.createdAt);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/companies/:id
router.get("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, req.params.id));
    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }
    res.json(company);
  } catch (err) {
    next(err);
  }
});

// POST /api/companies
router.post("/", async (req, res, next) => {
  try {
    const db = getDb();
    const input = createCompanySchema.parse(req.body);
    const slug =
      input.slug ?? input.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const [created] = await db
      .insert(companies)
      .values({ ...input, slug })
      .returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/companies/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const input = updateCompanySchema.parse(req.body);
    const [updated] = await db
      .update(companies)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(companies.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Company not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/companies/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    await db.delete(companies).where(eq(companies.id, req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
