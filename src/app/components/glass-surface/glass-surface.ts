import { Component, computed, inject, input, signal } from '@angular/core';
import { LiquidGlassService } from '../../core/liquid-glass.service';

@Component({
  selector: 'lg-surface',
  standalone: true,
  template: `
    <div
      class="lg-surface"
      [class.lg-surface--interactive]="interactive()"
      [class]="hostClass()"
      [style.--lg-mx.%]="pointerX()"
      [style.--lg-my.%]="pointerY()"
      [style.--lg-glint-opacity]="pointerActive() ? 1 : 0"
      [style.--lg-radius]="customRadius() ?? null"
      (pointermove)="onPointerMove($event)"
      (pointerleave)="onPointerLeave()"
    >
      <div class="lg-backdrop-base"></div>
      @if (refractionActive()) {
        <div class="lg-backdrop-refract"></div>
      }
      <div class="lg-tint-layer"></div>
      <div class="lg-fresnel-rim"></div>
      @if (glass.chromatic() > 0) {
        <div class="lg-chromatic-rim"></div>
      }
      <div class="lg-specular-glint"></div>
      <div class="lg-top-sheen"></div>

      <div class="lg-content" [class]="contentClass()">
        <ng-content />
      </div>
    </div>
  `,
})
export class GlassSurfaceComponent {
  protected readonly glass = inject(LiquidGlassService);

  readonly interactive = input<boolean>(false);
  readonly useRefraction = input<boolean>(true);
  readonly customRadius = input<string | null>(null);
  readonly hostClass = input<string>('');
  readonly contentClass = input<string>('p-6');

  protected readonly pointerX = signal<number>(50);
  protected readonly pointerY = signal<number>(30);
  protected readonly pointerActive = signal<boolean>(false);

  protected readonly refractionActive = computed(
    () =>
      this.useRefraction() &&
      this.glass.svgRefractionEnabled() &&
      this.glass.surfaceDisplacementScale() > 0,
  );

  protected onPointerMove(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    this.pointerX.set(((event.clientX - rect.left) / rect.width) * 100);
    this.pointerY.set(((event.clientY - rect.top) / rect.height) * 100);
    this.pointerActive.set(true);
  }

  protected onPointerLeave(): void {
    this.pointerActive.set(false);
  }
}
