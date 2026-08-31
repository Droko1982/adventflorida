# Pendientes y puntos a confirmar

Lo que sigue **no bloquea** el sitio: ya esta publicado y funcional. Son mejoras y
verificaciones que dependen de informacion que solo tiene el equipo de la organizacion.

> **Esta lista tambien se ejecuta.** `node tools/test-listo.js` recorre lo que una
> maquina si puede comprobar de aqui —el correo, las donaciones, las ciudades, los
> eventos y el dominio— y dice en dos segundos que sigue vacio. Las otras trece
> pruebas miran si el sitio esta **bien hecho**; esa mira si esta **lleno**, que no
> es lo mismo: el codigo puede estar impecable y la pagina seguir sin decir a donde
> ir un sabado. Lo que no se puede saber desde una prueba lo dice por su nombre al
> final, para que no parezca comprobado.

## 0. Contacto en linea — falta UN clic

El correo ya esta puesto: **fladventmissionaries@gmail.com**. El formulario de
contacto y el de peticiones de oracion envian desde la propia pagina via
FormSubmit: sin servidor, sin coste, y sin que el visitante tenga que salir del
sitio ni tener WhatsApp.

- [ ] **Abrir el correo de FormSubmit en fladventmissionaries@gmail.com y pulsar
      "Activate Form".** Ese mensaje ya se envio el 27 de agosto de 2026 desde la
      instalacion. Es un clic y se hace una sola vez.

Mientras no se pulse, FormSubmit rechaza los envios. La pagina **no miente por
eso**: detecta el rechazo, avisa de que no salio, no borra lo que la persona
escribio y le ofrece WhatsApp. Aun asi, cada dia sin activar es correo perdido.

Despues de activar, comprobadlo vosotros: entrad a la pagina, mandaos un mensaje
desde el formulario de contacto y mirad que llega al buzon.

### Recomendado en cuanto este activado: esconder la direccion

`js/main.js` es publico, y los robots de spam rastrean GitHub Pages buscando
justo direcciones de correo dentro del codigo. FormSubmit da, despues de activar,
una cadena aleatoria que hace el mismo trabajo sin ensenar el buzon:

```js
var CONTACT = {
  email: "fladventmissionaries@gmail.com",
  token: ""      // <- pegad aqui la cadena de FormSubmit
};
```

- [ ] Copiar de FormSubmit el "form endpoint" (la cadena aleatoria) y pegarla en
      `token`. Si esta puesta se usa ella y la direccion deja de aparecer en el
      codigo. Funciona igual con las dos.

Ojo con el buzon: por ahi entran peticiones de oracion con nombres, enfermedades
y problemas de familia. Que solo lo lea quien tenga que leerlo.

## 0.b El logotipo: tenemos el emblema, falta el rotulo

La pagina lleva ya el emblema de verdad del ministerio -- la A azul
marino con las tres alas doradas -- en la cabecera, en los cuatro iconos
y en la imagen que sale al compartir el enlace por WhatsApp.

Se saco del avatar del canal oficial de YouTube, que es la unica copia
publica que existe. **Y esta recortado**: YouTube guarda un cuadrado que
corta el rotulo "FLORIDA ADVENT MISSIONARIES" por la derecha. Se busco
sin recortar en el banner del canal, en Facebook y en buscadores, y no
aparece en ninguna parte.

- [ ] **Pasar el archivo original del logotipo** (idealmente vectorial:
      `.svg`, `.ai` o `.eps`; si no, un PNG grande con fondo
      transparente). Son dos archivos que sustituir en `assets/`:
      `logo.png` para el tema claro y `logo-dark.png` para el oscuro,
      este ultimo con el azul en un tono claro para que se lea sobre
      fondo oscuro. Todo lo demas ya esta puesto.

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

## 3. Steps to Christ — resuelto en los nueve idiomas

- [x] **PDF directo en los nueve.** Ruso y ucraniano ya lo tienen: hasta ahora
      su boton decia "Descargar el PDF" y abria el catalogo del idioma.
      Comprobados uno a uno el 28 de agosto de 2026, con peticion real y
      mirando los primeros bytes del archivo, no solo el codigo HTTP.
- [x] **El boton de leer abre la obra**, no el catalogo. Portugues y
      neerlandes iban al catalogo.
- [x] **Aleman descuadrado.** Servia el PDF de *Der bessere Weg zu einem
      neuen Leben* y el boton de leer abria *Der Weg zu Christus*, que es
      otra edicion distinta. Ya van emparejados.
- [x] **Titulo ucraniano corregido**: es *Дорога до Христа*, no *Шлях до Христа*.
- [ ] **El criollo haitiano sigue sin el libro.** Confirmado otra vez: la
      etiqueta "ht" de egwwritings es un criollo de base portuguesa, no el
      kreyol de Haiti, y su catalogo no sirve ni una obra. Los botones llevan
      a la edicion francesa y la pagina lo dice con todas las letras.
- [ ] Confirmar que si pueden **enviar ejemplares impresos gratis** por toda
      Florida (el sitio lo promete en `book.p4` y en el boton de WhatsApp).

## 3.b La biblioteca

La seccion del libro ya no ofrece solo *El camino a Cristo*: lleva **16 obras**,
casi todas de Elena White, mas la Biblia completa, las lecciones de Escuela
Sabatica y los folletos GLOW. **124 ediciones**, y cada enlace se pidio de
verdad antes de publicarlo: codigo, tamano y, en los PDF, los primeros bytes
del archivo. De 227 direcciones comprobadas entraron las que pasaron.

Cada idioma ve solo lo que existe en su lengua, y el numero se dice sin
adornos: ingles, espanol, frances, portugues y ruso 16; aleman 15; ucraniano
14; neerlandes 12; **kreyol ayisyen 3**.

Esas tres en kreyol son lo mas importante que trajo esta busqueda: hasta ahora
ese idioma no tenia NADA propio en toda la pagina. Ahora tiene la Biblia
completa, las lecciones de Escuela Sabatica y un texto de Elena White
publicado por su propio Estate.

- [ ] **Si algun enlace se cae**, quitarlo de `js/library.js` y la obra
      desaparece sola de ese idioma. Si desaparece de todos, desaparece la
      obra. No hay que tocar nada mas.
- [ ] Las lecciones de Escuela Sabatica en kreyol son del trimestre de
      **julio-septiembre de 2021**: es lo ultimo que hay traducido. Conviene
      mirar de vez en cuando si sale uno nuevo.
- [ ] Los audiolibros oficiales solo estaban en ingles y su enlace no paso la
      comprobacion, asi que no se publicaron.

## 4. Dominio propio: un solo comando

Hoy el sitio vive en una direccion de GitHub. El dia que se compre el dominio,
esto es lo unico que hay que ejecutar:

```
node tools/cambiar-dominio.js  midominio.org
```

Son **132 direcciones repartidas en 12 archivos**, y el sitemap se lleva 99 de
ellas: a mano se olvida una y el canonical o el hreflang se quedan apuntando al
sitio viejo, que es peor que no haber cambiado nada. La herramienta las cambia
todas, crea el archivo `CNAME`, pone al dia la fecha del sitemap y luego
imprime en pantalla los pasos que quedan: los cuatro registros DNS de GitHub
Pages, donde escribir el dominio en GitHub y como dar de alta el sitio nuevo en
Search Console.

Con `--prueba` enseña lo que haria sin tocar nada.

Probado de verdad, no solo escrito: se hizo una copia del repo, se migro con la
herramienta, se sirvio desde la raiz de un dominio y se abrio en Chrome. Cero
peticiones fallidas, cero errores de JavaScript, el canonical y los diez
hreflang ya en el dominio nuevo, y la pagina 404 con sus estilos y su enlace de
vuelta funcionando, que era justo lo que se rompia antes.

- [ ] Comprar el dominio.
- [ ] Ejecutar el comando y seguir los pasos que imprime.
- [ ] Dar de alta el sitio NUEVO en Search Console y enviar el sitemap.

La direccion vieja seguira redirigiendo sola a la nueva, asi que los enlaces ya
compartidos por WhatsApp no se rompen y no hay que reenviar nada a nadie.

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

- [x] **La bandera del ruso: resuelto de rebote.** Al quitar las banderas del
      selector (punto 15.d) esta decision se queda sin objeto: ya no hay
      ninguna bandera que pueda leerse mal, ni la rusa ni las otras ocho. Se
      deja escrito lo que se penso en su momento, por si alguien vuelve a
      proponer ponerlas:

- [ ] ~~**La bandera del ruso.**~~ El selector usaba 🇷🇺 para el ruso. Buena parte de
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

Mientras `js/near.js` este vacio, esa seccion **no promete compania**. Ni la
entradilla ni la respuesta que sale al elegir ciudad. Ofrecen lo que si es
seguro: la hora del ocaso, que la calcula el propio sitio, y buscar que
congregacion queda mas cerca y en que idioma predica. La compania queda
condicionada -- "si hay alguien que pueda entrar contigo, te lo decimos" -- en
los nueve idiomas. `tools/test-promesas.js` vigila que no se vuelva a prometer
sin condicion. Al poner la primera ciudad, el texto completo vuelve solo.

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


## 14. Revision de una persona que uso la pagina (30 de agosto de 2026) — HECHO

Llego por WhatsApp una lista de seis cosas, y despues una septima. Todas
estan hechas y medidas.
Se deja escrito el detalle porque en dos de ellas la decision no era obvia.

**1. "Que cuando entre a la pagina me abra en el inicio, que no me baje."**
Se abre en la parte 1, arriba del todo. Y el emblema, que durante unos dias
llevaba a la seccion "Quienes somos", vuelve a llevar al principio: un
emblema es el boton de volver a casa, y la casa es arriba.

**2. "Que seccione las cosas, al menos en 3."**
Hecho, en cuatro partes. Sigue siendo una sola landing. Ver "Las cuatro
partes" en el README.

**3. "Que verifique que toda la pagina este adaptada a PC y celular."**
Comprobado de 320 a 1440 px en las cuatro partes, y ademas en vertical
(320x568, 360x740, 390x844, 414x896, 768x1024) y en apaisado (844x390).

**4. "Que el logo no se corte ni quede a medias con puntos suspensivos."**
Tenia `text-overflow: ellipsis`, y por debajo de 620 px el subtitulo
desaparecia del todo: en un movil en vertical el nombre salia como
"Florida Adve..." y sin "MISSIONARIES". Ahora el emblema, la separacion y el
nombre encogen con `clamp()` en vez de recortarse, y el subtitulo no
desaparece a ningun ancho.

Para que "MISSIONARIES" cupiera a 320 px hacian falta 22 px que no habia. En
vez de encoger la letra hasta lo ilegible —se probo, salian 7,5 px y
`tools/test-responsive.js` lo rechazo con razon— el sitio se le quito a los
mandos de la derecha: los botones de tema e idioma bajan de 40 a 36 px, muy
por encima de los 24 que pide la WCAG 2.5.8. Verificado entero en las 7
pantallas x los 9 idiomas.

**5. "Que en el inicio quite esas 2 cosas que seleccione en la imagen."**
Era la pildora "Grupo misionero laico · Toda la Florida". Fuera, con su punto
verde y su clave de los nueve diccionarios.

No se perdio informacion, y se comprobo. Aviso para quien lea esto luego: en
su momento se justifico diciendo que "en toda la Florida" seguia en la barra
superior — y esa barra se quito poco despues (punto 7 de aqui abajo). Donde
esta ahora, y donde estaba ya entonces, es en el propio texto del hero: "Somos
gente sencilla de la Florida... Vivas donde vivas en este estado". Y "grupo
misionero laico adventista del septimo dia" abre la seccion Quienes somos.

**6. "El boton de WhatsApp aparece y desaparece; que este siempre."**
Era a proposito: `wireFloat()` lo retiraba mientras se veia el hero porque le
robaba el toque al boton principal, y estaba medido. Pero un atajo que va y
viene no se aprende, asi que se quita el escondite.

El motivo por el que se escondia era real, asi que en vez de ignorarlo se
resolvio apartando: en pantallas estrechas la burbuja baja de 58 a 50 px y se
mete mas en el rincon. Medido en las 7 pantallas: **el centro de todos los
botones queda libre siempre**; en el peor caso (360 px con los textos
ucranianos, que son los mas largos) la burbuja tapa un 7 % de la punta de un
boton. Una burbuja fija en la esquina siempre va a solaparse con algo: es el
precio de que este siempre, y es el que se eligio a sabiendas. Esto contesta
tambien la duda que quedaba abierta en el punto 13.

**Ademas, de propina:** el reparto en partes dejaba un solo enlace del menu
—"Cerca de ti"— deslizandose mientras los otros 18 saltaban en seco, y encima
llegaba tarde (100 px a los 350 ms). El umbral de `SALTO_LARGO` baja de 1
pantalla a 0,5 y los 19 se comportan igual.

**7. La franja de promesas de encima de la cabecera.** Decia "Estudios
biblicos gratis · Oracion gratuita · El libro El Camino a Cristo sin costo — en
toda la Florida". Fuera, con su CSS y su clave en los nueve diccionarios.

No repetia por enfasis, repetia por inercia: el hero, dos dedos mas abajo y en
letra que se lee, ya dice que somos de Florida, que da igual donde vivas en
este estado y que todo es gratuito. Comprobado en los nueve idiomas ANTES de
quitarla.

Lo que se gana no son solo pixeles. Medido comparando contra la version
anterior en un servidor local: **en un movil de 320x568 el boton principal
pasa de no verse sin desplazarse a verse**, en siete de los ocho idiomas
medidos (el aleman sigue sin entrar, por lo largo de su texto). Son 86 px en
320, 64 en 360 y 390.

**Y rompio tres comprobaciones, que es la parte que merece quedar escrita.**
`tools/test-browser.js` se puso rojo en tres sitios: al entrar por `#libro` y
al usar el menu, las secciones aterrizaban a 75 px en vez de a los 92 que la
prueba exigia.

Lo primero fue mirar si al lector le pasaba algo. No le pasa. Medido con el
navegador, comparando la version de antes contra la de ahora: la distancia
entre el titulo de la seccion y el borde de la cabecera es identica en las dos
(58 px en el hero, 161 px en las demas), porque `section` ya trae 84 px de
relleno propio. Lo unico que cambia es que la pagina ya no gasta 47 px de
desplazamiento en tragarse la franja: se queda en 0 y **el titulo aparece 17 px
mas arriba**. Es una mejora, no un fallo.

Lo que estaba mal era la prueba. Tenia un 92 a pelo — el `scroll-padding-top`
del sitio — y acertaba de casualidad: mientras hubo franja, siempre sobraban
pixeles por encima que retroceder. Sin franja, la primera seccion de cada parte
empieza a 75 px del documento y no hay 92 que retroceder; el desplazamiento se
topa con el 0.

Ahora la prueba calcula el destino en vez de darlo por sabido. Como el salto
hace `scrollTo(max(0, docTop - 92))`, la seccion acaba en `min(92, docTop)`, y
eso es lo que compara la funcion `aterriza()`.

Comprobado que no se ha ablandado la prueba, que era el riesgo: pasa con la
franja y sin ella, y contra un arbol roto a proposito (el salto movido de 92 a
400 px) sigue cantando 4 fallos. Solo afloja donde el documento fisicamente no
puede subir mas.

**Nombres de las partes:** la cuarta se llamaba "Escribenos" y pasa a
"Contactenos", que es lo que se pidio. La primera se llamaba "Quienes somos",
igual que uno de los enlaces de dentro; pasa a "Inicio", que ademas es la
palabra que uso quien reviso el sitio.

## 15. Lo que dejo abierto partir la pagina en cuatro

Al repartir las 17 secciones en cuatro partes se auditó el cambio en siete
frentes (ejecucion, SEO, enlaces, accesibilidad, correccion del codigo,
estados degradados y contenido), y cada hallazgo se paso por un revisor que
intentaba tumbarlo. Lo que bloqueaba se arreglo antes de publicar; esto es lo
que sobrevivio y no bloquea.

### 15.a — Tres de las cuatro partes no tienen `h1`

El unico `<h1>` del sitio es el titular del hero, que vive en la parte 1. Quien
entra por un enlace a `#sabado`, `#libro` o `#oracion` ve una pagina cuyo
encabezado de nivel mas alto es un `h2`. Comprobado leyendo el arbol de
accesibilidad real de Chrome: con `?lang=uk#sabado` salen 18 encabezados,
3 de nivel 2 y 15 de nivel 3, y ninguno de nivel 1.

Para Google no cambia nada —los rastreadores no usan el fragmento, asi que
siempre renderizan la parte 1 con su `h1`—, pero para quien navega con lector
de pantalla y llega por un enlace compartido, si.

- [x] **Hecho.** Cada parte tiene ya su `h1`. Las partes 2, 3 y 4 lo llevan
      oculto con la clase `sr-only` que ya existia, reusando `part.faith`,
      `part.free` y `part.connect`: ni una palabra nueva que traducir. La
      parte 1 **no** lleva uno nuevo, porque ya tiene el titular del hero,
      que ademas es visible y es el que sostiene el titulo de la pagina;
      por eso `part.about` se queda sin usar aqui.
- [x] **El aviso era bueno: `tools/test-seo.js` daba por supuesto que habia
      un solo `h1`** y se ponia rojo con los cuatro. La prueba no se ha
      ablandado, se ha afinado: ahora comprueba que **cada parte tiene
      exactamente uno**, que es lo que de verdad importa, porque solo se
      pinta una parte cada vez y quien lee la pagina sigue viendo un unico
      `h1`. Comprobado que sigue cantando: metiendo un `h1` de mas en una
      parte, la prueba falla y dice en cual.

### 15.b — Al abrir una parte se revelan de golpe todas sus animaciones

`abrirParte()` llama a `revelar()` sobre la parte entera para que no se vea en
blanco el primer fotograma. El efecto secundario es que marca como visibles
**todos** los `.reveal` de esa parte, tambien los que estan a 10.000 px de
distancia. Medido: al entrar en la parte "fe" se revelan 41 de 41, y 39 de
ellos estaban fuera de pantalla.

No se rompe nada: simplemente, la aparicion suave al ir bajando ya no existe en
tres cuartas partes del sitio.

- [x] **Hecho.** `abrirParte()` llama ahora a `revelarPortada()`, que solo
      enciende lo que cabe en la primera pantalla de la parte; del resto se
      encarga el observador segun se baja, que es para lo que esta. Y
      `revelar()`, la que se usa al aterrizar en una seccion concreta,
      revela esa seccion entera **mas lo que asome por debajo en esa misma
      pantalla**, que si no aparecia tarde.

      Medido en Chrome a 390x844: la parte "fe" pasa de revelar **41 de 41**
      a **7 de 41**; "recursos" de 17 a 3; "contacto" de 12 a 3.

      Lo que no podia romperse —y por poco— es que no se quede nada en
      blanco delante de los ojos. Vigilado ahora por `tools/test-browser.js`
      (bloque 7): baja la parte entera y no admite ni un bloque con medio
      alto o mas a la vista que siga apagado al final. Ojo al criterio, que
      cuesta un rato entenderlo: un bloque que **aun no ha entrado** DEBE
      estar sin revelar, y uno que solo asoma por el borde tambien, porque
      el observador pide un 12 % a proposito. Y lo que vive dentro de un
      `<details>` cerrado no cuenta: nadie lo ve, y al abrir el fold se
      revela solo -- comprobado abriendo uno, 4 de 4 encendidos.
      La prueba no es blanda: contra el codigo de antes falla en las tres
      partes.

### 15.c — Los enlaces con fragmento de texto dejan de funcionar

Google ofrece a veces enlaces del tipo
`...#:~:text=A%20day%20God%20gave%20away`, y los navegadores tienen "Copiar
enlace al fragmento destacado". Si el texto senalado vive en una parte que no
es la primera, el navegador no lo encuentra: cuando lo busca, esa parte todavia
esta en `display:none`.

- [x] **Probado: el arreglo que se apuntaba aqui NO se puede escribir.** Decia
      "leer tambien `#:~:text=` en el script de la cabecera", y esa premisa
      es falsa: **el navegador borra el fragmento de texto antes de que
      JavaScript pueda verlo.** Medido en Chrome, entrando a
      `/#:~:text=A%20day%20God%20gave%20away`:

      | Lo que se mira | Lo que devuelve |
      |---|---|
      | `location.hash` | `""` — vacia |
      | `location.href` | `http://.../` — sin el fragmento |
      | `document.fragmentDirective` | existe, pero `Object.keys()` da `[]` |

      No es un fallo de Chrome: lo pide el estandar (Fragment Directive). Se
      quita de la URL que ve el script **para que una pagina no pueda saber
      que texto venia buscando quien entra**, que es justo lo que habria que
      leer para arreglarlo. Se escribio el arreglo, se probo, no disparaba
      nunca, y se retiro: era codigo muerto.

      El fallo si es real, y se midio aparte para no confundir una cosa con
      la otra: un texto que vive **dentro de la parte ya abierta** si hace
      scroll (4.132 px y 5.367 px en dos pruebas), y los dos que viven en
      otra parte se quedan en la portada. O sea que el mecanismo funciona y
      lo que lo rompe es el `display:none`, como decia esta nota.

      **Lo que ve la persona no es una pagina rota**: aterriza en la portada,
      parte 1, arriba del todo. Pierde el resaltado, no el sitio.

- [ ] La unica salida de verdad es **una pagina por parte** en vez de cuatro
      partes dentro de un mismo HTML. No es poca cosa, pero de paso
      resolveria otras dos que ya estan apuntadas: cada parte tendria su URL
      propia y su `h1` sin trucos (15.a), y los eventos podrian dar
      resultado enriquecido en Google, que hoy no lo dan por vivir en una
      pagina de listado (punto 10). Solo merece la pena si Search Console
      llega a enseñar que alguien entra por estos enlaces.


### 15.d — En Windows el selector de idioma dice "ES ES"

Visto en una captura de Chrome sobre Windows a 1280 px: el boton de idioma
muestra la bandera y el codigo, pero **Windows no tiene glifo para las
banderas emoji**. En vez de dibujar la bandera, el navegador escribe las dos
letras del par de indicadores regionales, que son justo las mismas del codigo.
Resultado: "ES ES", "EN EN", "FR FR".

No lo trae este cambio, viene de antes, pero se ve en cualquier PC con Windows,
que es una parte grande de quien entra desde un ordenador. En Mac, Android e
iOS si se ve la bandera.

- [x] **Hecho: se queda el codigo y se va la bandera**, en el boton y en el
      desplegable, que ya lleva el nombre del idioma escrito. Confirmado en
      una captura de Chrome sobre Windows: el boton decia literalmente
      **"US EN"** y ahora dice "EN".

      **Cuidado si alguien deshace esto**, que es la trampa que no estaba
      escrita aqui: por debajo de 620 px la hoja escondia el codigo
      (`.lang-btn .lang-code { display: none; }`) justo porque quedaba la
      bandera. Quitar la bandera sin quitar tambien esa regla deja el boton
      **vacio** en el movil. Se ha quitado con ella. Medido: el boton pasa
      de 88 a 65 px a 1280, y de 52 a 53 px a 360 -- un pixel, asi que el
      sitio que costo ganar para "MISSIONARIES" en el punto 14.4 sigue ahi.
- [x] El dato `flag` se conserva en `js/i18n.js`, comentado y sin pintarse,
      porque guarda que pais se eligio para cada lengua (pt->BR, en->US). Si
      algun dia se quieren banderas de verdad, **tienen que ser SVG**: el
      emoji depende de la tipografia del sistema y en Windows no existe.
