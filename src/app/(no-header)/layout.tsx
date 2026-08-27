// Layout vacío para páginas sin header ni footer
// El paréntesis en (no-header) es un Route Group de Next.js:
// no afecta la URL pero sí permite tener su propio layout
export default function NoHeaderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
