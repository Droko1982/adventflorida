# Florida Advent Missionaries

Sitio web del grupo misionero laico adventista **Florida Advent Missionaries Inc.**
(Delray Beach, FL — servicio a todo el estado de Florida).

> **Live:** https://droko1982.github.io/adventflorida/

El objetivo del sitio es uno solo: **acercar personas a Jesucristo** como guia y
salvador, y darles herramientas gratuitas para seguir ese camino — estudios biblicos,
oracion y el libro *Steps to Christ* — en el idioma que hablan.

## Que incluye

| Bloque | Contenido |
|---|---|
| **Hero + versiculos** | 4 versiculos que rotan, traducidos a los 9 idiomas |
| **Alguien cerca de ti** | Eliges ciudad e idioma y te dice cuando empieza el sabado ahi, a donde ir y quien te espera |
| **Quienes somos** | Grupo laico, cobertura estatal, 4 tarjetas de valor |
| **Video** | Canal oficial de YouTube, con carga diferida (privacidad) |
| **Cristo** | El evangelio en 4 pasos + llamado a la decision |
| **Steps to Christ** | Libro gratis: PDF por idioma, lectura online y copia impresa |
| **Creencias** | 8 preguntas frecuentes de doctrina, con textos biblicos |
| **El sabado** | Reloj del ocaso para 22 ciudades, el evangelio primero, linea de tiempo del dia, que esperar en tu primera visita y 5 preguntas sinceras |
| **Estudios biblicos** | 4 series + 3 pasos para empezar |
| **Ministerios** | 6 frentes de trabajo |
| **Misiones** | Eventos pasados y proximos, repartidos solos por fecha, con datos estructurados |
| **Oracion** | Formulario que compone un mensaje de WhatsApp (sin backend) |
| **Donaciones** | 501(c)(3): online, voluntariado y cheque por correo |
| **Recursos** | 6 enlaces externos verificados |
| **FAQ + contacto** | 6 preguntas y canales directos |

## El sabado y el reloj del ocaso

El sabado va de la puesta de sol del viernes a la del sabado, asi que la hora
cambia cada semana y cada ciudad. `js/sabbath.js` la calcula en el navegador con
el algoritmo NOAA: 22 ciudades de Florida, los dos husos horarios del estado
(el Panhandle occidental va en hora central) y el horario de verano resuelto por
`Intl`. Sin API y sin red.

Coincide **exactamente** con las tablas del Observatorio Naval de EE. UU. y queda
dentro de un minuto de la tabla oficial de la Florida Conference en sus seis
ciudades. El contenido de la seccion salio de una investigacion con verificacion
adversarial (158 afirmaciones confirmadas, 12 descartadas por erroneas); el
resumen esta en [tools/research/](tools/research/).

## A donde ir, ciudad por ciudad

Una persona desconocida llega con dos preguntas: **cuando** y **donde**. El
bloque que hay justo debajo del hero las responde. La hora del ocaso se calcula
sola y es real desde el primer dia; lo demas se rellena en
[js/near.js](js/near.js), un archivo por ciudad con la iglesia, la direccion, el
mapa, la hora del culto, los idiomas y el nombre de quien va a esperar fuera.

Mientras una ciudad no tenga datos, la pagina **lo dice** en lugar de inventarse
una direccion. Mandar a alguien a un sitio equivocado un sabado por la manana es
peor que no mandarlo.

Se edita igual que los eventos: desde el navegador, en GitHub, sin instalar nada.

## Misiones y eventos

Toda la seccion sale de **`js/events.js`**, que es el unico archivo que hay que
tocar para anadir un evento. Esta escrito para alguien que no programa: cada
campo explicado, ejemplos listos para copiar y pegar, y las instrucciones para
editarlo **desde el navegador**, sin instalar nada.

Para anadir un evento sin salir de GitHub:

1. Entra a [js/events.js](https://github.com/Droko1982/adventflorida/blob/main/js/events.js)
2. Pulsa el lapiz de **Edit**
3. Copia uno de los ejemplos, pegalo dentro de los corchetes y cambia los datos
4. **Commit changes**

En dos o tres minutos aparece en la web. La pagina lo coloca sola en *proximos*
o en *ya realizados* comparando la fecha con el dia de hoy en Florida.

**Los idiomas.** No hace falta escribir cada evento nueve veces. Se escribe una
vez en el idioma que sea, se marca con `lang`, y la pagina avisa con una linea
pequena en que idioma esta. Si hay traduccion para algun idioma, se pone como
objeto y ese idioma la recibe. Exigir nueve traducciones por evento seria
garantizar que nadie publique nada.

Las fotos van en `assets/eventos/`. Las normas (tamano, formato y el permiso
para publicar caras) estan en [assets/eventos/README.md](assets/eventos/README.md).

## Nueve idiomas

`EN` `ES` `FR` `HT (Kreyol Ayisyen)` `PT` `DE` `NL` `RU` `UK`

- Deteccion automatica: `?lang=xx` -> `localStorage` -> idioma del navegador -> ingles.
- El selector cambia todo el contenido **sin recargar**, incluidos los enlaces del libro.
- 228 claves por idioma. `js/qa` cruza el HTML contra los 9 diccionarios.

## Modo claro / oscuro

Tokens CSS en `:root` y `[data-theme="dark"]`. El tema se resuelve **antes del primer
pintado** con un script inline, asi que no hay parpadeo blanco. Se recuerda en
`localStorage` y respeta `prefers-color-scheme` la primera vez.

## Estructura

### Las cuatro partes

Las 17 secciones no se ven de una vez: van repartidas en cuatro partes y solo
una esta en pantalla. Antes eran 15.000 px de desplazamiento en el movil, y
quien llegaba buscando el libro pasaba por delante de la oracion, del sabado y
de los ministerios para encontrarlo.

| Parte (id) | Se lee | Puerta | Secciones |
|---|---|---|---|
| `parte-quienes` | Inicio | `#inicio` | inicio, cerca, quienes, testimonios, ministerios, unirse, misiones |
| `parte-fe` | Jesus y nuestra fe | `#cristo` | cristo, creencias, sabado |
| `parte-recursos` | Recursos gratis | `#libro` | libro, biblioteca, estudios, recursos |
| `parte-contacto` | Contactenos | `#oracion` | oracion, faq, donar, contacto |

El nombre que se lee sale de las claves `part.about`, `part.faith`, `part.free`
y `part.connect`, asi que cambia con el idioma; el id no. La "puerta" es la
primera seccion de cada parte, que es a donde apunta su enlace del menu:
`tools/test-rhythm.js` comprueba que no se desemparejen.

El reparto se declara **una sola vez**, en `window.FAM_PARTES`, dentro de un
script inline de la cabecera de `index.html`. Esta arriba porque la parte hay
que elegirla antes del primer fotograma: si se decidiera en `main.js` se veria
la pagina entera un instante antes de encogerse. `js/main.js` lee ese mismo
reparto para abrir la parte que toca al pulsar un enlace, al entrar por una
direccion con ancla y al usar el boton de atras.

Quien lo pinta es el atributo `data-parte` del `<html>`, con cuatro reglas en
`css/styles.css`. **Sin JavaScript el atributo no existe, las reglas no
enganchan y la pagina se ve entera y seguida**, que es lo que sale al imprimir
y lo que ven los rastreadores que no ejecutan JavaScript — entre ellos el de
WhatsApp y el de Facebook, que son los que montan la vista previa del enlace.

Googlebot **si** ejecuta JavaScript, asi que no ve eso: ve lo mismo que una
persona, una parte pintada y tres en `display:none`. Son 27.730 de 36.699
caracteres, el 76 % del texto. Google lo indexa igual —su politica sobre
contenido en pestanas es explicita desde la indexacion movil primero— pero
conviene tenerlo apuntado: si algun dia baja el trafico de una seccion
concreta, esto es lo primero que hay que mirar.

El reparto tiene que funcionar con **solo el script de la cabecera**. Ese
script esconde tres cuartas partes del sitio, asi que si lo unico capaz de
volver a ensenarlas fuera `js/main.js` —el ultimo archivo del cuerpo— bastaria
con que no cargara para que diez secciones dejaran de existir. Medido en un
movil a 400 kbps, el boton del hero se puede pulsar a los 7,5 s y `main.js` no
termina hasta los 10,5. Por eso el script de la cabecera escucha `hashchange`
y abre la parte por su cuenta; `main.js`, cuando llega, se adelanta con
`pushState`, que no dispara `hashchange`, y los dos no se pisan.
`tools/test-browser.js` prueba el sitio con `js/main.js` bloqueado.

Para mover una seccion de parte hay que tocar tres sitios: la lista de
`FAM_PARTES`, el `<div class="part">` en el que vive en el HTML, y su enlace en
el menu movil y en el pie. `node tools/test-rhythm.js` avisa si al moverla
quedan dos fondos iguales pegados dentro de una parte.

### Los archivos

```
index.html          Pagina unica, en cuatro partes
404.html            Pagina de error con versiculo
css/styles.css      Sistema de diseno completo (tokens, componentes, responsive)
js/i18n.js          Lista de los 9 idiomas y enlaces del libro
js/lang/<cod>.js    Un diccionario por idioma (solo se descarga el que se usa)
js/sabbath.js       Calculo del ocaso (NOAA) y ventana del sabado
js/near.js          A donde ir por ciudad (el archivo que editan los voluntarios)
js/events.js        Los eventos de misiones (el archivo que editan los voluntarios)
js/library.js       La biblioteca gratuita: 16 obras, 124 ediciones comprobadas
js/main.js          Tema, idioma, versiculos, sabado, formularios, donaciones
tools/              Herramientas de mantenimiento y pruebas (ver abajo)
assets/             Iconos PWA, favicon SVG e imagen Open Graph
manifest.json       PWA instalable
sitemap.xml         9 URLs con hreflang cruzado
robots.txt
```

Sin dependencias, sin build, sin framework. HTML + CSS + JS vanilla.

## Herramientas

```
node tools/test-listo.js                     QUE FALTA PARA PUBLICAR: lo que esta vacio, no lo que esta mal
node tools/test-enlaces.js                   pide los 217 enlaces externos y dice cuales se han caido
node tools/test-sunset.js                    comprueba el calculo del ocaso
node tools/test-i18n.js                      cruza el HTML contra los 9 idiomas
node tools/test-page.js                      carga la pagina en un DOM y la prueba entera
node tools/test-forms.js                     los dos formularios, en sus dos modos
node tools/test-gospel.js                    la seccion del evangelio, doctrina incluida
node tools/test-promesas.js                  que no se prometa lo que no hay, ni se asuma el sexo del lector
node tools/test-browser.js                   abre un Chrome de verdad y pulsa todo (necesita puppeteer-core)
node tools/test-contrast.js                  comprueba el contraste WCAG de la paleta
node tools/test-responsive.js                telefono, tableta y escritorio
node tools/test-rhythm.js                    alternancia de fondos y ritmo de secciones
node tools/test-seo.js                       audita 40 puntos de SEO y estructura
node tools/test-loader.js                    comprueba que solo se descarga un idioma
node tools/patch-i18n.js <parche.json>       edita los 9 diccionarios sin romper el formato
node tools/cambiar-dominio.js <dominio>      cambia el sitio de direccion (--prueba para ver antes)
node tools/gen-biblioteca-jsonld.js          rehace los datos estructurados de la biblioteca
```

`test-page.js`, `test-forms.js` y `test-gospel.js` necesitan jsdom, que no es dependencia del sitio:
`npm install --no-save jsdom`.

Para anadir o cambiar textos, **no edites los `js/lang/*.js` a mano**: escribe
un parche en `tools/patches/` y pasalo por `patch-i18n.js`. Asi es imposible que
un idioma se quede atras.

## Donaciones

Todo lo que hay que tocar esta al principio de `js/main.js`:

```js
var GIVE = { online: "", zelle: "" };
```

Rellena un valor y su boton aparece solo. Mientras esten vacios, la pagina solo
ofrece WhatsApp y cheque por correo, asi que nunca se muestra un boton roto.

## Contacto en linea

En `js/main.js`, justo debajo de `GIVE`:

```js
var CONTACT = {
  email: "fladventmissionaries@gmail.com",
  token: ""      // cadena de FormSubmit; si esta puesta, se usa ella
};
```

El formulario de contacto y el de peticiones de oracion envian **desde la propia
pagina** via FormSubmit: sin servidor, sin coste, y sin que el visitante tenga que
salir ni tener WhatsApp. La primera vez, FormSubmit manda al buzon un enlace de
activacion que hay que pulsar una sola vez.

`token` es opcional pero recomendado: con la cadena que da FormSubmit despues de
activar, la direccion deja de aparecer en el codigo publico.

Con el correo vacio, los dos formularios siguen funcionando y entregan por
WhatsApp. El aviso de privacidad debajo de cada uno cambia solo para decir en cada
caso lo que de verdad pasa con el mensaje.

**FormSubmit contesta HTTP 200 aunque rechace el envio** (por ejemplo mientras el
formulario no esta activado): el motivo va dentro, en `success`. El sitio mira el
cuerpo y no el codigo, asi que nunca dice "enviado" a alguien cuyo mensaje no
salio. Lo cubre `tools/test-forms.js`.

## SEO

- `hreflang` cruzado para los 9 idiomas + `x-default`, en `<head>` y en el sitemap.
- Datos estructurados: `Organization`, `Book`, `FAQPage`, `WebSite` y `Event` cuando hay eventos.
- Open Graph y Twitter Card con imagen 1200x630 propia.
- `<title>` y `meta description` se traducen al cambiar de idioma.
- Geo-meta de Delray Beach; `areaServed` incluye Florida, EE. UU. y alcance online mundial.

## Steps to Christ — enlaces

Los PDF estan alojados por el **Ellen G. White Estate** (dominio publico).
Enlaces directos verificados: `en` `es` `fr` `pt` `de` `nl`.
Para `ht` `ru` `uk` el boton abre la biblioteca gratuita en ese idioma
(`text.egwwritings.org/allCollection/<lang>`) y el sitio lo indica en el aviso.

## Contacto de la organizacion

- WhatsApp / telefono: **+1 786 239 2331**
- Direccion: 206 SW 7th St, Delray Beach, FL 33444
- EIN: 81-1180614 (501(c)(3))
- YouTube: [@FloridaAdventMissionaries](https://www.youtube.com/@FloridaAdventMissionaries)
- Facebook: [floridaadvent](https://www.facebook.com/floridaadvent/)

## Autoria

Sitio concebido y desarrollado por el **Dr. Mauricio Rodriguez Herrera**.
Ver [AUTHORS.md](AUTHORS.md).
