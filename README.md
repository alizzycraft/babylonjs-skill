# Babylon.js Skill

Codex plugin for generating, debugging, optimizing, and migrating Babylon.js 9.12.0 web app code.

## Layout

This repository currently uses the Codex plugin layout:

```txt
src/babylonjs-skill/
  .codex-plugin/plugin.json
  skills/babylonjs-skill/SKILL.md
  skills/babylonjs-skill/references/
```

That means the skill is intended to be discovered through the plugin at `src/babylonjs-skill`, not by simply checking this repository out as a local skill folder.

For repo-local skill discovery instead, the skill contents would need to live under a scanned skill directory such as:

```txt
.agents/skills/babylonjs-skill/SKILL.md
.agents/skills/babylonjs-skill/references/
.agents/skills/babylonjs-skill/agents/openai.yaml
```

Avoid maintaining both layouts manually. The `.agents` directory is ignored in `.gitignore` to prevent duplicate files in the repository. You can run the sync script to automatically sync from the plugin directory to the local agent skills directory for local development testing:

```bash
node scripts/sync-skills.js
```

## Usage

Install or enable the plugin from `src/babylonjs-skill` using the Codex plugin flow. For local development, run Codex from the repository root and explicitly invoke the skill/plugin when testing prompts.

Example prompts:

- Use Babylon.js Skill to create a Vite TypeScript scene.
- Use Babylon.js Skill to diagnose this GLB loader error.
- Use Babylon.js Skill to migrate this Three.js snippet.

## License

AGPL-3.0-only. See `LICENSE`.

