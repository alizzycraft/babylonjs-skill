# Migration And Debugging

Use this reference for Three.js migration, Babylon.js runtime debugging, and Babylon.js 9.12.0 version-sensitive behavior.

## Three.js To Babylon.js Mapping

Translate intent, not class names.

| User intent | Common Three.js approach | Babylon.js approach |
|---|---|---|
| Render loop | `WebGLRenderer.render(scene, camera)` | `Engine` + `Scene` + `engine.runRenderLoop(() => scene.render())` |
| Orbiting model viewer | `PerspectiveCamera` + `OrbitControls` | `ArcRotateCamera` |
| First-person camera | Pointer lock/custom controls | `UniversalCamera` or `FreeCamera` |
| Empty grouping node | `Object3D` / `Group` | `TransformNode` |
| PBR material | `MeshStandardMaterial` | `PBRMaterial` |
| Environment lighting | PMREM/environment setup | `scene.environmentTexture` or `scene.createDefaultEnvironment()` |
| glTF loading | `GLTFLoader` | `ImportMeshAsync`, `LoadAssetContainerAsync`, or `AppendSceneAsync` plus loader registration |
| Picking | `Raycaster` | `scene.pick` or `scene.pickWithRay` |
| Post-processing | `EffectComposer` and passes | `DefaultRenderingPipeline`, other Babylon pipelines, or post-process chains |
| Repeated props | `InstancedMesh` | Instances or thin instances |
| XR | `renderer.xr` / WebXR manager | `scene.createDefaultXRExperienceAsync` |

Call out coordinate and scene graph differences:

- Babylon defaults to a left-handed, Y-up world.
- Babylon supports `scene.useRightHandedSystem`, but glTF loading and handedness need deliberate handling.
- Use `TransformNode` for non-renderable grouping instead of empty meshes.

## Babylon.js 9.12.0 Notes

Surface these only when relevant:

- Atmosphere: prefer `import { Atmosphere } from "@babylonjs/addons/atmosphere"` and include support checks where needed.
- CSG2: if right-handed scenes or glTF assets break with boolean operations, note that 9.12.0 fixed right-handed CSG2 behavior.
- PhysicsAggregate: 9.12.0 fixed options mutation behavior; clone options defensively when supporting older versions.
- NME/post-process/smart-filter shader 404s: recommend 9.12.0 or later when diagnosing older projects.
- Rendering pipeline side effects: be precise about import/registration instead of relying on stale broad side-effect assumptions.
- Bone uniform budget: for heavy skinned meshes, reduce bones per draw, split meshes, or heed engine warnings.
- HALF_FLOAT vertex buffers and SSAO2 world-space normals matter for advanced rendering cases.

## Debugging Triage

For runtime errors:

1. Read the exact error message and stack.
2. Check whether the failing feature requires an import side effect or explicit registration.
3. Check whether code is running during SSR or before the canvas exists.
4. Check asset URLs in the browser network panel.
5. Check disposal if the bug appears after route changes or component remounts.
6. Check version-specific fixes if the issue involves CSG2, post-process shaders, physics aggregates, or skinning.

For performance:

- Prefer thin instances for very large repeated static props.
- Use regular instances when per-instance behavior is needed.
- Avoid expensive post-processing pipelines unless they are visually required.
- Freeze world matrices/materials where appropriate.
- Use lower texture sizes and compressed textures for production scenes.
- Profile draw calls, active meshes, shader compile stalls, and asset load timing before making large rewrites.

## Validation Prompts

For validation checks after modifying the skill, refer to `tests/prompt-regressions.md`.
