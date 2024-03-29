/*!
* CSSViewer, A Google Chrome Extension for fellow web developers, web designers, and hobbyists.
* https://github.com/cssviewer/cssviewer
* https://chrome.google.com/webstore/detail/cssviewer/ggfgijbpiheegefliciemofobhmofgce
*
* Copyright (c) 2006, 2008 Nicolas Huon 
*
* This source code is licensed under the GNU General Public License,
* Version 2. See the file COPYING for more details.
*/

// Roadmap/ToDos
//    1. Make the initial code more readable 
//    2. Comment the initial code
//    3. Fix issues if any
//    4. Add new features (feasible and useful ones)
//    5. Make a new branch and start re-factoring the entire code

/*
** Globals
*/

  
	

var CSSViewer_container

// CSS Properties
var CSSViewer_pFont = new Array(
	'font-family', 
	'font-size', 
	'font-style', 
	'font-variant', 
	'font-weight', 
	'letter-spacing', 
	'line-height', 
	'text-decoration', 
	'text-align', 
	'text-indent', 
	'text-transform', 
	'vertical-align', 
	'white-space', 
	'word-spacing'
);

var CSSViewer_pColorBg = new Array(
	'background-attachment', 
	'background-color', 
	'background-image',
	'background-position',
	'background-repeat',
	'color'
);

var CSSViewer_pBox = new Array(
	'height',
	'width',
	'border',
	'border-top',
	'border-right',
	'border-bottom', 
	'border-left',
	'margin',
	'padding',
	'max-height',
	'min-height',
	'max-width',
	'min-width'
);

var CSSViewer_pPositioning = new Array(
	'position', 
	'top', 
	'bottom', 
	'right', 
	'left', 
	'float', 
	'display', 
	'clear', 
	'z-index'
);

var CSSViewer_pList = new Array(
	'list-style-image', 
	'list-style-type', 
	'list-style-position'
);

var CSSViewer_pTable = new Array(
	'border-collapse',
	'border-spacing',
	'caption-side',
	'empty-cells',
	'table-layout'
);

var CSSViewer_pMisc = new Array(
	'overflow', 
	'cursor', 
	'visibility'
);

var CSSViewer_pEffect = new Array(
	'transform',
	'transition',
	'outline',
	'outline-offset',
	'box-sizing',
	'resize',
	'text-shadow',
	'text-overflow',
	'word-wrap',
	'box-shadow',
	'border-top-left-radius',
	'border-top-right-radius',
	'border-bottom-left-radius',
	'border-bottom-right-radius'
);

// CSS Property categories
var CSSViewer_categories = { 
	'pFontText'    : CSSViewer_pFont, 
	'pColorBg'     : CSSViewer_pColorBg, 
	'pBox'         : CSSViewer_pBox, 
	'pPositioning' : CSSViewer_pPositioning, 
	'pList'        : CSSViewer_pList, 
	'pTable'       : CSSViewer_pTable, 
	'pMisc'        : CSSViewer_pMisc, 
	'pEffect'      : CSSViewer_pEffect 
};

var CSSViewer_categoriesTitle = { 
	'pFontText'    : 'Font & Text', 
	'pColorBg'     : 'Color & Background', 
	'pBox'         : 'Box', 
	'pPositioning' : 'Positioning', 
	'pList'        : 'List', 
	'pTable'       : 'Table', 
	'pMisc'        : 'Miscellaneous', 
	'pEffect'      : 'Effects' 
};

// Table tagnames
var CSSViewer_tableTagNames = new Array(
	'TABLE',
	'CAPTION',
	'THEAD',
	'TBODY',
	'TFOOT',
	'COLGROUP',
	'COL',
	'TR',
	'TH',
	'TD'
);

var CSSViewer_listTagNames = new Array(
	'UL',
	'LI',
	'DD',
	'DT',
	'OL'
);

// Hexadecimal
var CSSViewer_hexa = new Array(
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'A',
	'B',
	'C',
	'D',
	'E',
	'F'
);

/*
** Utils
*/

function GetCurrentDocument()
{
	return window.document;
}

function IsInArray(array, name)
{
	for (var i = 0; i < array.length; i++) {
		if (name == array[i])
			return true;
	}

	return false;
}

function DecToHex(nb)
{
	var nbHexa = '';

	nbHexa += CSSViewer_hexa[Math.floor(nb / 16)];
	nb = nb % 16;
	nbHexa += CSSViewer_hexa[nb];
	
	return nbHexa;
}

function RGBToHex(str)
{
	var start = str.search(/\(/) + 1;
	var end = str.search(/\)/);

	str = str.slice(start, end);

	var hexValues = str.split(', ');
	var hexStr = '#'; 

	for (var i = 0; i < hexValues.length; i++) {
		hexStr += DecToHex(hexValues[i]);
	}
	
	if( hexStr == "#00000000" ){
		hexStr = "#FFFFFF";
	}
	
	hexStr = '<span style="border: 1px solid #000000 !important;width: 1ex !important;height: 1ex !important;display: inline-block !important;background-color:'+ hexStr +' !important;"></span> ' + hexStr;

	return hexStr;
}

function GetFileName(str)
{
	var start = str.search(/\(/) + 1;
	var end = str.search(/\)/);

	str = str.slice(start, end);

	var path = str.split('/');
	
	return path[path.length - 1];
}

function RemoveExtraFloat(nb)
{
	nb = nb.substr(0, nb.length - 2);

	return Math.round(nb) + 'px';
}

/*
** CSSFunc
*/

function GetCSSProperty(element, property)
{
	return element.getPropertyValue(property);
}

function SetCSSProperty(element, property)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	li.lastChild.innerHTML = " : " + element.getPropertyValue(property);
}

function SetCSSPropertyIf(element, property, condition)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	if (condition) {
		li.lastChild.innerHTML = " : " + element.getPropertyValue(property);
		li.style.display = 'block';

		return 1;
	}
	else {
		li.style.display = 'none';

		return 0;
	}
}

function SetCSSPropertyValue(element, property, value)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	li.lastChild.innerHTML = " : " + value;
	li.style.display = 'block';
}

function SetCSSPropertyValueIf(element, property, value, condition)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	if (condition) {
		li.lastChild.innerHTML = " : " + value;
		li.style.display = 'block';

		return 1;
	}
	else {
		li.style.display = 'none';

		return 0;
	}
}

function HideCSSProperty(property)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	li.style.display = 'none';
}

function HideCSSCategory(category)
{
	var document = GetCurrentDocument();
	var div = document.getElementById('CSSViewer_' + category);

	div.style.display = 'none';
}

function ShowCSSCategory(category)
{
	var document = GetCurrentDocument();
	var div = document.getElementById('CSSViewer_' + category);

	div.style.display = 'block';
}

function UpdatefontText(element)
{
	// Font
	SetCSSProperty(element, 'font-family');
	SetCSSProperty(element, 'font-size');

	SetCSSPropertyIf(element, 'font-weight'    , GetCSSProperty(element, 'font-weight') != '400');
	SetCSSPropertyIf(element, 'font-variant'   , GetCSSProperty(element, 'font-variant') != 'normal');
	SetCSSPropertyIf(element, 'font-style'     , GetCSSProperty(element, 'font-style') != 'normal');
	
	// Text
	SetCSSPropertyIf(element, 'letter-spacing' , GetCSSProperty(element, 'letter-spacing') != 'normal');
	SetCSSPropertyIf(element, 'line-height'    , GetCSSProperty(element, 'line-height') != 'normal');
	SetCSSPropertyIf(element, 'text-decoration', GetCSSProperty(element, 'text-decoration') != 'none');
	SetCSSPropertyIf(element, 'text-align'     , GetCSSProperty(element, 'text-align') != 'start');
	SetCSSPropertyIf(element, 'text-indent'    , GetCSSProperty(element, 'text-indent') != '0px');
	SetCSSPropertyIf(element, 'text-transform' , GetCSSProperty(element, 'text-transform') != 'none');
	SetCSSPropertyIf(element, 'vertical-align' , GetCSSProperty(element, 'vertical-align') != 'baseline');
	SetCSSPropertyIf(element, 'white-space'    , GetCSSProperty(element, 'white-space') != 'normal');
	SetCSSPropertyIf(element, 'word-spacing'   , GetCSSProperty(element, 'word-spacing') != 'normal');
}

function UpdateColorBg(element)
{
	// Color
	SetCSSPropertyValue(element, 'color', RGBToHex(GetCSSProperty(element, 'color')));

	// Background
	SetCSSPropertyValueIf(element, 'background-color', RGBToHex(GetCSSProperty(element, 'background-color')), GetCSSProperty(element, 'background-color') != 'transparent');
	SetCSSPropertyIf(element, 'background-attachment', GetCSSProperty(element, 'background-attachment') != 'scroll');
	SetCSSPropertyValueIf(element, 'background-image', GetFileName(GetCSSProperty(element, 'background-image')), GetCSSProperty(element, 'background-image') != 'none');
	SetCSSPropertyIf(element, 'background-position'  , GetCSSProperty(element, 'background-position') != '');
	SetCSSPropertyIf(element, 'background-repeat'    , GetCSSProperty(element, 'background-repeat') != 'repeat');
}

function UpdateBox(element)
{
	// Width/Height
	SetCSSPropertyIf(element, 'height', RemoveExtraFloat(GetCSSProperty(element, 'height')) != 'auto');
	SetCSSPropertyIf(element, 'width', RemoveExtraFloat(GetCSSProperty(element, 'width')) != 'auto');

	// Border
	var borderTop    = RemoveExtraFloat(GetCSSProperty(element, 'border-top-width')) + ' ' + GetCSSProperty(element, 'border-top-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-top-color'));
	var borderBottom = RemoveExtraFloat(GetCSSProperty(element, 'border-bottom-width')) + ' ' + GetCSSProperty(element, 'border-bottom-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-bottom-color'));
	var borderRight  = RemoveExtraFloat(GetCSSProperty(element, 'border-right-width')) + ' ' + GetCSSProperty(element, 'border-right-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-right-color'));
	var borderLeft   = RemoveExtraFloat(GetCSSProperty(element, 'border-left-width')) + ' ' + GetCSSProperty(element, 'border-left-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-left-color'));

	if (borderTop == borderBottom && borderBottom == borderRight && borderRight == borderLeft && GetCSSProperty(element, 'border-top-style') != 'none') {
		SetCSSPropertyValue(element, 'border', borderTop);

		HideCSSProperty('border-top');
		HideCSSProperty('border-bottom');
		HideCSSProperty('border-right');
		HideCSSProperty('border-left');
	}
	else {
		SetCSSPropertyValueIf(element, 'border-top'   , borderTop   , GetCSSProperty(element, 'border-top-style') != 'none');
		SetCSSPropertyValueIf(element, 'border-bottom', borderBottom, GetCSSProperty(element, 'border-bottom-style') != 'none');
		SetCSSPropertyValueIf(element, 'border-right' , borderRight , GetCSSProperty(element, 'border-right-style') != 'none');
		SetCSSPropertyValueIf(element, 'border-left'  , borderLeft  , GetCSSProperty(element, 'border-left-style') != 'none');

		HideCSSProperty('border');
	}
	
	// Margin
	var marginTop    = RemoveExtraFloat(GetCSSProperty(element, 'margin-top'));
	var marginBottom = RemoveExtraFloat(GetCSSProperty(element, 'margin-bottom'));
	var marginRight  = RemoveExtraFloat(GetCSSProperty(element, 'margin-right'));
	var marginLeft   = RemoveExtraFloat(GetCSSProperty(element, 'margin-left'));
	var margin       = (marginTop == '0px' ? '0' : marginTop) + ' ' + (marginRight == '0px' ? '0' : marginRight) + ' '  + (marginBottom == '0px' ? '0' : marginBottom) + ' '  + (marginLeft == '0px' ? '0' : marginLeft);

	SetCSSPropertyValueIf(element, 'margin', margin, margin != '0 0 0 0');

	// padding
	var paddingTop    = RemoveExtraFloat(GetCSSProperty(element, 'padding-top'));
	var paddingBottom = RemoveExtraFloat(GetCSSProperty(element, 'padding-bottom'));
	var paddingRight  = RemoveExtraFloat(GetCSSProperty(element, 'padding-right'));
	var paddingLeft   = RemoveExtraFloat(GetCSSProperty(element, 'padding-left'));
	var padding       = (paddingTop == '0px' ? '0' : paddingTop) + ' ' + (paddingRight == '0px' ? '0' : paddingRight) + ' '  + (paddingBottom == '0px' ? '0' : paddingBottom) + ' '  + (paddingLeft == '0px' ? '0' : paddingLeft);

	SetCSSPropertyValueIf(element, 'padding', padding, padding != '0 0 0 0');

	// Max/Min Width/Height
	SetCSSPropertyIf(element, 'min-height', GetCSSProperty(element, 'min-height') != '0px');
	SetCSSPropertyIf(element, 'max-height', GetCSSProperty(element, 'max-height') != 'none');
	SetCSSPropertyIf(element, 'min-width' , GetCSSProperty(element, 'min-width') != '0px');
	SetCSSPropertyIf(element, 'max-width' , GetCSSProperty(element, 'max-width') != 'none');
}

function UpdatePositioning(element)
{
	SetCSSPropertyIf(element, 'position', GetCSSProperty(element, 'position') != 'static');
	SetCSSPropertyIf(element, 'top'     , GetCSSProperty(element, 'top') != 'auto');
	SetCSSPropertyIf(element, 'bottom'  , GetCSSProperty(element, 'bottom') != 'auto');
	SetCSSPropertyIf(element, 'right'   , GetCSSProperty(element, 'right') != 'auto');
	SetCSSPropertyIf(element, 'left'    , GetCSSProperty(element, 'left') != 'auto');
	SetCSSPropertyIf(element, 'float'   , GetCSSProperty(element, 'float') != 'none');

	SetCSSProperty(element, 'display');

	SetCSSPropertyIf(element, 'clear'   , GetCSSProperty(element, 'clear') != 'none');
	SetCSSPropertyIf(element, 'z-index' , GetCSSProperty(element, 'z-index') != 'auto');
}

function UpdateTable(element, tagName)
{
	if (IsInArray(CSSViewer_tableTagNames, tagName)) {
		var nbProperties = 0;

		nbProperties += SetCSSPropertyIf(element, 'border-collapse', GetCSSProperty(element, 'border-collapse') != 'separate');
		nbProperties += SetCSSPropertyIf(element, 'border-spacing' , GetCSSProperty(element, 'border-spacing') != '0px 0px');
		nbProperties += SetCSSPropertyIf(element, 'caption-side'   , GetCSSProperty(element, 'caption-side') != 'top');
		nbProperties += SetCSSPropertyIf(element, 'empty-cells'    , GetCSSProperty(element, 'empty-cells') != 'show');
		nbProperties += SetCSSPropertyIf(element, 'table-layout'   , GetCSSProperty(element, 'table-layout') != 'auto');

		if (nbProperties > 0)
			ShowCSSCategory('pTable');
		else
			HideCSSCategory('pTable');
	}
	else {
		HideCSSCategory('pTable');
	}
}

function UpdateList(element, tagName)
{
	if (IsInArray(CSSViewer_listTagNames, tagName)) {
		ShowCSSCategory('pList');

		var listStyleImage = GetCSSProperty(element, 'list-style-image');

		if (listStyleImage == 'none') {
			SetCSSProperty(element, 'list-style-type');
			HideCSSProperty('list-style-image');
		}
		else {
			SetCSSPropertyValue(element, 'list-style-image', listStyleImage);
			HideCSSProperty('list-style-type');
		}

		SetCSSProperty(element, 'list-style-position');
	}
	else {
		HideCSSCategory('pList');
	}
}

function UpdateMisc(element)
{
	var nbProperties = 0;

	nbProperties += SetCSSPropertyIf(element, 'overflow'  , GetCSSProperty(element, 'overflow') != 'visible');
	nbProperties += SetCSSPropertyIf(element, 'cursor'    , GetCSSProperty(element, 'cursor') != 'auto');
	nbProperties += SetCSSPropertyIf(element, 'visibility', GetCSSProperty(element, 'visibility') != 'visible'); 

	if (nbProperties > 0)
		ShowCSSCategory('pMisc');
	else
		HideCSSCategory('pMisc');
}

function UpdateEffects(element)
{
	var nbProperties = 0;

	nbProperties += SetCSSPropertyIf(element, 'transform'                 , GetCSSProperty(element, 'transform') ); 
	nbProperties += SetCSSPropertyIf(element, 'transition'                , GetCSSProperty(element, 'transition') ); 
	nbProperties += SetCSSPropertyIf(element, 'outline'                   , GetCSSProperty(element, 'outline') ); 
	nbProperties += SetCSSPropertyIf(element, 'outline-offset'            , GetCSSProperty(element, 'outline-offset') != '0px'); 
	nbProperties += SetCSSPropertyIf(element, 'box-sizing'                , GetCSSProperty(element, 'box-sizing') != 'content-box'); 
	nbProperties += SetCSSPropertyIf(element, 'resize'                    , GetCSSProperty(element, 'resize') != 'none'); 

	nbProperties += SetCSSPropertyIf(element, 'text-shadow'               , GetCSSProperty(element, 'text-shadow') != 'none'); 
	nbProperties += SetCSSPropertyIf(element, 'text-overflow'             , GetCSSProperty(element, 'text-overflow') != 'clip'); 
	nbProperties += SetCSSPropertyIf(element, 'word-wrap'                 , GetCSSProperty(element, 'word-wrap') != 'normal'); 
	nbProperties += SetCSSPropertyIf(element, 'box-shadow'                , GetCSSProperty(element, 'box-shadow') != 'none');  

	nbProperties += SetCSSPropertyIf(element, 'border-top-left-radius'    , GetCSSProperty(element, 'border-top-left-radius') != '0px'); 
	nbProperties += SetCSSPropertyIf(element, 'border-top-right-radius'   , GetCSSProperty(element, 'border-top-right-radius') != '0px'); 
	nbProperties += SetCSSPropertyIf(element, 'border-bottom-left-radius' , GetCSSProperty(element, 'border-bottom-left-radius') != '0px'); 
	nbProperties += SetCSSPropertyIf(element, 'border-bottom-right-radius', GetCSSProperty(element, 'border-bottom-right-radius') != '0px'); 

	if (nbProperties > 0)
		ShowCSSCategory('pEffect');
	else
		HideCSSCategory('pEffect');
}

/*
** Event Handlers
*/

function CSSViewerMouseOver(e)
{
	
	// Block
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');

	block.firstChild.innerHTML = '&lt;' + this.tagName + '&gt;' + (this.id == '' ? '' : ' #' + this.id) + (this.className == '' ? '' : ' .' + this.className);

	// Outline element
	if (this.tagName != 'body') {
		this.style.outline = '2px solid #0099CC';
	}
	
	var rect = this.getBoundingClientRect();
	// Updating CSS properties
	var element = document.defaultView.getComputedStyle(this, null);

	notifyDevtools("This :"+block.firstChild.innerHTML+' top?'+rect.top);

	UpdatefontText(element);
	UpdateColorBg(element);
	UpdateBox(element);
	UpdatePositioning(element);
	UpdateTable(element, this.tagName);
	UpdateList(element, this.tagName);
	UpdateMisc(element);
	UpdateEffects(element);

	// console.log( element.cssText ); //< debug the hovred el css

	cssViewerRemoveElement("cssViewerInsertMessage");


	e.stopPropagation();
}

function CSSViewerMouseDown(e)
{
	if(this.tagName != 'body'){
		this.setAttribute("style","pointer-events: none; cursor: default");
 	}
 	e.stopPropagation();
 	return false;
}
var c=[],i=0;
function CSSViewerClick(e)
{
	i++;
 	if(this.tagName != 'BODY'){
 		c.push(this);
 	}
 	if (i==4) c[c.length-1].setAttribute("style","outline: 3px solid yellow;");
 	
}

function CSSViewerMouseUp(e)
{
	if(this.tagName != 'body'){
		this.setAttribute("style","outline: 3px solid yellow;");
 	}
 	e.stopPropagation();
 	return false;
}

notifyDevtools = function(msg){
	//window.postMessage(msg, "*");
	chrome.runtime.sendMessage(msg);
}

function CSSViewerMouseOut(e)
{
	
	if (this.style.outline = '2px solid #0099CC') this.style.outline = '';

	e.stopPropagation();
	return false;
}

function CSSViewerMouseMove(e)
{
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');

	block.style.display = 'none';
	
	var pageWidth = window.innerWidth;
	var pageHeight = window.innerHeight;
	var blockWidth = 332;
	var blockHeight = document.defaultView.getComputedStyle(block, null).getPropertyValue('height');

	blockHeight = blockHeight.substr(0, blockHeight.length - 2) * 1;
	
	if ((e.pageX + blockWidth) > pageWidth) {
		if ((e.pageX - blockWidth - 10) > 0)
			block.style.left = e.pageX - blockWidth - 10 + 'px';
		else
			block.style.left = 0 + 'px';
	}
	else
		block.style.left = (e.pageX + 10) + 'px';

	if ((e.pageY + blockHeight) > pageHeight) {
		if ((e.pageY - blockHeight - 10) > 0)
			block.style.top = e.pageY - blockHeight - 10 + 'px';
		else
			block.style.top = 0 + 'px';
	}
	else
		block.style.top = (e.pageY + 10) + 'px';

	e.stopPropagation();
}

/*
* CSSViewer Class
*/
function CSSViewer()
{
	// Create a block to display informations
	this.CreateBlock = function() {
		var document = GetCurrentDocument();
		var block;
		
		if (document) {
			// Create a div block
			block = document.createElement('div');
			block.id = 'CSSViewer_block';
			
			// Insert a title for CSS selector
			var header = document.createElement('h1');

			header.appendChild(document.createTextNode(''));
			block.appendChild(header);
			
			// Insert all properties
			var center = document.createElement('div');

			center.id = 'CSSViewer_center';
			
			for (var cat in CSSViewer_categories) {
				var div = document.createElement('div');

				div.id = 'CSSViewer_' + cat;
				div.className = 'CSSViewer_category';

				var h2 = document.createElement('h2');

				h2.appendChild(document.createTextNode(CSSViewer_categoriesTitle[cat]));

				var ul = document.createElement('ul');
				var properties = CSSViewer_categories[cat];

				for (var i = 0; i < properties.length; i++) {
					var li = document.createElement('li');

					li.id = 'CSSViewer_' + properties[i];

					var spanName = document.createElement('span');

					spanName.className = 'CSSViewer_property';

					var spanValue = document.createElement('span');

					spanName.appendChild(document.createTextNode(properties[i]));
					li.appendChild(spanName);
					li.appendChild(spanValue);
					ul.appendChild(li);
				}

				div.appendChild(h2);
				div.appendChild(ul);
				center.appendChild(div);
			}

			block.appendChild(center);

			// Insert a footer
			var footer = document.createElement('div');

			footer.id = 'CSSViewer_footer';

			//< I know, its annoying.. sorry about that. it just to spread the word for now, and will be removed :) 
			footer.appendChild(document.createTextNode('http://github.com/cssviewer/cssviewer')); 
			block.appendChild(footer);
		}
		
		cssViewerInsertMessage( "CSSViewer loaded! Hover any element you want to inspect in the page." );

		return block;
	}
	
	// Get all elements within the given element
	this.GetAllElements = function(element)
	{
		var elements = new Array();

		if (element && element.hasChildNodes()) {
			elements.push(element);

			var childs = element.childNodes;

			for (var i = 0; i < childs.length; i++) {
				if (childs[i].hasChildNodes()) {
					elements = elements.concat(this.GetAllElements(childs[i]));
				}
				else if (childs[i].nodeType == 1) {
					elements.push(childs[i]);
				}
			}
		}

		return elements;
	}
	
	// Add event listeners for all elements in the current document
	this.AddEventListeners = function()
	{
		var document = GetCurrentDocument();
		var elements = this.GetAllElements(document.body);

		for (var i = 0; i < elements.length; i++)	{
			elements[i].addEventListener("click", CSSViewerClick, true);
			elements[i].addEventListener("mouseover", CSSViewerMouseOver, false);
			elements[i].addEventListener("mousedown", CSSViewerMouseDown, false);
			elements[i].addEventListener("mouseup", CSSViewerMouseUp, false);
			elements[i].addEventListener("mouseout", CSSViewerMouseOut, false);
			elements[i].addEventListener("mousemove", CSSViewerMouseMove, false);
		}	
	}
	
	// Remove event listeners for all elements in the current document
	this.RemoveEventListeners = function()
	{
		var document = GetCurrentDocument();
		var elements = this.GetAllElements(document.body);

		for (var i = 0; i < elements.length; i++){
			elements[i].removeEventListener("mouseover", CSSViewerMouseOver, false);
			elements[i].removeEventListener("mouseout", CSSViewerMouseOut, false);
			elements[i].removeEventListener("mousemove", CSSViewerMouseMove, false);
		}	
	}

	// Set the title of the block
	this.SetTitle = function()
	{}
	
	// Add a stylesheet to the current document
	this.AddCSS = function(cssFile)
	{
		var document = GetCurrentDocument();
		var link = document.createElement("link");

		link.setAttribute("href", cssFile);
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");

		var heads = document.getElementsByTagName("head");

		if(heads.length > 0)
		    heads[0].appendChild(link);
		else
		    document.documentElement.appendChild(link);
	}
	
	this.RemoveCSS = function(cssFile)
	{
		var document = GetCurrentDocument();
		var links = document.getElementsByTagName('link');

		for (var i = 0; i < links.length; i++) {
			if (links[i].rel == "stylesheet" && links[i].href == cssFile) {
				var heads = document.getElementsByTagName("head");

				if(heads.length > 0) {
					heads[0].removeChild(links[i]);
				}

				return;
			}
		}
	}
}

/*
* Check if CSSViewer is enabled
*/
CSSViewer.prototype.IsEnabled = function()
{
	var document = GetCurrentDocument();

	if (document.getElementById('CSSViewer_block')) {
		return true;
	}

	return false;
}

/*
* Enable CSSViewer
*/
CSSViewer.prototype.Enable = function()
{
	var document = GetCurrentDocument();
	
	var block = document.getElementById('CSSViewer_block');

	if (!block){
		block = this.CreateBlock();
		document.body.appendChild(block);
		this.AddEventListeners();

		return true;
	}

	return false;
}

/*
* Disable CSSViewer
*/
CSSViewer.prototype.Disable = function()
{
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');

	if (block) {
		document.body.removeChild(block); 
		this.RemoveEventListeners();

		return true;
	}

	return false;
}

/*
* Display the notification message
*/
function cssViewerInsertMessage( msg )
{
	var oNewP = document.createElement("p");
	var oText = document.createTextNode( msg );

	oNewP.appendChild(oText);
	oNewP.id                    = 'cssViewerInsertMessage';
	oNewP.style.backgroundColor = '#b40000';
	oNewP.style.color           = '#ffffff';
	oNewP.style.position        = "absolute";
	oNewP.style.top             = '10px';
	oNewP.style.left            = '10px';
	oNewP.style.zIndex          = '100';
	oNewP.style.padding         = '3px';

	// hot fix 
	// https://github.com/miled/cssviewer/issues/5
	try{
		var beforeMe = document.getElementsByTagName("body");
		document.body.insertBefore( oNewP, beforeMe[0] );
	} catch(err) {
		// console.log( "CSSVIEWER::ERR document.body not found" ); // keep quiet 
	}
}

/*
* Removes and element from the dom, used to remove the notification message
*/
function cssViewerRemoveElement(divid)
{   
	var n = document.getElementById(divid);

	if(n){
		document.body.removeChild(n); 
	}
}

/*
* CSSViewer entry-point
*/
cssViewer = new CSSViewer();

if ( cssViewer.IsEnabled()){
	cssViewer.Disable();  
}
else{
	cssViewer.Enable(); 
}
