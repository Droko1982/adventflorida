/* =========================================================
   library.js — la biblioteca gratuita de la seccion del libro.
   Autor: Dr. Mauricio Rodriguez Herrera

   Cada direccion de este archivo se pidio de verdad antes de
   publicarla: se comprobo el codigo, el tamano y, en los PDF,
   los primeros bytes del archivo. Un enlace que devolvia una
   pagina de error disfrazada de PDF, o un PDF de 20 KB para un
   libro entero, no entro. Comprobado el 28 de agosto de 2026.

   Si algun dia un enlace se cae, quitalo de aqui y la obra
   desaparece sola del idioma que corresponda. No hay que tocar
   nada mas. Y si desaparece de todos, desaparece la obra.

     slug   identificador interno
     grupo  start · jesus · story · daily · other
     egw    true si es de Elena White
     largo  short · medium · long (cuanto cuesta leerlo)
     ed     una entrada por idioma que SI la tiene:
              t     titulo en ese idioma
              pdf   descarga directa, si existe
              mb    tamano en MB, solo si pesa 4 o mas
              leer  lectura en linea, si existe
   ========================================================= */
window.FAM_LIBRARY = [
  {
    "slug": "steps-to-christ",
    "grupo": "start",
    "egw": true,
    "largo": "short",
    "audio": false,
    "ed": {
      "en": {
        "t": "Steps to Christ",
        "pdf": "https://media4.egwwritings.org/pdf/en_SC.pdf",
        "leer": "https://text.egwwritings.org/book/b108"
      },
      "es": {
        "t": "El Camino a Cristo",
        "pdf": "https://media4.egwwritings.org/pdf/es_CC(SC).pdf",
        "leer": "https://text.egwwritings.org/book/b1749"
      },
      "fr": {
        "t": "Vers Jésus",
        "pdf": "https://media4.egwwritings.org/pdf/fr_VJ(SC).pdf",
        "leer": "https://text.egwwritings.org/book/b235"
      },
      "pt": {
        "t": "Caminho a Cristo",
        "pdf": "https://media4.egwwritings.org/pdf/pt_CC(SC).pdf",
        "leer": "https://text.egwwritings.org/book/b11121"
      },
      "de": {
        "t": "Der bessere Weg",
        "pdf": "https://media4.egwwritings.org/pdf/de_BW(SC).pdf",
        "leer": "https://text.egwwritings.org/book/b801"
      },
      "nl": {
        "t": "Schreden naar Christus",
        "pdf": "https://media4.egwwritings.org/pdf/nl_SC(SC).pdf",
        "leer": "https://text.egwwritings.org/book/b11389"
      },
      "ru": {
        "t": "Путь ко Христу",
        "pdf": "https://media4.egwwritings.org/pdf/ru_%D0%9F%D0%A5(SC).pdf",
        "leer": "https://text.egwwritings.org/book/b1718"
      },
      "uk": {
        "t": "Дорога до Христа",
        "pdf": "https://media4.egwwritings.org/pdf/uk_%D0%94%D0%A5(SC).pdf",
        "leer": "https://text.egwwritings.org/book/b11257"
      }
    }
  },
  {
    "slug": "mount-of-blessing",
    "grupo": "start",
    "egw": true,
    "largo": "short",
    "audio": false,
    "ed": {
      "en": {
        "t": "Thoughts From the Mount of Blessing",
        "pdf": "https://media4.egwwritings.org/pdf/en_MB.pdf",
        "leer": "https://text.egwwritings.org/book/b150"
      },
      "es": {
        "t": "El Discurso Maestro de Jesucristo",
        "pdf": "https://media4.egwwritings.org/pdf/es_DMJ(MB).pdf",
        "leer": "https://text.egwwritings.org/book/b175"
      },
      "fr": {
        "t": "Heureux ceux qui",
        "pdf": "https://media4.egwwritings.org/pdf/fr_HCQ(MB).pdf",
        "leer": "https://text.egwwritings.org/book/b181"
      },
      "pt": {
        "t": "O Maior Discurso de Cristo",
        "pdf": "https://media4.egwwritings.org/pdf/pt_MDC(MB).pdf",
        "leer": "https://text.egwwritings.org/book/b1956"
      },
      "de": {
        "t": "Das bessere Leben",
        "pdf": "https://media4.egwwritings.org/pdf/de_BL(MB).pdf",
        "leer": "https://text.egwwritings.org/book/b587"
      },
      "nl": {
        "t": "Gedachten van de Berg der Zaligsprekingen",
        "pdf": "https://media4.egwwritings.org/pdf/nl_GZ(MB).pdf",
        "leer": "https://text.egwwritings.org/book/b12449"
      },
      "ru": {
        "t": "Нагорная проповедь Христа",
        "pdf": "https://media4.egwwritings.org/pdf/ru_%D0%9D%D0%9F%D0%A5(MB).pdf",
        "leer": "https://text.egwwritings.org/book/b1780"
      },
      "uk": {
        "t": "Небесні принципи щасливого життя",
        "leer": "https://text.egwwritings.org/book/b12124"
      }
    }
  },
  {
    "slug": "christs-object-lessons",
    "grupo": "start",
    "egw": true,
    "largo": "long",
    "audio": false,
    "ed": {
      "en": {
        "t": "Christ's Object Lessons",
        "pdf": "https://media4.egwwritings.org/pdf/en_COL.pdf",
        "leer": "https://text.egwwritings.org/book/b15"
      },
      "es": {
        "t": "Palabras de Vida del Gran Maestro",
        "pdf": "https://media4.egwwritings.org/pdf/es_PVGM(COL).pdf",
        "leer": "https://text.egwwritings.org/book/b210"
      },
      "fr": {
        "t": "Les Paraboles de Jésus",
        "pdf": "https://media4.egwwritings.org/pdf/fr_PJ(COL).pdf",
        "leer": "https://text.egwwritings.org/book/b197"
      },
      "pt": {
        "t": "Parábolas de Jesus",
        "pdf": "https://media4.egwwritings.org/pdf/pt_PJ(COL).pdf",
        "leer": "https://text.egwwritings.org/book/b1931"
      },
      "de": {
        "t": "Christi Gleichnisse",
        "pdf": "https://media4.egwwritings.org/pdf/de_CGl(COL).pdf",
        "leer": "https://text.egwwritings.org/book/b588"
      },
      "nl": {
        "t": "Lessen Uit Het Leven Van Alledag",
        "pdf": "https://media4.egwwritings.org/pdf/nl_LLA(COL).pdf",
        "leer": "https://text.egwwritings.org/book/b14299"
      },
      "ru": {
        "t": "Наглядные уроки Христа",
        "pdf": "https://media4.egwwritings.org/pdf/ru_%D0%9D%D0%A3%D0%A5(COL).pdf",
        "leer": "https://text.egwwritings.org/book/b1797"
      },
      "uk": {
        "t": "Наочні уроки Христа",
        "pdf": "https://media4.egwwritings.org/pdf/uk_%D0%9D%D0%A3%D0%A5(COL).pdf",
        "leer": "https://text.egwwritings.org/book/b11232"
      }
    }
  },
  {
    "slug": "desire-of-ages",
    "grupo": "jesus",
    "egw": true,
    "largo": "long",
    "audio": false,
    "ed": {
      "en": {
        "t": "The Desire of Ages",
        "pdf": "https://media4.egwwritings.org/pdf/en_DA.pdf",
        "leer": "https://text.egwwritings.org/book/b130"
      },
      "es": {
        "t": "El Deseado de Todas las Gentes",
        "pdf": "https://media4.egwwritings.org/pdf/es_DTG(DA).pdf",
        "leer": "https://text.egwwritings.org/book/b174"
      },
      "fr": {
        "t": "Jésus-Christ",
        "pdf": "https://media4.egwwritings.org/pdf/fr_JC(DA).pdf",
        "leer": "https://text.egwwritings.org/book/b187"
      },
      "pt": {
        "t": "O Desejado de Todas as Nações",
        "pdf": "https://media4.egwwritings.org/pdf/pt_DTN(DA).pdf",
        "leer": "https://text.egwwritings.org/book/b1813"
      },
      "de": {
        "t": "Das Leben Jesu",
        "pdf": "https://media4.egwwritings.org/pdf/de_LJ(DA).pdf",
        "leer": "https://text.egwwritings.org/book/b165"
      },
      "nl": {
        "t": "De Wens der Eeuwen",
        "leer": "https://text.egwwritings.org/book/b12523"
      },
      "ru": {
        "t": "Желание веков",
        "pdf": "https://media4.egwwritings.org/pdf/ru_%D0%96%D0%92(DA).pdf",
        "leer": "https://text.egwwritings.org/book/b1798"
      },
      "uk": {
        "t": "Христос — надія світу",
        "pdf": "https://media4.egwwritings.org/pdf/uk_%D0%A5%D0%9D%D0%A1(DA).pdf",
        "leer": "https://text.egwwritings.org/book/b11610"
      }
    }
  },
  {
    "slug": "ministry-of-healing",
    "grupo": "jesus",
    "egw": true,
    "largo": "long",
    "audio": false,
    "ed": {
      "en": {
        "t": "The Ministry of Healing",
        "pdf": "https://media4.egwwritings.org/pdf/en_MH.pdf",
        "leer": "https://text.egwwritings.org/book/b135"
      },
      "es": {
        "t": "El Ministerio de Curación",
        "pdf": "https://media4.egwwritings.org/pdf/es_MC(MH).pdf",
        "leer": "https://text.egwwritings.org/book/b1757"
      },
      "fr": {
        "t": "Le Ministère de la Guérison",
        "pdf": "https://media4.egwwritings.org/pdf/fr_MG(MH).pdf",
        "leer": "https://text.egwwritings.org/book/b195"
      },
      "pt": {
        "t": "A Ciência do Bom Viver",
        "pdf": "https://media4.egwwritings.org/pdf/pt_CBV(MH).pdf",
        "leer": "https://text.egwwritings.org/book/b11255"
      },
      "de": {
        "t": "Auf den Spuren des großen Arztes",
        "pdf": "https://media4.egwwritings.org/pdf/de_SGA(MH).pdf",
        "leer": "https://text.egwwritings.org/book/b788"
      },
      "nl": {
        "t": "Gezin en Gezondheid",
        "pdf": "https://media4.egwwritings.org/pdf/nl_GG(MH).pdf",
        "leer": "https://text.egwwritings.org/book/b11703"
      },
      "ru": {
        "t": "Служение исцеления",
        "pdf": "https://media4.egwwritings.org/pdf/ru_%D0%A1%D0%98(MH).pdf",
        "leer": "https://text.egwwritings.org/book/b1829"
      },
      "uk": {
        "t": "Служіння зцілення",
        "leer": "https://text.egwwritings.org/book/b12145"
      }
    }
  },
  {
    "slug": "great-controversy",
    "grupo": "story",
    "egw": true,
    "largo": "long",
    "audio": false,
    "ed": {
      "en": {
        "t": "The Great Controversy",
        "pdf": "https://media4.egwwritings.org/pdf/en_GC.pdf",
        "leer": "https://text.egwwritings.org/book/b132"
      },
      "es": {
        "t": "El Conflicto de los Siglos",
        "pdf": "https://media4.egwwritings.org/pdf/es_CS(GC).pdf",
        "leer": "https://text.egwwritings.org/book/b1710"
      },
      "fr": {
        "t": "La Tragédie des Siècles",
        "pdf": "https://media4.egwwritings.org/pdf/fr_TS(GC).pdf",
        "leer": "https://text.egwwritings.org/book/b192"
      },
      "pt": {
        "t": "O Grande Conflito",
        "pdf": "https://media4.egwwritings.org/pdf/pt_GC(GC).pdf",
        "leer": "https://text.egwwritings.org/book/b11125"
      },
      "de": {
        "t": "Der große Kampf",
        "pdf": "https://media4.egwwritings.org/pdf/de_GK(GC).pdf",
        "leer": "https://text.egwwritings.org/book/b167"
      },
      "nl": {
        "t": "De Grote Strijd Tussen Christus en Satan",
        "pdf": "https://media4.egwwritings.org/pdf/nl_GT(GC).pdf",
        "leer": "https://text.egwwritings.org/book/b11453"
      },
      "ru": {
        "t": "Великая Борьба",
        "pdf": "https://media4.egwwritings.org/pdf/ru_%D0%92%D0%91(GC).pdf",
        "leer": "https://text.egwwritings.org/book/b1800"
      },
      "uk": {
        "t": "Велика боротьба",
        "pdf": "https://media4.egwwritings.org/pdf/uk_%D0%92%D0%91(GC).pdf",
        "leer": "https://text.egwwritings.org/book/b11838"
      }
    }
  },
  {
    "slug": "patriarchs-and-prophets",
    "grupo": "story",
    "egw": true,
    "largo": "long",
    "audio": false,
    "ed": {
      "en": {
        "t": "Patriarchs and Prophets",
        "pdf": "https://media4.egwwritings.org/pdf/en_PP.pdf",
        "leer": "https://text.egwwritings.org/book/b84"
      },
      "es": {
        "t": "Historia de los Patriarcas y Profetas",
        "pdf": "https://media4.egwwritings.org/pdf/es_PP(PP).pdf",
        "leer": "https://text.egwwritings.org/book/b1704"
      },
      "fr": {
        "t": "Patriarches et Prophètes",
        "pdf": "https://media4.egwwritings.org/pdf/fr_PP(PP).pdf",
        "leer": "https://text.egwwritings.org/book/b212"
      },
      "pt": {
        "t": "Patriarcas e Profetas",
        "pdf": "https://media4.egwwritings.org/pdf/pt_PP(PP).pdf",
        "leer": "https://text.egwwritings.org/book/b1815"
      },
      "de": {
        "t": "Patriarchen und Propheten",
        "pdf": "https://media4.egwwritings.org/pdf/de_PP(PP).pdf",
        "leer": "https://text.egwwritings.org/book/b793"
      },
      "nl": {
        "t": "Patriarchen En Profeten",
        "pdf": "https://media4.egwwritings.org/pdf/nl_PEP(PP).pdf",
        "leer": "https://text.egwwritings.org/book/b12455"
      },
      "ru": {
        "t": "Патриархи и пророки",
        "pdf": "https://media4.egwwritings.org/pdf/ru_%D0%9F%D0%9F(PP).pdf",
        "leer": "https://text.egwwritings.org/book/b1802"
      },
      "uk": {
        "t": "Патріархи і пророки",
        "pdf": "https://media4.egwwritings.org/pdf/uk_%D0%9F%D0%9F(PP).pdf",
        "leer": "https://text.egwwritings.org/book/b11265"
      }
    }
  },
  {
    "slug": "prophets-and-kings",
    "grupo": "story",
    "egw": true,
    "largo": "long",
    "audio": false,
    "ed": {
      "en": {
        "t": "Prophets and Kings",
        "pdf": "https://media4.egwwritings.org/pdf/en_PK.pdf",
        "leer": "https://text.egwwritings.org/book/b88"
      },
      "es": {
        "t": "Profetas y Reyes",
        "pdf": "https://media4.egwwritings.org/pdf/es_PR(PK).pdf",
        "leer": "https://text.egwwritings.org/book/b217"
      },
      "fr": {
        "t": "Prophètes et Rois",
        "pdf": "https://media4.egwwritings.org/pdf/fr_PR(PK).pdf",
        "leer": "https://text.egwwritings.org/book/b219"
      },
      "pt": {
        "t": "Profetas e Reis",
        "pdf": "https://media4.egwwritings.org/pdf/pt_PR(PK).pdf",
        "leer": "https://text.egwwritings.org/book/b1816"
      },
      "de": {
        "t": "Propheten und Könige",
        "pdf": "https://media4.egwwritings.org/pdf/de_PK(PK).pdf",
        "leer": "https://text.egwwritings.org/book/b218"
      },
      "nl": {
        "t": "Profeten En Koningen",
        "pdf": "https://media4.egwwritings.org/pdf/nl_PeK(PK).pdf",
        "leer": "https://text.egwwritings.org/book/b12453"
      },
      "ru": {
        "t": "Пророки и цари",
        "pdf": "https://media4.egwwritings.org/pdf/ru_%D0%9F%D0%A6(PK).pdf",
        "leer": "https://text.egwwritings.org/book/b1801"
      },
      "uk": {
        "t": "Пророки і царі",
        "leer": "https://text.egwwritings.org/book/b11956"
      }
    }
  },
  {
    "slug": "acts-of-the-apostles",
    "grupo": "story",
    "egw": true,
    "largo": "long",
    "audio": false,
    "ed": {
      "en": {
        "t": "The Acts of the Apostles",
        "pdf": "https://media4.egwwritings.org/pdf/en_AA.pdf",
        "leer": "https://text.egwwritings.org/book/b127"
      },
      "es": {
        "t": "Los Hechos de los Apóstoles",
        "pdf": "https://media4.egwwritings.org/pdf/es_HAp(AA).pdf",
        "leer": "https://text.egwwritings.org/book/b198"
      },
      "fr": {
        "t": "Conquérants Pacifiques",
        "pdf": "https://media4.egwwritings.org/pdf/fr_CP(AA).pdf",
        "leer": "https://text.egwwritings.org/book/b158"
      },
      "pt": {
        "t": "Atos Dos Apóstolos",
        "pdf": "https://media4.egwwritings.org/pdf/pt_AA(AA).pdf",
        "leer": "https://text.egwwritings.org/book/b1806"
      },
      "de": {
        "t": "Das Wirken der Apostel",
        "pdf": "https://media4.egwwritings.org/pdf/de_WA(AA).pdf",
        "leer": "https://text.egwwritings.org/book/b813"
      },
      "ru": {
        "t": "Деяния апостолов",
        "pdf": "https://media4.egwwritings.org/pdf/ru_%D0%94%D0%90(AA).pdf",
        "leer": "https://text.egwwritings.org/book/b1785"
      },
      "uk": {
        "t": "Дії апостолів",
        "leer": "https://text.egwwritings.org/book/b11875"
      }
    }
  },
  {
    "slug": "education",
    "grupo": "daily",
    "egw": true,
    "largo": "medium",
    "audio": false,
    "ed": {
      "en": {
        "t": "Education",
        "pdf": "https://media4.egwwritings.org/pdf/en_Ed.pdf",
        "leer": "https://text.egwwritings.org/book/b29"
      },
      "es": {
        "t": "La Educación",
        "pdf": "https://media4.egwwritings.org/pdf/es_ED(Ed).pdf",
        "leer": "https://text.egwwritings.org/book/b1702"
      },
      "fr": {
        "t": "Éducation",
        "pdf": "https://media4.egwwritings.org/pdf/fr_%C3%89d(Ed).pdf",
        "leer": "https://text.egwwritings.org/book/b170"
      },
      "pt": {
        "t": "Educação",
        "pdf": "https://media4.egwwritings.org/pdf/pt_Ed(Ed).pdf",
        "leer": "https://text.egwwritings.org/book/b1948"
      },
      "de": {
        "t": "Erziehung",
        "pdf": "https://media4.egwwritings.org/pdf/de_ERZ(Ed).pdf",
        "leer": "https://text.egwwritings.org/book/b791"
      },
      "nl": {
        "t": "Karaktervorming",
        "pdf": "https://media4.egwwritings.org/pdf/nl_Ka(Ed).pdf",
        "leer": "https://text.egwwritings.org/book/b14298"
      },
      "ru": {
        "t": "Воспитание",
        "pdf": "https://media4.egwwritings.org/pdf/ru_%D0%92%D0%BE%D1%81(Ed).pdf",
        "leer": "https://text.egwwritings.org/book/b1867"
      },
      "uk": {
        "t": "Виховання та освіта",
        "leer": "https://text.egwwritings.org/book/b12328"
      }
    }
  },
  {
    "slug": "adventist-home",
    "grupo": "daily",
    "egw": true,
    "largo": "long",
    "audio": false,
    "ed": {
      "en": {
        "t": "The Adventist Home",
        "pdf": "https://media4.egwwritings.org/pdf/en_AH.pdf",
        "leer": "https://text.egwwritings.org/book/b128"
      },
      "es": {
        "t": "El Hogar Cristiano",
        "pdf": "https://media4.egwwritings.org/pdf/es_HC(AH).pdf",
        "leer": "https://text.egwwritings.org/book/b177"
      },
      "fr": {
        "t": "Le Foyer Chrétien",
        "pdf": "https://media4.egwwritings.org/pdf/fr_FC(AH).pdf",
        "leer": "https://text.egwwritings.org/book/b193"
      },
      "pt": {
        "t": "O Lar Adventista",
        "pdf": "https://media4.egwwritings.org/pdf/pt_LA(AH).pdf",
        "leer": "https://text.egwwritings.org/book/b1955"
      },
      "de": {
        "t": "Glück fängt zu Hause an",
        "pdf": "https://media4.egwwritings.org/pdf/de_GFH(AH).pdf",
        "leer": "https://text.egwwritings.org/book/b792"
      },
      "ru": {
        "t": "Христианский дом",
        "pdf": "https://media4.egwwritings.org/pdf/ru_%D0%A5%D0%94(AH).pdf",
        "leer": "https://text.egwwritings.org/book/b1803"
      },
      "uk": {
        "t": "Християнська родина",
        "leer": "https://text.egwwritings.org/book/b12131"
      }
    }
  },
  {
    "slug": "counsels-diet-foods",
    "grupo": "daily",
    "egw": true,
    "largo": "long",
    "audio": false,
    "ed": {
      "en": {
        "t": "Counsels on Diet and Foods",
        "pdf": "https://media4.egwwritings.org/pdf/en_CD.pdf",
        "leer": "https://text.egwwritings.org/book/b384"
      },
      "es": {
        "t": "Consejos Sobre el Régimen Alimenticio",
        "pdf": "https://media4.egwwritings.org/pdf/es_CRA(CD).pdf",
        "leer": "https://text.egwwritings.org/book/b1697"
      },
      "fr": {
        "t": "Conseils sur la Nutrition et les Aliments",
        "pdf": "https://media4.egwwritings.org/pdf/fr_CNA(CD).pdf",
        "leer": "https://text.egwwritings.org/book/b161"
      },
      "pt": {
        "t": "Conselhos sobre o Regime Alimentar",
        "pdf": "https://media4.egwwritings.org/pdf/pt_CRA(CD).pdf",
        "leer": "https://text.egwwritings.org/book/b11093"
      },
      "ru": {
        "t": "Основы здорового питания",
        "pdf": "https://media4.egwwritings.org/pdf/ru_%D0%9F%D0%B8%D1%82(CD).pdf",
        "leer": "https://text.egwwritings.org/book/b1786"
      },
      "uk": {
        "t": "Поради щодо їжі та харчування",
        "leer": "https://text.egwwritings.org/book/b12203"
      }
    }
  },
  {
    "slug": "holy-bible",
    "grupo": "other",
    "egw": false,
    "largo": "",
    "audio": false,
    "ed": {
      "en": {
        "t": "World English Bible",
        "pdf": "https://ebible.org/pdf/engwebp/engwebp_all.pdf",
        "mb": 9,
        "leer": "https://ebible.org/engwebp/"
      },
      "es": {
        "t": "Reina-Valera 1909",
        "pdf": "https://ebible.org/pdf/spaRV1909/spaRV1909_all.pdf",
        "mb": 9,
        "leer": "https://ebible.org/spaRV1909/"
      },
      "fr": {
        "t": "Louis Segond 1910",
        "pdf": "https://ebible.org/pdf/fraLSG/fraLSG_all.pdf",
        "mb": 12,
        "leer": "https://ebible.org/fraLSG/"
      },
      "ht": {
        "t": "Bib La",
        "pdf": "https://ebible.org/pdf/hat/hat_all.pdf",
        "mb": 10,
        "leer": "https://ebible.org/hat/"
      },
      "pt": {
        "t": "Bíblia Livre",
        "pdf": "https://ebible.org/pdf/porbr2018/porbr2018_all.pdf",
        "mb": 9,
        "leer": "https://ebible.org/porbr2018/"
      },
      "de": {
        "t": "Lutherbibel 1912",
        "pdf": "https://ebible.org/pdf/deu1912/deu1912_all.pdf",
        "mb": 8,
        "leer": "https://ebible.org/deu1912/"
      },
      "nl": {
        "t": "NBG-vertaling 1951",
        "pdf": "https://ebible.org/pdf/nldnbg/nldnbg_all.pdf",
        "mb": 9,
        "leer": "https://ebible.org/nldnbg/"
      },
      "ru": {
        "t": "Синодальный перевод",
        "pdf": "https://ebible.org/pdf/russyn/russyn_all.pdf",
        "mb": 8,
        "leer": "https://ebible.org/russyn/"
      },
      "uk": {
        "t": "Біблія",
        "pdf": "https://ebible.org/pdf/ukr1996/ukr1996_all.pdf",
        "mb": 9,
        "leer": "https://ebible.org/ukr1996/"
      }
    }
  },
  {
    "slug": "sabbath-school",
    "grupo": "other",
    "egw": false,
    "largo": "",
    "audio": false,
    "ed": {
      "en": {
        "t": "Sabbath School Bible Study Guide",
        "leer": "https://sabbath-school.adventech.io/en"
      },
      "es": {
        "t": "Guia de Estudio de la Biblia, Escuela Sabatica",
        "leer": "https://sabbath-school.adventech.io/es"
      },
      "fr": {
        "t": "Guide d'etude de la Bible, Ecole du Sabbat",
        "leer": "https://sabbath-school.adventech.io/fr"
      },
      "ht": {
        "t": "Repo nan Kris la — Jiye · Dawou · Septanm 2021",
        "leer": "https://sabbath-school.adventech.io/ht"
      },
      "pt": {
        "t": "Guia de Estudo da Biblia, Escola Sabatina",
        "leer": "https://sabbath-school.adventech.io/pt"
      },
      "de": {
        "t": "Bibelstudien zur Sabbatschule",
        "leer": "https://sabbath-school.adventech.io/de"
      },
      "nl": {
        "t": "Bijbelstudiegids voor de sabbatschool",
        "leer": "https://sabbath-school.adventech.io/nl"
      },
      "ru": {
        "t": "Пособие по изучению Библии в субботней школе",
        "leer": "https://sabbath-school.adventech.io/ru"
      },
      "uk": {
        "t": "Посібник з вивчення Біблії в суботній школі",
        "leer": "https://sabbath-school.adventech.io/uk"
      }
    }
  },
  {
    "slug": "glow-tracts",
    "grupo": "other",
    "egw": false,
    "largo": "short",
    "audio": false,
    "ed": {
      "en": {
        "t": "GLOW Digital Sharing Center — English",
        "leer": "https://www.glowonline.org/digital/english"
      },
      "es": {
        "t": "GLOW Centro Digital — Español",
        "leer": "https://www.glowonline.org/digital/espanol"
      },
      "nl": {
        "t": "GLOW Nederlands",
        "leer": "https://www.glowonline.org/glow-dutch/"
      },
      "de": {
        "t": "GLOW Deutsch",
        "leer": "https://www.glowonline.org/glow-german/"
      },
      "fr": {
        "t": "GLOW Français",
        "leer": "https://www.glowonline.org/francais/"
      },
      "pt": {
        "t": "GLOW Português",
        "leer": "https://www.glowonline.org/glow-portuguese/"
      },
      "ru": {
        "t": "GLOW Русский",
        "leer": "https://www.glowonline.org/glow-russian/"
      }
    }
  },
  {
    "slug": "egw-prayer-1903",
    "grupo": "other",
    "egw": true,
    "largo": "short",
    "audio": false,
    "ed": {
      "ht": {
        "t": "Lapriyè Mesajè Senyè a",
        "pdf": "https://whiteestate.org/documents/46/Prayer_DIGITAL_HAITIAN_CREOLE.pdf",
        "leer": "https://whiteestate.org/resources/gc-session/egw-prayer/gc-prayer-ht/"
      },
      "en": {
        "t": "Prayer of the Lord's Messenger",
        "pdf": "https://whiteestate.org/documents/39/Prayer_DIGITAL_ENGLISH.pdf",
        "leer": "https://whiteestate.org/resources/gc-session/egw-prayer/gc-prayer-en/"
      },
      "es": {
        "t": "Oración de la mensajera del Señor",
        "pdf": "https://whiteestate.org/documents/58/Prayer_DIGITAL_SPANISH.pdf",
        "leer": "https://whiteestate.org/resources/gc-session/egw-prayer/gc-prayer-es/"
      },
      "fr": {
        "t": "Prière de la messagère du Seigneur",
        "pdf": "https://whiteestate.org/documents/44/Prayer_DIGITAL_FRENCH.pdf",
        "leer": "https://whiteestate.org/resources/gc-session/egw-prayer/gc-prayer-fr/"
      },
      "pt": {
        "t": "Oração da Mensageira do Senhor",
        "pdf": "https://whiteestate.org/documents/53/Prayer_DIGITAL_PORTUGUESE.pdf",
        "leer": "https://whiteestate.org/resources/gc-session/egw-prayer/gc-prayer-pt/"
      },
      "de": {
        "t": "Ein Gebet von Ellen White, der Botin Gottes",
        "pdf": "https://whiteestate.org/documents/45/Prayer_DIGITAL_GERMAN.pdf",
        "leer": "https://whiteestate.org/resources/gc-session/egw-prayer/gc-prayer-de/"
      },
      "ru": {
        "t": "Молитва вестницы Божьей",
        "pdf": "https://whiteestate.org/documents/55/Prayer_DIGITAL_RUSSIAN.pdf",
        "leer": "https://whiteestate.org/resources/gc-session/egw-prayer/gc-prayer-ru/"
      }
    }
  }
];
