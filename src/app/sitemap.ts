import { MetadataRoute } from 'next';
import { sql } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://consumaquinayequipos.com';

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/excavadora-zoomlion-ze215g`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
  ];

  // Páginas dinámicas de máquinas
  try {
    const machines = await sql`
      SELECT id, updated_at FROM machines 
      WHERE status = 'published' AND (expires_at > CURRENT_TIMESTAMP OR expires_at IS NULL)
    `;
    const machinePages: MetadataRoute.Sitemap = machines.map((m: any) => ({
      url: `${baseUrl}/maquina/${m.id}`,
      lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
    return [...staticPages, ...machinePages];
  } catch {
    return staticPages;
  }
}
