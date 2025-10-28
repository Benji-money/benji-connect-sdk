// Wrap emitter in a generic typed emitter
export class TypedEmitter<EvMap extends Record<string, any>> {
  private target = new EventTarget();

  on<K extends keyof EvMap & string>(type: K, handler: (detail: EvMap[K]) => void) {
    const listener = ((e: Event) => handler((e as CustomEvent).detail)) as EventListener;
    this.target.addEventListener(type, listener);
    return () => this.target.removeEventListener(type, listener);
  }

  once<K extends keyof EvMap & string>(type: K, handler: (detail: EvMap[K]) => void) {
    const listener = ((e: Event) => handler((e as CustomEvent).detail)) as EventListener;
    this.target.addEventListener(type, listener, { once: true });
  }

  off<K extends keyof EvMap & string>(type: K, handler: (detail: EvMap[K]) => void) {
    // Note: to use .off, call .on first and keep the returned disposer, which is more reliable.
    // This method is provided for symmetry; you can manage your own listener reference if needed.
    // Consumers should prefer the disposer returned by .on().
    // (Left intentionally minimal; EventTarget needs the exact same function reference.)
  }

  emit<K extends keyof EvMap & string>(type: K, detail: EvMap[K]) {
    this.target.dispatchEvent(new CustomEvent(type, { detail }));
  }
}