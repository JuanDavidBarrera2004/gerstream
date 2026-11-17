// GET /api/productos → lista pública de productos activos
import { json, leerProductos } from "../../lib/comun.js";

export async function onRequestGet({ env }) {
  if (!env.TIENDA) return json(500, { error: "Falta enlazar el almacén KV llamado TIENDA" });
  const lista = (await leerProductos(env)).filter(p => p.activo !== false);
  return json(200, lista, { "Cache-Control": "public, max-age=30" });
}
