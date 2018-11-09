// Déclaration des variables.
/*property
    an, annee, auteur1, auteur2, backglassbutton, backimg, changelog, click, fabricant,
    getDate, getFullYear, getMonth, hide, infos, jour, length, message, modifications,
    mois, notes, on, show, slice, substr, tablebutton, toString, urlbackglass,
    urlbackglass2, urlbackground, urldb2s, urlipdb, urlipdb2, urlmediapack, urlminiwheel,
    urlminiwheel2, urlplayfield, urlplayfield2, urlsujet, urltable, urlvignbackglass,
    urlvignbackglass2, urlvignplayfield, urlvignplayfield2, val, value, version
*/

"use strict";
var auteur;
var confirm;
var datejournew;
var datejourold;
var datemoisnew;
var datemoisold;
var dateannew;
var dateanold;
var fabricant;
var tablebutton;
var backglassbutton;
var codehtmlfiche;
var codesupportfiche;
var importtoastr = false;
var infosfiche;
var presentationtable;
var tablelinks;
var zoneinfo;
var pseudofiche0 = "";
var pseudofiche1 = "";
var pseudofiche2 = "";
var pseudofiche3 = "";
var tablecolspan;
var tablewidth;
var teampptable = "";
var titretable = false;
var urlipdb;
var urlipdb2 = "";
var urlsujet;
var urlmediapack;
var urltable;
var urldb2s;
var urlbackglass;
var urlbackground;
var username = _userdata["username"];
var versionnew;
var versionold;

// Notifications.
toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

// Infobulles.
$(document).tooltip({
  show: {
    effect: "none",
    delay: 250,
  },
  hide: false,
  content: function () {
    return $(this).prop("title");
  },
  open: function (event, ui) {
   setTimeout(function(){
     $(ui.tooltip).hide();
   }, 3000);
  }
});

/*$("#auteurfiche").selectmenu();
$("#editeurfiche").selectmenu();
$("#raisonfiche").selectmenu();
$("#fabricant").selectmenu();*/

// Détection du navigateur utilisé (le formulaire n'est pas compatible Internet Explorer).
$(function () {
  var agent = window.navigator.userAgent;
  if (agent.indexOf("MSIE ") > 0 || agent.indexOf("Trident/") > 0 || agent.indexOf("Edge/") > 0) {
    alert("ATTENTION : vous utilisez Internet Explorer ou Edge.\n\nLe code JavaScript utilisé par ce formulaire n'est pas compatible avec ces navigateurs, qui peuvent générer des dysfonctionnements.\n\nLes boutons Aperçu et Publier sont donc désactivés.");
    $("#apercu, #saveform").prop("disabled", "disabled").fadeTo("fast", 0.33);
  }
});

// Notification de bienvenue.
  toastr.info("Bienvenue dans le formulaire de création de fiche de table VPX <img src='https://illiweb.com/fa/i/smiles/icon_wink.gif?t=1519062584'>","<b><font color='yellow'>" + _userdata["username"] + "</font></b>", { timeOut: 6000 });

// Un clic dans un champ de type texte (sauf le titre), nombre ou URL sélectionne tout son contenu = gain de temps en importation de fiche.
$("input[type=text]:not(#titre), input[type=number], input[type=url]").on("click", function () {
  if ($(this).val() !== "" || $(this).val() !== null) {
    $(this).select();
  }
});

// Case à cocher [MÉDIA PACK À FAIRE] / [AJOUT MÉDIA PACK] et Team PP désactivées par défaut et activée si Titre !== "".
$("#mpafaire, #tableteampp, #ajoutmp").prop("disabled", true).fadeTo("fast", 0.33);
$("#mpafairetitre, #tableteampptitre, #ajoutmptitre").prop("title", "<i>Option désactivée car le champ </i>Titre<i> est vide.</i>");

// Fonction de mise en capitales (titre et auteurs).
String.prototype.toCapital = function () {
  return this.toLowerCase().split(" ").map(function (i) {
    if (!i.charAt(0).match("[a-zA-Z]+")) {
      return i.charAt(0) + i.substr(1,1).toUpperCase() + i.substr(2);
    } else {
      return i.charAt(0).toUpperCase() + i.substr(1);
    }
  }).join(" ");
};

/* Définition du sous-forum dans lequel sera postée la fiche.
   Dans l'immédiat les membres ne peuvent poster que dans la section "Tables à valider". */
if ($.inArray(_userdata["user_id"], [4429]) != -1) {
  $("#subf2, #subf3, #subf4").prop("disabled", true);
  $("#subf1").prop("checked", true);
};

$("input[type=radio][name=subf]").change(function() {
  $("#subforum").val($(this).val());
  var choixf = $("#subforum").val();
  alert(choixf);
  if (choixf === "110" || choixf === "96" || choixf === "108") {
    if ($("#tableteampp").is(":checked") && $("#auteur1").val() !== "Team PP") {
      $("#tableteampp").prop("checked", false).change();
    }
  } else if (choixf === "81" && $("#auteur1").val() === "Team PP") {
    $("#tableteampp").prop("checked", true).change();
  }
});

// Affichage créateur / éditeur / raison édition fiche.
disableediteurraison();

function disableediteurraison () {
  $("#editeurficherequis, #raisonficherequis").css("display", "none");
  $("#editeurfiche, #raisonfiche").val("").prop("disabled", true).fadeTo("fast", 0.33).change();
  $("#editeurfichetitre, #raisonfichetitre").prop("title", "<i>Menu désactivé.</i>");
}

$("#auteurfiche").change(function () {
  if ($(this).val() !== "" && $(this).val() !== null) {
    if ($("#loadfiche").val() !== "") {
      $("#editeurficherequis").css("display", "inline");
      $("#editeurfiche").prop("disabled", false).fadeTo("fast", 1).change();
      $("#editeurfichetitre").prop("title", "Sélection de l'éditeur de la fiche.");
      $("#raisonfichetitre").prop("title", "Sélection de la raison d'édition de la fiche.");
    }
    pseudofiche1 = "";
    pseudofiche1 = "<p style='display:inline;color:#666666;font-size:75%;'>Fiche créée par </p>" +
    "<p style='display:inline;color:#999999;font-size:75%;'>" + $(this).val() + "</p>" +
    "<p style='display:inline;color:#666666;font-size:75%;'>.</p>";
    setinfosfiche();
  }
  });

// Pour réinitialiser la raison de l'édition, ajouter .val("") ligne 1138 et décommenter la ligne 1145.
$("#editeurfiche").change(function () {
  if ($(this).val() !== "" && $(this).val() !== null) {
    $("#raisonficherequis").css("display", "inline");
    $("#raisonfiche").prop({"disabled": false, "required": true}).fadeTo("fast", 1).change();
    $("#raisonfichetitre").prop("title", "Sélection de la raison de l'édition.");
    $("#editeurfichetitre").prop("title", "Sélection de l'éditeur de la fiche.");
    pseudofiche2 = "";
    pseudofiche2 = "<p style='display:inline;color:#666666;font-size:75%;'> Dernière édition par </p>" +
    "<p style='display:inline;color:#999999;font-size:75%;'>" + $(this).val() + "</p>" +
    "<p style='display:inline;color:#666666;font-size:75%;'> le " + dd + "/" + mm + "/" + yy;
    //pseudofiche3 = "";
    setinfosfiche();
  }
});

$("#raisonfiche").change(function () {
  if ($(this).val() !== "" && $(this).val() !== null) {
    pseudofiche3 = "";
    pseudofiche3 = "<p style='display:inline;color:#666666;font-size:75%;'> (raison : </p>" +
    "<p style='display:inline;color:#999999;font-size:75%;'>" + $(this).val() + "</p>" +
    "<p style='display:inline;color:#666666;font-size:75%;'>).</p>";
    setinfosfiche();
  }
});

function setinfosfiche () {
  if (pseudofiche2 !=="" && pseudofiche3 === "") {
  pseudofiche0 = pseudofiche1 + pseudofiche2 + "<p style='display:inline;color:#666666;font-size:75%;'>.</p>" + pseudofiche3;
  } else {
    pseudofiche0 = pseudofiche1 + pseudofiche2 + pseudofiche3;
  }
  $("#afficheauteurfiche").html(pseudofiche0).show();
  if (importtoastr === false) {
    toastr.info(pseudofiche0, "Infos auteur/éditeur fiche :").css({"background-color":"#292929","box-shadow":"0 0 12px #555555"});
  }
}

// Récupération de la date actuelle.
var dt = new Date();
var dd = ("0" + dt.getDate()).slice(-2);
var mm = ("0" + (dt.getMonth() + 1)).slice(-2);
var yy = (dt.getFullYear() + "").slice(-2);

// Date du jour renseignée pour la date de disponibilité de la table au clic sur le bouton Aujourd'hui.
$("#aujourd").on("click", function () {
  if ($("#jour").val() === "" && $("#mois").val() === "" && $("#an").val() === "") {
    $("#jour").val(dd);
    $("#mois").val(mm);
    $("#an").val(yy);
    $("#aujourd").val("Réinitialiser");
    if (importtoastr === false) {
      toastr.info("<i>" + dd + "/" + mm + "/" + yy, "Date :");
    }
  } else {
    $("#jour, #mois, #an").val("");
    $("#aujourd").val("Aujourd'hui");
    if (importtoastr === false) {
      toastr.info("Date réinitialisée.", "Information :");
    }
  }
});

// Vérification des nombres renseignés dans les champs Date.
$("#jour").change(function () {
  if ($(this).val() !== "") {
    var long = $(this).val().length;
    if ($(this).val() < 1 || $(this).val() > 31) {
      $("#jour").val("");
      if (importtoastr === false) {
        toastr.error("Le jour doit être compris entre 1 et 31 !", "Erreur :");
        $("#jour").focus();
      }
    } else if ($(this).val() >= 1 && $(this).val() < 10) {
      $("#jour").val("0" + $("#jour").val().slice(-1));
      datejourold = $("#jour").val();
    } else if (long > 2) {
      var longjour = $(this).val().replace(/^0/, "");
      $("#jour").val(longjour);
      datejourold = $("#jour").val();
    }
  }
});

$("#mois").change(function () {
  if ($(this).val() !== "") {
    var long = $(this).val().length;
    if ($(this).val() < 1 || $(this).val() > 12) {
      $("#mois").val("");
      if (importtoastr === false) {
        toastr.error("Le mois doit être compris entre 1 et 12 !", "Erreur :");
        $("#mois").focus();
      }
    } else if ($(this).val() >= 1 && $(this).val() < 10) {
      $("#mois").val("0" + $("#mois").val().slice(-1));
      datemoisold = $("#mois").val();
    } else if (long > 2) {
      var longmois = $(this).val().replace(/^0/, "");
      $("#jour").val(longmois);
      datemoisold = $("#jour").val();
    }
  }
});
  
$("#an").change(function () {
  if ($(this).val() !== "") {
    if ($(this).val() < 15 || $(this).val() > yy) {
      $("#an").val("");
      if (importtoastr === false) {
        toastr.error("L'année doit être comprise entre 2015 et 20" + yy + " !", "Erreur :");
        $("#an").focus();
      }
    } else {
      dateanold = $("#an").val();
    }
  }
});
  
$("#an").mouseover(function () {
  $("#an").prop("title", "Saisir ici l'année de la date au format AA.<br /><i>Doit être compris entre (20)15 et (20)" + yy + ".</i>");
});

// Vérification date renseignée : ne doit pas être supérieure à la date actuelle.
$(".datedisp").change(function () {
  if ($("#jour").val() !== "" && $("#mois").val() !== "" && $("#an").val() !== "") {
    var dd2 = $("#jour").val();
    var mm2 = $("#mois").val();
    var yy2 = $("#an").val();
    var dt2 = Date.parse("20" + yy + "/" + mm + "/" + dd);
    var dt3 = Date.parse("20" + yy2 + "/" + mm2 + "/" + dd2);
    if (dt3 > dt2) {
      $("#jour, #mois, #an").val("");
      if (importtoastr === false) {
        toastr.error("La date de disponibilité ne peut pas être postérieure à la date courante !", "Erreur :");
      }
    } else {
      if (importtoastr === false) {
        toastr.info("<i>" + dd2 + "/" + mm2 + "/" + yy2 + "</i>.", "Date :");
      }
    }
  }
});

/* Épuration du nom de la table :
  - Retrait des espaces inutiles ;
  - Suppression du "Re: " qui s'ajoute automatiquement sous certains navigateurs ;
  - Abréviation LE (Limited Edition) en majuscules si en fin de titre;
  - Première lettre des mots en majuscules ;
  - Texte entre [] en majuscules) ;
  - Ac/dc, II, III et CSI en majuscules. */
$("#titre").change(function () {
  if ($(this).val() !== "") {
    if (titretable === false) {
      $("#mpafaire, #tableteampp, #ajoutmp").prop("disabled", false).fadeTo("fast", 1);
      $("#mpafairetitre").prop("title", "Cocher cette case pour ajouter <i>[MÉDIA PACK À FAIRE]</i> au titre du sujet.").fadeTo("fast", 1);
      $("#ajoutmptitre").prop("title", "Cocher cette case pour ajouter<i>[AJOUT MÉDIA PACK]</i> au titre du sujet.").fadeTo("fast", 1);
      $("#tableteampptitre").prop("title", "Cocher cette case si la table est une création de la Team PP.");
    }
    var trimurl = $(this).val().replace("Re: ", "").trim().toCapital();
    trimurl = trimurl.replace(/ Le$/, " LE").replace(" Le [", " LE [").replace("Acdc", "AC/DC").replace("Ac/dc", "AC/DC").replace(" Ii", " II").replace(" Iii", " III").replace("Csi", "CSI");
    var matches = trimurl.split("[")
    .filter(function(v){ return v.indexOf("]") > -1})
    .map(function(value) { 
      return value.split("]")[0]
    })
    for(var i=0; i < matches.length; i++) {
     trimurl = trimurl.replace(matches[i], matches[i].toString().toUpperCase());
    }
    trimurl = trimurl.replace("[MÉDIA PACK À FAIRE] [TEAMPP]", "[TEAMPP] [MÉDIA PACK À FAIRE]").replace("[AJOUT MÉDIA PACK] [TEAMPP]", "[TEAMPP] [AJOUT MÉDIA PACK]");
    $("#titre").val(trimurl);
    if (importtoastr === false && $("#titre").val() !== "") {
      toastr.info("<i>" + trimurl + "</i>.", "Nom de la table :");
    }
  } else {
    $("#mpafaire, #tableteampp, #ajoutmp").prop("disabled", true).fadeTo("fast", 0.33);
    $("#mpafairetitre, #tableteampptitre, #ajoutmptitre").prop("title", "<i>Option désactivée car le champ </i>Titre<i> est vide.</i>");
  }
});

// Si case [MÉDIA PACK À FAIRE] cochée ajouter la mention au titre du sujet + désactiver option [AJOUT MÉDIA PACK].
$("#mpafaire").change(function() {
  titretable = true;
  var titre = $("#titre").val().trim();
  $("#titre").val(titre);
  if ($(this).prop("checked")) {
    importtoastr = true;
    $("#titre").val($("#titre").val().replace(" [MÉDIA PACK À FAIRE]", "").replace("[MÉDIA PACK À FAIRE]", "")).change();
    importtoastr = false;
    $("#titre").val($("#titre").val() + " [MÉDIA PACK À FAIRE]").change();
    $("#ajoutmp").prop("disabled", true).fadeTo("fast", 0.33);
    $("#ajoutmptitre").prop("title", "<i>Option désactivée car l'option </i>[MÉDIA PACK À FAIRE]<i> est activée.</i>");
  } else {
    $("#titre").val($("#titre").val().replace(" [MÉDIA PACK À FAIRE]", "").replace("[MÉDIA PACK À FAIRE]", "")).change();
    $("#ajoutmp").prop("disabled", false).fadeTo("fast", 1);
    $("#ajoutmptitre").prop("title", "Cocher cette case pour ajouter <i>[AJOUT MÉDIA PACK]</i> au titre du sujet.");
  }
});

// Si case [AJOUT MÉDIA PACK À FAIRE] cochée ajouter la mention au titre du sujet + désactiver option [MÉDIA PACK À FAIRE].
$("#ajoutmp").change(function() {
  titretable = true;
  var titre = $("#titre").val().trim();
  $("#titre").val(titre);
  if ($(this).prop("checked")) {
    importtoastr = true;
    $("#titre").val($("#titre").val().replace(" [AJOUT MÉDIA PACK]", "").replace("[AJOUT MÉDIA PACK]", "")).change();
    importtoastr = false;
    $("#titre").val($("#titre").val() + " [AJOUT MÉDIA PACK]").change();
    $("#mpafaire").prop("disabled", true).fadeTo("fast", 0.33);
    $("#mpafairetitre").prop("title", "<i>Option désactivée car l'option </i>[AJOUT MÉDIA PACK]<i> est activée.</i>");
  } else {
    $("#titre").val($("#titre").val().replace(" [AJOUT MÉDIA PACK]", "").replace("[AJOUT MÉDIA PACK]", "")).change();
    $("#mpafaire").prop("disabled", false).fadeTo("fast", 1);
    $("#mpafairetitre").prop("title", "Cocher cette case pour ajouter <i>[MÉDIA PACK À FAIRE]</i> au titre du sujet.");
  }
});

// Si table Team PP injecter l'affichage de la bannière au code HTML, l'afficher dans le formulaire et ajouter [TEAMPP] au titre du sujet.
$("#tableteampp").change(function () {
  titretable = true;
  if ($(this).prop("checked")) {
    $("#teampp").show();
    importtoastr = true;
    $("#titre").val($("#titre").val().replace(" [TEAMPP]", "")).change();
    importtoastr = false;
    $("#titre").val($("#titre").val() + " [TEAMPP]").change();
    $("#auteur1").val("Team PP");
    teampptable = "<br /><img id='fichetableteampp' src='https://i.servimg.com/u/f62/19/65/43/35/banner19.png' style='height:auto;width:700px;opacity:0.5;box-shadow:0px 0px 15px #666;' /><br /><br />";
  } else {
    $("#teampp").hide();
    $("#auteur1").val("");
    $("#titre").val($("#titre").val().replace(" [TEAMPP]", "")).change();
    teampptable = "";
  }
});

// Affichage du logo fabricant.
$("#fabricant").change(function () {
  if ($(this).val() === "") {
    $("#fabpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
    $("#urlipdb").prop({"disabled": false, "placeholder": "URL de la fiche IPDB"}).fadeTo("fast", 1);
    $("#urlipdbtitre").prop("title", "Saisir ici l'URL de la fiche IPDB.<br /><i>Doit commencer par 'https://www.ipdb.org/machine.cgi?' ou l'exception AC/DC<br />'https://www.ipdb.org/search.pl?any=acdc'.<br />Laisser vide si inexistante.</i>");
  } else if ($("#fabricant option:selected").text() === "Original") {
    $("#fabpreview").prop("src", $(this).val());
    $("#urlipdb").prop({"disabled": true, "placeholder": "Champ désactivé"}).fadeTo("fast", 0.33).val("").blur();
    $("#ipdbpreview").prop("src", "https://i.servimg.com/u/f58/19/65/43/35/ipdbno11.png").unwrap("a");
    $("#urlipdbtitre").prop("title", "Champ désactivé car <i>Fabricant</i> = <i>Original</i>.");
  } else {
    $("#urlipdb").prop({"disabled": false, "placeholder": "URL de la fiche IPDB"}).fadeTo("fast", 1);
    $("#urlipdbtitre").prop("title", "Saisir ici l'URL de la fiche IPDB.<br /><i>Doit commencer par 'https://www.ipdb.org/machine.cgi?' ou l'exception AC/DC<br />'https://www.ipdb.org/search.pl?any=acdc'.<br />Laisser vide si inexistante.</i>");
    $("#fabpreview").prop("src", $(this).val());
    if (importtoastr === false) {
      toastr.info("<i>" + $("#fabricant option:selected").text() + "</i>.", "Fabricant :");
    }
  }
});
 
// Vérification Auteur1 et Auteur2.
function formatenom (nom) {
  nom = nom.split("/").map(function (name) {
    name = name.toCapital();
    name = name.replace("Team Pp", "Team PP").replace("Jpsalas", "JPSalas").replace("Jp Salas", "JPSalas").replace("32assassin", "32Assassin").replace("Hanibals", "Hanibal");
    name = name.replace("Freneticamnesic", "FreneticAmnesic").replace("Jpj", "JPJ").replace("Clarkkent", "ClarkKent");
    name = name.replace("Icpjuggla", "ICPjuggla").replace("Nfozzy", "nFozzy").replace("Borgdog", "BorgDog").replace("Djrobx", "DJRobX");
    name = name.replace("Darthmarino", "DarthMarino");
    return name;
  });
  return nom;
}

$("#auteur1").change(function () {
  var trimurl = $(this).val().trim();
  if (trimurl !== "") {
    trimurl = trimurl.toString().replace(/,/g, "/"); // remplace toute virgule par un slash avant appel à la fonction formatenom().
    trimurl = formatenom(trimurl);
    trimurl = trimurl.toString().replace(/,/g, "/"); // et après appel à la fonction.
    trimurl = trimurl.replace(" / ", "/");
    $("#auteur1").val(trimurl);
    if (importtoastr === false) {
      toastr.info("<i>" + trimurl + "</i>.", "Auteur ligne 1 :");
    }
  }
});

$("#auteur2").change(function () {
  var trimurl = $(this).val().trim();
  if (trimurl !== "") {
    trimurl = trimurl.toString().replace(/,/g, "/");
    trimurl = formatenom(trimurl);
    trimurl = trimurl.toString().replace(/,/g, "/");
    trimurl = trimurl.replace(" / ", "/");
    $("#auteur2").val(trimurl);
    if (importtoastr === false) {
      toastr.info("<i>" + trimurl + "</i>.", "Auteur ligne 2 :");
    }
  }
});

$("#auteur1, #auteur2").change(function () {
  if ($("#auteur1").val() !== "" && $("#auteur1").val() === $("#auteur2").val()) {
    toastr.error("Les champs <i>Auteur1</i> et <i>Auteur2</i> ont le même contenu !<br />Le champ <i>Auteur2</i> a donc été réinitialisé.", "Erreur :");
    $("#auteur2").val("");
  } else if ($("#auteur1").val() === "" && $("#auteur2").val() !== "") {
    toastr.warning("Le champ <i>Auteur1</i> est vide et le champ <i>Auteur2</i> a été renseigné !<br />Le contenu du champ <i>Auteur2</i> a donc été déplacé dans le champ <i>Auteur1</i>.", "Attention :");
    $("#auteur1").val($("#auteur2").val());
    $("#auteur2").val("");
  }
});

// Vérification année (fonction trim()).
$("#annee").change(function () {
  var trimurl = $(this).val().trim();
  if (trimurl !== "") {
    $("#annee").val(trimurl);
    if (importtoastr === false) {
      toastr.info("<i>" + trimurl + "</i>.", "Année :");
    }
  }
});

// Récupération numéro de version pour comparaison en cas d'importation d'une fiche existante.
$("#version").change(function () {
  var trimurl = $(this).val().trim().toLowerCase();
  trimurl = trimurl.replace("wip", "WIP");
  if (trimurl !== "" && trimurl !== "sans") {
    $("#version").val(trimurl);
    versionold = trimurl;
  } else if (trimurl === "sans") {
    $("#version").val("Sans");
  }
  if (importtoastr === false) {
    toastr.info("<i>" + trimurl + "</i>.", "Version :");
  }
});


// Vérification image miniwheel.
$("#urlminiwheel").change(function () {
  var trimurl = $(this).val().trim();
  var ext = trimurl.split(".").pop().toLowerCase();
  if (trimurl !== "" && ext !== "png") {
    $("#urlminiwheel").val("");
    $("#wheelpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
    var toastrmsg = "L'image doit être au format PNG !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Mini-wheel :");
    } else {
      toastr.error(toastrmsg, "Mini-wheel :", {timeOut: 10000});
    }
    return;
} else if (trimurl !== "" && ext === "png" && trimurl.indexOf("/19/65/43/35/") === -1) {
  $("#urlminiwheel").val("");
  var toastrmsg = "L'image doit être hébergée sur le compte Servimg Pincab Passion !";
  if (importtoastr === false) {
    toastr.error(toastrmsg, "Image mini-wheel :");
    $("#urlminiwheel").focus();
  } else {
    toastr.error(toastrmsg, "Image mini-wheel :", {timeOut: 10000});
  }
  $("#wheelpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
  return;
}
  $("#urlminiwheel2").prop("src", "");
  $("#urlminiwheel2").prop("src", trimurl);
  $("#urlminiwheel").val(trimurl);
  $("input[name=description]").val(trimurl);
});
  
$("#urlminiwheel2").on({
  error: function () {
    if ($("#urlminiwheel").val() === "") {
      $("#urlminiwheel").val("");
      $("#wheelpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
    } else {
      $("#urlminiwheel").val("");
      $("#wheelpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
      var toastrmsg = "L'URL ne contient pas d'image !";
      if (importtoastr === false) {
        toastr.error(toastrmsg, "Image mini-wheel :");
        $("#urlminiwheel").focus();
      } else {
        toastr.error(toastrmsg, "Image mini-wheel :", {timeOut: 10000});
      }
    }
  },
  load: function () {
    var imgmw = new Image();
    $(imgmw).on("load", function () {
      if (this.width === 1 && this.height === 1) {
        $("#wheelpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
        $("#urlminiwheel").val("");
        var toastrmsg = "Le format du fichier est incorrect !";
        if (importtoastr === false) {
          toastr.error(toastrmsg, "Image mini-wheel :");
          $("#urlminiwheel").focus();
        } else {
          toastr.error(toastrmsg, "Image mini-wheel :", {timeOut: 10000});
        }
      } else if ((this.width !== 300 && this.height !== 150) || (this.width === 300 && this.height > 220) || (this.width > 280 && this.height === 150)) {
        $("#wheelpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
        $("#urlminiwheel").val("");
        var toastrmsg = "La résolution de l'image est incorrecte (" + this.width + "x" + this.height + " pixels) :<br />300x220 maximum pour un format rectangulaire, 280x150 maximum pour un format carré !";
        if (importtoastr === false) {
          toastr.error(toastrmsg, "Image mini-wheel :");
          $("#urlminiwheel").focus();
        } else {
          toastr.error(toastrmsg, "Image mini-wheel :", {timeOut: 10000});
        }
      } else {
        $("#wheelpreview").prop("src", imgmw.src);
        if (importtoastr === false) {
          toastr.info("Image ajoutée.", "Image mini-wheel :");
        }
      }
    });
  imgmw.src = $("#urlminiwheel").val();
  }
});

// Vérification vignette playfield.
$("#urlvignplayfield").change(function () {
  var trimurl = $(this).val().trim();
  var ext = trimurl.split(".").pop().toLowerCase();
  if (trimurl !== "" && ext !== "jpg") {
    $("#urlvignplayfield").val("");
    $("#playfieldpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
    var toastrmsg = "L'image doit être au format JPG !";
        if (importtoastr === false) {
          toastr.error(toastrmsg, "Vignette playfield :");
          $("#urlvignplayfield").focus();
        } else {
          toastr.error(toastrmsg, "Vignette playfield :", {timeOut: 10000});
        }
    return;
  } else if (trimurl !=="" && ext === "jpg" && trimurl.indexOf("19/65/43/35") === -1) {
    var toastrmsg = "L'image doit être hébergée sur le compte Servimg Pincab Passion !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Vignette playfield :");
      $("#urlvignplayfield").focus();
    } else {
      toastr.error(toastrmsg, "Vignette playfield :", {timeOut: 10000});
    }
    $("#urlvignplayfield").val("");
    $("#playfieldpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
    return;
  }
  $("#urlvignplayfield2").prop("src", "");
  $("#urlvignplayfield2").prop("src", trimurl);
  $("#urlvignplayfield").val(trimurl);
});

$("#urlvignplayfield2").on({
  error: function () {
    if ($("#urlvignplayfield").val() === "") {
      $("#urlvignplayfield").val("");
      $("#playfieldpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
    } else {
      $("#urlvignplayfield").val("");
      $("#playfieldpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
      var toastrmsg = "L'URL ne contient pas d'image !";
      if (importtoastr === false) {
        toastr.error(toastrmsg, "Vignette playfield :");
        $("#urlvignplayfield").focus();
      } else {
        toastr.error(toastrmsg, "Vignette playfield :", {timeOut: 10000});
      }
    }
  },
  load: function () {
    var imgvp = new Image();
    $(imgvp).on("load", function () {
      if (this.width === 1 && this.height === 1) {
        $("#playfieldpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
        $("#urlvignplayfield").val("");
        var toastrmsg = "Le format du fichier est incorrect !";
        if (importtoastr === false) {
          toastr.error(toastrmsg, "Vignette playfield :");
          $("#urlvignplayfield").focus();
        } else {
          toastr.error(toastrmsg, "Vignette playfield :", {timeOut: 0});
        }
      } else if (this.width !== 250 && this.height !== 250) {
        $("#playfieldpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
        $("#urlvignplayfield").val("");
        var toastrmsg = "La résolution de l'image est incorrecte (" + this.width + "x" + this.height + " pixels) :<br />250x250 pixels requis !";
        if (importtoastr === false) {
          toastr.error(toastrmsg, "Vignette playfield :");
          $("#urlvignplayfield").focus();
        } else {
          toastr.error(toastrmsg, "Vignette playfield :", {timeOut: 10000});
        }
      } else {
        $("#playfieldpreview").prop("src", imgvp.src);
        if (importtoastr === false) {
          toastr.info("Image ajoutée.", "Vignette playfield :");
        }
      }
    });
  imgvp.src = $("#urlvignplayfield").val();
  }
});

// Vérification image playfield.
$("#urlplayfield").change(function () {
  var trimurl = $(this).val().trim();
  var ext = trimurl.split(".").pop().toLowerCase();
  if (trimurl !== "" && ext !== "jpg") {
    $("#urlplayfield").val("");
    $("#playfieldpreview").unwrap("a");
    var toastrmsg = "L'image doit être au format JPG !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Image playfield :");
      $("#urlplayfield").focus();
    } else {
      toastr.error(toastrmsg, "Image playfield :", {timeOut: 10000});
    }
    return;
  } else if (trimurl !== "" && ext === "jpg" && trimurl.indexOf("/19/65/43/35/") === -1) {
    var toastrmsg = "L'image doit être hébergée sur le compte Servimg Pincab Passion !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Image playfield :");
      $("#urlplayfield").focus();
    } else {
      toastr.error(toastrmsg, "Image playfield :", {timeOut: 10000});
    }
    $("#urlplayfield").val("");
    $("#playfieldpreview").unwrap("a");
    return;
  }
  $("#urlplayfield").val(trimurl);
  if ($("#urlplayfield").val() !== "") {
    $("#urlplayfield2").prop("src", trimurl);
    $("#playfieldpreview").wrap("<a href='" + $("#urlplayfield").val() + "' target='_blank'>");
    if (importtoastr === false) {
      toastr.info("Image ajoutée.", "Image playfield :");
    }
  } else {
    $("#playfieldpreview").unwrap("a");
  }
});

$("#urlplayfield2").on({
  error: function () {
    if ($("#urlplayfield").val() === "") {
      $("#urlplayfield").val("");
      $("#playfieldpreview").unwrap("a");
    } else {
      $("#urlplayfield").val("");
      $("#playfieldpreview").unwrap("a");
      var toastrmsg = "L'URL ne contient pas d'image !";
      if (importtoastr === false) {
        toastr.error(toastrmsg, "Image playfield :");
        $("#urlplayfield").focus();
      } else {
        toastr.error(toastrmsg, "Image playfield :", {timeOut: 10000});
      }
    }
  },
  load: function () {
    var imgpf = new Image();
    $(imgpf).on("load", function () {
      if (this.width === 1 && this.height === 1) {
        $("#playfieldpreview").unwrap("a");
        $("#urlplayfield").val("");
        var toastrmsg = "Le format du fichier est incorrect !";
        if (importtoastr === false) {
          toastr.error(toastrmsg, "Image playfield :");
          $("#urlplayfield").focus();
        } else {
          toastr.error(toastrmsg, "Image playfield :", {timeOut: 10000});
        }
      } else if (this.width > 1280 && this.height > 720) {
        $("#playfieldpreview").unwrap("a");
        $("#urlplayfield").val("");
        var toastrmsg = "La résolution de l'image est incorrecte (" + this.width + "x" + this.height + " pixels) :<br />1280x720 pixels maximum !";
        if (importtoastr === false) {
          toastr.error(toastrmsg, "Image playfield :");
          $("#urlplayfield").focus();
        } else {
          toastr.error(toastrmsg, "Image playfield :", {timeOut: 10000});
        }
      }
    });
  imgpf.src = $("#urlplayfield").val();
  }
});

// Vérification vignette backglass.
$("#urlvignbackglass").change(function () {
  var trimurl = $(this).val().trim();
  var ext = trimurl.split(".").pop().toLowerCase();
  if (trimurl !== "" && ext !== "jpg") {
    $("#urlvignbackglass").val("");
    $("#backglasspreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
    var toastrmsg = "L'image doit être au format JPG !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Vignette backglass :");
      $("#urlvignbackglass").focus();
    } else {
      toastr.error(toastrmsg, "Vignette backglass :", {timeOut: 10000});
    }
    return;
  } else if (trimurl !== "" && ext === "jpg" && trimurl.indexOf("/19/65/43/35/") === -1) {
    $("#urlvignbackglass").val("");
    $("#backglasspreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
    var toastrmsg = "L'image doit être hébergée sur le compte Servimg Pincab Passion !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Vignette backglass :");
      $("#urlvignbackglass").focus();
    } else {
      toastr.error(toastrmsg, "Vignette backglass :", {timeOut: 10000});
    }
    return;
  }
  $("#urlvignbackglass").val(trimurl);
  $("#urlvignbackglass2").prop("src", "");
  $("#urlvignbackglass2").prop("src", trimurl);
});

$("#urlvignbackglass2").on({
  error: function () {
    if ($("#urlvignbackglass").val() === "") {
      $("#urlvignbackglass").val("");
      $("#backglasspreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
    } else {
      $("#urlvignbackglass").val("");
      $("#backglasspreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
      var toastrmsg = "L'URL ne contient pas d'image !";
      if (importtoastr === false) {
        toastr.error(toastrmsg, "Vignette backglass :");
        $("#urlvignbackglass").focus();
      } else {
        toastr.error(toastrmsg, "Vignette backglass :", {timeOut: 10000});
      }
    }
 },
 load: function () {
   var imgvb = new Image();
   $(imgvb).on("load", function () {
     if (this.width === 1 && this.width === 1) {
       $("#backglasspreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
       $("#urlvignbackglass").val("");
       var toastrmsg = "Le format du fichier est incorrect !";
       if (importtoastr === false) {
         toastr.error(toastrmsg, "Vignette backglass :");
         $("#urlvignbackglass").focus();
       } else {
         toastr.error(toastrmsg, "Vignette backglass :", {timeOut: 10000});
       }
     } else if (this.width !== 250 && this.height !== 250) {
       $("#backglasspreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
       $("#urlvignbackglass").val("");
       var toastrmsg = "La résolution de l'image est incorrecte (" + this.width + "x" + this.height + " pixels) :<br />250x250 pixels requis !";
       if (importtoastr === false) {
         toastr.error(toastrmsg, "Vignette backglass :");
         $("#urlvignbackglass").focus();
       } else {
         toastr.error(toastrmsg, "Vignette backglass :", {timeOut: 10000});
       }
     } else {
       $("#backglasspreview").prop("src", imgvb.src);
       if (importtoastr === false) {
         toastr.info("Image ajoutée.", "Vignette backglass :");
       }
     }
   });
 imgvb.src = $("#urlvignbackglass").val();
 }
});

// Vérification image backglass.
$("#urlbackglass").change(function () {
  var trimurl = $(this).val().trim();
  var ext = trimurl.split(".").pop().toLowerCase();
  if (trimurl !== "" && ext !== "jpg") {
    $("#urlbackglass").val("");
    $("#backglasspreview").unwrap("a");
    var toastrmsg = "L'image doit être au format JPG !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Image backglass :");
      $("#urlbackglass").focus();
    } else {
      toastr.error(toastrmsg, "Image backglass :", {timeOut: 10000});
    }
    return;
  } else if (trimurl !== "" && ext === "jpg" && trimurl.indexOf("19/65/43/35") === -1) {
    var toastrmsg = "L'image doit être hébergée sur le compte Servimg Pincab Passion !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Image backglass :");
      $("#urlbackglass").focus();
    } else {
      toastr.error(toastrmsg, "Image backglass :", {timeOut: 10000});
    }
    $("#urlbackglass").val("");
    $("#backglasspreview").unwrap("a");
    return;
  }
  $("#urlbackglass").val(trimurl);
  if ($("urlbackglass").val() !== "") {
    $("#urlbackglass2").prop("src", trimurl);
    $("#backglasspreview").wrap("<a href='" + $("#urlbackglass").val() + "' target='_blank'>");
    if (importtoastr === false) {
      toastr.info("Image ajoutée.", "Image backglass :");
    }
  } else {
    $("#backglasspreview").unwrap("a");
  }
});

$("#urlbackglass2").on({
  error: function () {
    if ($("#urlbackglass").val() === "") {
      $("#urlbackglass").val("");
      $("#backglasspreview").unwrap("a");
    } else {
      $("#urlbackglass").val("");
      $("#backglasspreview").unwrap("a");
      var toastrmsg = "L'URL ne contient pas d'image !";
      if (importtoastr === false) {
        toastr.error(toastrmsg, "Image backglass :");
        $("#urlbackglass").focus();
      } else {
        toastr.error(toastrmsg, "Image backglass :", {timeOut: 10000});
      }
    }
  },
  load: function () {
    var imgbg = new Image();
    $(imgbg).on("load", function () {
      if (this.width === 1 && this.width === 1) {
        $("#backglasspreview").unwrap("a");;
        $("#urlbackglass").val("");
        var toastrmsg = "Le format du fichier est incorrect !";
        if (importtoastr === false) {
          toastr.error(toastrmsg, "Image backglass :");
          $("#urlbackglass").focus();
        } else {
          toastr.error(toastrmsg, "Image backglass :", {timeOut: 10000});
        }
      } else if (this.width > 1360 && this.height > 768) {
        $("#urlbackglass").val("");
        $("#backglasspreview").unwrap("a");
        var toastrmsg = "La résolution de l'image est incorrecte (" + this.width + "x" + this.height + " pixels) :<br />1360x768 pixels maximum !";
        if (importtoastr === false) {
          toastr.error(toastrmsg, "Image backglass :");
          $("#urlbackglass").focus();
        } else {
          toastr.error(toastrmsg, "Image backglass :", {timeOut: 10000});
        }
      }
    });
  imgbg.src = $("#urlbackglass").val();
  }
});

// Vérification URL ipdb.org.
$("#urlipdb").change(function () {
  var trimurl = $(this).val().trim();
  if (trimurl !== "") {
    if (trimurl.indexOf("http://www.ipdb.org/") === 0) {
      trimurl = trimurl.replace("http://", "https://");
      toastr.warning("URL IPDB <i>http://</i> modifiée en <i>https:///</i>.", "Information :");
    } else if (trimurl.indexOf("http://ipdb.org/") === 0) {
      trimurl = trimurl.replace("http://ipdb.org/", "https://www.ipdb.org/");
      toastr.warning("URL IPDB <i>http://ipdb.org/</i> modifiée en <i>https://www.ipdb.org/</i>.", "Information :");
      } else if (trimurl.indexOf("https://ipdb.org/") === 0) {
      trimurl = trimurl.replace("https://ipdb.org/", "https://www.ipdb.org/");
      toastr.warning("URL IPDB <i>https://ipdb.org/</i> modifiée en <i>https://www.ipdb.org/</i>.", "Information :");
    }
  }
  if (trimurl.indexOf("https://www.ipdb.org/machine.cgi?id=") !== 0 && trimurl.indexOf("https://www.ipdb.org/search.pl?any=acdc") !== 0 && trimurl !== "") {
    $("#urlipdb").val("");
    $("#ipdbpreview").prop("src", "https://i.servimg.com/u/f58/19/65/43/35/ipdbno11.png").unwrap("a");
    urlipdb2 = "<img class='cadretablevpx ipdb' src='https://i.servimg.com/u/f58/19/65/43/35/ipdbno11.png' />";
    var toastrmsg = "L'URL est incorrecte ou ne redirige pas vers ipdb.org !<br />Elle doit contenir <i>https://www.ipdb.org/machine.cgi?id=</i> ou l'exception AC/DC<br /><i>https://www.ipdb.org/search.pl?any=acdc</i>.";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Fiche IPDB :");
      $("#urlipdb").focus();
    } else {
      toastr.error(toastrmsg, "Fiche IPDB :", {timeOut: 10000});
    }
  } else if (trimurl.match(/[0-9]/g) == null && trimurl.indexOf("https://www.ipdb.org/search.pl?any=acdc") !== 0) {
    $("#urlipdb").val("");
    $("#ipdbpreview").prop("src", "https://i.servimg.com/u/f58/19/65/43/35/ipdbno11.png").unwrap("a");
    urlipdb2 = "<img class='cadretablevpx ipdb' src='https://i.servimg.com/u/f58/19/65/43/35/ipdbno11.png' />";
    var toastrmsg = "L'URL saisie ne contient ni l'identifiant IPDB (nombre après <i>?id=</i> ni l'exception AC/DC <i>?any=acdc</i> !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Fiche IPDB :");
      $("#urlipdb").focus();
    } else {
      toastr.error(toastrmsg, "Fiche IPDB :", {timeOut: 10000});
    }
  } else if (trimurl.match(/https/g).length > 1) {
    $("#urlipdb").val("");
    $("#ipdbpreview").prop("src", "https://i.servimg.com/u/f58/19/65/43/35/ipdbno11.png").unwrap("a");
    urlipdb2 = "<img class='cadretablevpx ipdb' src='https://i.servimg.com/u/f58/19/65/43/35/ipdbno11.png' />";
    var toastrmsg = "L'URL saisie contient " + trimurl.match(/https/g).length + " fois <i>https</i> !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Fiche IPDB :");
      $("#urlipdb").focus();
    } else {
      toastr.error(toastrmsg, "Fiche IPDB :", {timeOut: 10000});
    }
  } else if (trimurl === "") {
    $("#ipdbpreview").prop("src", "https://i.servimg.com/u/f58/19/65/43/35/ipdbno11.png").unwrap("a");
    urlipdb2 = "<img class='cadretablevpx ipdb' src='https://i.servimg.com/u/f58/19/65/43/35/ipdbno11.png' />";
  } else {
    $("#urlipdb").val(trimurl);
    $("#ipdbpreview").prop("src", "https://i.servimg.com/u/f58/19/65/43/35/ipdb1110.png").wrap("<a href='" + $("#urlipdb").val() + "' target='_blank'>");
    urlipdb2 = "<a id='ficheurlipdb' href='" + $("#urlipdb").val() + "' target='_blank'><img class='cadretablevpx ipdb' src='https://i.servimg.com/u/f58/19/65/43/35/ipdb1110.png' /></a>";
    if (importtoastr === false) {
      toastr.info("URL ajoutée.", "Fiche IPDB");
    }
  }
});

// Vérification URL sujet [SUPPORT] Pincab Passion.
$("#urlsujet").change(function () {
  var trimurl = $(this).val().trim().split("#")[0];
  $("#urlsujet").val(trimurl);
  if (trimurl.indexOf("http://www.pincabpassion.net/") !== 0 && trimurl !== "") {
    $("#urlsujet").val("");
    $("#urlsujetpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png").unwrap("a");
    var toastrmsg = "L'URL est incorrecte ou ne redirige pas vers <i>http://www.pincabpassion.net/</i> !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "URL sujet [SUPPORT] :");
      $("#urlsujet").focus();
    } else {
      toastr.error(toastrmsg, "URL sujet [SUPPORT] :", {timeOut: 10000});
    }
  } else if (trimurl === "") {
    $("#urlsujetpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png").unwrap("a");
  } else {
    $("#urlsujetpreview").prop("src", "https://i.servimg.com/u/f30/19/65/43/35/suppor10.png").wrap("<a href='" + trimurl + "' target='_blank'>");
    if (importtoastr === false) {
      toastr.info("URL ajoutée.", "URL sujet [SUPPORT]");
    }
  }
});

// Vérification du site hébergeur de la table.
function disabledb2s () {
  $("#urldb2s").prop({"disabled": true, "placeholder": "Champ désactivé"}).fadeTo("fast", 0.33).val("").change();
  $("#urldb2spreview").fadeTo("fast", 0.33).prop("title", "<i>Désactivé.</i>");
  $("#urldb2stitre").prop("title", "<i>Désactivé.</i>");
}

function enabledb2s () {
  $("#urldb2s").prop({"disabled": false, "placeholder": "URL du dB2S"}).fadeTo("fast", 1);
  $("#urldb2spreview").fadeTo("fast", 1).prop("title", "Zone de prévisualisation du bouton dB2S.");
  $("#urldb2stitre").prop("title", "Saisir ici l'URL du backglass.<br /><i>Doit commencer par 'http(s)://'.</i>");
}

function disabledb2stable () {
  $("#db2stable").prop({"disabled": true, "checked": true}).fadeTo("fast", 0.33);
  $("#db2stablediv").prop("title", "<i>Désactivé.</i>");
}

function enabledb2stable () {
  $("#db2stable").prop({"disabled": false, "checked": false}).fadeTo("fast", 1);
  $("#db2stablediv").prop("title", "Cocher cette case si le dB2S est fourni avec la table.<br />Note : si la case est cochée le champ est réinitialisé.");
}

$("#urltable").change(function () {
  var trimurl = $(this).val().trim();
  if (trimurl.indexOf("http://www.vpforums.org/") === 0 && trimurl !== "") {
    trimurl = trimurl.replace("http://", "https://");
    toastr.warning("URL VPForums HTTP modifiée en HTTPS.", "Information lien table :");
  } else if (trimurl.indexOf("http://vpinball.com/") === 0 && trimurl !== "") {
    trimurl = trimurl.replace("http://", "https://");
    toastr.warning("URL VPinball HTTP modifiée en HTTPS.", "Information lien table :");
  }
  if (trimurl.indexOf("https://mega.nz/") === 0) {
    $("#urltable").val(trimurl);
    if (!$("#db2stable").is(":checked")) {
      enabledb2stable();
      enabledb2s();
      tablebutton = "https://i.servimg.com/u/f58/19/65/43/35/tabpp10.png";
      $("#urltablepreview").prop("src", tablebutton).wrap("<a href='" + $("#urltable").val() + "' target='_blank'>");
    } else if ($("#db2stable").is(":checked")) {
      disabledb2s();
      tablebutton = "https://i.servimg.com/u/f62/19/65/43/35/tb2pp10.png";
      $("#urltablepreview").prop("src", tablebutton).wrap("<a href='" + $("#urltable").val() + "' target='_blank'>");
    }
    var urltableok = true;
    if (importtoastr === false) {
      toastr.info("Pincab Passion.", "URL table :");
    }
  };

  if (trimurl.indexOf("https://www.vpforums.org/") === 0) {
    $("#urltable").val(trimurl.split("#")[0]);
    if (!$("#db2stable").is(":checked")) {
      enabledb2stable();
      enabledb2s();
      tablebutton = "https://i.servimg.com/u/f58/19/65/43/35/tabvpf11.png";
      $("#urltablepreview").prop("src", tablebutton).wrap("<a href='" + $("#urltable").val() + "' target='_blank'>");
    } else if ($("#db2stable").is(":checked")) {
      disabledb2s();
      tablebutton = "https://i.servimg.com/u/f58/19/65/43/35/tb2vpf10.png";
      $("#urltablepreview").prop("src", tablebutton).wrap("<a href='" + $("#urltable").val() + "' target='_blank'>");
    }
    var urltableok = true;
    if (importtoastr === false) {
      toastr.info("VPForums.", "URL table :");
    }
  };

  if (trimurl.indexOf("http://vpuniverse.com/") === 0) {
    $("#urltable").val(trimurl.split("#")[0]);
    if (!$("#db2stable").is(":checked")) {
      enabledb2stable();
      enabledb2s();
      tablebutton = "https://i.servimg.com/u/f58/19/65/43/35/tabvpu10.png";
      $("#urltablepreview").prop("src", tablebutton).wrap("<a href='" + $("#urltable").val() + "' target='_blank'>");
    } else if ($("#db2stable").is(":checked")) {
      disabledb2s();
      tablebutton = "https://i.servimg.com/u/f58/19/65/43/35/tabb2s10.png";
      $("#urltablepreview").prop("src", tablebutton).wrap("<a href='" + $("#urltable").val() + "' target='_blank'>");
    }
    var urltableok = true;
    if (importtoastr === false) {
      toastr.info("VPUniverse.", "URL table :");
    }
  };

  if (trimurl.indexOf("https://vpinball.com/") === 0) {
    $("#urltable").val(trimurl.split("#")[0]);
    if (!$("#db2stable").is(":checked")) {
      enabledb2stable();
      enabledb2s();
      tablebutton = "https://i.servimg.com/u/f58/19/65/43/35/tabvpb11.png";
      $("#urltablepreview").prop("src", tablebutton).wrap("<a href='" + $("#urltable").val() + "' target='_blank'>");
    } else if ($("#db2stable").is(":checked")) {
      disabledb2s();
      tablebutton = "https://i.servimg.com/u/f58/19/65/43/35/tb2vpb10.png";
      $("#urltablepreview").prop("src", tablebutton).wrap("<a href='" + $("#urltable").val() + "' target='_blank'>");
    }
    var urltableok = true;
    if (importtoastr === false) {
      toastr.info("VPinball.", "URL table :");
    }
  };

  if (trimurl.indexOf("http://www.monsterbashpincab.com/forums/topic") === 0) {
    $("#urltable").val(trimurl.split("#")[0]);
    //disabledb2stable(); fonctions de désactivation automatique des champs dB2S désactivées suite certains dB2S non disponibles chez MBP.
    //disabledb2s();
    tablebutton = "https://i.servimg.com/u/f58/19/65/43/35/mbp11.png"
    $("#urltablepreview").prop("src", tablebutton).wrap("<a href='" + $("#urltable").val() + "' target='_blank'>");
    var urltableok = true;
    if (importtoastr === false) {
      toastr.info("MonsterBashPincab.", "URL table :");
    }
  };

  if (trimurl === "") {
    enabledb2stable();
    enabledb2s();
    $("#urltable").val("");
    tablebutton = "";
    $("#urltablepreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png").unwrap("a");
  } else if (trimurl !== "" && urltableok !== true) {
    $("#urltable").val("");
    tablebutton = "";
    $("#urltablepreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png").unwrap("a");
    var toastrmsg = "L'URL est invalide ou ne redirige pas vers Mega (Pincab Passion), MBP, VPF, VPU ou VPB !<br />Pour MonsterBash Pincab, l'URL doit contenir <i>http://www.monsterbashpincab.com/forums/topic/</i><br />(redirection vers la page de téléchargement non autorisée).";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "URL table :");
      $("#urltable").focus();
    } else {
      toastr.error(toastrmsg, "URL table :", {timeOut: 10000});
    }
  }
});


// Case à cocher dB2S fourni avec la table.
$("#db2stable").change(function () {
  if ($(this).is(":checked")) {
    disabledb2s();
    if (importtoastr === false) {
      toastr.info("Option sélectionnée.", "dB2S fourni :");
    }
  } else {
    enabledb2s();
    if (importtoastr === false) {
      toastr.info("Option déselectionnée.", "dB2S fourni :");
    }
  }
  if ($("#urltable").val() !== "") {
    $("#urltable").change();
  }
});

// Vérification du site hébergeur du backglass.
$("#urldb2s").change(function () {
  var trimurl = $(this).val().trim();
  if (trimurl.indexOf("http://www.vpforums.org/") === 0 && trimurl !== "") {
    trimurl = trimurl.replace("http://", "https://");
    toastr.warning("URL VPForums HTTP modifiée en HTTPS.", "Information lien dB2S :");
  } else if (trimurl.indexOf("http://vpinball.com/") === 0 && trimurl !== "") {
    trimurl = trimurl.replace("http://", "https://");
    toastr.warning("URL VPinball HTTP modifiée en HTTPS.", "Information lien dB2S :");
  }
  if (trimurl.indexOf("https://mega.nz/") === 0) {
    $("#urldb2s").val(trimurl);
    backglassbutton = "https://i.servimg.com/u/f58/19/65/43/35/db2spp10.png";
    $("#urldb2spreview").prop("src", backglassbutton).wrap("<a href='" + $("#urldb2s").val() + "' target='_blank'>");
    if (importtoastr === false) {
      toastr.info("Pincab Passion.", "URL dB2S :");
    }
  } else if (trimurl.indexOf("https://www.vpforums.org/") === 0) {
    $("#urldb2s").val(trimurl.split("#")[0]);
    backglassbutton = "https://i.servimg.com/u/f58/19/65/43/35/b2svpf11.png";
    $("#urldb2spreview").prop("src", backglassbutton).wrap("<a href='" + $("#urldb2s").val() + "' target='_blank'>");
    if (importtoastr === false) {
      toastr.info("VPForums.", "URL dB2S :");
    }
  } else if (trimurl.indexOf("http://vpuniverse.com/") === 0) {
    $("#urldb2s").val(trimurl.split("#")[0]);
    backglassbutton ="https://i.servimg.com/u/f58/19/65/43/35/b2svpu10.png";
    $("#urldb2spreview").prop("src", backglassbutton).wrap("<a href='" + $("#urldb2s").val() + "' target='_blank'>");
    if (importtoastr === false) {
      toastr.info("VPUniverse.", "URL dB2S :");
    }
  } else if (trimurl.indexOf("https://vpinball.com/") === 0) {
    $("#urldb2s").val(trimurl.split("#")[0]);
    backglassbutton = "https://i.servimg.com/u/f58/19/65/43/35/b2svpb10.png";
    $("#urldb2spreview").prop("src", backglassbutton).wrap("<a href='" + $("#urldb2s").val() + "' target='_blank'>");
    if (importtoastr === false) {
      toastr.info("VPinball.", "URL dB2S :");
    }
  } else if (trimurl === "") {
    $("#urldb2s").val("");
    backglassbutton = "";
    $("#urldb2spreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png").unwrap("a");
  } else {
    $("#urldb2s").val("");
    backglassbutton = "";
    $("#urldb2spreview").prop("src", "https://i.servimg.com/u/f58/19/65/43/35/mpsoon10.png").unwrap("a");
    var toastrmsg = "L'URL est invalide ou ne redirige pas vers Mega (Pincab Passion), VPF, VPU ou VPB !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "URL dB2S :");
      $("#urldb2s").focus();
    } else {
      toastr.error(toastrmsg, "URL dB2S :", {timeOut: 10000});
    }
  }
});

// Vérification URL média pack.
$("#urlmediapack").change(function () {
  var trimurl = $(this).val().trim();
  $("#urlmediapack").val(trimurl);
  if (trimurl.indexOf("https://mega.nz/") !== 0 && trimurl !== "") {
    $("#urlmediapack").val("");
    $("#urlmediapackpreview").prop("src", "https://i.servimg.com/u/f58/19/65/43/35/mpsoon10.png").unwrap("a");
    var toastrmsg = "L'URL est incorrect ou ne redirige pas vers mega.nz !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "URL média pack :");
      $("#urlmediapack").focus();
    } else {
      toastr.error(toastrmsg, "URL média pack :", {timeOut: 10000});
    }
  } else if (trimurl === "") {
    $("#urlmediapack").val("");
    $("#urlmediapackpreview").prop("src", "https://i.servimg.com/u/f58/19/65/43/35/mpsoon10.png").unwrap("a");
  } else {
    $("#urlmediapackpreview").prop("src", "https://i.servimg.com/u/f58/19/65/43/35/medpac11.png").wrap("<a href='" + $("#urlmediapack").val() + "' target='_blank'>");
    if (importtoastr === false) {
      toastr.info("URL ajoutée.", "URL média pack :");
    }
  }
});

// Vérification de l'image background de la zone Changelog.
$("#urlbackground").change(function () {
  var trimurl = $(this).val().trim();
  var ext = trimurl.split(".").pop().toLowerCase();
  if (trimurl !== "" && ext !== "png") {
    $("#urlbackground").val("");
    $("#backimg").prop("style", "width:80%;margin:0 auto;");
    var toastrmsg = "L'image doit être au format PNG !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Image background :");
      $("#urlbackground").focus();
    } else {
      toastr.error(toastrmsg, "Image background :", {timeOut: 0});
    }
    return;
  } else if (trimurl !== "" && ext === "png" && trimurl.indexOf("19/65/43/35") === -1) {
    var toastrmsg = "L'image doit être hébergée sur le compte Servimg Pincab Passion !";
    if (importtoastr === false) {
      toastr.error(toastrmsg, "Image background :");
      $("#urlbackground").focus();
    } else {
      toastr.error(toastrmsg, "Image background :", {timeOut: 10000});
    }
    $("#urlbackground").val("");
    $("#backimg").prop("style", "width:80%;margin:0 auto;");
    return;
  }
  $("#urlbackground").val(trimurl);
  $("#urlbackground2").prop("src", trimurl);
});

$("#urlbackground2").on({
  error: function () {
    if ($("#urlbackground").val() === "") {
      $("#urlbackground").val("");
      $("#backimg").prop("style", "width:80%;margin:0 auto;");
    } else {
      $("#urlbackground").val("");
      $("#backimg").prop("style", "width:80%;margin:0 auto;");
      var toastrmsg = "L'URL ne contient pas d'image !";
      if (importtoastr === false) {
        toastr.error(toastermsg, "Image background :");
        $("#urlbackground").focus();
      } else {
        toastr.error(toastermsg, "Image background :", {timeOut: 10000});
      }
    }
  },

  load: function () {
    var imgbg = new Image();
    $(imgbg).on("load", function () {
      if (this.width === 1 && this.width === 1) {
        $("#backimg").prop("style", "width:80%;margin: 0 auto;");
        $("#urlbackground").val("");
        var toastrmsg = "Le format du fichier est incorrect !";
        if (importtoastr === false) {
          toastr.error(toastrmsg, "Image background :");
          $("#urlbackground").focus();
        } else {
          toastr.error(toastrmsg, "Image background :", {timeOut: 10000});
        }
      } else if ((this.width !== 700 && this.height !== 300) || (this.width === 700 && this.height > 300) || (this.width > 700 && this.height === 300)) {
        $("#backimg").prop("style", "width:80%;margin:0 auto;");
        $("#urlbackground").val("");
        var toastrmsg = "La résolution de l'image est incorrecte (" + this.width + "x" + this.height + " pixels) :<br />700 pixels de largeur ou 300 pixels de hauteur requis !";
        if (importtoastr === false) {
          toastr.error(toastrmsg, "Image background :");
          $("#urlbackground").focus();
        } else {
          toastr.error(toastrmsg, "Image background :", {timeOut: 10000});
        }
      } else {
        $("#backimg").prop("style", "width:80%;margin:0 auto;background-image:linear-gradient(to bottom, rgba(31,28,28,0.9) 100%,rgba(31,28,28,0.9) 100%),url("
        + imgbg.src + ");background-repeat:no-repeat;background-position:center center;");
        if (importtoastr === false) {
          toastr.info("Image ajoutée.", "Image background :");
        }
      }
    });
  imgbg.src = $("#urlbackground").val();
  }
});

// Mise à jour des zones Changelog, Infos et Notes.
$("#changelog, #infos, #notes").change(function () {
  $(this).val($(this).val().trim()).html($(this).val());
  if (importtoastr === false) {
    toastr.info("Modifiée.", "Zone <i>" + $(this).prop("id").substr(0,1).toUpperCase() + $(this).prop("id").substr(1) + "</i> :");
  }
});

// Remplissage des zones Changelog, Infos et Notes par les boutons "Par défaut".
$("#changeloginitial").on("click", function () {
  if ($("#changelog").is(":empty")) {
    $("#changelog").val("v1.0" + String.fromCharCode(13, 10) + "- Initial release.").html($("#changelog").val());
    $("#changeloginitial").val("Réinitialiser");
    if (importtoastr === false) {
      toastr.info("Renseignée par la valeur par défaut.", "Zone <i>Changelog</i> :");
    }
  } else {
    $("#changelog").val("").html($("#changelog").val());
    $("#changeloginitial").val("Par défaut");
    if (importtoastr === false) {
      toastr.info("Réinitialisée.", "Zone <i>Changelog</i> :");
    }
  }
});

$("#infosaucunes").on("click", function () {
  if ($("#infos").is(":empty")) {
    $("#infos").val("Aucunes.").html($("#infos").val());
    $("#infosaucunes").val("Réinitialiser");
    if (importtoastr === false) {
      toastr.info("Renseignée par la valeur par défaut.", "Zone <i>Infos</i> :");
    }
  } else {
    $("#infos").val("").html($("#infos").val());
    $("#infosaucunes").val("Par défaut");
    if (importtoastr === false) {
      toastr.info("Réinitialisée.", "Zone <i>Infos</i> :");
    }
  }
});

$("#notesaucunes").on("click", function () {
  if ($("#notes").is(":empty")) {
    $("#notes").val("Aucunes.").html($("#notes").val());
    $("#notesaucunes").val("Réinitialiser");
    if (importtoastr === false) {
      toastr.info("Renseignée par la valeur par défaut.", "Zone <i>Notes</i> :");
    }
  } else {
    $("#notes").val("").html($("#notes").val());
    $("#notesaucunes").val("Par défaut");
    if (importtoastr === false) {
      toastr.info("Réinitialisée.", "Zone <i>Notes</i> :");
    }
  }
});

// Notification Modifications autorisées.
$("#modifications").change(function () {
  if (importtoastr === false) {
    toastr.info("<i>" + $("#modifications option:selected").text() + "</i>", "Modifications :");
  }
});

// Mise à jour d'une fiche à partir de l'URL d'une fiche existante.
function resetVarBlur(identifier) {
  $(identifier).val("").prop("disabled", false).fadeTo("fast", 1).change();
}

function resetChamps() {
  disableediteurraison();
  $("#mpafaire, #ajoutmp, #tableteampp").prop("disabled", true).fadeTo("fast", 0.33);
  $("#mpafairetitre, #ajoutmptitre, #tableteampptitre").prop("title", "<i>Option désactivée car le champ </i>Titre<i> est vide.</i>");
  importtoastr = true;
  pseudofiche0 = "";
  pseudofiche1 = "";
  pseudofiche2 = "";
  pseudofiche3 = "";
  titretable = false;
  $("#teampp, #afficheauteurfiche").hide();
  $("#wheelpreview, #fabpreview, #playfieldpreview, #backglasspreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
  $("#editeurfiche").prop("required", false);
  $("#auteurfiche").prop("disabled", false).fadeTo("fast", 1);
  $("#auteurfichetitre").prop("title", "Sélection du créateur de la fiche.");
  $("#ipdbpreview").prop("src", "https://i.servimg.com/u/f58/19/65/43/35/ipdbno11.png").unwrap("a");
  $("#urlsujetpreview, #urltablepreview, #urldb2spreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png").unwrap("a");
  enabledb2s();
  enabledb2stable();
  $("#backimg").attr("style", "width:80%;margin:0 auto;");
  $("#urlmediapackpreview").prop("src", "https://i.servimg.com/u/f62/19/65/43/35/transp10.png");
  $("#changelog").val("").html($("#changelog").val());
  $("#infos").val("").html($("#infos").val());
  $("#notes").val("").html($("#notes").val());
  $("#codehtml, #codesupport").hide();
  $("#codehtmlcontenu, #codesupportcontenu").empty();
  $("#generecodehtml").val("Afficher code HTML fiche");
  $("#generecodesupport").val('Afficher code HTML "Support"');
  $("#aujourd").val('Aujourd"hui');
  $("#changeloginitial, #infosaucunes, #notesaucunes").val("Par défaut");
  importtoastr = false;
  if ($("#loadfiche").val !== "") {
    var loadfichetemp = $("#loadfiche").val();
  }
  document.getElementById("postform").reset();
  if (loadfichetemp !== "") {
    $("#loadfiche").val(loadfichetemp);
  }
    
}

$("#loadfiche").change(function () {
  var trimurl = $(this).val().trim();
  if (trimurl.indexOf("http://www.pincabpassion.net/") !== 0 && trimurl !== "") {
    $("#loadfiche").val("").change();
    toastr.error("L'URL ne pointe pas vers www.pincabpassion.net !", "URL fiche existante :");
    return false;
  }
  $("#loadfiche").val(trimurl);
  $.get(trimurl, function (pagehtml) {
    var loadfiche = trimurl;
    var erreur = "La fiche ne contient pas l'identifiant ";
    var fichetablevpx = $("#fichetablevpx", pagehtml).length;
    if (fichetablevpx !== 1 && loadfiche !== "") {
      $("#loadfiche").val("").change();
      toastr.error("L'URL est invalide ou n'est pas une fiche de table VPX !", "URL fiche existante :");
    } else if (loadfiche === "") {
      resetChamps();
    } else {
      toastr.info("Importation des données de la fiche...", "Information :", {timeOut: 2000});
      resetChamps();
      importtoastr = true;
      var titre = $(".postdetails", pagehtml).text();
      if (titre !== "") {
        var sujet = titre.substring(titre.lastIndexOf("Sujet: ")+7,titre.lastIndexOf(String.fromCharCode(160))).slice(0,-2);
        var matches = sujet.split("[")
        .filter(function(v){ return v.indexOf("]") > -1})
        .map(function(value) { 
          return value.split("]")[0]
        })
        for(var i=0; i < matches.length; i++) {
        sujet = sujet.replace(matches[i], matches[i].toString().toUpperCase());
        }
        $("#titre").val(sujet).change();
        if (sujet.indexOf("[MÉDIA PACK À FAIRE]") !== -1) {
          $("#mpafaire").prop("checked", true);
          $("#ajoutmp").prop("disabled", true).fadeTo("fast", 0.33);
          $("#ajoutmptitre").prop("title", "<i>Option désactivée car l'option </i>[MÉDIA PACK À FAIRE]<i> est activée.</i>");
        } else if (sujet.indexOf("[AJOUT MÉDIA PACK]") !== -1) {
          $("#mpafaire").prop("disabled", true).fadeTo("fast", 0.33);
          $("#ajoutmp").prop("checked", true);
          $("#mpafairetitre").prop("title", "<i>Option désactivée car l'option </i>[AJOUT MÉDIA PACK]<i> est activée.</i>");
        }
      } else {
        resetVarBlur($("#titre"));
      }

      var fichetableteampp = $("#fichetableteampp", pagehtml).attr("src");
      if ((fichetableteampp !== "") && (typeof fichetableteampp !== "undefined")) {
        $("#tableteampp").prop("checked", true);
        //$("input[type=radio][name=subf][value=81]").prop("checked", true).change(); // Coche automatiquement le bouton radio Team PP.
        $("#teampp").show();
      } else {
        $("#tableteampp").prop("checked", false);
        $("#teampp").hide();
      }

      var ficheurlminiwheel = $("#ficheurlminiwheel", pagehtml).attr("src");
      if (ficheurlminiwheel !== "") {
        $("#urlminiwheel").val(ficheurlminiwheel).change();
        $("input[name=description]").val(ficheurlminiwheel);
      } else {
        resetVarBlur($("#urlminiwheel"));
        toastr.warning(erreur + "'ficheurlminiwheel' !", "Attention :");
      }

      var fichefabricant = $("#fichefabricant", pagehtml).attr("src");
      if (fichefabricant !== "") {
        $("#fabricant").val(fichefabricant).change();
      } else {
        $("#fabricant").val("").change();
        toastr.warning(erreur + "'fichefabricant' !", "Attention :");
      }

      var ficheannee = $("#ficheannee", pagehtml).text();
      if (ficheannee !== "") {
        $("#annee").val(ficheannee).change();
      } else {
        resetVarBlur($("#annee"));
        toastr.warning(erreur + "'ficheannee' !", "Attention :");
      }

      var ficheauteur1 = $("#ficheauteur1", pagehtml).text();
      if (ficheauteur1 !== "") {
        $("#auteur1").val(ficheauteur1).change();
      } else {
        resetVarBlur($("#auteur1"));
        toastr.warning(erreur + "'ficheauteur1' !", "Attention :");
      }

      var ficheauteur2 = $("#ficheauteur2", pagehtml).text();
      if (ficheauteur2 !== "") {
        $("#auteur2").val(ficheauteur2).change();
      } else {
        resetVarBlur($("#auteur2"));
      }

      var ficheversion = $("#ficheversion", pagehtml).text();
      if (ficheversion !== "") {
        versionnew = ficheversion;
        $("#version").val(ficheversion).change();
      } else {
        versionnew = "";
        resetVarBlur($("#version"));
        toastr.warning(erreur + "'ficheversion' !", "Attention :");
      }

      var fichejour = $("#fichejour", pagehtml).text();
      if (fichejour !== "") {
        datejournew = fichejour;
        $("#jour").val(fichejour).change();
      } else {
        datejournew = "";
        resetVarBlur($("#jour"));
        toastr.warning(erreur + "'fichejour' !", "Attention :");
      }

      var fichemois = $("#fichemois", pagehtml).text();
      if (fichemois !== "") {
        datemoisnew = fichemois;
        $("#mois").val(fichemois).change();
      } else {
        datemoisnew = "";
        resetVarBlur($("#mois"));
        toastr.warning(erreur + "'fichemois' !", "Attention :");
      }

      var fichean = $("#fichean", pagehtml).text();
      if (fichean !== "") {
        dateannew = fichean;
        $("#an").val(fichean).change();
        $("#aujourd").val("Réinitialiser");
      } else {
        dateannew = "";
        resetVarBlur($("#an"));
        $("#aujourd").val("Aujourd'hui");
        toastr.warning(erreur + "'fichean' !", "Attention :");
      }

      var ficheurlplayfield = $("#ficheurlplayfield", pagehtml).attr("href");
      if (ficheurlplayfield !== "") {
        $("#urlplayfield").val(ficheurlplayfield).change();
      } else {
        resetVarBlur($("#urlplayfield"));
        toastr.warning(erreur + "'ficheurlplayfield' !", "Attention :");
      }

      var ficheurlvignplayfield = $("#ficheurlvignplayfield", pagehtml).attr("src");
      if (ficheurlvignplayfield !== "") {
        $("#urlvignplayfield").val(ficheurlvignplayfield).change();
      } else {
        resetVarBlur($("#urlvignplayfield"));
        toastr.warning(erreur + "'ficheurlvignplayfield' !", "Attention :");
      }

      var ficheurlbackglass = $("#ficheurlbackglass", pagehtml).attr("href");
      if (ficheurlbackglass !== "") {
        $("#urlbackglass").val(ficheurlbackglass).change();
      } else {
        resetVarBlur($("#urlbackglass"));
        toastr.warning(erreur + "'ficheurlbackglass' !", "Attention :");
      }

      var ficheurlvignbackglass = $("#ficheurlvignbackglass", pagehtml).attr("src");
      if (ficheurlvignbackglass !== "") {
        $("#urlvignbackglass").val(ficheurlvignbackglass).change();
      } else {
        resetVarBlur($("#urlvignbackglass"));
        toastr.warning(erreur + "'ficheurlvignbackglass' !", "Attention :");
      }

      var ficheurlipdb = $("#ficheurlipdb", pagehtml).attr("href");
      if (ficheurlipdb !== "") {
        $("#urlipdb").val(ficheurlipdb).change();
      } else {
        resetVarBlur($("#urlipdb"));
      }

      var ficheurlsujet = $("#ficheurlsujet", pagehtml).attr("href");
      if (ficheurlsujet !== "") {
        $("#urlsujet").val(ficheurlsujet).change();
      } else {
        resetVarBlur($("#urlsujet"));
      }

      var ficheurltable = $("#ficheurltable", pagehtml).attr("href");
      if (ficheurltable !== "") {
        $("#urltable").val(ficheurltable).change();
      } else {
        resetVarBlur($("#urltable"));
        toastr.warning(erreur + "'ficheurltable' !", "Attention :");
      }

      var ficheurldb2s = $("#ficheurldb2s", pagehtml).attr("href");
      if (typeof ficheurldb2s === "undefined") {
        disabledb2s();
        $("#db2stable").prop("checked", true).change();
        if ($("#urltable").val() !== "") {
          $("#urltable").change();
        }
      } else if (ficheurldb2s !== "") {
        $("#urldb2s").val(ficheurldb2s).change();
      } else {
        resetVarBlur($("#urldb2s"));
      }

      var ficheurlmediapack = $("#ficheurlmediapack", pagehtml).attr("href");
      if (ficheurlmediapack !== "") {
        $("#urlmediapack").val(ficheurlmediapack).change();
      } else {
        resetVarBlur($("#urlmediapack"));
      }

      var ficheurlbackground = $("#ficheurlbackground", pagehtml).attr("style");
      if (ficheurlbackground !== "") {
        var urlbg = ficheurlbackground.substring(ficheurlbackground.lastIndexOf("url(")+4,ficheurlbackground.lastIndexOf(")"));
        $("#urlbackground").val(urlbg).change();
      } else {
        resetVarBlur($("#urlbackground"));
        toastr.warning(erreur + "'ficheurlbackground' !", "Attention :");
      }

      var fichechangelog = $("#fichechangelog", pagehtml).html();
      if (fichechangelog !== "") {
        var fichechangelog2 = fichechangelog.replace(/<br> ?/g, String.fromCharCode(13, 10));
        $("#changelog").val(fichechangelog2).html($("#changelog").val()).change();
        $("#changeloginitial").val("Réinitialiser");
      } else {
        $("#changelog").val("").html($("#changelog").val());
        $("#changeloginitial").val("Par défaut");
        toastr.warning(erreur + "'fichechangelog' !", "Attention :");
      }

      var ficheinfos = $("#ficheinfos", pagehtml).html();
      if (ficheinfos !== "") {
        var ficheinfos2 = ficheinfos.replace(/<br> ?/g, String.fromCharCode(13, 10));
        $("#infos").val(ficheinfos2).html($("#infos").val());
        $("#infosaucunes").val("Réinitialiser");
      } else {
        $("#infos").val("").html($("#infos").val());
        $("#infosaucunes").val("Par défaut");
        toastr.warning(erreur + "'ficheinfos' !", "Attention :");
      }

      var fichenotes = $("#fichenotes", pagehtml).html();
      if (fichenotes !== "") {
        var fichenotes2 = fichenotes.replace(/<br> ?/g, String.fromCharCode(13, 10));
        $("#notes").val(fichenotes2).html($("#notes").val());
        $("#notesaucunes").val("Réinitialiser");
      } else {
        $("#notes").val("").html($("#notes").val());
        $("#notesaucunes").val("Par défaut");
        toastr.warning(erreur + "'fichenotes' !", "Attention :");
      }

      var fichemodifs = $("#fichemodifs", pagehtml).text();
      if (fichemodifs !== "") {
        $("#modifications").val(fichemodifs).change();
      } else {
        resetVarBlur($("#modifications"));
        toastr.warning(erreur + "'fichemodifs' !", "Attention :");
      }

      var ficheauteur = $("#ficheauteur", pagehtml).text();
      if (ficheauteur !== "") {
        $("#auteurfiche").val(ficheauteur).prop("disabled", true).fadeTo("fast", 0.33).change();
        $("#auteurfichetitre").prop("title", "<i>Menu désactivé.</i>");
        $("#editeurficherequis, #raisonficherequis").css("display", "inline");
        $("#editeurfiche, #raisonfiche").prop("required", true);
        setinfosfiche();
      } else {
        resetVarBlur($("#auteurfiche"));
        $("#auteurfichetitre").prop("title", "Sélection du créateur de la fiche.");
        $("#editeurficherequis, #raisonficherequis").css("display", "none");
        $("#editeurfiche, #raisonfiche").prop("required", false);
        toastr.warning(erreur + "'ficheauteur' !", "Attention :");
      }

      var ficheediteur = $("#ficheediteur", pagehtml).text();
      if (ficheediteur !== "") {
        $("#editeurfiche").val(ficheediteur).change();
        setinfosfiche();
      } else {
        resetVarBlur($("#editeurfiche"));
      }

      var ficheraison = $("#ficheraison", pagehtml).text();
      if (ficheraison !== "") {
        $("#raisonfiche").val(ficheraison).change();
        setinfosfiche();
      } else {
        resetVarBlur($("#raisonfiche"));
      }
    }
  importtoastr = false;
  });
});

// Paramétrage de l'auteur de la fiche par l'utilisateur courant.
importtoastr = true;
$("#auteurfiche").val(username).change();
importtoastr = false;

// Gestion des boutons Aperçu - Publier - Réinitialiser et fermeture onglet ou fenêtre.
$("#apercu").on("click", function () {
  document.getElementById("postform").action += "#preview";
});

$("#saveform").on("click", function () {
  var choixf = $("#subforum").val();
  if (choixf === "110") {
    var choixfnom = "News du mois";
  } else if (choixf === "81") {
    var choixfnom = "Team PP";
  } else if (choixf === "96") {
    var choixfnom = "Tables VPX";
  } else if (choixf === "108") {
    var choixfnom = "Tables à valider";
  } else if (choixf === "111") {
    var choixfnom = "Tables validées";
  }
  var publier = confirm("Publier la fiche dans la section " + choixfnom + " ?");
  if (publier === true) {
    if (versionnew === versionold && $("#raisonfiche").val() === "mise à jour table") {
      var confirmer = confirm("Fiche importée : les numéros de version sont identiques.\n\nCliquez sur Annuler pour revenir à la fiche ou sur OK pour la publier quand même.");
      if (confirmer === false) {
        return false;
      }
    } else if ((versionnew !== versionold) && (datejournew + datemoisnew + dateannew) === (datejourold + datemoisold + dateanold)) {
      var confirmer = confirm("La version de la table a changée mais la date de disponibilité n'a pas été modifiée.\n\nCliquez sur Annuler pour revenir à la fiche ou sur OK pour la publier quand même.");
      if (confirmer === false) {
        return false;
      }
    }
  } else {
    return false;
  }
  //$("html, body").animate({ scrollTop: 0 }, "fast");
});

$("#resetform").on("click", function () {
  var reset = confirm("Réinitialiser le formulaire ?");
  if (reset === true) {
    $("#loadfiche").val("").change();
    $("html, body").animate({ scrollTop: 0 }, "fast");
  } else {
    return;
  }
});

$("#resetform2").on("click", function () {
  var reset = confirm("Réinitialiser le formulaire ?");
  if (reset === true) {
    $("#loadfiche").val("").change();
  } else {
    return;
  }
});

$(window).on("beforeunload", function () {
  var confirmer = confirm("Quitter le formulaire ?");
  return confirmer;
});

$("#generecodehtml").on("click", function () {
  creeCodeHTML();
  $("#codehtmlcontenu").empty().val(codehtmlfiche);
  $("#codehtml").toggle();
  if ($("#codehtml").is(":visible")) {
    $("#generecodehtml").val("Masquer code HTML fiche");
  } else {
    $("#generecodehtml").val("Afficher code HTML fiche");
  }
});

$("#copycodehtml").on("click", function () {
  $("#codehtmlcontenu").select();
  document.execCommand("Copy");
  toastr.info("Code HTML de la fiche copié dans le presse-papier.", "Information :");
  $("#codehtml").toggle();
  if ($("#codehtml").is(":visible")) {
    $("#generecodehtml").val("Masquer code HTML fiche");
  } else {
    $("#generecodehtml").val("Afficher code HTML fiche");
  }
});

$("#refreshcodehtml").on("click", function() {
  creeCodeHTML();
  $("#codehtmlcontenu").empty().val(codehtmlfiche);
});

$("#generecodesupport").on("click", function () {
  creeCodeHTML();
  $("#codesupportcontenu").empty().val(codesupportfiche);
  $("#codesupport").toggle();
  if ($("#codesupport").is(":visible")) {
    $("#generecodesupport").val('Masquer code HTML "Support"');
  } else {
    $("#generecodesupport").val('Afficher code HTML "Support"');
  }
  });

$("#copycodesupport").on("click", function () {
  $("#codesupportcontenu").select();
  document.execCommand("Copy");
  toastr.info("Code HTML du sujet Support copié dans le presse-papier.", "Information :");
  $("#codesupport").toggle();
  if ($("#codesupport").is(":visible")) {
    $("#generecodesupport").val('Masquer code HTML "Support"');
  } else {
    $("#generecodesupport").val('Afficher code HTML "Support"');
  }
});

$("#refreshcodesupport").on("click", function() {
  creeCodeHTML();
  $("#codesupportcontenu").empty().val(codesupportfiche);
});

$("form").on("reset", function() {
  setTimeout(function() {
    importtoastr = true;
    if ($("#loadfiche").val() === "") {
      $("#auteurfiche").val(username).change();
    }
    importtoastr = false;
  });
});

// Création du code HTML.
function creeCodeHTML () {
// Date affichée au format JJ/MM/AA.
  var date = $("#jour").val() + "/" + $("#mois").val() + "/" + $("#an").val();

// Calcul du nombre de boutons - définit le nombre de cellules à fusionner (colspan) pour le logo Liens et Téléchargements
// et la largeur (width) en pourcentage du tableau Liens et Téléchargements.
// Minimum = 2 boutons (colspan=2 et width=40%); maximum 4 boutons (colspan=4 et width=60%).
// Si pas de sujet ni de backglass :
  if ($("#urlsujet").val() === "" && $("#urldb2s").val() === "") {
    tablecolspan = "2";
    tablewidth = "40%";
// Si un sujet et pas de backglass :
  } else if ($("#urlsujet").val() !== "" && $("#urldb2s").val() === "") {
    tablecolspan = "3";
    tablewidth = "40%";
// Si pas de sujet et un backglass :
  } else if ($("#urlsujet").val() === "" && $("#urldb2s").val() !== "") {
    tablecolspan = "3";
    tablewidth = "60%";
// Si un sujet et un backglass
  } else if ($("#urlsujet").val() !== "" && $("#urldb2s").val() !== "") {
    tablecolspan = "4";
    tablewidth = "60%";
  }

// Définition de la zone Titre, Playfield Backglass IPDB.
  if (!urlipdb2) {
    urlipdb2 = "<img class='cadretablevpx ipdb' src='https://i.servimg.com/u/f58/19/65/43/35/ipdbno11.png' />";
    toastr.error("Merci de vérifier le champ <i>URL IPDB</i>.", "Erreur critique !", { timeOut: 6000 });
  }
  presentationtable = "<div id='fichetablevpx' style='display:none;'></div>&#13;&#10;<center><img src='https://i.servimg.com/u/f84/19/25/98/58/2sep10.png' />&#13;&#10;" +
  "<table style='padding:5;border-spacing:5;width:40%;'><tr style='text-align:center;'><td style='width:50%;'><img id='ficheurlminiwheel' src='" +
  $("#urlminiwheel").val() + "' /></td><td style='width:50%;'><img id='fichefabricant' src='" + $("#fabricant").val() + "' /><br /><b><span id='ficheannee'>" +
  $("#annee").val() + "</span></b></td></tr></table></center>&#13;&#10;&#13;&#10;" +
  "<center><table style='padding:5;border-spacing:5;width:60%;'><tr style='vertical-align:top;text-align:center;'><td style='width:20%;'>" +
  "<img src='https://i.servimg.com/u/f58/19/65/43/35/auteur13.png' /><br /><span style='display:inline;margin:0;padding:0;' id='ficheauteur1'>" + $("#auteur1").val() +
  "</span><br /><span style='margin:0;padding:0;' id='ficheauteur2'>" + $("#auteur2").val() + "</span></td><td style='width:20%;'>" +
  "<img src='https://i.servimg.com/u/f58/19/65/43/35/versio14.png' /><br /><span style='display:inline;margin:0;padding:0;' id='ficheversion'>" + $("#version").val() +
  "</span></td><td style='width:20%;'><img src='https://i.servimg.com/u/f58/19/65/43/35/date13.png' /><br /><span style='margin:0;padding:0;display:inline;' id='fichejour'>" +
  $("#jour").val() + "</span>/<span style='margin:0;padding:0;display:inline;' id='fichemois'>" + $("#mois").val() +
  "</span>/<span style='margin:0;padding:0;display:inline;' id='fichean'>" + $("#an").val() + 
  "</span></td></tr></table>&#13;&#10;" + teampptable + "<img src='https://i.servimg.com/u/f84/19/25/98/58/2sep10.png' /></center>&#13;&#10;&#13;&#10;" +
  "<center><table style='padding:5;border-spacing:5;width:80%;'><th style='background:none'>" +
  "<img src='https://i.servimg.com/u/f58/19/65/43/35/playfi11.png' /></th><th style='background:none'>" +
  "<img src='https://i.servimg.com/u/f58/19/65/43/35/backgl11.png' /></th><th style='background:none'>" +
  "<img src='https://i.servimg.com/u/f58/19/65/43/35/ipdb10.png' /></th><tr style='text-align:center;'><td style='width:20%;'><a id='ficheurlplayfield' href='" +
  $("#urlplayfield").val() + "' target='_blank'><img id='ficheurlvignplayfield' class='cadretablevpx' src='" +
  $("#urlvignplayfield").val() + "' /></a></td><td style='width:20%;'><a id='ficheurlbackglass' href='" + $("#urlbackglass").val() +
  "' target='_blank'><img id='ficheurlvignbackglass' class='cadretablevpx' src='" + $("#urlvignbackglass").val() +
  "' /></a></td><td style='width:20%;'>" + urlipdb2 + "</td></tr></table>&#13;&#10;&#13;&#10;" +
  "<img src='https://i.servimg.com/u/f84/19/25/98/58/2sep10.png' /></center>&#13;&#10;&#13;&#10;";

// Définition de la zone Liens et Téléchargements.
// Bouton SUJET.
  if ($("#urlsujet").val() === "") {
    urlsujet = "";
  } else {
    urlsujet = "<td style='width:20%;'><a id='ficheurlsujet' href='" + $("#urlsujet").val() + "' target='_blank'>" +
    "<img class='cadretablevpx button' src='https://i.servimg.com/u/f30/19/65/43/35/suppor10.png' /></a></td>";
  }

// Bouton TABLE.
  if ($("#urltable").val() === "") {
    urltable = "";
  } else {
    urltable = "<td style='width:20%;'><a id='ficheurltable' href='" + $("#urltable").val() + "' target='_blank'>" +
    "<img class='cadretablevpx button' src='" + tablebutton + "' /></a></td>";
  }

// Bouton DB2S.
  if ($("#urldb2s").val() === "") {
    urldb2s = "";
  } else {
    urldb2s = "<td style='width:20%;'><a id='ficheurldb2s' href='" + $("#urldb2s").val() + "' target='_blank'>" +
    "<img class='cadretablevpx button' src='" + backglassbutton + "' /></a></td>";
  }

// Bouton MEDIA PACK.
  if ($("#urlmediapack").val() === "") {
    urlmediapack = "<td style='width:20%;'><img class='cadretablevpx button' src='https://i.servimg.com/u/f58/19/65/43/35/mpsoon10.png' /></td>";
  } else {
    urlmediapack = "<td style='width:20%;'><a id='ficheurlmediapack' href='" + $("#urlmediapack").val() + "' target='_blank'>" +
    "<img class='cadretablevpx button' src='https://i.servimg.com/u/f58/19/65/43/35/medpac11.png' /></a></td>";
  }

  tablelinks = "<center><table style='padding:5;border-spacing:5;width:'" + tablewidth + ";'><th colspan='" + tablecolspan + "' style='background:none'>" +
  "<img src='https://i.servimg.com/u/f58/19/65/43/35/links12.png' /></th><tr style='text-align:center;'>" + urlsujet + urltable + urldb2s + urlmediapack +
  "</tr></table>&#13;&#10;<img src='https://i.servimg.com/u/f84/19/25/98/58/2sep10.png' /></center>&#13;&#10;";

// Définition de la zone Changelog, Infos et Notes.
  zoneinfo = "<br><center><img src='https://i.servimg.com/u/f58/19/65/43/35/chinno11.png' /></center><br><br>" +
  "<div id='ficheurlbackground' class='scrollzonetablevpx' style='background-image:linear-gradient(to bottom, rgba(41,41,38,0.9) 0%,rgba(41,41,38,0.9) 100%),url(" +
  $("#urlbackground").val() + ");background-repeat:no-repeat;background-position:center center;'>" +
  "<img src='https://i.servimg.com/u/f58/19/65/43/35/change12.png' /><br><span id='fichechangelog' style='margin:0;padding:0;'>" +
  $("#changelog").val() + "</span><br><br><img src='https://i.servimg.com/u/f58/19/65/43/35/infos211.png' /><br><span id='ficheinfos' style='margin:0;padding:0;'>" +
  $("#infos").val() + "</span><br><br><img src='https://i.servimg.com/u/f58/19/65/43/35/notes11.png' /><br><span id='fichenotes' style='margin:0;padding:0;'>" +
  $("#notes").val() + "</span><br><br><img src='https://i.servimg.com/u/f58/19/65/43/35/modaut11.png' /><br><span id='fichemodifs' style='margin:0;padding:0;'>" +
  $("#modifications").val() + "</span></div><br><center><img src='https://i.servimg.com/u/f84/19/25/98/58/2sep10.png' /></center><br>";

// Définition de la zone Créateur / Éditeur / Raison édition fiche.
  infosfiche = "<center><p style='display:inline;color:#666666;font-size:75%;'>Fiche créée par </p>" +
  "<p id='ficheauteur' style='display:inline;color:#999999;font-size:75%;'>" + $("#auteurfiche").val() + "</p>";

  if ($("#editeurfiche").val() !== null) {
    infosfiche += "<p style='display:inline;color:#666666;font-size:75%;'>. Dernière édition par </p>" +
    "<p id='ficheediteur' style='display:inline;color:#999999;font-size:75%;'>" + $("#editeurfiche").val() + "</p>" +
    "<p style='display:inline;color:#666666;font-size:75%;'> le " + dd + "/" + mm + "/" + yy + "</p>";
  }

  if ($("#raisonfiche").val() !== null) {
    infosfiche += "<p style='display:inline;color:#666666;font-size:75%;'> (raison : </p>" +
    "<p id='ficheraison' style='display:inline;color:#999999;font-size:75%;'>" + $("#raisonfiche").val() + "</p>" +
    "<p style='display:inline;color:#666666;font-size:75%;'>)</p>";
  }

  infosfiche += "<p style='display:inline;color:#666666;font-size:75%;'>.</p></center>";

  codehtmlfiche = presentationtable + tablelinks + zoneinfo + infosfiche;
  codesupportfiche = "<center><img src='https://i.servimg.com/u/f84/19/25/98/58/2sep10.png' />" +
  "<table style='padding:5;border-spacing:5;width:40%;'><tr style='text-align:center;'><td style='width:50%;'><img src='" + $("#urlminiwheel").val() + "' />" +
  "</td><td style='width:50%;'><img src='" + $("#fabricant").val() + "' /><br /><b><span>" + $("#annee").val() + "</span></b></td></tr>" +
  "<tr style='text-align:center;'><td colspan='2'><img src='https://i.servimg.com/u/f30/19/65/43/35/supthr10.png' /></td></tr></table>" +
  "<img src='https://i.servimg.com/u/f84/19/25/98/58/2sep10.png' /></center>";
}

// Création du sujet.
function envoiMessage(form) {
  creeCodeHTML();
  form.message.value = codehtmlfiche;
}
