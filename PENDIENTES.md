# Pendientes y puntos a confirmar

Lo que sigue **no bloquea** el sitio: ya esta publicado y funcional. Son mejoras y
verificaciones que dependen de informacion que solo tiene el equipo de la organizacion.

## 0. Un correo, y el contacto pasa a ser en linea (lo mas rentable de esta lista)

La pagina ya tiene **dos formularios de verdad**: el de oracion y el nuevo de la
seccion de contacto. Hoy los dos preparan el mensaje y lo entregan por WhatsApp,
que es el unico canal comprobado. Con un correo pasan a enviarse **desde la propia
pagina**, sin que el visitante tenga que salir ni tener WhatsApp instalado.

En `js/main.js`, justo debajo de `GIVE`:

```js
var CONTACT = { email: "" };   // ponedlo aqui y ya esta
```

Como activarlo, una sola vez:

1. Poner el correo del ministerio entre las comillas y publicar.
2. Enviar vosotros mismos un mensaje de prueba desde la pagina.
3. FormSubmit mandara a ese correo un mensaje con un **enlace de activacion**.
   Pulsarlo. A partir de ahi todo llega solo, sin servidor y sin coste.

- [ ] **Elegir el correo.** Que sea uno del ministerio al que tenga acceso quien
      ora, no el personal de nadie: por ahi van a entrar peticiones de oracion
      con nombres, enfermedades y problemas de familia.
- [ ] Hacer la prueba de activacion y comprobar que llega.

Mientras el campo siga vacio no se rompe nada ni se promete nada falso: los
formularios funcionan, y el aviso de privacidad debajo de cada uno **cambia solo**
para decir en cada caso lo que de verdad pasa con el mensaje.

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

## 9. Fechas adventistas fijas para planificar el ano

Estas salieron de la investigacion y estan verificadas contra fuentes
oficiales. **No estan puestas como eventos del grupo**, porque son de la
Asociacion, no vuestras: ponerlas como propias seria atribuirse algo ajeno.
Sirven para saber alrededor de que fechas conviene organizar lo vuestro.

| Cuando | Que |
|---|---|
| Enero, 10 dias | **Ten Days of Prayer** — reuniones de oracion cada noche, terminan en sabado (7-17 ene 2026) |
| Enero | Sabado de enfasis en Salud (10 ene 2026) |
| Febrero | **VBS Showcase** de la Florida Conference: Orlando 21 feb, Miami 28 feb 2026 |
| Marzo, 3er sabado | **Global Youth Day** — el gran dia de servicio joven (21 mar 2026) |
| Marzo | Entrenamiento de Respuesta a Desastres, Florida Conference (13-15 mar 2026) |
| Abril | **World Impact Day** y Semana del Evangelismo de Literatura |
| Abril | **Camp Meeting** de la Florida Conference |
| Mayo | **Campestre** · Global Adventurer's Day |
| Verano | **Escuela Biblica de Vacaciones (VBS)** con el kit oficial, en ingles y espanol |
| Septiembre, 3er sabado | **Dia del Conquistador** (19 sep 2026) |
| Septiembre | Retiro de salud "Fit Together" |
| Noviembre, 8 dias | **Semana de Oracion** (7-14 nov 2026) |
| Diciembre | Sabado de enfasis en Salud (12 dic 2026) |

Programas oficiales con nombre propio que se pueden usar tal cual:
**Breathe-Free 2** (dejar de fumar, ocho dias, gratis, con material en espanol),
**Journey to Wholeness** (grupo semanal de doce pasos centrado en Cristo),
**Seasons** (acompanamiento en el duelo), **GLOW** (folletos de bolsillo,
"Giving Light to Our World", en mas de 25 idiomas), **FC-LIFE** (formacion
gratuita en evangelismo laico, tres domingos al ano).

- [ ] **Confirmar a que asociacion pertenece el grupo.** Florida esta cubierta
      por al menos **tres**: la Florida Conference, la Southeastern Conference
      y, en el Panhandle occidental, la Gulf States Conference. No es "una y la
      otra": se solapan. De eso depende a que calendario y a que formaciones
      teneis acceso.

## 10. SEO: lo que quedo resuelto y lo que depende de vosotros

Resuelto y comprobado por `node tools/test-seo.js` (40 puntos) y
`node tools/test-loader.js`:

- [x] El canonical y el `og:url` siguen al idioma. Antes las nueve variantes
      declaraban la raiz, y con eso Google habria indexado solo la inglesa.
- [x] Titulo de 48 caracteres y descripcion de 135: lo que Google muestra sin
      cortar.
- [x] `hreflang` de los nueve idiomas mas `x-default`, en el head y en el sitemap.
- [x] Cuatro bloques de datos estructurados validos: Organization, Book,
      FAQPage y WebSite, mas Event cuando haya eventos.
- [x] Jerarquia de encabezados sin saltos, un solo `h1`.
- [x] 238 KB por visita en el peor caso, con un solo idioma descargado.

Pendiente, y no lo puedo hacer yo:

- [ ] **Google Search Console y Bing Webmaster Tools**: dar de alta el sitio y
      enviar `sitemap.xml`. Sin esto, la indexacion tarda semanas en lugar de dias.
- [ ] **Enlazar el sitio desde el canal de YouTube y desde Facebook.** Es la
      senal de autoridad mas rapida y mas barata que existe para un sitio nuevo.
- [ ] **Los eventos no daran resultado enriquecido en Google** mientras vivan en
      una pagina de listado: Google exige una pagina por evento. El dato
      estructurado sigue siendo correcto y util, pero no esperes la tarjeta con
      fecha en los resultados.
- [ ] **Fotografias.** Sigue siendo el hueco mas grande de la pagina.

## 11. A donde ir: lo unico que falta para que el bloque principal sirva

El bloque de debajo del hero es ahora la accion principal de la pagina. Da la
hora del ocaso de verdad desde el primer dia, pero lo demas esta vacio.

Por cada ciudad donde tengais gente, rellenad en `js/near.js`:

- [ ] **Nombre de la congregacion**, tal como esta en la puerta.
- [ ] **Direccion completa** y el enlace del mapa.
- [ ] **Hora del culto principal.** Confirmadla, no la copieis de otra iglesia.
- [ ] **Idiomas** en los que se predica ahi.
- [ ] **Nombre de quien va a esperar fuera.** Solo poned un nombre si esa
      persona ya dijo que si. Si no hay nadie, dejad el campo fuera: la pagina
      da la direccion igual, sin prometer compania que no existe.

Con tres ciudades ya funciona. No hace falta tenerlas las veintidos.

Mientras `js/near.js` este vacio, la entradilla de ese bloque **ya no promete un
nombre**: ofrece solo la hora del ocaso, que si es real, y se ofrece a averiguar
cual es la congregacion mas cercana. En cuanto pongais la primera ciudad, vuelve
sola a la version completa. No hay que tocar el texto.

## 12. Misiones: se esconde sola mientras este vacia

`#misiones` **no se muestra** mientras `js/events.js` no tenga ni un evento, y con
ella se esconden sus enlaces del menu, para no dejar anclas que no llevan a nada.
Al anadir el primer evento reaparece sola.

Cuando tengais tres eventos con foto, merece la pena mover la seccion mas arriba,
a la altura de "Quienes somos". Ahora esta despues de Ministerios a proposito.
Con historial y fotos, se convierte en lo mas convincente de la pagina.

## 13. Once llamadas a la accion compitiendo

La pagina tiene once botones de WhatsApp mas la burbuja flotante. Cada uno por
separado tiene sentido, pero juntos se restan: si todo es la accion principal,
ninguna lo es. No los he quitado porque cual sobra es una decision vuestra, no
mia. Cuando el bloque de "a donde ir" tenga datos de tres ciudades, merece la
pena revisar si el boton generico de la seccion de contacto y el del menu movil
siguen haciendo falta, y si la burbuja flotante debe seguir apareciendo encima
del bloque principal.
