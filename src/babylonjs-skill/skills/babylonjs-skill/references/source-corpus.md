# Source Corpus

Use this reference when a task needs current or version-sensitive Babylon.js details, exact import paths, or diagnosis of a specific runtime/build error.

## Primary Sources

- Babylon.js documentation: feature guides, setup docs, loaders, WebXR, physics, GUI, materials, and performance guidance.
- Babylon.js TypeDoc: exact class, function, enum, and method signatures.
- Babylon.js changelog and breaking changes: version-specific behavior, fixes, and migration notes.
- Babylon.js official examples and Playground snippets: working feature combinations and scene setup patterns.
- Babylon.js docs repository: source for setup pages, tree-shaking guidance, and documentation changes.
- Babylon.js forum: specific runtime/import/build errors, especially exact error strings and bundler symptoms.
- Babylon.js GitHub issues and pull requests: unresolved bugs, regressions, and details behind changelog entries.

Prefer official docs, TypeDoc, changelog, and examples before forum or GitHub discussion. Use forum/GitHub results mainly for exact error triage, missing import side effects, bundler behavior, or version regressions.

## Search Patterns

- `site:doc.babylonjs.com Babylon.js <feature>`
- `site:doc.babylonjs.com/typedoc <ClassName>`
- `site:doc.babylonjs.com/typedoc <functionName>`
- `site:doc.babylonjs.com WebXR Babylon.js <feature>`
- `site:doc.babylonjs.com Havok PhysicsAggregate Babylon.js`
- `site:forum.babylonjs.com "<exact error message>"`
- `site:forum.babylonjs.com Babylon.js <feature> <bundler or framework>`
- `site:github.com/BabylonJS/Babylon.js CHANGELOG 9.12.0 <feature>`
- `site:github.com/BabylonJS/Babylon.js <exact class or function name>`

## Research Rules

- Check installed package versions first when working inside an existing repo.
- Verify import paths against the installed `@babylonjs/*` package version before emitting final code for deep imports or pure imports.
- Treat TypeDoc signatures and installed type declarations as stronger evidence than old snippets.
- For exact errors, search the full error string before rewriting scene logic.
- For SSR/build issues, inspect the framework and bundler first, then research Babylon.js side-effect registration or browser-only imports.
- When sources disagree, prefer the source that matches the user's installed version and build mode.

