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
| **Quienes somos** | Grupo laico, cobertura estatal, 4 tarjetas de valor |
| **Video** | Canal oficial de YouTube, con carga diferida (privacidad) |
| **Cristo** | El evangelio en 4 pasos + llamado a la decision |
| **Steps to Christ** | Libro gratis: PDF por idioma, lectura online y copia impresa |
| **Creencias** | 8 preguntas frecuentes de doctrina, con textos biblicos |
| **El sabado** | Reloj del ocaso para 22 ciudades, el evangelio primero, linea de tiempo del dia, que esperar en tu primera visita y 5 preguntas sinceras |
| **Estudios biblicos** | 4 series + 3 pasos para empezar |
| **Ministerios** | 6 frentes de trabajo |
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

```
index.html          Pagina unica con todas las secciones
404.html            Pagina de error con versiculo
css/styles.css      Sistema de diseno completo (tokens, componentes, responsive)
js/i18n.js          EN · ES · FR
js/i18n2.js         HT · PT · DE
js/i18n3.js         NL · RU · UK
js/sabbath.js       Calculo del ocaso (NOAA) y ventana del sabado
js/main.js          Tema, idioma, versiculos, WhatsApp, video, sabado, donaciones
tools/              Herramientas de mantenimiento y pruebas (ver abajo)
assets/             Iconos PWA, favicon SVG e imagen Open Graph
manifest.json       PWA instalable
sitemap.xml         9 URLs con hreflang cruzado
robots.txt
```

Sin dependencias, sin build, sin framework. HTML + CSS + JS vanilla.

## Herramientas

```
node tools/test-sunset.js                    comprueba el calculo del ocaso
node tools/test-i18n.js                      cruza el HTML contra los 9 idiomas
node tools/test-page.js                      carga la pagina en un DOM y la prueba entera
node tools/patch-i18n.js <parche.json>       edita los 9 diccionarios sin romper el formato
```

`test-page.js` necesita jsdom, que no es dependencia del sitio:
`npm install --no-save jsdom`.

Para anadir o cambiar textos, **no edites los tres `js/i18n*.js` a mano**: escribe
un parche en `tools/patches/` y pasalo por `patch-i18n.js`. Asi es imposible que
un idioma se quede atras.

## Donaciones

Todo lo que hay que tocar esta al principio de `js/main.js`:

```js
var GIVE = { online: "", zelle: "" };
```

Rellena un valor y su boton aparece solo. Mientras esten vacios, la pagina solo
ofrece WhatsApp y cheque por correo, asi que nunca se muestra un boton roto.

## SEO

- `hreflang` cruzado para los 9 idiomas + `x-default`, en `<head>` y en el sitemap.
- Datos estructurados: `Organization` (con `DonateAction`), `Book`, `FAQPage`, `WebSite`.
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
