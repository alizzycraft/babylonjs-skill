---
name: babylonjs-skill
description: Generate, debug, optimize, and migrate Babylon.js 9.12.0 web app code. Use for Babylon.js, @babylonjs/core, glTF/GLB loading, WebXR, PBR, Havok physics, GUI, pure imports, tree-shaking, SSR/client lifecycle issues, or converting Three.js code to Babylon.js. Do not use for Three.js-only work unless migrating.
---

# Babylon.js Skill

Use this skill to produce Babylon.js 9.12.0 code for web applications and framework integrations. Default to TypeScript, standard ESM imports, and client-only rendering unless the target stack requires a different shape.

## Defaults

- Assume Babylon.js 9.12.0 unless the user asks for another version.
- Prefer official Babylon.js docs, TypeDoc, changelog, breaking-changes notes, and official examples before community answers.
- Read `references/source-corpus.md` when the task needs research, version-sensitive APIs, unfamiliar features, exact import paths, or diagnosis of specific runtime/build errors.
- Default to TypeScript for application code, not plain HTML snippets, unless the user asks for a standalone demo or repro.
- Prefer standard imports from `@babylonjs/core` for normal application code.
- Use `@babylonjs/core/pure` only when the user asks for aggressive tree-shaking, bundle reduction, or pure imports.
- Use CDN/global `BABYLON` snippets only for Playground-like demos, quick repros, or non-framework prototypes.
- Generate Babylon-native solutions; do not mirror Three.js architecture unless explaining a migration.

## Workflow

1. Identify the task type: create feature, integrate with a framework or library, debug runtime/build issue, optimize, or migrate from Three.js.
2. Identify the target stack before writing code:
   - Check whether the project uses Angular, React, Vue, Svelte, vanilla TypeScript/JavaScript, or another framework/library.
   - Inspect local project files such as `package.json`, framework config, router/build config, existing components, and asset configuration when available.
   - Note the framework version, build tool, SSR/hydration mode, and existing lifecycle patterns.
   - If no framework is present, proceed with a framework-neutral browser/TypeScript implementation.
3. Select the relevant reference:
   - Use a framework-specific reference when one exists for the detected or requested stack.
   - If no matching reference exists, use general Babylon.js guidance and adapt to the stack's documented lifecycle, asset, and cleanup patterns.
4. Identify runtime constraints: browser-only execution, SSR/hydration, Vite/esbuild/Webpack builder, asset paths, and whether code belongs in a component, directive, hook, service, module, or plain script.
5. Select import mode:
   - Standard ESM for most application code.
   - Pure imports for bundle-sensitive apps.
   - CDN only for demos, playgrounds, or quick repros.
6. Emit code with explicit lifecycle handling:
   - Create the engine after the canvas exists.
   - Run Babylon setup outside framework reactivity/change detection when appropriate.
   - Resize on window resize or `ResizeObserver`.
   - Dispose scenes, engines, observers, and listeners in the target framework's cleanup hook or teardown path.
7. Add version/import notes when the task touches loaders, physics, post-processing, WebXR, Atmosphere, right-handed scenes, CSG2, skinning, or side-effect errors.
8. Provide validation steps: build command, browser check, expected visual result, and targeted debugging checks.

## Framework References

Choose references based on the user's target stack after inspecting the project when files are available. If a framework-specific reference does not exist yet, use the general Babylon.js guidance and keep the integration idiomatic for that stack.

Current references:

- Read `references/source-corpus.md` when researching official docs, TypeDoc, changelogs, examples, forum errors, or GitHub issues.
- Read `references/angular-patterns.md` when generating or reviewing Angular components, services, directives, SSR-safe code, or lifecycle cleanup.

Framework-neutral integration guidance:

- Create the Babylon engine only after the canvas element exists.
- Keep Babylon's imperative scene code isolated from framework state unless interactions must update UI state.
- Use the framework's client-only lifecycle hook for initialization.
- Use the framework's cleanup/disposal hook for scenes, engines, observers, and listeners.
- Guard browser-only imports or inspector/debug tooling in SSR projects.

## Imports, Loaders, And Assets

Read `references/imports-loaders-assets.md` for import styles, pure imports, glTF/GLB loading, side-effect registration, Havok physics, GUI, and asset-path rules.

Core guidance:

- Standard imports are the application default:

```ts
import { Engine, Scene, ArcRotateCamera, Vector3 } from "@babylonjs/core";
```

- Register loaders explicitly when using glTF/GLB:

```ts
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";

registerBuiltInLoaders();
```

- Put static models/textures under the app's public/static assets output, then load with app-relative URLs such as `/models/robot.glb`.
- Do not invent loader APIs. If uncertain, consult official docs or TypeDoc before emitting code.

## Migration And Debugging

Read `references/migration-debugging.md` when translating from Three.js, diagnosing runtime errors, optimizing, or handling version-sensitive Babylon.js 9.12.0 behavior.

Core translation rules:

- `OrbitControls` -> `ArcRotateCamera`
- `PerspectiveCamera` plus custom FPS controls -> `UniversalCamera` or `FreeCamera`
- `Object3D`/`Group` container -> `TransformNode`
- `GLTFLoader` -> Babylon loader functions plus loader registration
- `Raycaster` -> `scene.pick` or `scene.pickWithRay`
- `EffectComposer` -> Babylon rendering pipelines or post-process chains
- `MeshStandardMaterial` -> `PBRMaterial` plus `environmentTexture` or default environment
- Repeated meshes -> instances or thin instances
- WebXR manager -> `scene.createDefaultXRExperienceAsync`

## Output Contract

For non-trivial work, structure the answer as:

1. Summary
2. Babylon.js 9.12.0 / stack assumptions
3. Code or patch
4. Import, asset, and lifecycle notes
5. Validation steps
6. Migration mapping table, when translating from Three.js

Keep answers concise, but include complete imports and cleanup code when emitting framework examples.
