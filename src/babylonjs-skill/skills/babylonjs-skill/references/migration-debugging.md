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

## External Image Orientation

Treat DOM/canvas-to-Babylon orientation as a rendering-boundary problem, not as a generic world-coordinate conversion.

- DOM and canvas image data commonly use a top-left origin.
- Babylon plane sampling may require `V -> 1 - V`.
- `Texture.invertY` controls texture loading or upload behavior. It does not retroactively transform pixel data in an externally wrapped `GPUTexture`.
- For `StandardMaterial`, `PBRMaterial`, and other shaders that consume Babylon's texture matrix, normalize vertical sampling at the texture adapter boundary:

```ts
texture.vScale = -1;
texture.vOffset = 1;
```

- Custom `ShaderMaterial` code must apply `texture.getTextureMatrix()` or perform the equivalent UV transformation itself.
- Do not compensate for texture orientation by moving the camera, changing handedness, or applying negative mesh/world scaling.
- Viewing a textured plane from behind produces a genuine horizontal reflection from the viewer's perspective.
- `backFaceCulling = false` can conceal an incorrect camera/face relationship by allowing the mirrored back face to render.

Establish canonical scene transforms, handedness, and front-face orientation first. Normalize external image orientation once at the texture adapter boundary.

Use an asymmetric corner test image to distinguish flips and rotations:

```text
TL red    TR green
BL blue   BR yellow
```

| Observed output | Likely cause |
|---|---|
| Top/bottom swapped | Texture-origin mismatch or V inversion |
| Left/right swapped | Back-face viewing or U inversion |
| Both swapped | 180-degree rotation or both UV axes inverted |
| Raw GPU texture correct, rendered output wrong | Babylon sampling, UV, material, or mesh boundary |
| Raw GPU texture already wrong | Capture, copy, upload, or readback boundary |

Treat these as diagnostic leads, not proof. GPU readback also has an orientation convention, so "raw texture correct" is meaningful only after interpreting rows with a known origin.

During diagnosis, compute the world-space relationship explicitly:

```ts
const planeFrontNormal = Vector3.TransformNormal(
  new Vector3(0, 0, -1),
  plane.getWorldMatrix(),
).normalize();

const planeToCamera = camera.globalPosition
  .subtract(plane.getAbsolutePosition())
  .normalize();

const frontFacingDot = Vector3.Dot(planeFrontNormal, planeToCamera);
```

With `planeToCamera` defined from the plane toward the camera, a positive value means the camera is on the intended front side. Babylon's default plane front normal is local `-Z`; do not assume `plane.forward` is the front normal. If the plane was created with `BACKSIDE`, uses custom geometry, or has unusual transforms, derive the normal from its actual geometry and side orientation.

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
7. For flipped DOM, canvas, video, or external GPU textures, isolate capture orientation, texture sampling, and plane face orientation before changing world transforms.

For performance:

- Prefer thin instances for very large repeated static props.
- Use regular instances when per-instance behavior is needed.
- Avoid expensive post-processing pipelines unless they are visually required.
- Freeze world matrices/materials where appropriate.
- Use lower texture sizes and compressed textures for production scenes.
- Profile draw calls, active meshes, shader compile stalls, and asset load timing before making large rewrites.

## Validation Prompts

For validation checks after modifying the skill, refer to `tests/prompt-regressions.md`.
