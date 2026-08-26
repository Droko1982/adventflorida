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

**Hallazgo importante (2026-08-26):** la pagina de B Charitable
(app.bcharitable.org/charities/833734) **NO permite donar al publico general**.
Su unico boton es "Make a grant request", pensado para fondos asesorados por
donantes (DAF). Por eso se retiro ese enlace del sitio: era un boton que no
llevaba a ninguna parte util.

Lo que funciona hoy en el sitio:

- [x] Cheque por correo a la direccion del 501(c)(3).
- [x] WhatsApp para preguntar como donar.
- [x] Voluntariado (dar tiempo en vez de dinero).

**Falta un solo dato para activar los botones de pago.** En `js/main.js`, arriba
del todo, esta el objeto `GIVE`:

```js
var GIVE = {
  online: "",   // enlace de PayPal / Givelify / Tithe.ly / Stripe
  zelle:  ""    // correo o telefono registrado en Zelle
};
```

Rellena un valor y su boton aparece solo. Mientras esten vacios, no se muestra
ningun boton roto. No hay que tocar nada mas.

- [ ] **PayPal**: pegar el enlace de donacion o `paypal.me` en `GIVE.online`.
- [ ] **Zelle**: poner en `GIVE.zelle` el correo o telefono registrado. Zelle no
      tiene enlace web; el sitio solo muestra el dato para copiarlo en el banco.
      **Confirmar el dato exacto antes de publicarlo**: un error ahi manda el
      dinero a un desconocido.
- [ ] Opcional: dejar una nota para donantes con DAF que enlace a B Charitable,
      etiquetada claramente como "solo fondos asesorados por donantes".

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

## 7. Seccion del sabado — a confirmar con el equipo

La seccion se escribio sobre una investigacion verificada, pero tres cosas
prometen algo concreto y necesitan una persona real detras antes de darlas por
buenas en nueve idiomas:

- [ ] **Los horarios.** La linea de tiempo dice "media manana" y "final de la
      manana" en lugar de una hora fija, precisamente para no publicar un horario
      que no sea el de las iglesias a las que ustedes envian gente. Si quieren
      poner horas concretas, hay que confirmarlas congregacion por congregacion.
- [ ] **"Uno de nosotros te espera y entra contigo."** Aparece en `sab.g.lead` y
      en `sab.e.2.d`. Hace falta alguien con nombre que se haya comprometido a
      eso, por zona, antes de publicarlo.
- [ ] **"Te enviamos a una congregacion en tu idioma."** Verificar que existe la
      lista de iglesias por idioma y quien la mantiene.

## 8. Idiomas: dos decisiones pendientes

- [ ] **La bandera del ruso.** El selector usa 🇷🇺 para el ruso. Buena parte de
      quienes leen en ruso en Florida son ucranianos, moldavos o centroasiaticos,
      y desde 2022 una bandera de Estado puede leerse mal. Es una decision suya:
      se puede dejar, cambiar por un icono neutro o quitar las banderas del ruso
      y el ucraniano. Se cambia en `js/i18n.js`, en `FAM_LANGS`.
- [ ] **El criollo haitiano es el idioma peor servido.** No existe *El Camino a
      Cristo* en kreyol, ni television, ni radio, ni biblioteca de Elena White.
      El sitio ya lo dice con honestidad y ofrece el frances, pero conviene tener
      a alguien que pueda leer con esa persona en kreyol, que es lo que promete.
