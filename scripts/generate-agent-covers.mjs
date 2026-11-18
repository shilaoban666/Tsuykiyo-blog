import { readFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const yaml = readFileSync(resolve(process.env.USERPROFILE || "", ".dsh/.credentials.yaml"), "utf8");
const key = (yaml.match(/DASHSCOPE_API_KEY:\s*(\S+)/) || [])[1];
if (!key) throw new Error("missing DASHSCOPE_API_KEY");
const base = "https://llm-2uwbz89bykkffsbm.cn-beijing.maas.aliyuncs.com/compatible-mode/v1";
const STYLE =
  "High-end Japanese anime tech illustration, cinematic film still, deep indigo and teal palette with coral accents, volumetric light, delicate linework, fine grain, no text, no letters, no numbers, no logo, no watermark.";

const prompts = {
  "what-is-ai-agent": `A glowing goal orb floating above a programmer's desk, connected by a luminous loop of action, observation and decision, a girl watching the loop from the dark. ${STYLE}`,
  "agent-memory-layers": `A vertical library of translucent memory floors, short-lived light sparks on top, long shelves of glowing crystals below, a figure descending between layers. ${STYLE}`,
  "agent-planning-paradigms": `A night map room split into two paths: a deliberate chessboard route and a reactive trail of light, a planner choosing between them. ${STYLE}`,
  "multi-agent-topologies": `Four floating islands at night connected by different bridges, one central hub, a pipeline, a debate ring and a shared blackboard, tiny agent silhouettes. ${STYLE}`,
  "what-is-agent-harness": `A luminous AI core held inside a delicate mechanical exoskeleton of rings, rails and safety braces, a young engineer adjusting one brace. ${STYLE}`,
  "harness-tool-layer-design": `A wall of modular glowing tools in sockets, each with a different shape, one tool being pulled out, a workbench and a calm engineer. ${STYLE}`,
  "harness-context-engineering": `A glass funnel compressing floating documents, memories and images into a dense beam of light above a terminal, a girl watching. ${STYLE}`,
  "harness-loop-control": `A giant clockwork loop with glowing step counters, a brake lever and a fuse, an engineer stopping the loop before it overheats. ${STYLE}`,
  "harness-state-checkpointing": `A path through a dark data landscape marked by floating crystal savepoints, one cracked crystal being restored, a traveler silhouette. ${STYLE}`,
  "harness-permission-sandbox": `A glass sandbox cube floating in a dark room, a robotic claw and a key inside, a hand outside testing the boundary, luminous walls. ${STYLE}`,
  "harness-observability": `A night city of agent trajectories drawn as constellations, glowing traces, token sparks and failure markers, an observer on a rooftop. ${STYLE}`,
  "harness-human-in-the-loop": `A human hand hovering over a glowing approval console, an agent paused behind glass, warm lamp against cool machinery. ${STYLE}`,
  "harness-mcp-integration": `A luminous protocol bridge between two floating towers, cables and handshake-like arcs of light, a small maintenance drone crossing. ${STYLE}`,
  "harness-runtime-multitenancy": `A vertical city of isolated glass apartments, each with its own tiny agent and color of light, a central scheduler tower. ${STYLE}`,
  "superagent-definition-orchestrator": `Anime conductor on a dark stage, raising a baton over a orchestra of small glowing agents and tools, music-like trails of light. ${STYLE}`,
  "superagent-task-decomposition": `A glowing prism splitting one large task crystal into smaller shards, each shard landing on a different workbench, an orchestrator watching. ${STYLE}`,
  "superagent-shared-memory": `A round blackboard table in a dark hall, glowing notes and threads connecting them, several agent silhouettes writing without touching. ${STYLE}`,
  "superagent-tool-orchestration": `A vast glowing dependency graph above a city, nodes as tools, edges as light, a conductor figure pulling parallel threads. ${STYLE}`,
  "superagent-quality-gates": `A path through a series of floating torii-like quality gates, glowing checkmarks and rejected papers, an agent walking through. ${STYLE}`,
  "superagent-budget-latency": `A giant hourglass filled with glowing coins and light particles, a stopwatch-like ring, an orchestrator balancing speed and cost. ${STYLE}`,
  "superagent-failure-recovery": `Small repair drones tending a damaged glowing agent in a dark hangar, backup copies in glass capsules, a calm recovery scene. ${STYLE}`,
  "superagent-workflow-hybrid": `A luminous railway track through clouds merging into a free-flying path, a train of tasks and a bird-like agent choosing the route. ${STYLE}`,
  "superagent-product-evolution": `A layered holographic interface evolving from a small copilot panel into a full orchestra of agents, a designer watching the transformation. ${STYLE}`,
  "build-minimal-harness-python": `A tiny friendly robot on a workbench surrounded by five glowing modules and simple gears, a engineer assembling it, cozy workshop. ${STYLE}`,
  "tool-contract-testing": `A laboratory bench with glowing contract scrolls and test tubes shaped like connectors, a girl testing a tool interface, precise and calm. ${STYLE}`,
  "prompt-config-versioning": `A vault of floating glass capsules, each holding a glowing prompt or configuration scroll, an archivist sealing one capsule. ${STYLE}`,
  "local-agent-dev-environment": `A cozy dark lab with several floating replay screens, fake tools on shelves, a developer and a small agent debugging together. ${STYLE}`,
  "agent-evaluation-system": `An arena of floating task cards and glowing score rings, an agent running a course while examiners watch from a balcony. ${STYLE}`,
  "prompt-injection-defense": `A glowing shield deflecting poisoned arrows made of text-like sparks, an agent behind the shield, dark hostile network outside. ${STYLE}`,
  "agent-security-checklist": `A final gate at night with a holographic checklist panel, keys, audit trails and a red emergency stop, an engineer doing final checks. ${STYLE}`,
};

mkdirSync("public/art/generated/agents", { recursive: true });

async function generate(slug, prompt, attempt = 0) {
  const response = await fetch(`${base}/images/generations`, {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ model: "qwen-image-3.0", prompt, n: 1, size: "1472x981" }),
  });
  const data = await response.json();
  if (!response.ok || !data.data?.[0]?.url) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 5000 + attempt * 4000));
      return generate(slug, prompt, attempt + 1);
    }
    throw new Error(`${slug}: ${response.status} ${JSON.stringify(data).slice(0, 200)}`);
  }
  const image = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
  await sharp(image).resize(1472, 981, { fit: "cover" }).webp({ quality: 87 }).toFile(`public/art/generated/agents/${slug}.webp`);
  console.log(`✓ ${slug}`);
}

const entries = Object.entries(prompts);
for (let index = 0; index < entries.length; index += 3) {
  await Promise.all(entries.slice(index, index + 3).map(([slug, prompt]) => generate(slug, prompt)));
}
console.log(`done ${entries.length}`);