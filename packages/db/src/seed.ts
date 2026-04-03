import { getDb } from "./client.js";
import { companies, agents, issues, projects, goals } from "./schema/index.js";

async function seed() {
  const db = getDb();

  console.log("Seeding database...");

  // Create a demo company
  const [company] = await db
    .insert(companies)
    .values({
      name: "Acme Corp",
      slug: "acme",
      description: "A demo company for Forge",
      missionStatement: "Build great software with AI agents",
    })
    .returning();

  console.log(`Created company: ${company.name} (${company.id})`);

  // Create CEO agent
  const [ceo] = await db
    .insert(agents)
    .values({
      companyId: company.id,
      name: "Alice (CEO)",
      role: "ceo",
      adapterType: "claude_local",
      systemPrompt:
        "You are the CEO of Acme Corp. Your job is to oversee the engineering team and ensure projects are delivered on time.",
      heartbeatIntervalSeconds: 300,
      budgetMonthlyCents: 50000,
    })
    .returning();

  console.log(`Created CEO: ${ceo.name}`);

  // Create engineer agent
  const [engineer] = await db
    .insert(agents)
    .values({
      companyId: company.id,
      name: "Bob (Engineer)",
      role: "engineer",
      adapterType: "claude_local",
      reportsTo: ceo.id,
      systemPrompt:
        "You are a software engineer at Acme Corp. You implement features and fix bugs.",
      heartbeatIntervalSeconds: 600,
      budgetMonthlyCents: 20000,
    })
    .returning();

  console.log(`Created engineer: ${engineer.name}`);

  // Create a project
  const [project] = await db
    .insert(projects)
    .values({
      companyId: company.id,
      name: "Platform v1",
      description: "Initial platform launch",
      status: "active",
      leadAgentId: ceo.id,
    })
    .returning();

  console.log(`Created project: ${project.name}`);

  // Create a goal
  const [goal] = await db
    .insert(goals)
    .values({
      companyId: company.id,
      title: "Launch MVP",
      level: "company",
      ownerAgentId: ceo.id,
      projectId: project.id,
    })
    .returning();

  console.log(`Created goal: ${goal.title}`);

  // Create some issues
  const issueData = [
    { title: "Set up CI/CD pipeline", status: "todo" as const, priority: "high" as const },
    { title: "Design system components", status: "in_progress" as const, priority: "medium" as const },
    { title: "Write API documentation", status: "backlog" as const, priority: "low" as const },
  ];

  for (let i = 0; i < issueData.length; i++) {
    const [issue] = await db
      .insert(issues)
      .values({
        companyId: company.id,
        number: i + 1,
        ...issueData[i],
        assigneeId: engineer.id,
        projectId: project.id,
        goalId: goal.id,
      })
      .returning();
    console.log(`Created issue #${issue.number}: ${issue.title}`);
  }

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
