# Imports, Loaders, And Assets

Use this reference for Babylon.js 9.12.0 imports, loader registration, assets, GUI, physics, and pure imports.

## Import Mode Selection

Standard ESM imports are the default for application code:

```ts
import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";
```

Use pure imports only when bundle size/tree-shaking is a user requirement:

```ts
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  CreateSphere,
  RegisterStandardEngineExtensions,
  Vector3,
} from "@babylonjs/core/pure";

RegisterStandardEngineExtensions();
```

Use CDN/global `BABYLON` only for quick non-framework repros or Playground-style snippets.

## glTF And GLB Loading

Register loaders explicitly in application code:

```ts
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";

registerBuiltInLoaders();

const result = await ImportMeshAsync("/models/robot.glb", scene);
```

Rules:

- Prefer module-level loader functions such as `ImportMeshAsync`, `LoadAssetContainerAsync`, or `AppendSceneAsync`.
- Use `registerBuiltInLoaders()` for common loader coverage.
- Call `registerBuiltInLoaders()` once at module/app setup level when possible. In small examples it may appear near the load call for clarity, but avoid repeated registration in hot paths or frequently recreated components.
- For stricter bundle control, import only the specific loader package/module required by the app.
- If loader errors appear only in production, suspect tree-shaking or missing registration before rewriting scene logic.

## Asset Paths

- Put static assets under the app's public/static assets output. In modern Angular projects, this is usually `public/`; in other frameworks, use the equivalent public directory or configured assets folder.
- Load public assets with absolute app paths: `/models/file.glb`, `/textures/env.env`.
- Do not rely on source-relative paths from component files at runtime.
- For deployed apps under a non-root base href, respect the repo's existing asset URL helper if one exists.

## GUI

Use `@babylonjs/gui`:

```ts
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui";
```

Dispose GUI textures and remove observers when they are component-owned.

## Physics With Havok

Use `@babylonjs/havok` and Babylon physics classes:

```ts
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { Vector3 } from "@babylonjs/core";
import "@babylonjs/core/Physics/physicsEngineComponent";
import HavokPhysics from "@babylonjs/havok";

const havok = await HavokPhysics();
scene.enablePhysics(new Vector3(0, -9.81, 0), new HavokPlugin(true, havok));
```

- `HavokPlugin` is not a top-level `@babylonjs/core` export; it must be imported from `@babylonjs/core/Physics/v2/Plugins/havokPlugin`. It is excluded from the barrel because it depends on the external `@babylonjs/havok` WASM module.
- `PhysicsAggregate` and `PhysicsShapeType` are available as top-level `@babylonjs/core` exports, but deep imports are preferred for tree-shaking.
- Import `@babylonjs/core/Physics/physicsEngineComponent` as a side effect to enable physics on `Scene`.
- Verify deep physics import paths against the installed `@babylonjs/core` version before emitting final code.
- For older code or compatibility support, avoid reusing mutable aggregate options objects across many `PhysicsAggregate` instances.

## Common Registration Symptoms

- `AudioSceneComponent needs to be imported before...`: missing side-effect registration under tree-shaken imports.
- `DefaultCollisionCoordinator needs to be imported before...`: collision component not registered.
- Loader/plugin not found for GLB/glTF: loader registration missing.
- Inspector causes `window is not defined`: top-level browser-only import in SSR.

Fix the registration or SSR boundary first; do not treat these as mesh/material bugs.
