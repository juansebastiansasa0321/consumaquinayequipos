// Layout especial para la landing de cada máquina:
// SIN header, SIN footer, SIN botón WhatsApp global
// Solo el contenido de la landing page + su propio botón WA
export default function MachineLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
