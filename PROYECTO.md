# 📋 PROYECTO — Consumaquinayequipos
> Archivo de contexto para retomar el trabajo con el agente IA sin empezar desde cero.
> **Última actualización:** 28 de agosto de 2026

---

## 🌐 URLs importantes

| Recurso | URL |
|---|---|
| Sitio web en producción | https://consumaquinayequipos.vercel.app |
| Repositorio GitHub | https://github.com/juansebastiansasa0321/consumaquinayequipos |
| Panel Admin | https://consumaquinayequipos.vercel.app/admin |
| Dashboard cliente | https://consumaquinayequipos.vercel.app/dashboard |
| Página de login | https://consumaquinayequipos.vercel.app/login |

---

## 🔐 Credenciales de Admin

| Campo | Valor |
|---|---|
| Email | `admin@consumaquina.com` |
| Contraseña | `Sebas0321!` |
| Rol | `admin` |

> ⚠️ El panel `/admin` **no está visible en el menú público**. Se accede solo por URL directa.

---

## 📞 Contacto del negocio

| Campo | Valor |
|---|---|
| WhatsApp / Teléfono | `+57 310 575 3752` (código: `573105753752`) |
| Email | `consumaquinayequipos@icloud.com` |
| Instagram | `@consumaquinayequipos` |
| Facebook | `facebook.com/profile.php?id=61582161870533` |
| Ubicación principal | Cali, Valle del Cauca |
| Cobertura | Chocó, Cauca, Valle del Cauca, toda Colombia |

---

## 🗄️ Base de datos — Neon Postgres

| Campo | Valor |
|---|---|
| Proveedor | Neon (serverless Postgres) |
| Variable de entorno | `POSTGRES_URL` |
| Connection string | `postgresql://neondb_owner:npg_Z3byav2rcgnB@ep-morning-shadow-a41evzje-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require` |

### Tabla `machines` — columnas principales
| Columna | Tipo | Descripción |
|---|---|---|
| `id` | serial PK | ID autoincremental |
| `title` | text | Nombre de la máquina |
| `description` | text | Descripción larga |
| `price` | numeric | Precio |
| `currency` | varchar | `COP` o `USD` |
| `hours` | int | Horas de uso (0 = nuevo) |
| `usage_type` | varchar | `hours` o `km` |
| `location` | text | Ciudad/departamento |
| `tags` | text[] | Etiquetas |
| `images` | text[] | URLs de imágenes (Vercel Blob) |
| `visibility_tier` | varchar | `basico`, `plata`, `oro` |
| `is_featured` | boolean | Aparece en carrusel destacados |
| `is_urgent` | boolean | Badge "Venta Urgente" |
| `display_order` | int | Orden en el catálogo (admin puede reordenar) |
| `status` | varchar | `published`, `draft`, `expired` |
| `expires_at` | timestamp | Fecha de vencimiento de la publicación |
| `contact_phone` | varchar | Teléfono principal |
| `contact_phone_2` | varchar | Teléfono alternativo |
| `contact_email` | varchar | Email de contacto |

### Tabla `users` — columnas principales
| Columna | Descripción |
|---|---|
| `id` | ID autoincremental |
| `name` | Nombre |
| `email` | Email único |
| `password_hash` | bcrypt hash |
| `role` | `admin` o `user` |

---

## 🖼️ Almacenamiento de imágenes — Vercel Blob

- Proveedor: **Vercel Blob**
- Variable de entorno: `BLOB_READ_WRITE_TOKEN`
- API de subida: `POST /api/upload?filename=nombre.jpg`
- Las imágenes se redimensionan automáticamente a máx. 1200px y se guardan con la URL pública de Vercel Blob
- Límite por imagen: **5MB**

---

## 🏗️ Arquitectura del proyecto

```
src/
├── app/
│   ├── page.tsx                        ← Home (catálogo + carousel destacados)
│   ├── layout.tsx                      ← Layout raíz (Header/Footer — se ocultan en /landing)
│   ├── contacto/page.tsx               ← Página de contacto
│   ├── maquina/[id]/
│   │   ├── page.tsx                    ← Detalle de máquina
│   │   └── landing/                    ← ⚠️ CARPETA VACÍA - ver (no-header) abajo
│   ├── (no-header)/                    ← Route group SIN header/footer
│   │   ├── layout.tsx                  ← Layout vacío
│   │   └── maquina/[id]/landing/
│   │       └── page.tsx                ← Landing profesional por máquina (sin nav)
│   ├── admin/page.tsx                  ← Panel admin completo
│   ├── dashboard/page.tsx              ← Dashboard para clientes
│   ├── api/
│   │   ├── machines/route.ts           ← GET (catálogo) / POST (crear)
│   │   ├── machines/[id]/route.ts      ← PUT (editar/featured/order) / DELETE
│   │   ├── admin/machines/route.ts     ← GET admin (todas, ordenadas por display_order)
│   │   ├── upload/route.ts             ← POST subir imagen a Vercel Blob
│   │   └── auth/                       ← login, register, logout
│   └── excavadora-zoomlion-ze215g/     ← Landing SEO estática para la Zoomlion
├── components/
│   ├── layout/
│   │   ├── header.tsx                  ← Solo: Inicio / Catálogo / Contactar (sin login)
│   │   └── footer.tsx                  ← Info empresa, redes, contacto
│   └── ui/
│       ├── featured-carousel.tsx       ← Carrusel de máquinas destacadas (home)
│       ├── catalog-search.tsx          ← Grid de catálogo con búsqueda y filtros
│       ├── machine-gallery.tsx         ← Galería interactiva en detalle de máquina
│       ├── contact-seller-button.tsx   ← Botón WhatsApp principal
│       └── whatsapp-button.tsx         ← Botón flotante de WhatsApp
├── middleware.ts                       ← Auth JWT + header x-pathname para ocultar nav
└── lib/
    └── db.ts                           ← Conexión Neon Postgres con @neondatabase/serverless
```

---

## 🎯 Modelo de negocio — Tiers de publicación

| Tier (DB) | Tier (Form) | Duración | Visible en |
|---|---|---|---|
| `basico` | `free` | 30 días | Solo catálogo |
| `plata` | `featured` | 45 días | Catálogo + carrusel destacados |
| `oro` | `premium` | 60 días | Catálogo + carrusel destacados (badge dorado) |

- Cuando `expires_at` vence, la máquina deja de aparecer en el catálogo automáticamente
- El admin puede renovar desde `/admin` editando la máquina (se resetea a 30/45/60 días)
- **Máquinas actuales renovadas hasta: 27/agosto/2027**

---

## ⭐ Lógica de "Destacados"

Una máquina aparece en el carrusel de **Máquinas Destacadas** si:
- `is_featured = true` (activado con la estrella ⭐ en el admin), O
- `visibility_tier = 'oro'`

La estrella en el admin hace **toggle real** (activa/desactiva). Al activar una, las demás se desactivan (solo 1 featured a la vez por estrella, pero pueden coexistir múltiples por tier oro).

---

## 🔍 SEO — Enfoque principal

La máquina prioritaria para vender es:
> **Excavadora Zoomlion ZE215E — 21 Toneladas — Cali, Valle del Cauca**

- Keywords: `excavadora 21 toneladas Cali`, `Zoomlion ZE215E Colombia`, `maquinaria pesada Cali`, `excavadora Valle del Cauca`
- Landing SEO estática: `/excavadora-zoomlion-ze215g`
- Landing dinámica (sin menú): `/maquina/4/landing`
- La página home tiene metadata enfocada en esta máquina

---

## 🔧 Funcionalidades del Admin (`/admin`)

- **Tab Resumen**: métricas generales
- **Tab Catálogo**: lista de máquinas con:
  - Flechas ↑↓ para reordenar (afecta `display_order`)
  - ⭐ Estrella para marcar/desmarcar destacada
  - ✏️ Editar máquina (abre formulario arriba)
  - 🗑️ Eliminar
  - 🔗 Ver landing pública de esa máquina
- **Tab Usuarios**: gestión de usuarios registrados

---

## 🧩 Funcionalidades del Dashboard (`/dashboard`)

Para **clientes** (rol `user`):
- Ver sus propias máquinas publicadas
- Subir nuevas máquinas

> ℹ️ El dashboard está **oculto del menú público** — solo accesible por URL directa o cuando el cliente está logueado.

---

## 📱 Diseño — Decisiones tomadas

- **Cards de máquinas**: idénticas en catálogo y carrusel destacados (mobile: `85vw / max 320px`, imagen `aspect-[4/3]`)
- **Badge NUEVO**: verde (`bg-emerald-500`) cuando `hours === 0`
- **Badge USADO**: slate oscuro con 🔧 + horas/km cuando `hours > 0`
- **Landing por máquina**: sin header, sin footer, sin menú, sin similares — solo info + botón WhatsApp
- **Menú público**: Solo `Inicio`, `Catálogo`, `Contactar` — sin login ni publicar

---

## 📝 Conversación de referencia

ID de conversación original con todo el historial:
```
62b0eaed-f3fb-4055-a74b-a956f96dcc34
```

Puedes decirle al agente: *"Lee el PROYECTO.md y retoma desde ahí"*

---

## 🚀 Comandos útiles

```bash
# Desarrollo local
npm run dev

# Ver el log de BD en producción (script temporal)
node -e "import('@neondatabase/serverless').then(({neon})=>{...})"

# Deploy (automático al hacer push a main)
git add . && git commit -m "descripción" && git push
```
