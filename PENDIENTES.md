# Pendientes y puntos a confirmar

Lo que sigue **no bloquea** el sitio: ya esta publicado y funcional. Son mejoras y
verificaciones que dependen de informacion que solo tiene el equipo de la organizacion.

## 1. Confirmar con Florida Advent Missionaries (importante)

- [ ] **Datos publicos usados.** Nombre legal, EIN `81-1180614` y direccion
      `206 SW 7th St, Delray Beach, FL 33444` se tomaron de registros publicos de
      organizaciones sin animo de lucro. Confirmar que son los vigentes y que
      quieren mostrarlos en la web.
- [ ] **Texto de "Quienes somos".** La redaccion actual describe a un grupo misionero
      laico generico. Reemplazar por la mision en sus propias palabras.
- [ ] **Ministerios.** Los 6 bloques son los tipicos de un grupo laico adventista.
      Ajustar a los frentes que realmente trabajan hoy.
- [ ] **Series de estudio biblico.** Confirmar nombres y numero de lecciones reales.
- [ ] **WhatsApp +1 786 239 2331.** Verificar que es el numero que atiende al publico
      y que tiene WhatsApp activo.
- [ ] **Horario de respuesta.** El sitio promete "menos de 24 horas". Ajustar si es otro.

## 2. Donaciones

- [x] Enlace a B Charitable (perfil real de la organizacion).
- [x] Donacion por cheque a la direccion postal.
- [x] Voluntariado por WhatsApp.
- [ ] **Anadir pasarela propia** si la tienen: PayPal, Zelle, Givelify o Stripe.
      Se cambia en `index.html`, seccion `#donar`, boton `give.card.donate`.
- [ ] Confirmar que la pagina de B Charitable acepta donaciones del publico general
      (no solo solicitudes de subvencion desde fondos asesorados).

## 3. Steps to Christ

- [x] PDF directo verificado en 6 idiomas: EN, ES, FR, PT, DE, NL.
- [ ] **HT, RU y UK** abren la biblioteca por idioma en lugar del PDF directo.
      Si consiguen el enlace exacto, se pone en `js/i18n.js` -> `FAM_LANGS[].book.pdf`
      y se quita ese codigo de `FAM_NO_DIRECT_PDF`.
- [ ] Confirmar que si pueden **enviar ejemplares impresos gratis** por toda Florida
      (el sitio lo promete en `book.p4` y en el boton de WhatsApp).

## 4. Dominio propio (recomendado)

Hoy vive en `droko1982.github.io/adventflorida/`. Con un dominio como
`floridaadventmissionaries.org`:

1. Crear el archivo `CNAME` en la raiz con el dominio.
2. Apuntar los DNS a GitHub Pages.
3. Buscar y reemplazar `https://droko1982.github.io/adventflorida/` en
   `index.html`, `sitemap.xml` y `robots.txt`.

## 5. Posicionamiento (cuando el dominio este listo)

- [ ] Dar de alta en Google Search Console y enviar `sitemap.xml`.
- [ ] Dar de alta en Bing Webmaster Tools.
- [ ] Crear perfil de Google Business (aparecer en busquedas locales de Florida).
- [ ] Enlazar el sitio desde el canal de YouTube y la pagina de Facebook:
      es la senal de autoridad mas rapida.

## 6. Contenido que sumaria

- [ ] Testimonios reales (con permiso escrito de cada persona).
- [ ] Fotos del equipo y de las actividades, en lugar de las ilustraciones SVG.
- [ ] Calendario de eventos y campanas de evangelismo.
- [ ] Horarios de culto de las iglesias aliadas por ciudad.
