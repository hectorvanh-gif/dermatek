export function SiteFooter() {
  return (
    <footer id="contacto" className="bg-primary text-primary-foreground mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-display text-3xl mb-4">
            Derma<span className="text-accent">Tek</span>
          </h3>
          <p className="text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
            Aparatología estética profesional. Tecnología médica de alta gama para clínicas y profesionales.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-accent mb-5">Catálogo</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li>Láser & Diodo</li>
            <li>HIFU</li>
            <li>Hidrafacial</li>
            <li>EMSzero</li>
            <li>Radiofrecuencia</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-accent mb-5">Contacto</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li>ventas@dermatek.mx</li>
            <li>+52 1 55 6855 2672</li>
            <li>Lun–Vie · 9:00–18:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-primary-foreground/40">
          <span>© {new Date().getFullYear()} DermaTek. Todos los derechos reservados.</span>
          <span className="uppercase tracking-[0.2em]">Aparatología estética profesional</span>
        </div>
      </div>
    </footer>
  );
}