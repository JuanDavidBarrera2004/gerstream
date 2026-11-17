// GerStream — lógica de la tienda
import { SEMILLA } from "./lib/semilla.js";

/* ===== CONFIGURACIÓN: cambia aquí tus datos ===== */
export const CONFIG = {
  whatsapp: "573228540542",            // número con indicativo, sin + ni espacios
  grupoWhatsapp: "https://chat.whatsapp.com/HhNa6IJE7fNJL8BjzCPpn3",                   // pega aquí el enlace de invitación a tu grupo (si lo dejas vacío, el botón no aparece)
  correo: "info@gerstream.com",
  productosApi: "/api/productos",
};
/* ================================================ */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
export const pesos = n => "$" + Number(n || 0).toLocaleString("es-CO");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const waUrl = txt => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`;

/* ---------- productos ---------- */
export async function cargarProductos() {
  let lista = null;
  try {
    const r = await fetch(CONFIG.productosApi, { headers: { Accept: "application/json" } });
    if (r.ok && (r.headers.get("content-type") || "").includes("json")) lista = await r.json();
  } catch { /* vista previa sin servidor */ }
  if (!Array.isArray(lista)) lista = SEMILLA;
  return lista.filter(p => p.activo !== false).sort((a, b) => (a.orden ?? 100) - (b.orden ?? 100));
}

function portada(p) {
  if (p.imagen) return `background-image:url('${esc(p.imagen)}')`;
  const c = /^#[0-9a-f]{6}$/i.test(p.color) ? p.color : "#45b83c";
  return `background:radial-gradient(circle at 85% 15%,#ffffff30,transparent 45%),linear-gradient(135deg,${c},${c}88 55%,#151520)`;
}

export function tarjeta(p) {
  const op = p.opciones || [];
  return `<article class="prod rev" data-id="${esc(p.id)}">
    <div class="prod-portada" style="${portada(p)}">
      ${p.etiqueta ? `<span class="tag">${esc(p.etiqueta)}</span>` : ""}
      <h3>${esc(p.nombre)}</h3>
    </div>
    <div class="prod-cuerpo">
      ${p.descripcion ? `<p>${esc(p.descripcion)}</p>` : ""}
      ${op.length > 1 ? `<div class="opciones" role="radiogroup" aria-label="Opciones">${op.map((o, i) =>
        `<button class="opcion${i ? "" : " sel"}" data-i="${i}" role="radio" aria-checked="${!i}">${esc(o.nombre)}</button>`).join("")}</div>` : ""}
      <div class="prod-pie">
        <div class="precio">${pesos(op[0]?.precio)}<small>${esc(op[0]?.nombre || "")}</small></div>
        <button class="btn-add" data-add>Agregar</button>
      </div>
    </div>
  </article>`;
}

export function activarTarjetas(cont, lista) {
  cont.addEventListener("click", e => {
    const card = e.target.closest(".prod"); if (!card) return;
    const p = lista.find(x => x.id === card.dataset.id); if (!p) return;
    const op = e.target.closest(".opcion");
    if (op) {
      $$(".opcion", card).forEach(b => { b.classList.toggle("sel", b === op); b.setAttribute("aria-checked", b === op); });
      const o = p.opciones[+op.dataset.i];
      $(".precio", card).innerHTML = `${pesos(o.precio)}<small>${esc(o.nombre)}</small>`;
    }
    if (e.target.closest("[data-add]")) {
      const sel = $(".opcion.sel", card);
      const o = p.opciones[sel ? +sel.dataset.i : 0];
      Carrito.agregar(p, o);
    }
  });
  observarAparicion();
}

/* ---------- carrito (se guarda en el navegador) ---------- */
export const Carrito = {
  items: [],
  cargar() { try { this.items = JSON.parse(localStorage.getItem("gs-carrito") || "[]"); } catch { this.items = []; } },
  guardar() { try { localStorage.setItem("gs-carrito", JSON.stringify(this.items)); } catch {} this.pintar(); },
  agregar(p, o) {
    const clave = p.id + "|" + o.nombre;
    const it = this.items.find(i => i.clave === clave);
    if (it) it.cant++; else this.items.push({ clave, nombre: p.nombre, opcion: o.nombre, precio: o.precio, color: p.color, cant: 1 });
    this.guardar(); aviso(`${p.nombre} agregado`);
  },
  cambiar(clave, d) {
    const it = this.items.find(i => i.clave === clave); if (!it) return;
    it.cant += d; if (it.cant <= 0) this.items = this.items.filter(i => i !== it);
    this.guardar();
  },
  total() { return this.items.reduce((s, i) => s + i.precio * i.cant, 0); },
  pintar() {
    const n = this.items.reduce((s, i) => s + i.cant, 0);
    $$("[data-contador]").forEach(e => e.textContent = n || "");
    const caja = $("#carritoItems"); if (!caja) return;
    caja.innerHTML = this.items.length ? this.items.map(i => `
      <div class="item">
        <span class="punto" style="background:linear-gradient(135deg,${esc(i.color)},#151520)"></span>
        <div><b>${esc(i.nombre)}</b><small>${esc(i.opcion)} · ${pesos(i.precio)}</small></div>
        <div class="cant"><button data-menos="${esc(i.clave)}" aria-label="Quitar uno">−</button>${i.cant}<button data-mas="${esc(i.clave)}" aria-label="Agregar uno">+</button></div>
      </div>`).join("") : `<p class="carrito-vacio">Tu pedido está vacío.<br>Agrega plataformas desde el catálogo.</p>`;
    $("#carritoTotal").textContent = pesos(this.total());
    $("#btnPedir").toggleAttribute("disabled", !this.items.length);
    $("#btnPedir").style.opacity = this.items.length ? 1 : .5;
  },
  mensaje() {
    const lineas = this.items.map(i => `• ${i.cant} x ${i.nombre} (${i.opcion}) — ${pesos(i.precio * i.cant)}`);
    return `¡Hola GerStream! 👋 Quiero hacer este pedido:\n\n${lineas.join("\n")}\n\nTotal: ${pesos(this.total())}\n\n¿Me confirman disponibilidad? Pago por Nequi o Bancolombia.`;
  },
};

function montarCarrito() {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="velo" id="velo"></div>
    <aside class="carrito" id="carrito" aria-label="Tu pedido">
      <div class="carrito-cab"><h3>Tu pedido</h3><button id="cerrarCarrito" aria-label="Cerrar">×</button></div>
      <div class="carrito-items" id="carritoItems"></div>
      <div class="carrito-pie">
        <div class="total"><span>Total</span><span id="carritoTotal">$0</span></div>
        <button class="btn btn-wa" id="btnPedir">${ICONO_WA} Pedir por WhatsApp</button>
        <small style="color:var(--tenue);text-align:center">Te confirmamos disponibilidad. Pagas con Nequi o Bancolombia (<a href="/medios-de-pago" style="color:var(--a2)">ver QR</a>).</small>
      </div>
    </aside>
    <div class="toast" id="toast"></div>`);
  const abrir = v => { $("#carrito").classList.toggle("abierto", v); $("#velo").classList.toggle("abierto", v); };
  $$("[data-abrir-carrito]").forEach(b => b.addEventListener("click", () => abrir(true)));
  $("#cerrarCarrito").onclick = $("#velo").onclick = () => abrir(false);
  $("#carritoItems").addEventListener("click", e => {
    const m = e.target.closest("[data-mas]"), n = e.target.closest("[data-menos]");
    if (m) Carrito.cambiar(m.dataset.mas, 1); if (n) Carrito.cambiar(n.dataset.menos, -1);
  });
  $("#btnPedir").onclick = () => { if (Carrito.items.length) window.open(waUrl(Carrito.mensaje()), "_blank", "noopener"); };
  Carrito.cargar(); Carrito.pintar();
}

let tAviso;
function aviso(t) {
  const el = $("#toast"); if (!el) return;
  el.textContent = t; el.classList.add("ver");
  clearTimeout(tAviso); tAviso = setTimeout(() => el.classList.remove("ver"), 1800);
}

/* ---------- animación de aparición ---------- */
let obs;
export function observarAparicion() {
  if (!("IntersectionObserver" in window)) { $$(".rev").forEach(e => e.classList.add("ver")); return; }
  obs ||= new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("ver"); obs.unobserve(e.target); } }), { rootMargin: "0px 0px -40px" });
  $$(".rev:not(.ver)").forEach(e => obs.observe(e));
}

export const ICONO_WA = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.3-.6-.4ZM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.3 4.6Zm8.4-18.2A11.8 11.8 0 0 0 1.8 17.8L.1 24l6.3-1.7a11.8 11.8 0 0 0 5.6 1.4A11.8 11.8 0 0 0 20.4 3.6Z"/></svg>`;

/* ---------- arranque común ---------- */
export function iniciar() {
  const menu = $(".menu"), hamb = $(".hamb");
  if (hamb) hamb.onclick = () => menu.classList.toggle("abierto");
  $$("[data-wa]").forEach(a => { a.href = waUrl(a.dataset.wa || "¡Hola GerStream! Quiero información 🙌"); a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-grupo]").forEach(a => { if (CONFIG.grupoWhatsapp) { a.href = CONFIG.grupoWhatsapp; a.target = "_blank"; a.rel = "noopener"; } else a.remove(); });
  $$("[data-anio]").forEach(e => e.textContent = new Date().getFullYear());
  document.body.insertAdjacentHTML("beforeend", `<a class="wa-flot" data-wa href="#" aria-label="Escríbenos por WhatsApp">${ICONO_WA}</a>`);
  const f = $(".wa-flot"); f.href = waUrl("¡Hola GerStream! Quiero información 🙌"); f.target = "_blank"; f.rel = "noopener";
  montarCarrito();
  observarAparicion();
}
