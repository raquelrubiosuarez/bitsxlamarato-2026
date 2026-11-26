// Patró de rajola geomètric. Només es fa servir aquí, a la capçalera.
function Patro() {
  return (
    <svg className="patro" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="rajola-sant-pau" width="48" height="48" patternUnits="userSpaceOnUse">
          <rect width="48" height="48" fill="#F5F0E6" />
          <rect x="0.5" y="0.5" width="47" height="47" fill="none" stroke="#1F1D1A" strokeWidth="1" />
          <path d="M0 0 H12 A12 12 0 0 1 0 12 Z M48 0 V12 A12 12 0 0 1 36 0 Z M48 48 H36 A12 12 0 0 1 48 36 Z M0 48 V36 A12 12 0 0 1 12 48 Z" fill="#B5462F" />
          <path d="M24 8 L40 24 L24 40 L8 24 Z" fill="#D98C8C" />
          <path d="M24 14 L34 24 L24 34 L14 24 Z" fill="none" stroke="#F5F0E6" strokeWidth="2" />
          <rect x="21" y="21" width="6" height="6" fill="#2B5C8A" />
          <path d="M24 0 V6 M24 42 V48 M0 24 H6 M42 24 H48" stroke="#2F6F5E" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#rajola-sant-pau)" />
    </svg>
  );
}

export default function Capcalera({ children }) {
  return (
    <header className="capcalera">
      <Patro />
      <div className="capcalera-cos">
        <div>
          <h1>Rutes Sant Pau</h1>
          <p>Planificació de visites per a estudis clínics de memòria</p>
        </div>
        {children}
      </div>
    </header>
  );
}
