import { readFileSync, mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";
import sharp from "sharp";

const yaml = readFileSync(resolve(process.env.USERPROFILE || "", ".dsh/.credentials.yaml"), "utf8");
const key = (yaml.match(/DASHSCOPE_API_KEY:\s*(\S+)/) || [])[1];
if (!key) throw new Error("missing DASHSCOPE_API_KEY");
const base = "https://llm-2uwbz89bykkffsbm.cn-beijing.maas.aliyuncs.com/compatible-mode/v1";
const sql = postgres("postgres://postgres:123456@127.0.0.1:5432/tsukiyo_blog", { max: 1 });

const STYLE =
  "High-end Japanese anime illustration, cinematic film still, deep indigo and teal palette with coral accents, volumetric light, delicate linework, fine film grain, no text, no letters, no numbers, no logo, no watermark.";

const prompts = {
  f3af6348_f4de_48cb_95c5_972c658ffaad: `A quiet clockwork workshop at midnight, brass gears and a glowing blue retry loop rewinding a silver thread, floating translucent rune-like tags, a cat asleep on the desk. ${STYLE}`,
  "2ec4b1a2_8307_4253_99e1_14628cfab5bb": `A luminous spring coiled around a floating pocket watch, blue retry arrows looping in the air above a programmer's desk, warm desk lamp and rain on the window. ${STYLE}`,
  "4b9493fd_ea7c_4716_951e_8ab39cce9207": `A long cyberpunk server corridor at night, one glowing network port sealed with a red holographic lock, tangled fiber cables, a girl engineer inspecting it with a tablet. ${STYLE}`,
  "238567ca_add6_4010_84be_54c6e6f66cc7": `An anime command center at night, many glowing process threads floating like ribbons, a silver blade cutting one thread, monitors showing abstract waves, a focused young engineer. ${STYLE}`,
  "2fd528ca_6039_4f84_8e87_6952e2db141c": `A vast midnight library of glass database shelves, thousands of tiny glowing strings braided into one luminous thread between two books, a librarian silhouette. ${STYLE}`,
  "476f360f_7b51_41f2_bece_d5f8ccd96851": `A rooftop at night filled with glowing paper airplanes carrying sealed letters, a girl releasing one paper plane toward a distant city, deep blue sky. ${STYLE}`,
  "625f7734_ac06_49b3_b3cb_2df627b14068": `An anime architect's desk at night, translucent building blocks assembling themselves into a glowing green framework, spring vines growing around a laptop. ${STYLE}`,
  "fc02f40d_b25b_42fe_9b11_ee5598ead97c": `A dark Windows command-line room reimagined as anime, glowing text-free terminal panels, a single red process line being cut by a silver cursor, a cat watching. ${STYLE}`,
  "8024f0c2_884c_4716_8c43_ea9421aa2d7e": `A constellation of glowing nodes above a dark desk, one node lit bright green with a tiny checkmark, cables connecting the others, a girl looking up. ${STYLE}`,
  "f76ba97a_9a6e_4dc8_be83_82315d8f258c": `Transparent glass vessels connected by glowing liquid threads, light being injected from one vessel into another, a calm alchemist girl in a dark laboratory. ${STYLE}`,
  dfbeceb4_d39e_4d70_8bd7_b0cfec8a593b: `Two immense libraries at night, one warm wooden and one cool glass, connected by a bridge of flowing light and tiny data fireflies. ${STYLE}`,
  "0a0441d8_2e39_4b9b_8355_dc42d9be5953": `Three floating islands at night representing a data ecosystem, connected by luminous bridges, tiny glowing libraries and server trees, a wide cinematic sky. ${STYLE}`,
  d5effb9d_88ec_429e_96df_33977f889668: `An anime girl at a desk by a window, a glowing console panel emitting abstract waves of light, no readable text, city lights outside, quiet night. ${STYLE}`,
  "53cc50c5_8051_41ee_8a1a_30d76cf8f577": `A futuristic anime monitoring room, floating holographic gauges and a glowing heartbeat line, a young engineer watching a calm blue interface, no text. ${STYLE}`,
  "3c121123_7593_4655_9da8_7abb201a2e58": `Floating paper talismans with abstract glowing seals attaching themselves to everyday objects, a girl in a dark coat watching, magical and precise. ${STYLE}`,
  "53f724dc_4a1c_4682_8419_9636bdb4bee9": `A locked glass vault shaped like a database, a single glowing golden key floating in front of it, moonlight and cyan reflections, mysterious. ${STYLE}`,
  "62286136_2aee_41b7_b650_486d4a241f0c": `A silver spider web stretched between Tokyo rooftops at night, catching glowing data packets and fireflies, a girl with a laptop watching from below. ${STYLE}`,
  "61a9ef3f_0eff_412b_afb7_3d25006671af": `A corridor of floating mirrors, a hand reaching toward a glowing reflection that reaches back, threads of light connecting the mirrors. ${STYLE}`,
  "36c26313_1b51_4325_beb3_48027591ec63": `A translucent blueprint of a floating glass cathedral, glowing structural lines and tiny rooms, an engineer girl walking through the blueprint. ${STYLE}`,
  b233cb0d_be5e_44fe_ae6b_bd6e09f56787: `A room filled with glowing doors and floating tools, each tool connected to a central glass blueprint, a girl choosing one, cinematic. ${STYLE}`,
  b689c7df_646e_4e73_8259_10d90750422e: `Two silhouettes standing apart on a city rooftop at night, warm and cool lights between them, a huge moon, restrained and bittersweet. ${STYLE}`,
  dd7e65eb_53cf_46b4_a7a6_8e29cabee958: `An anime control desk at night with two glowing terminal windows, a spring boot made of light and a small nginx gear, startup cables, no text. ${STYLE}`,
  c3b7d42d_4b9e_4bff_8d41_c8bad5684211: `Three translucent bridges connecting a glowing database island to a floating code city, tiny figures crossing, deep blue night. ${STYLE}`,
  "321fa4fd_4ee8_4b0c_851a_707855707c6b": `A luminous tree made of fiber-optic threads and event loops, glowing packets traveling along branches, a girl network engineer watching. ${STYLE}`,
  "93a249e7_bc7b_496a_bac2_9c419788e654": `A giant tree made of glowing folders and files at night, one branch being gently dissolved into light by a girl with silver scissors. ${STYLE}`,
  "758342d8_69a3_44fc_b99e-c7d9cb4cb6ab": `A quiet exam desk at night with floating geometric puzzle cubes and a glowing hourglass, an empty chair, city lights beyond the window. ${STYLE}`,
  cc8ba487_e920_44b8_9df3_81788e8d7f1e: `A wall of glowing hash-table lockers, golden keys and floating abstract tokens, a girl solving a puzzle in front of it, cinematic. ${STYLE}`,
  f42f7a4b_9a71_4f79_9bec_7a1422eb2eba: `A cute luminous python coiled around a glowing spider web in a dark garden, data fireflies, a girl programmer watching with a laptop. ${STYLE}`,
  "421b8200_6032_44f6_a369_f79c395728e1": `A dark data-visualization room with floating holographic charts and glowing lines, a girl presenting to an empty auditorium, no text, elegant. ${STYLE}`,
};

const normalizedPrompts = Object.fromEntries(
  Object.entries(prompts).map(([id, prompt]) => [id.replaceAll("_", "-"), prompt]),
);

const articles = await sql`SELECT id, title FROM posts WHERE source_platform = 'csdn'`;
const directory = resolve("public", "art", "generated", "articles");
mkdirSync(directory, { recursive: true });

async function generate(article, prompt, attempt = 0) {
  const response = await fetch(`${base}/images/generations`, {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ model: "qwen-image-3.0", prompt, n: 1, size: "1472x981" }),
  });
  const data = await response.json();
  if (!response.ok || !data.data?.[0]?.url) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 5000 + attempt * 4000));
      return generate(article, prompt, attempt + 1);
    }
    throw new Error(`${article.title}: ${response.status} ${JSON.stringify(data).slice(0, 200)}`);
  }
  const image = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
  const target = resolve(directory, `${article.id}.webp`);
  await sharp(image).resize(1472, 981, { fit: "cover" }).webp({ quality: 87 }).toFile(target);
  await sql`UPDATE posts SET cover_url = ${`/art/generated/articles/${article.id}.webp`}, updated_at = now() WHERE id = ${article.id}`;
  console.log(`✓ ${article.title}`);
}

const queue = articles.filter((article) => normalizedPrompts[article.id]);
const missing = articles.filter((article) => !normalizedPrompts[article.id]);
console.log(`generating ${queue.length} covers, ${missing.length} without prompt`);
for (let index = 0; index < queue.length; index += 3) {
  await Promise.all(queue.slice(index, index + 3).map((article) => generate(article, normalizedPrompts[article.id])));
}
await sql.end();
console.log("done");