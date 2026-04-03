import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { projects, projectWorkspaces, projectMembers } from "@forge/db/schema";
import { getDb } from "@forge/db/client";
import { z } from "zod";

const router = Router();

const createProjectSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  status: z.string().optional(),
  leadAgentId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  targetDate: z.string().datetime().optional(),
  color: z.string().optional(),
});

const updateProjectSchema = createProjectSchema.partial().omit({ companyId: true });

// GET /api/projects?companyId=xxx
router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const { companyId } = req.query as { companyId?: string };
    const result = companyId
      ? await db.select().from(projects).where(eq(projects.companyId, companyId))
      : await db.select().from(projects);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, req.params.id));
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// POST /api/projects
router.post("/", async (req, res, next) => {
  try {
    const db = getDb();
    const input = createProjectSchema.parse(req.body);
    const [created] = await db.insert(projects).values(input as any).returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/projects/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const input = updateProjectSchema.parse(req.body);
    const [updated] = await db
      .update(projects)
      .set({ ...input, updatedAt: new Date() } as any)
      .where(eq(projects.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    await db.delete(projects).where(eq(projects.id, req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/workspaces
router.get("/:id/workspaces", async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db
      .select()
      .from(projectWorkspaces)
      .where(eq(projectWorkspaces.projectId, req.params.id));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/projects/:id/workspaces
router.post("/:id/workspaces", async (req, res, next) => {
  try {
    const db = getDb();
    const [created] = await db
      .insert(projectWorkspaces)
      .values({ ...req.body, projectId: req.params.id })
      .returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/members
router.get("/:id/members", async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db
      .select()
      .from(projectMembers)
      .where(eq(projectMembers.projectId, req.params.id));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/projects/:id/members
router.post("/:id/members", async (req, res, next) => {
  try {
    const db = getDb();
    const { agentId, role } = req.body as { agentId: string; role?: string };
    const [created] = await db
      .insert(projectMembers)
      .values({ projectId: req.params.id, agentId, role: role ?? "member" })
      .returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id/members/:agentId
router.delete("/:id/members/:agentId", async (req, res, next) => {
  try {
    const db = getDb();
    await db
      .delete(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, req.params.id),
          eq(projectMembers.agentId, req.params.agentId)
        )
      );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
