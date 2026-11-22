import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { LiquidGlassService, MATERIAL_PRESETS } from './core/liquid-glass.service';

describe('App & LiquidGlassService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the Liquid Glass application', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the main Spanish Liquid Glass heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Cristal Líquido');
  });

  it('should adapt theme luminance when switching to the Alpine light scene', () => {
    const service = TestBed.inject(LiquidGlassService);
    expect(service.isLightScene()).toBe(false);

    service.scene.set('alpine');
    expect(service.isLightScene()).toBe(true);
    expect(service.cssVariables()['--lg-shadow-alpha']).toBe('0.18');
  });

  it('should apply material presets and update generated CSS code', () => {
    const service = TestBed.inject(LiquidGlassService);
    const prismatic = MATERIAL_PRESETS.find((p) => p.id === 'prismatic-lens')!;
    service.applyPreset(prismatic);

    expect(service.refraction()).toBe(96);
    expect(service.chromatic()).toBe(92);
    expect(service.generatedCssCode()).toContain('blur(6px)');
    expect(service.generatedCssCode()).toContain('saturate(235%)');
  });

  it('should activate the alternative Taxi Nocturno theme and Taxi Amber preset', async () => {
    const service = TestBed.inject(LiquidGlassService);
    const fixture = TestBed.createComponent(App);

    service.scene.set('taxi-night');
    const taxiPreset = MATERIAL_PRESETS.find((p) => p.id === 'taxi-amber')!;
    service.applyPreset(taxiPreset);
    await fixture.whenStable();

    expect(service.isTaxiScene()).toBe(true);
    expect(service.tintPreset()).toBe('amber-taxi');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('4829 LMG');
  });
});
