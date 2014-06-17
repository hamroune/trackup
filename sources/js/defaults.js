var _ = require('underscore')
var mongoose = require("mongoose");

var url = "mongodb://lucette:lucette@hanso.mongohq.com:10024/app18820246";


// forms Schema
var FormSchema = new mongoose.Schema({
    name : { type : String },
    fields : [mongoose.Schema.Types.Mixed]
});


// Create a model for forms
var FormsModel = mongoose.model("forms", FormSchema);

var marques =
[
"ARMENCELLE",
"AVENE",
"BIODERMA",
"BIOTHERM",
"CATTIER",
"CAUDALIE",
"ROGE CAVAILLES",
"DIOR",
"CLARINS",
"CLINIQUE",
"DARPHIN",
"DIADERMINE",
"Dr.HAUSCHKA",
"DUCRAY",
"ERBORIAN",
"ESENKA",
"ESTEE LAUDER",
"EUCERIN",
"EXFOLIAC",
"FILORGA",
"GALENIC",
"GAMARDE",
"GARANCIA",
"GARNIER",
"GUINOT",
"HERBORIST",
"L'OCCITANE",
"L'OREAL",
"LANCOME",
"LIFT'ARGAN",
"LIERAC",
"MATIDIANE",
"MELVITA",
"MIXA",
"MYSTERIEUX",
"NUXE",
"NOREVA",
"VICHY",
"OFFICINEA",
"PAYOT",
"PHYT'S",
"PURE SYSTEM - YVES ROCHER",
"QIRINESS",
"ROC",
"SVR",
"SANOFLORE",
"SHISEIDO",
"SISLEY",
"IXXI",
"THEMIS",
"URIAGE",
"VELD'S",
"YVES ROCHER",
"DE PULPE DE VIE",
"RUBIALINE",
"KIKO",
"NIVEA",
"KIEHL'S",
"EAU PRECIEUSE",
"LA ROCHE POSAY",
"CLUB DES CREATEURS DE BEAUTE",
"KIKO",
"VICHY",
"DECLEOR",
"MONOPRIX",
"BARBARA GOULD",
"UNE",
"MARCELLE",
"GUERLAIN",
"DHC",
"CHANEL",
"CREME DE LA MER",
"BIOTHERM",
"SEPHORA"
]

var jsonMarques = _.map(marques, function(marque, index){

        var name = marque.replace(/'/g, "_")
                                         .replace(/ /g, "_")
                                         .replace(/:/g, "_")
                                         .replace(/-/g, "_")
        return {
                value: name.toLowerCase(),
                label: marque
        }
});

var options =

{
marques: jsonMarques,
teint :
[
    {value: 'teint_terne', label: 'Teint terne'},
    {value: 'teint_plutoto_terne', label: 'Teint plutôt terne'},
    {value: 'teint_plutoto_terne', label: 'Teint plutôt terne'},
    {value: 'teint_plutot_lumineux', label: 'Teint plutôt lumineux'},
    {value: 'teint_lumineux', label: 'Teint lumineux'}
],

couleur_teint_hiver : [
                {value: 'blanc_tres_pale', label: 'Blanc très pale'},
                {value: 'blanc', label: 'Blanc'},
                {value: 'jaune', label: 'Jaune'},
                {value: 'mat', label: 'Mat'},
                {value: 'fonce', label: 'foncé'},
                {value: 'noir', label: 'Noir'},
                ]
,

type_peau : [
                {value: 'peau_grasse', label: 'Peau grasse'},
                {value: 'peau_mixte', label: 'Peau mixte'},
                {value: 'peau_plutot_seche', label: 'Peau plutôt sèche'},
                {value: 'peau_seche', label: 'Peau sèche'},
                ]

,
brillance_peau : [ {value: 'peau_brillante', label: 'Peau brillante'},
                {value: 'peau_brillante', label: 'Peau brillante'},
                {value: 'peau_brillante', label: 'Peau brillante'},
                {value: 'peau_plutot_brillante', label: 'Peau plutôt brillante'},
                {value: 'peau_plutot_brillante', label: 'Peau plutôt brillante'},
                {value: 'peau_plutot_brillante', label: 'Peau plutôt brillante'},
                {value: 'peau_plutot_mate', label: 'Peau plutôt mate'},
                {value: 'peau_plutot_mate', label: 'Peau plutôt mate'},
                {value: 'peau_plutot_mate', label: 'Peau plutôt mate'},
                {value: 'peau_mate', label: 'Peau mate'},
                {value: 'peau_mate', label: 'Peau mate'},]


,
couleur_yeux : [ {value: 'yeux_bleu', label: 'bleu'},
                {value: 'yeux_vert', label: 'vert'},
                {value: 'yeux_noisette', label: 'noisette'},
                {value: 'yeux_noir', label: 'noir'}, ]

,
couleur_cheveux : [
                {value: 'cheveux_gris', label: 'Gris'},
                {value: 'cheveux_blond', label: 'Blonds'},
                {value: 'cheveux_roux', label: 'Roux'},
                {value: 'cheveux_brun', label: 'Bruns'},
                {value: 'cheveux_noir', label: 'noir'},]


,
points_rouges_visage : [
{
    value:'front_gauche', label:"front gauche",
    value:'joue_gauche', label:"joue gauche",
    value:'menton_gauche', label:"menton gauche",
    value:'menton', label:"menton",
    value:'front_droite', label:"front droite",
    value:'joue_droite', label:"joue droite",
    value:'menton_droite', label:"mentondroite"
}]
}

console.log('options ==>', options)