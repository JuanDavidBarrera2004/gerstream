// POST /api/admin → acciones del panel (requiere la contraseña ADMIN_PASSWORD)
// Cuerpo JSON: { clave, accion: "listar" | "guardar" | "eliminar" | "foto", ... }
import { json, leerProductos, guardarProductos, limpiarProducto, claveCorrecta } from "../../lib/comun.js";

const TIPOS = ["image/jpeg", "image/png", "image/webp"];

export async function onRequestPost({ env, request }) {
  if (!env.TIENDA) return json(500, { error: "Falta enlazar el almacén KV llamado TIENDA" });
  if (!env.ADMIN_PASSWORD) return json(500, { error: "Falta configurar ADMIN_PASSWORD en Cloudflare" });

  let datos;
  try { datos = await request.json(); } catch { return json(400, { error: "Solicitud inválida" }); }
  if (!(await claveCorrecta(env, datos.clave))) return json(401, { error: "Contraseña incorrecta" });

  const lista = await leerProductos(env);

  switch (datos.accion) {
    case "listar":
      return json(200, lista);

    case "guardar": {
      const prod = limpiarProducto(datos.producto);
      if (!prod) return json(400, { error: "Revisa el nombre y que tenga al menos una opción con precio" });
      const i = lista.findIndex(p => p.id === prod.id);
      if (i >= 0) lista[i] = prod; else lista.push(prod);
      await guardarProductos(env, lista);
      return json(200, { ok: true, producto: prod });
    }

    case "eliminar": {
      const nueva = lista.filter(p => p.id !== datos.id);
      await guardarProductos(env, nueva);
      return json(200, { ok: true });
    }

    case "foto": {
      // datos.base64 = contenido de la imagen, datos.tipo = image/jpeg|png|webp
      if (!TIPOS.includes(datos.tipo) || typeof datos.base64 !== "string") return json(400, { error: "Formato no permitido" });
      const bin = Uint8Array.from(atob(datos.base64), c => c.charCodeAt(0));
      if (bin.length > 1.5 * 1024 * 1024) return json(400, { error: "La foto es muy pesada (máx. 1,5 MB)" });
      const id = "img-" + crypto.randomUUID().replace(/-/g, "").slice(0, 20);
      await env.TIENDA.put(id, bin, { metadata: { tipo: datos.tipo } });
      return json(200, { url: "/api/imagen?id=" + id });
    }

    default:
      return json(400, { error: "Acción desconocida" });
  }
}
