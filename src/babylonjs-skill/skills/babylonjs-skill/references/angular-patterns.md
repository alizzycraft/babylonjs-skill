# Angular Patterns

Use this reference for Babylon.js 9.12.0 code inside Angular applications.

## Component Shape

Prefer standalone components unless the repo already uses NgModules.

```ts
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  ViewChild,
  inject,
} from "@angular/core";
import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";

@Component({
  selector: "app-babylon-viewer",
  standalone: true,
  template: `<canvas #canvas class="render-canvas"></canvas>`,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .render-canvas { width: 100%; height: 100%; display: block; touch-action: none; }
  `],
})
export class BabylonViewerComponent implements AfterViewInit {
  @ViewChild("canvas", { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private engine?: Engine;
  private scene?: Scene;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const canvas = this.canvasRef.nativeElement;
      const engine = new Engine(canvas, true);
      const scene = new Scene(engine);

      const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 6, Vector3.Zero(), scene);
      camera.attachControl(canvas, true);
      new HemisphericLight("light", new Vector3(0, 1, 0), scene);
      MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);

      const onResize = () => engine.resize();
      window.addEventListener("resize", onResize);
      engine.runRenderLoop(() => scene.render());

      this.engine = engine;
      this.scene = scene;
      this.destroyRef.onDestroy(() => {
        window.removeEventListener("resize", onResize);
        scene.dispose();
        engine.dispose();
      });
    });
  }
}
```

## Lifecycle Rules

- Create `Engine` only after the canvas is available.
- Use `NgZone.runOutsideAngular()` around render-loop setup.
- Re-enter Angular with `zone.run()` only when Babylon events must update Angular state.
- Dispose in `DestroyRef.onDestroy()` or `ngOnDestroy()`.
- Remove window listeners, scene observers, GUI observers, and XR sessions created by the component.
- Use `ResizeObserver` instead of `window.resize` when the canvas is inside resizable panels.

## SSR And Hydration

- Babylon rendering is browser-only. Avoid touching `window`, `document`, canvas, WebGL, or inspector code during server render.
- In SSR projects, initialize with a browser guard such as `isPlatformBrowser`, `afterNextRender`, or a client-only route/component pattern already used by the repo.
- Lazy-load optional tooling such as `@babylonjs/inspector` on the client; do not import it at top level in SSR code.

## Services And Ownership

- Use a service when multiple components share scene creation, asset loading, or engine lifecycle.
- Keep ownership clear: the component that creates the engine should usually dispose it.
- Avoid global singleton engines unless the app intentionally has one long-lived rendering surface.
