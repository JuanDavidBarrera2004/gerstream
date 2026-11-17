// Catálogo inicial de GerStream (tomado de la página anterior).
// Se muestra mientras el administrador no haya guardado cambios desde admin.html.
// Después de la primera vez que guardes en el panel, manda lo que haya en el panel.

const p = (id, nombre, categoria, descripcion, opciones, color, extra = {}) => ({
  id, nombre, categoria, descripcion,
  opciones: opciones.map(([nombre, precio]) => ({ nombre, precio })),
  color, imagen: "", etiqueta: "", destacado: false, activo: true, orden: 100, ...extra,
});

const una = (precio, premium) =>
  premium ? [["Disney+ Estándar", precio], ["Con Disney+ Premium", premium]] : [["1 pantalla c/u", precio]];

export const SEMILLA = [
  // ---------- Unidad ----------
  p("netflix", "Netflix", "Unidad", "Calidad 4K + HDR, perfil propio. 30 días de garantía.",
    [["1 pantalla", 15000], ["2 pantallas", 28000], ["3 pantallas", 39000]], "#e50914",
    { destacado: true, etiqueta: "Más vendido", orden: 1 }),
  p("netflix-int", "Netflix Internacional", "Unidad", "Acceso internacional, perfil propio. 30 días de garantía.",
    [["1 pantalla", 16000], ["2 pantallas", 30000]], "#b20710", { orden: 2 }),
  p("disney-std", "Disney+ Estándar", "Unidad", "Disney, Pixar, Marvel y Star Wars. 30 días de garantía.",
    [["1 pantalla", 8000], ["2 pantallas", 14000], ["3 pantallas", 20000]], "#1f6bff", { orden: 3 }),
  p("disney-prem", "Disney+ Premium", "Unidad", "Incluye canales ESPN. 30 días de garantía.",
    [["1 pantalla", 12000], ["2 pantallas", 22000], ["3 pantallas", 30000]], "#0b3d91",
    { destacado: true, etiqueta: "Con ESPN", orden: 4 }),
  p("hbo", "HBO Max", "Unidad", "Series y películas de estreno. 30 días de garantía.",
    [["1 pantalla", 8000], ["2 pantallas", 12000], ["3 pantallas", 15000]], "#7b2ff7", { destacado: true, orden: 5 }),
  p("prime", "Prime Video", "Unidad", "Películas, series y originales. 30 días de garantía.",
    [["1 pantalla", 8000], ["2 pantallas", 13000]], "#00a8e1", { orden: 6 }),
  p("paramount", "Paramount+", "Unidad", "Perfil propio. 30 días de garantía.",
    [["1 pantalla", 7000], ["2 pantallas", 11000], ["3 pantallas", 15000]], "#0064ff", { orden: 7 }),
  p("crunchyroll", "Crunchyroll", "Unidad", "Anime en simulcast. 30 días de garantía.",
    [["1 pantalla", 7000], ["2 pantallas", 12000]], "#f47521", { orden: 8 }),
  p("vix", "ViX", "Unidad", "Novelas, noticias y deportes. 30 días de garantía.",
    [["1 pantalla", 6000], ["2 pantallas", 10000], ["3 pantallas", 15000]], "#ff5a1f", { orden: 9 }),

  // ---------- Música y diseño ----------
  p("spotify", "Spotify Premium", "Música y diseño", "Música sin anuncios.",
    [["1 mes", 10000], ["3 meses", 25000]], "#1db954", { destacado: true, orden: 20 }),
  p("youtube", "YouTube Premium", "Música y diseño", "Videos sin anuncios y YouTube Music.",
    [["1 mes", 10000], ["3 meses", 28000]], "#ff0033", { orden: 21 }),
  p("canva", "Canva Pro", "Música y diseño", "Todas las herramientas Pro de diseño.",
    [["1 mes", 10000], ["1 año", 50000]], "#00c4cc", { orden: 22 }),

  // ---------- Dúos ----------
  p("duo-netflix-disney", "Netflix + Disney+", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(20000, 24000), "#e50914", { orden: 30, destacado: true, etiqueta: "Dúo top" }),
  p("duo-netflix-hbo", "Netflix + HBO Max", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(19000), "#e50914", { orden: 31 }),
  p("duo-netflix-prime", "Netflix + Prime Video", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(20000), "#e50914", { orden: 32 }),
  p("duo-netflix-paramount", "Netflix + Paramount+", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(19000), "#e50914", { orden: 33 }),
  p("duo-netflix-crunchy", "Netflix + Crunchyroll", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(19000), "#e50914", { orden: 34 }),
  p("duo-netflix-vix", "Netflix + ViX", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(19000), "#e50914", { orden: 35 }),
  p("duo-disney-prime", "Disney+ + Prime Video", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(13000, 17000), "#1f6bff", { orden: 36 }),
  p("duo-disney-hbo", "Disney+ + HBO Max", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(13000, 17000), "#1f6bff", { orden: 37 }),
  p("duo-disney-paramount", "Disney+ + Paramount+", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(12000, 16000), "#1f6bff", { orden: 38 }),
  p("duo-disney-crunchy", "Disney+ + Crunchyroll", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(12000, 16000), "#1f6bff", { orden: 39 }),
  p("duo-hbo-prime", "HBO Max + Prime Video", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(12000), "#7b2ff7", { orden: 40 }),
  p("duo-hbo-crunchy", "HBO Max + Crunchyroll", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(12000), "#7b2ff7", { orden: 41 }),
  p("duo-hbo-paramount", "HBO Max + Paramount+", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(12000), "#7b2ff7", { orden: 42 }),
  p("duo-prime-crunchy", "Prime Video + Crunchyroll", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(12000), "#00a8e1", { orden: 43 }),
  p("duo-prime-paramount", "Prime Video + Paramount+", "Dúos", "1 pantalla en cada una. 30 días de garantía.", una(12000), "#00a8e1", { orden: 44 }),

  // ---------- Combos ----------
  p("combo-4", "Netflix + Disney+ + HBO Max + Prime Video", "Combos", "1 pantalla en cada una. 30 días de garantía.", una(28000, 32000), "#45b83c", { orden: 50, destacado: true, etiqueta: "Combo estrella" }),
  p("combo-ndp", "Netflix + Disney+ + Prime Video", "Combos", "1 pantalla en cada una. 30 días de garantía.", una(24000, 28000), "#45b83c", { orden: 51 }),
  p("combo-ndh", "Netflix + Disney+ + HBO Max", "Combos", "1 pantalla en cada una. 30 días de garantía.", una(24000, 28000), "#45b83c", { orden: 52 }),
  p("combo-nph", "Netflix + Prime Video + HBO Max", "Combos", "1 pantalla en cada una. 30 días de garantía.", una(23000), "#45b83c", { orden: 53 }),
  p("combo-5-paramount", "Netflix + Disney+ + HBO Max + Prime Video + Paramount+", "Combos", "1 pantalla en cada una. 30 días de garantía.", una(32000, 36000), "#2e8f2a", { orden: 54 }),
  p("combo-5-crunchy", "Netflix + Disney+ + HBO Max + Prime Video + Crunchyroll", "Combos", "1 pantalla en cada una. 30 días de garantía.", una(32000, 36000), "#2e8f2a", { orden: 55 }),
  p("combo-dhp", "Disney+ + HBO Max + Prime Video", "Combos", "1 pantalla en cada una. 30 días de garantía.", una(17000, 21000), "#7bc94a", { orden: 56 }),
  p("combo-dhpp", "Disney+ + HBO Max + Prime Video + Paramount+", "Combos", "1 pantalla en cada una. 30 días de garantía.", una(20000, 24000), "#7bc94a", { orden: 57 }),
  p("combo-dhpc", "Disney+ + HBO Max + Prime Video + Crunchyroll", "Combos", "1 pantalla en cada una. 30 días de garantía.", una(20000, 24000), "#7bc94a", { orden: 58 }),
  p("combo-nhc", "Netflix + HBO Max + Crunchyroll", "Combos", "1 pantalla en cada una. 30 días de garantía.", una(22000), "#45b83c", { orden: 59 }),
  p("combo-npc", "Netflix + Prime Video + Crunchyroll", "Combos", "1 pantalla en cada una. 30 días de garantía.", una(22000), "#45b83c", { orden: 60 }),
  p("combo-php", "Prime Video + HBO Max + Paramount+", "Combos", "1 pantalla en cada una. 30 días de garantía.", una(15000), "#00a8e1", { orden: 61 }),
];

export const CATEGORIAS = ["Unidad", "Dúos", "Combos", "Música y diseño", "Otros"];
