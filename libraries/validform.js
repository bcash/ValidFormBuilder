/***************************
 * ValidForm Builder - build valid and secure web forms quickly
 * 
 * Copyright (c) 2009-2012, Felix Langfeldt <flangfeldt@felix-it.com>.
 * All rights reserved.
 * 
 * This software is released under the GNU GPL v2 License <http://www.gnu.org/licenses/old-licenses/gpl-2.0.html>
 * 
 * @package    ValidForm
 * @author     Felix Langfeldt <flangfeldt@felix-it.com>
 * @copyright  2009-2012 Felix Langfeldt <flangfeldt@felix-it.com>
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html GNU GPL v2
 * @link       http://code.google.com/p/validformbuilder/
 * @version    Release: 0.2.7
 ***************************/

function ValidFormValidator(strFormId) {
	/****************************/
	/* ValidFormValidator Class ******************************************/
	/* 
	/* Display class used to push alerts regarding form validation 
	/* to the browser.
	/*********************************************************************/
	
	this.id 				= strFormId;
	this.mainAlert			= "";
}

function ValidFormFieldValidator(strElementId, strElementName) {
	/****************************/
	/* ValidFormValidator Class ******************************************/
	/* 
	/* Display class used to push alerts regarding form validation 
	/* to the browser.
	/*********************************************************************/
	
	this.id 				= strElementId;
	this.name 				= strElementName;
	this.check				= null;
	this.typeError			= "";
	this.required			= false;
	this.requiredError		= "";
	this.hint				= null;
	this.hintError			= "";
	this.minLength			= null;
	this.minLengthError		= "";
	this.maxLength			= null;
	this.maxLengthError		= "";
}

function ValidFormElement(strFormId, strElementName, strElementId, strValidation) {
	/**************************/
	/* ValidFormElement Class ********************************************/
	/* 
	/* Holds an element that can be validated.
	/*********************************************************************/
	
	this.formId					= strFormId;
	this.id 					= strElementId;
	this.name 					= strElementName;
	this.validator 				= new ValidFormFieldValidator(strElementId, strElementName);
	this.validator.check 		= strValidation;
	this.validator.required		= false;
	this.validator.minLength	= null;
	this.validator.maxLength	= null;
	
	if (ValidFormElement.arguments.length > 4) {
		this.validator.required = ValidFormElement.arguments[4];
	}
	
	if (ValidFormElement.arguments.length > 5) {
		this.validator.maxLength = ValidFormElement.arguments[5];
	}
	
	if (ValidFormElement.arguments.length > 6) {
		this.validator.minLength = ValidFormElement.arguments[6];
	}
	
	if (ValidFormElement.arguments.length > 7) {
		this.validator.hint = ValidFormElement.arguments[7];
		
		var __this = this;
		if (this.validator.hint != "") {
			jQuery("#" + this.id).bind("focus", function(){
				if (jQuery(this).val() == __this.validator.hint) {
					jQuery(this).val("");
				}
			}).bind("blur", function(){
				if (jQuery(this).val() == "" && __this.validator.required) {
					jQuery(this).val(__this.validator.hint);
				}
			});
		}
	}
	
	if (ValidFormElement.arguments.length > 8) {
		this.validator.typeError = ValidFormElement.arguments[8];
	}
	
	if (ValidFormElement.arguments.length > 9) {
		this.validator.requiredError = ValidFormElement.arguments[9];
	}
	
	if (ValidFormElement.arguments.length > 10) {
		this.validator.hintError = ValidFormElement.arguments[10];
	}
	
	if (ValidFormElement.arguments.length > 11) {
		this.validator.minLengthError = ValidFormElement.arguments[11];
	}
	
	if (ValidFormElement.arguments.length > 12) {
		this.validator.maxLengthError = ValidFormElement.arguments[12];
	}
}

function ValidConfirmForm(strFormId) {
	this.id = strFormId;

	this.init();
}

function ValidForm(strFormId, strMainAlert, blnAllowPreviousPage) {
	this.id = strFormId;
	this.elements = {};
	this.pages = [];
	this.valid = false;
	this.validator = new ValidFormValidator(this.id);
	this.validator.mainAlert = strMainAlert;
	this.events = [];
	this.cachedEvents = [];
	this.customEvents = [
		"beforeSubmit", 
		"beforeNextPage", 
		"afterNextPage", 
		"beforePreviousPage", 
		"afterPreviousPage", 
		"beforeAddPreviousButton",
		"afterAddPreviousButton",
		"beforeShowPage",
		"afterShowPage",
		"beforeAddPageNavigation",
		"afterAddPageNavigation",
		"beforeDynamicChange",
		"afterDynamicChange",
		"afterValidate"
	];
	this.hashPageIndex = 1;
	this.hashPrefix = "vf_page";
	this.labels = {};
	this.allowPreviousPage = (typeof blnAllowPreviousPage !== "undefined") ? blnAllowPreviousPage : true;

	// Initialize ValidForm class
	this.init();
}

/**
 * Initialize ValidForm Builder client side after all elements are added to the collection.
 */
ValidForm.prototype.init = function() {
	var __this = this;

	

	// Handle disabled elements and make sure all sub-elements are disabled as well.
	this.traverseDisabledElements();
	
	// This is where the magic happens: onSubmit; validate form.
	jQuery("#" + this.id).bind("submit", function(){
		if (typeof __this.events.beforeSubmit == "function") {
			__this.events.beforeSubmit(__this);
		}

		if (__this.pages.length > 1) {
			// Validation has been done on each page individually. 
			// No need to re-validate here.
			return true;
		} else {
			return __this.validate();
		}
	});
	
	// Dynamic duplication logic.
	this.dynamicDuplication();
};

/**
 * This function only gets called when the ValidWizard contains more than one page.
 */
ValidForm.prototype.initWizard = function (intPageIndex) {
	this.currentPage = jQuery("#" + this.id + " .vf__page:first");
	
	if (typeof intPageIndex !== "undefined") {
		var $objPage = jQuery("#" + this.id + " .vf__page:eq(" + (parseInt(intPageIndex) - 1) + ")");

		this.currentPage.hide();
		this.currentPage = $objPage;

		if (typeof _hash == "object") {
			_hash.set(this.hashPrefix, intPageIndex);
		}
		
		this.showPage(this.currentPage);
	}

	// Get the next & previous labels and set them on all page navigation elements.
	for (var key in this.labels) {
		if (this.labels.hasOwnProperty(key)) {
			if (key == "next" || key == "previous") {
				for (strPageId in this.pages) {
					if (this.pages.hasOwnProperty(strPageId)) {
						$("#" + key + "_" + this.pages[strPageId]).html(this.labels[key]);
					}
				}
			}
		}
	}

	this.hashChange();
};

ValidForm.prototype.setLabel = function (key, value) {
	if (typeof value !== "undefined") {
		this.labels[key] = value;
	} else {
		throw new Error("Cannot set empty label in ValidForm.setLabel('" + key + "', '" + value + "')");
	}
}

/**
 * This function handles the hashchange and hashupdated events if the _hash library is included.<br />
 * This is an optional library and hashChange won't work if _hash is not initiated before <br />
 * loading validform.js
 */
ValidForm.prototype.hashChange = function () {
	if (typeof _hash == "object") {
		var __this = this;

		jQuery(window).on("hashchange hashset hashupdated", function (e, updatedHashIndex) {
			var pageIndex = _hash.get(__this.hashPageIndex);
			var valid = true;

			// If there are any, show the first page with errors.
			__this.showFirstError();

			// If the page set by a hash is valid and it's index is within 
			// the maximum number of pages, show that page and set this.currentPage.
			if (pageIndex <= __this.pages.length && valid) {
				var $newPage = jQuery("#" + __this.pages[pageIndex - 1]);

				if (!$newPage.is(":visible")) {
					// Do a page switch
					__this.currentPage.hide();

					if (__this.validate("#" + __this.currentPage.attr("id"))) {
						__this.currentPage = __this.showPage($newPage, true);
					} else {
						// If there are any, show the first page with errors.
						__this.showFirstError();
					}
				}
			// Show first page by force, hash page index is not a valid index for the this.pages array.
			} else if (pageIndex > __this.pages.length) {
				_hash.set(__this.hashPrefix, 1);
				__this.currentPage = __this.showPage(jQuery("#" + __this.id + " .vf__page:first"));
			}
		});

		jQuery(window).trigger("hashset");
	}
};

ValidForm.prototype.showFirstError = function () {
	var __this = this;

	if (jQuery("#" + __this.id).has(".vf__error").length > 0) {
		var $error 	= jQuery(".vf__error:first");
		var $page 	= $error.parentsUntil(".vf__page").parent();

		_hash.set(__this.hashPrefix, jQuery("#" + __this.id + " .vf__page").index($page) + 1);
		__this.currentPage.hide();
		__this.showPage($page);
	}
};

ValidForm.prototype.addPage = function (strPageId, blnIsOverview) {
	var __this = this;
	var $page = jQuery("#" + strPageId);

	// Set the data attribute if this is an overview page.
	$page.data("vf__overview", (blnIsOverview) ? blnIsOverview : false);

	// Add page to the pages collection
	this.pages.push(strPageId);

	// Add next / prev navigation
	this.addPageNavigation(strPageId);

	// If this is not the first page, hide it.
	$page.hide();
	jQuery("#" + __this.id).find(".vf__navigation").hide();

	if (this.pages.length == 1) {
		this.showPage($page);
	}

	if (this.pages.length > 1) {
		this.addPreviousButton(strPageId);
	}

	//*** Due to incomplete functionality, this is temporarily disabled. ***//
	// jQuery("#" + strPageId).on("keyup", function (e) {
	// 	if (event.keyCode == 13) {
	// 		var target;
	// 		if (e.target) target = jQuery(e.target);
	// 		else if (e.srcElement) target = jQuery(e.srcElement);

	// 		if (!target.is("textarea")) {
	// 			// Simulate submit
	// 			jQuery(this).find("#next_" + jQuery(this).attr("id")).trigger("click", [true]);
	// 		}
	// 	}
	// });
};

ValidForm.prototype.addPreviousButton = function (strPageId) {
	var __this		= this;

	//*** Call custom event if set.
	if (typeof __this.events.beforeAddPreviousButton == "function") {
		__this.events.beforeAddPreviousButton(strPageId);
	}

	var $page 		= jQuery("#" + strPageId);
	
	var $pagenav 	= $page.find(".vf__pagenavigation");
	var $nav 		= ($pagenav.length > 0) ? $pagenav : $page.find(".vf__navigation");

	$nav.append(jQuery("<a href='#' id='previous_" + strPageId + "' class='vf__button vf__previous'></a>"));

	jQuery("#previous_" + strPageId).on("click", function () {
		__this.previousPage();
		return false;
	});

	//*** Call custom event if set.
	if (typeof __this.events.afterAddPreviousButton == "function") {
		__this.events.afterAddPreviousButton(strPageId);
	} else {
		this.cachedEvents.push({"afterAddPreviousButton": strPageId});
	}
};

ValidForm.prototype.getPages = function () {
	var __this 		= this;
	var objReturn 	= {};

	for (i in this.pages) {
		if (this.pages.hasOwnProperty(i)) {
			objReturn[this.pages[i]] = jQuery("#" + __this.pages[i]);
		}
	}

	return objReturn;
};

ValidForm.prototype.nextPage = function () {
	if (typeof this.events.beforeNextPage == "function") {
		this.events.beforeNextPage(this);
	}

	if (this.validate("#" + this.currentPage.attr("id"))) {
		if (this.isLastPage()) {
			jQuery("#" + this.id).trigger("submit");
		} else {
			this.currentPage.hide();

			// Set the next page as the new current page.
			this.currentPage = this.currentPage.next(".vf__page");
			this.showPage(this.currentPage);

			// Try to update the current hash if hash-based navigation is enabled
			if (typeof _hash == "object" && typeof _hash.set == "function") {
				_hash.set(this.hashPrefix, jQuery("#" + this.id + " .vf__page").index(this.currentPage) + 1);
			}

			if (typeof this.events.afterNextPage == "function") {
				this.events.afterNextPage(this);
			}
		}
	}
};

ValidForm.prototype.isLastPage = function () {
	var index = (jQuery("#" + this.id + " .vf__page").index(this.currentPage) + 1);
	return (this.pages.length == index);
};

ValidForm.prototype.previousPage = function () {
	if (typeof this.events.beforePreviousPage == "function") {
		this.events.beforePreviousPage(this);
	}

	this.currentPage.hide();

	// Set the next page as the new current page.
	this.currentPage = this.currentPage.prev(".vf__page");
	this.showPage(this.currentPage);

	// Try to update the current hash if hash-based navigation is enabled
	if (typeof _hash == "object" && typeof _hash.set == "function") {
		_hash.set(this.hashPrefix, jQuery("#" + this.id + " .vf__page").index(this.currentPage) + 1);
	}

	if (typeof this.events.afterPreviousPage == "function") {
		this.events.afterPreviousPage(this);
	}
};

ValidForm.prototype.showPage = function ($objPage) {
	var __this = this;

	if (typeof $objPage == "object" && $objPage instanceof jQuery) {
		if (typeof this.events.beforeShowPage == "function") {
			this.events.beforeShowPage($objPage);
		} else {
			this.cachedEvents.push({"beforeShowPage": $objPage});
		}

		$objPage.show(0, function () {
			if (typeof __this.events.afterShowPage == "function") {
				__this.events.afterShowPage($objPage);
			} else {
				__this.cachedEvents.push({"afterShowPage": $objPage});
			}
		});
	
		// Check if this is the last page. 
		// If that is the case, set the 'next button'-label the submit button value to
		// simulate a submit button
		var pageIndex = jQuery("#" + this.id + " .vf__page").index($objPage);
		if (pageIndex == this.pages.length) {
			jQuery("#next_" + this.pages[pageIndex - 1]).text(jQuery("#" + this.id).find("input[type='submit']").val());
		} else {
			jQuery("#" + this.id).find(".vf__navigation").hide();
		}
	} else {
		throw new Error("Invalid object passed to ValidForm.showPage().");
	}

	return $objPage;
};

ValidForm.prototype.addPageNavigation = function (strPageId) {
	var __this 			= this;
	//*** Call custom event if set.
	if (typeof __this.events.beforeAddPageNavigation == "function") {
		__this.events.beforeAddPageNavigation(strPageId);
	}

	// Button label will be set later in initWizard
	var $page 			= jQuery("#" + strPageId);
	var $nextNavigation = jQuery("<div class='vf__pagenavigation vf__cf'><a href='#' id='next_" + strPageId + "' class='vf__button'></a></div>");

	jQuery("#" + strPageId).append($nextNavigation);

	jQuery("#next_" + strPageId).on("click", function () {
		__this.nextPage();

		return false;
	});

	//*** Call custom event if set.
	if (typeof __this.events.afterAddPageNavigation == "function") {
		__this.events.afterAddPageNavigation(strPageId);
	} else {
		this.cachedEvents.push({"afterAddPageNavigation": strPageId});
	}
};

ValidForm.prototype.matchfields = function (strSecondFieldId, strFirstFieldId, strMatchError) {
	var objElement = this.getElement(jQuery("#" + strSecondFieldId).attr("name"));
	objElement.validator.matchWith = this.getElement(jQuery("#" + strFirstFieldId).attr("name"));
	objElement.validator.matchError = strMatchError;
};

ValidForm.prototype.traverseDisabledElements = function () {
	var __this = this;
	
	jQuery("#" + this.id + " fieldset.vf__disabled").each(function(){
		var fieldset = this;
		
		jQuery("input, select, textarea", fieldset).attr("disabled", "disabled");
		jQuery(".vf__dynamic a", fieldset).addClass("vf__disabled");
		jQuery("legend input", fieldset)
			.removeAttr("disabled");
		
		__this.attachAreaEvents(jQuery("legend input", fieldset));
	});
};

ValidForm.prototype.dynamicDuplication = function () {
	var __this 	= this;
			

	// Bind click event to duplicate button
	jQuery(".vf__dynamic a").bind("click", function() {
		var $anchor = jQuery(this);

		//*** Call custom event if set.
		if (typeof __this.events.beforeDynamicChange == "function") {
			__this.events.beforeDynamicChange(__this, $anchor);
		}

		if (!jQuery(this).hasClass("vf__disabled")) {
			//*** Update dynamic field counter.
			var $original 	= $anchor.parent().prev();
			var copy 		= $original.clone();

			//*** Clear values.
			var names = jQuery(this).data("target-name").split("|");
			var ids = jQuery(this).data("target-id").split("|");
			
			copy.find("input[name$='_dynamic']").remove();

			jQuery.each(names, function(index, fieldname){
				//*** Fix every field in an area or multifield. 
				var counter = $("#" + fieldname + "_dynamic");

				counter.val(parseInt(counter.val()) + 1);
				var search 	= (parseInt(counter.val()) == 1) ? fieldname : fieldname + "_" + (parseInt(counter.val()) - 1);

				copy.find("[name='" + search + "']").each(function(){
					if (jQuery(this).attr("type") == "radio" || 
							jQuery(this).attr("type") == "checkbox") {
						//*** Radio buttons and checkboxes have to be treated differently.
						var fieldId;
						if (counter.val() == 1) {
							fieldId = jQuery(this).attr("id");
						} else {
							var arrFieldId = jQuery(this).attr("id").split("_");
							arrFieldId.pop();
							fieldId = arrFieldId.join("_");
						}
						
						jQuery(this)
							.removeAttr("checked")
							.attr("name", fieldname + "_" + counter.val())
							.attr("id", fieldId + "_" + counter.val())
							.parent("label").attr("for", fieldId + "_" + counter.val());
					} else {
						//*** Normal fields (input, textarea) are easy.
						jQuery(this)
							.attr("value", "")
							.attr("name", fieldname + "_" + counter.val())
							.attr("id", ids[index] + "_" + counter.val())
							.prev("label").attr("for", ids[index] + "_" + counter.val());
					}
				});
				
				//*** Add fields to the form.
				var objOriginal = __this.getElement(fieldname);
				var objCopy = jQuery.extend(new ValidFormElement(), objOriginal);
				objCopy.id = ids[index] + "_" + counter.val();
				objCopy.name = fieldname + "_" + counter.val();
				objCopy.validator = jQuery.extend(new ValidFormFieldValidator(), objOriginal.validator);
				objCopy.validator.id = objCopy.id;
				objCopy.validator.required = false;
				__this.addElement(objCopy);
			});
			
			//*** Fix click event on active areas.
			if (copy.hasClass("vf__area")) {
				var copiedTrigger = jQuery("legend input", copy);
				if (copiedTrigger.length > 0) {
					copiedTrigger.attr("id", copiedTrigger.attr("id") + "_" + counter.val());
					copiedTrigger.attr("name", copiedTrigger.attr("name") + "_" + counter.val());
					copiedTrigger.parent("label").attr("for", copiedTrigger.attr("id"));
					
					__this.attachAreaEvents(copiedTrigger);
				}
			}
			
			//*** Remove styling.
			copy.removeClass("vf__required").removeClass("vf__error").addClass("vf__optional");
			copy.find("p.vf__error").remove();
			copy.find(".vf__error").removeClass("vf__error");
			
			jQuery(this).parent().before(copy);
			
			//*** Call custom event if set.
			if (typeof __this.events.afterDynamicChange == "function") {
				__this.events.afterDynamicChange(__this, {anchor: $anchor, copy: copy});
			}
		}
		
		return false;
	});
};

ValidForm.prototype.attachAreaEvents = function(objActiveTrigger) {
	objActiveTrigger.unbind("click").bind("click", function(){
		var fieldset = jQuery(objActiveTrigger).parentsUntil(".vf__area").parent(".vf__area");
		if (this.checked) {
			jQuery("input, select, textarea", fieldset).removeAttr("disabled");
			jQuery(".vf__dynamic a", fieldset).removeClass("vf__disabled");
			jQuery(fieldset).removeClass("vf__disabled");
		} else {
			jQuery("input, select, textarea", fieldset).attr("disabled", "disabled");
			jQuery(".vf__dynamic a", fieldset).addClass("vf__disabled");
			jQuery("legend input", fieldset).removeAttr("disabled");
			jQuery(fieldset).addClass("vf__disabled");
			
			//*** Remove errors.
			jQuery("div.vf__error", fieldset).each(function(){
				jQuery(this).removeClass("vf__error").find("p.vf__error").remove();
			});
		}
	});
};

ValidForm.prototype.inArray = function(arrToSearch, value) {
	var i;
	for (i=0; i < arrToSearch.length; i++) {
		if (arrToSearch[i] === value) {
			return true;
		}
	}
	return false;
};

ValidForm.prototype.addTrigger = function(strTriggerId, strTargetId) {
	var $trigger 	= jQuery("#" + strTriggerId);
	var $target 	= jQuery("#" + strTargetId);
	var blnIsOption	= $trigger.is("option");

	var toggleTrigger = function () {
		if ($trigger.is((blnIsOption) ? ":selected" : ":checked")) {
			$target.parent().show();
		} else {
			$target.parent().hide();
		}
	};

	if ($trigger.is(":checkbox") || $trigger.is(":radio")) {
		jQuery("input[name='" + $trigger.attr("name") + "']").on("change", function () {
			toggleTrigger();
		});
		toggleTrigger();

		// Store the triggerfield
		$target.data("vf_triggerField", $trigger);

	} else if (blnIsOption) {
		// Select option
		jQuery("input[name='" + $trigger.attr("name") + "']").on("change", function () {
			toggleTrigger();
		});
		toggleTrigger();
		
		// Store the triggerfield
		$target.data("vf_triggerField", $trigger);

	} else {
		throw new Error("Invalid Trigger type in addTrigger. Trigger should be a checkbox, radiobutton or selectlist option : '" + strTriggerId + "'.");
	}
};

ValidForm.prototype.addElement = function() {
	if (arguments.length > 0 && typeof(arguments[0]) == "object") {
		this.elements[arguments[0].name] = arguments[0];
		
		return true;
	} else {
		var typeError		= "";
		var required		= false;
		var requiredError	= "";
		var hint			= null;
		var hintError		= "";
		var minLength		= null;
		var minLengthError	= "";
		var maxLength		= null;
		var maxLengthError	= "";
	
		if (arguments.length > 0) {
			var strElementId = arguments[0];
		} else {
			return false;
		}

		if (arguments.length > 1) {
			var strElementName = arguments[1];
		} else {
			return false;
		}

		if (arguments.length > 2) {
			var strValidation = arguments[2];
		} else {
			return false;
		}
		
		if (arguments.length > 3) {
			required = arguments[3];
		}
		
		if (arguments.length > 4) {
			maxLength = arguments[4];
		}
		
		if (arguments.length > 5) {
			minLength = arguments[5];
		}
		
		if (arguments.length > 6) {
			hint = arguments[6];
		}
		
		if (arguments.length > 7) {
			typeError = arguments[7];
		}
		
		if (arguments.length > 8) {
			requiredError = arguments[8];
		}
		
		if (arguments.length > 9) {
			hintError = arguments[9];
		}
		
		if (arguments.length > 10) {
			minLengthError = arguments[10];
		}
		
		if (arguments.length > 11) {
			maxLengthError = arguments[11];
		}
		
		this.elements[strElementName] = new ValidFormElement(this.id, strElementName, strElementId, strValidation, required, maxLength, minLength, hint, typeError, requiredError, hintError, minLengthError, maxLengthError);
	}
};

ValidForm.prototype.getElement = function(strElementName){
	var objReturn = null;
	
	for (var strElement in this.elements) {
		if (strElement == strElementName) {
			objReturn = this.elements[strElement];
			break;
		}
	}
	
	return objReturn;
};

ValidForm.prototype.addEvent = function(strEvent, callback){
	if (this.inArray(this.customEvents, strEvent)) {
		this.events[strEvent] = callback;

		for(var i in this.cachedEvents) {
			if (this.cachedEvents.hasOwnProperty(i)) {
				var objCachedEvent = this.cachedEvents[i];
				for (var eventName in objCachedEvent) {
					if (objCachedEvent.hasOwnProperty(eventName)) {
						if (strEvent == eventName) {
							this.events[strEvent](objCachedEvent[eventName]);
						}
					}
				}
			}
		}
	} else {
		jQuery("#" + this.id).bind(strEvent, callback);
	}
};

ValidForm.prototype.reset = function() {
	this.validator.removeMain();
	for (var strElement in this.elements) {
		var objElement = this.elements[strElement];
		objElement.reset();
	}
};

ValidForm.prototype.validate = function(strSelector) {
	/*************************/
	/* validate function     *********************************************/
	/* 
	/* Uses the ValidForms, ValidForm, ValidElement and ValidFormAlerter 
	/* objects to validate form elements.
	/*********************************************************************/
	
	this.valid = true;
	var objDOMForm = null;
	var blnReturn = false;
	strSelector = strSelector || null;
	
	//*** Set the form object.
	try {
		objDOMForm = jQuery("#" + this.id);
	} catch(e) {
		alert("An error occured while calling the Form.\nMessage: " + e.message);
		this.valid = false;
	}
	
	if (objDOMForm) {		
		//*** Reset main error notifications.
		this.validator.removeMain();
		for (var strElement in this.elements) {
			var objElement = this.elements[strElement];
			
			if (((strSelector !== null) && (jQuery(strSelector).has(jQuery("[name='" + objElement.name + "']")).length > 0)) 
				|| (strSelector == null)) {
				//*** Check if the element is part of an area.
				var objArea = jQuery("[name='" + objElement.name + "']").parentsUntil(".vf__area").parent(".vf__area");
				if (objArea.length > 0) {
					var objChecker = jQuery("legend :checkbox", objArea);
					if (objChecker.length > 0) {
						if (objChecker.get(0).checked) {
							if (!objElement.validate()) {
								this.valid = false;
							}
						}
					} else {
						if (!objElement.validate()) {
							this.valid = false;
						} 
					}
				} else {
					if (!objElement.validate()) {
						this.valid = false;
					}	
				}
			}
		}				
	} else {
		alert("An error occured while calling the Form.\nMessage: " + e.message);
		this.valid = false;
	}
	
	if (!this.valid) {
		this.validator.showMain();
	}

	blnReturn = this.valid;
	
	if (typeof this.events.afterValidate == "function") {
		varReturn = this.events.afterValidate(this, strSelector);
		if (typeof varReturn !== "undefined") {
			blnReturn = varReturn;
		}
	}
		
	return blnReturn;
};

ValidConfirmForm.prototype.init = function () {
	var __this = this;

	$("#confirm_" + __this.id + "_previous").on("click", function () {
		var $objForm = $("#" + __this.id);
		var $objDispatch = $objForm.find("input[name='vf__dispatch']");

		$objDispatch.val(__this.id + "_correct");
		$objDispatch.after($("<input type='hidden' name='vf__back' value='true' />"));

		$objForm.find("input[type='submit']:first").attr("disabled", true);
	});
}

ValidFormElement.prototype.validate = function() {	
	return this.validator.validate();
};

ValidFormElement.prototype.reset = function() {	
	this.validator.removeAlert();
	
	var objElement = jQuery("#" + this.id);
	objElement.val("");
};

ValidFormValidator.prototype.removeMain = function() {
	jQuery("#" + this.id + " div.vf__main_error").remove();
};

ValidFormValidator.prototype.showMain = function() {
	if (this.mainAlert != "") {
		jQuery("#" + this.id).prepend("<div class=\"vf__main_error\"><p>" + this.mainAlert + "</p></div>");
	}
	
	//*** Jump to the first error.
	jQuery.scrollTo(jQuery("div.vf__error:first"), 500);
};

/**
 * Element validator
 * @param  {mixed} value Value of the element
 * @return {boolean}       True if value is valid, false if not.
 */
ValidFormFieldValidator.prototype.validate = function(value) {
	var objElement = jQuery("#" + this.id);
	var value = objElement.val();
	
	this.removeAlert();
			
	try {
		var objDOMElement = objElement.get(0);
		/*** Redirect to error handler if a checkbox or radio is found.
				This is done for cross-browser functionality. */

		switch (objDOMElement.type) {
			case 'checkbox':
			case 'radiobutton':
				throw "Checkbox or radio button detected.";
				break;
		}
		
		//*** Required, but empty is not good.
		if (this.required && value == "") {
			this.showAlert(this.requiredError);
			return false;
		} else if (!this.required && value == "") {
			// If the triggerfield is checked, the targetfield (objElement) becomes required. 
			// But ONLY if the triggerfield is checked.
			var objTrigger = objElement.data("vf_triggerField");
			if (typeof objTrigger !== "undefined") {
				if (objTrigger[0].checked) {
					this.showAlert(this.requiredError);
					return false;
				}
			}

			// Check if field values match
			if (typeof this.matchWith == "object") {
				if (this.matchWith.validate()) {
					if (jQuery("#" + this.matchWith.id).val() != value) {
						this.matchWith.validator.showAlert(this.matchError);
						this.showAlert(this.matchError);
						return false;
					}
				}
			}

			return true;
		}

		//*** Value is the same as hint value.
		if (this.hint && value == this.hint) {
			this.showAlert(this.hintError);
			return false;
		}
		
		//*** Check if the length of the value is within the range.
		if (this.minLength > 0 && value.length < this.minLength) {
			this.showAlert(sprintf(this.minLengthError, this.minLength));
			return false;
		}
		
		if (this.maxLength > 0 && value.length > this.maxLength) {
			this.showAlert(sprintf(this.maxLengthError, this.maxLength));
			return false;
		}
		
		//*** Check specific types using regular expression.
		if(typeof this.check != "function" && typeof this.check != "object") {
			return true;
		} else {
			blnReturn = this.check.test(value);
			if (blnReturn == false) this.showAlert(this.typeError);
			return blnReturn;
		}
	} catch(e) {
		var objElements = jQuery("input[name='" + this.name + "']");
		if (objElements.length > 0) {
			var objValidElements = objElements.filter(":checked");
			value = objValidElements.val();

			//*** Required, but empty is not good.
			if (this.required && value == undefined) {
				this.showAlert(this.requiredError);
				return false;
			} else if (!this.required && value == undefined) {
				return true;
			}

			//*** Check if the length of the value is within the range.
			if (this.minLength > 0 && objValidElements.length < this.minLength) {
				this.showAlert(sprintf(this.minLengthError, this.minLength));
				return false;
			}
			
			if (this.maxLength > 0 && objValidElements.length > this.maxLength) {
				this.showAlert(sprintf(this.maxLengthError, this.maxLength));
				return false;
			}

			//*** Check specific types using the type array.
			if (typeof this.check == "array") {
				for (var intCount = 0; intCount < objValidElements.length; intCount++) {
					if (!ValidForm.inArray(this.check, objValidElements.get(intCount))) {
						this.showAlert(this.typeError);
						return false;
					}
				}
			}

			return true;
		} else {
			return true;
		}
	}
};

ValidFormFieldValidator.prototype.removeAlert = function() {
	var objElement = jQuery("#" + this.id);
	if (objElement.length == 0) {
		objElement = jQuery("input[name='" + this.name + "']:first").parent().parent();
	}

	if (objElement.parent("div").hasClass("vf__multifielditem")) {
		objElement.parent("div").removeClass("vf__error");
		if (objElement.parent("div").find(".vf__error").length == 0) {
			objElement.parent("div").parent("div").removeClass("vf__error").find("p.vf__error").remove();
		}
	} else {
		objElement.parent("div").removeClass("vf__error").find("p.vf__error").remove();
	}
};

ValidFormFieldValidator.prototype.showAlert = function(strAlert) {
	var objElement = jQuery("#" + this.id);
	if (objElement.length == 0) {
		objElement = jQuery("input[name='" + this.name + "']:first").parent().parent();
	}
	
	if (objElement.parent("div").hasClass("vf__multifielditem")) {
		objElement.parent("div").addClass("vf__error");
		if (!objElement.parent("div").parent("div").hasClass("vf__error")) {
			objElement.parent("div").parent("div").addClass("vf__error").prepend("<p class=\"vf__error\">" + strAlert + "</p>");
		}
	} else {
		objElement.parent("div").addClass("vf__error").prepend("<p class=\"vf__error\">" + strAlert + "</p>");
	}
};

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 9/11/2008
 * @author Ariel Flesler
 * @version 1.4
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
(function(h){var m=h.scrollTo=function(b,c,g){h(window).scrollTo(b,c,g)};m.defaults={axis:'y',duration:1};m.window=function(b){return h(window).scrollable()};h.fn.scrollable=function(){return this.map(function(){var b=this.parentWindow||this.defaultView,c=this.nodeName=='#document'?b.frameElement||b:this,g=c.contentDocument||(c.contentWindow||c).document,i=c.setInterval;return c.nodeName=='IFRAME'||i&&h.browser.safari?g.body:i?g.documentElement:this})};h.fn.scrollTo=function(r,j,a){if(typeof j=='object'){a=j;j=0}if(typeof a=='function')a={onAfter:a};a=h.extend({},m.defaults,a);j=j||a.speed||a.duration;a.queue=a.queue&&a.axis.length>1;if(a.queue)j/=2;a.offset=n(a.offset);a.over=n(a.over);return this.scrollable().each(function(){var k=this,o=h(k),d=r,l,e={},p=o.is('html,body');switch(typeof d){case'number':case'string':if(/^([+-]=)?\d+(px)?$/.test(d)){d=n(d);break}d=h(d,this);case'object':if(d.is||d.style)l=(d=h(d)).offset()}h.each(a.axis.split(''),function(b,c){var g=c=='x'?'Left':'Top',i=g.toLowerCase(),f='scroll'+g,s=k[f],t=c=='x'?'Width':'Height',v=t.toLowerCase();if(l){e[f]=l[i]+(p?0:s-o.offset()[i]);if(a.margin){e[f]-=parseInt(d.css('margin'+g))||0;e[f]-=parseInt(d.css('border'+g+'Width'))||0}e[f]+=a.offset[i]||0;if(a.over[i])e[f]+=d[v]()*a.over[i]}else e[f]=d[i];if(/^\d+$/.test(e[f]))e[f]=e[f]<=0?0:Math.min(e[f],u(t));if(!b&&a.queue){if(s!=e[f])q(a.onAfterFirst);delete e[f]}});q(a.onAfter);function q(b){o.animate(e,j,a.easing,b&&function(){b.call(this,r,a)})};function u(b){var c='scroll'+b,g=k.ownerDocument;return p?Math.max(g.documentElement[c],g.body[c]):k[c]}}).end()};function n(b){return typeof b=='object'?b:{top:b,left:b}}})(jQuery);

/**
 * sprintf() for JavaScript 0.7-beta1
 * http://www.diveintojavascript.com/projects/javascript-sprintf
 * Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
 * All rights reserved.
 */
var sprintf=function(){function a(a){return Object.prototype.toString.call(a).slice(8,-1).toLowerCase()}function b(a,b){for(var c=[];b>0;c[--b]=a){}return c.join("")}var c=function(){if(!c.cache.hasOwnProperty(arguments[0])){c.cache[arguments[0]]=c.parse(arguments[0])}return c.format.call(null,c.cache[arguments[0]],arguments)};c.format=function(c,d){var e=1,f=c.length,g="",h,i=[],j,k,l,m,n,o;for(j=0;j<f;j++){g=a(c[j]);if(g==="string"){i.push(c[j])}else if(g==="array"){l=c[j];if(l[2]){h=d[e];for(k=0;k<l[2].length;k++){if(!h.hasOwnProperty(l[2][k])){throw sprintf('[sprintf] property "%s" does not exist',l[2][k])}h=h[l[2][k]]}}else if(l[1]){h=d[l[1]]}else{h=d[e++]}if(/[^s]/.test(l[8])&&a(h)!="number"){throw sprintf("[sprintf] expecting number but found %s",a(h))}switch(l[8]){case"b":h=h.toString(2);break;case"c":h=String.fromCharCode(h);break;case"d":h=parseInt(h,10);break;case"e":h=l[7]?h.toExponential(l[7]):h.toExponential();break;case"f":h=l[7]?parseFloat(h).toFixed(l[7]):parseFloat(h);break;case"o":h=h.toString(8);break;case"s":h=(h=String(h))&&l[7]?h.substring(0,l[7]):h;break;case"u":h=Math.abs(h);break;case"x":h=h.toString(16);break;case"X":h=h.toString(16).toUpperCase();break}h=/[def]/.test(l[8])&&l[3]&&h>=0?"+"+h:h;n=l[4]?l[4]=="0"?"0":l[4].charAt(1):" ";o=l[6]-String(h).length;m=l[6]?b(n,o):"";i.push(l[5]?h+m:m+h)}}return i.join("")};c.cache={};c.parse=function(a){var b=a,c=[],d=[],e=0;while(b){if((c=/^[^\x25]+/.exec(b))!==null){d.push(c[0])}else if((c=/^\x25{2}/.exec(b))!==null){d.push("%")}else if((c=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(b))!==null){if(c[2]){e|=1;var f=[],g=c[2],h=[];if((h=/^([a-z_][a-z_\d]*)/i.exec(g))!==null){f.push(h[1]);while((g=g.substring(h[0].length))!==""){if((h=/^\.([a-z_][a-z_\d]*)/i.exec(g))!==null){f.push(h[1])}else if((h=/^\[(\d+)\]/.exec(g))!==null){f.push(h[1])}else{throw"[sprintf] huh?"}}}else{throw"[sprintf] huh?"}c[2]=f}else{e|=2}if(e===3){throw"[sprintf] mixing positional and named placeholders is not (yet) supported"}d.push(c)}else{throw"[sprintf] huh?"}b=b.substring(c[0].length)}return d};return c}();var vsprintf=function(a,b){b.unshift(a);return sprintf.apply(null,b)};