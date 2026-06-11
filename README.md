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

Avoid maintaining both layouts manually unless there is a sync step, because duplicated skill files can drift.

## License

AGPL-3.0-only. See `LICENSE`.

