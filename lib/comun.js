// Utilidades compartidas por las funciones de Cloudflare Pages.
// Usa el almacén KV enlazado con el nombre TIENDA (ver LEEME.md).
import { SEMILLA, CATEGORIAS } from "./semilla.js";

export const json = (status, body, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra },
  });

export async function leerProductos(env) {
  const guardados = await env.TIENDA.get("productos", { type: "json" });
  return Array.isArray(guardados) ? guardados : SEMILLA;
}
export async function guardarProductos(env, lista) {
  await env.TIENDA.put("productos", JSON.stringify(lista));
}

const txt = (v, max) => String(v ?? "").trim().slice(0, max);
const num = v => Math.max(0, Math.min(100000000, parseInt(String(v ?? "").replace(/[^\d]/g, ""), 10) || 0));

export function limpiarProducto(p) {
  if (!p || typeof p !== "object") return null;
  const id = txt(p.id, 60).toLowerCase().replace(/[^a-z0-9-]/g, "");
  const nombre = txt(p.nombre, 120);
  if (!id || !nombre) return null;
  const categoria = CATEGORIAS.find(c => c.toLowerCase() === txt(p.categoria, 30).toLowerCase()) || "Otros";
  const opciones = (Array.isArray(p.opciones) ? p.opciones : [])
    .map(o => ({ nombre: txt(o?.nombre, 60), precio: num(o?.precio) }))
    .filter(o => o.nombre && o.precio > 0)
    .slice(0, 12);
  if (!opciones.length) return null;
  const imagen = txt(p.imagen, 300);
  const color = /^#[0-9a-f]{6}$/i.test(txt(p.color, 7)) ? txt(p.color, 7) : "#45b83c";
  return {
    id, nombre, categoria,
    descripcion: txt(p.descripcion, 300),
    opciones, color,
    imagen: /^(https:\/\/|\/api\/imagen\?id=)/.test(imagen) ? imagen : "",
    etiqueta: txt(p.etiqueta, 24),
    destacado: p.destacado === true,
    activo: p.activo !== false,
    orden: Math.min(9999, num(p.orden) || 100),
  };
}

/* ---------- contraseña del administrador ---------- */
const enc = new TextEncoder();
async function hmac(clave, texto) {
  const k = await crypto.subtle.importKey("raw", enc.encode(clave), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(texto)));
}
export async function claveCorrecta(env, intento) {
  const real = env.ADMIN_PASSWORD || "";
  if (!real || typeof intento !== "string") return false;
  // Comparación de tiempo constante usando HMAC de ambos valores
  const a = await hmac("gerstream", real), b = await hmac("gerstream", intento);
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a[i] ^ b[i];
  return dif === 0;
}
