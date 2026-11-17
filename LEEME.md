# GerStream — guía rápida

## Qué hay en esta carpeta
- `index.html` — página de inicio
- `plataformas.html` — catálogo con filtros, buscador y pedido por WhatsApp (queda en `gerstream.com/plataformas`)
- `admin.html` — panel del administrador (agregar, editar, ocultar y borrar productos, subir fotos)
- `tienda.js` — **aquí cambias el WhatsApp, el enlace del grupo y el correo** (arriba, en CONFIG)
- `lib/semilla.js` — catálogo inicial (el de la página anterior). Después de guardar algo en el panel, manda el panel.
- `functions/api/` — el "servidor" que guarda productos y fotos en Cloudflare
- `robots.txt`, `sitemap.xml` — para que Google encuentre la página
- `_redirects` — los enlaces viejos (`/Unidad.html`) llevan a la página nueva

## Publicar en Cloudflare Pages (gratis)
1. Sube **todo el contenido** de esta carpeta a un repositorio de GitHub.
2. En Cloudflare → **Workers y Pages** → **Crear** → **Pages** → **Conectar a Git** → elige el repositorio.
   - Build command: *(vacío)* · Output directory: `/`
3. Crea el almacén de productos: **Workers y Pages → KV → Crear namespace** con el nombre `gerstream-tienda`.
4. En tu proyecto de Pages → **Configuración → Enlaces (Bindings) → Agregar → KV namespace**:
   - Nombre de la variable: `TIENDA` · Namespace: `gerstream-tienda`
5. En **Configuración → Variables y secretos → Agregar**: `ADMIN_PASSWORD` (tipo Secreto) con la contraseña del panel.
6. **Implementaciones → Reintentar implementación** para que tome los cambios.
7. Entra a `tu-dominio/admin.html` con esa contraseña.

## Conectar el dominio gerstream.com
Proyecto de Pages → **Dominios personalizados → Configurar dominio** → escribe `www.gerstream.com` y después `gerstream.com`.
Cloudflare te dice qué registro DNS crear donde compraste el dominio (o lo hace solo si el dominio ya está en Cloudflare).

## Que aparezca en Google
1. Entra a **Google Search Console** (search.google.com/search-console) con tu cuenta de Google.
2. **Agregar propiedad → Dominio** → `gerstream.com`. Google te da un registro TXT: agrégalo en el DNS (en Cloudflare: DNS → Agregar registro → TXT).
3. Cuando esté verificado: **Sitemaps** → escribe `sitemap.xml` → Enviar.
4. **Inspección de URLs** → pega `https://www.gerstream.com/` → **Solicitar indexación**. Repite con `/plataformas`.
5. Google suele tardar de unos días a 2 semanas en mostrarla. Buscar el nombre exacto "GerStream" es lo primero que funciona.
6. Extra que ayuda mucho: crea un **Perfil de Empresa en Google** y pon el enlace de la página en tu Instagram/WhatsApp Business.

## Usar el panel
- **+ Nuevo producto**: nombre, categoría, opciones con precio (ej. "1 pantalla — 15000"), color o foto.
- **Visible en la tienda**: desmárcalo para ocultar algo sin borrarlo (ej. si se agotó).
- **Destacado en el inicio**: aparece en "Los favoritos de esta semana".
- **Orden**: número más bajo = sale primero.
- Las fotos se reducen solas antes de subirse.
