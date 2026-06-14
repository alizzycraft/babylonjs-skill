# Prompt Regressions

Use these prompts as a review checklist after changing the skill.

Every answer should include:

- Assumptions
- Code or patch
- Import/runtime notes
- Validation steps

## Framework Detection

Prompt:
Add a Babylon.js viewer to this app.

Expected:
- Inspects project files such as `package.json` and framework config before choosing an integration pattern.
- States the detected framework or that no framework was found.
- Uses a framework-specific reference only when it matches the detected/requested stack.
- Creates the engine after the canvas exists.
- Includes cleanup and resize handling.

## Angular PBR Sphere

Prompt:
Create an Angular standalone Babylon.js 9.12.0 PBR sphere.

Expected:
- Uses `references/angular-patterns.md`.
- Uses `ArcRotateCamera`.
- Creates `Engine` after the canvas exists.
- Uses `NgZone.runOutsideAngular`.
- Disposes scene and engine.
- Includes resize handling.
- Does not use Three.js imports.

## Angular SSR Viewer

Prompt:
Create an Angular SSR-safe Babylon.js viewer component.

Expected:
- Uses a browser/client-only guard such as `isPlatformBrowser`, `afterNextRender`, or the repo's existing client-only pattern.
- Avoids top-level inspector or browser-only side-effect imports.
- Does not touch `window`, `document`, canvas, or WebGL during server render.
- Disposes scene, engine, observers, and listeners.

## GLB Loading

Prompt:
Load a GLB model from `/models/robot.glb`.

Expected:
- Uses Babylon loader APIs such as `ImportMeshAsync`, `LoadAssetContainerAsync`, or `AppendSceneAsync`.
- Registers loaders with `registerBuiltInLoaders()` or a specific loader import.
- Calls loader registration once at app/module setup when possible.
- Uses public app asset URLs, not source-relative component paths.

## Three.js Migration

Prompt:
Translate a Three.js `OrbitControls` plus `GLTFLoader` snippet to Babylon.js.

Expected:
- Maps `OrbitControls` to `ArcRotateCamera`.
- Maps `GLTFLoader` to Babylon loader functions plus loader registration.
- Translates intent instead of mirroring Three.js architecture.
- Does not import Three.js in the Babylon.js output.

## Production Import Error

Prompt:
Diagnose `AudioSceneComponent needs to be imported before...` in a production build.

Expected:
- Treats it as a likely side-effect registration/tree-shaking issue.
- Checks import mode and bundler behavior before rewriting scene logic.
- Searches the exact error if local context is insufficient.

## Havok Physics

Prompt:
Add Havok physics with a dynamic box.

Expected:
- Uses `@babylonjs/havok`.
- Imports `HavokPlugin` from `@babylonjs/core/Physics/v2/Plugins/havokPlugin`, not from top-level `@babylonjs/core`.
- Imports the `@babylonjs/core/Physics/physicsEngineComponent` side effect.
- Verifies deep imports against the installed `@babylonjs/core` version before using them.
- Enables physics before creating physics aggregates.

## Pure Imports

Prompt:
Create the smallest bundle-conscious Babylon.js 9.12.0 scene using pure imports.

Expected:
- Uses `@babylonjs/core/pure`.
- Calls required registration functions.
- Does not accidentally rely on side-effect-heavy imports.
- Explains when pure imports are worth the extra ceremony.

## Unknown Feature Research

Prompt:
Use Babylon.js 9.12.0 Atmosphere in a scene.

Expected:
- Reads `references/source-corpus.md`.
- Checks official docs or TypeDoc for the import path.
- Uses the 9.12.0-aware import guidance.
- Mentions support/compatibility caveats only when relevant.
