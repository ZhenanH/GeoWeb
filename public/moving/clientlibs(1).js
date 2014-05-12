
/**
 * Binds a placeholder value to a text or selection based input field which is also bound to a
 * model value.  Operates by updating the bound model value.
 */
ko.bindingHandlers.placeholderValue = {

        init : function( element, valueAccessor, allBindingsAccessor ) {

            var allBindings = allBindingsAccessor();

            if ( allBindings.value ) {

                var valueBinding = allBindings.value;
                var placeholderValue = ko.utils.unwrapObservable( valueAccessor() );

                if ( !valueBinding() ) {
                    valueBinding( placeholderValue );

                    //check to see if knockout validation is present
                    //if it is set is modified to false so validation dose not run on the placeholder text
                    if(valueBinding.isModified){
                        var foundPlaceHolderRule = false;

                        $.each(valueBinding.rules(), function(index, ruleObject){
                            if(ruleObject.rule == 'placeholder'){
                                ruleObject.params = placeholderValue;
                                foundPlaceHolderRule = true;
                            }
                        });

                        if ( !foundPlaceHolderRule ) {
                            valueBinding.extend( { placeholder : placeholderValue } );
                        }

                        valueBinding.isModified(false);
                    }
                }

                $( element ).blur( function() {

                    if ( !valueBinding() ) {
                        valueBinding( placeholderValue );

                        //check to see if knockout validation is present
                        //if it is set is modified to false so validation dose not run on the placeholder text
                        if(valueBinding.isModified){
                            valueBinding.isModified(false);
                        }
                    }

                } );
                $( element ).focus( function() {

                    if ( valueBinding() === placeholderValue ) {
                        valueBinding( '' );

                        //check to see if knockout validation is present
                        //if it is set is modified to false so validation dose not run on the placeholder text
                        if(valueBinding.isModified){
                            valueBinding.isModified(false);
                        }
                    }

                } );
            }

        }

};
//This should only be applied to an input that has a date picker applied to it already.
ko.bindingHandlers.dateSet = {
    init: function(element, valueAccessor, viewModel) {
        var input =   $(element);

        input.datepicker({
            onClose: function(){
                var value = ko.utils.unwrapObservable(valueAccessor());
                value(element, viewModel);
            }
        })


    }
};
//focus out expects the value accessor to be a function
ko.bindingHandlers.focusOut = {
    init: function(element, valueAccessor, viewModel){
        var el = $(element);
        el.focusout(valueAccessor())
    }
};
ko.bindingHandlers.spinner = {

    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var jqTarget = $(element);
        var options = {
            lines: 13, // The number of lines to draw
            length: 7, // The length of each line
            width: 4, // The line thickness
            radius: 10, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            color: '#107C84', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };
        var userOptions = allBindingsAccessor().spinnerOptions;

        if(userOptions){
            for(var key in userOptions){
                var option = userOptions[key];
                options[key] = option;
            }
        }



        jqTarget.spin(options);


    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var jqTarget = $(element);
        var options = {
            lines: 13, // The number of lines to draw
            length: 7, // The length of each line
            width: 4, // The line thickness
            radius: 10, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            color: '#107C84', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };
        var userOptions = allBindingsAccessor().spinnerOptions;

        if(userOptions){
            for(var key in userOptions){
                var option = userOptions[key];
                options[key] = option;
            }
        }



        if(valueAccessor()()){
            jqTarget.spin(options);
        }else{
            jqTarget.spin(false);
        }
    }
};
//key up binding expects the value accessor to be a function
ko.bindingHandlers.keyUp = {
    init: function(element, valueAccessor, viewModel){
        var el = $(element);
        el.on('keyup',function(event){
            valueAccessor()(element, event);
        })
    }
};
//change binding expects the value accessor to be a function
ko.bindingHandlers.change = {
    init: function(element, valueAccessor, viewModel){
        var el = $(element);
        el.change(valueAccessor())
    }
};
/*
    <a data-bind="gaTag: {trackingType : '', category: '', action: '', label: ''}" > click me to track ga </a>
 */

ko.bindingHandlers.gaTag = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        var trackingObject = valueAccessor();

        if(trackingObject.trackingType == '_trackEvent'){
            $(element).on('click', function(){
                mymoveKOModel.gaTag._trackEvent(trackingObject);
            })
        }


    }
};
// uses moment.js to turn date into string
ko.bindingHandlers.dateString = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);
        if(valueUnwrapped) {
            $(element).text(moment(valueUnwrapped).add("h", 12).format("MMMM Do, YYYY"));
        }
    }
};
/*
pluralization binding - doesn't display the value but will add any word after the value with pluralization.
example:
    <span data-bind="text: value"></span>
    <span data-bind="pluralize: { data: value, singular:'Value', plural:'Values' }"></span>

*/

ko.bindingHandlers.pluralize = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        function count(data) {
            var value = ko.utils.unwrapObservable(data);
            if (typeof value === "object" && value.length > 0) {
                return value.length;
            } else if (typeof value === "number") {
                return value;
            }
        }

        var settings = valueAccessor();
        var text = count(settings.data) === 1 ? settings.singular : settings.plural;
        $(element).text(ko.utils.unwrapObservable(text));
    }
};
// Gigya Comments Binding for moving company reviews - would have to be refactored with a different categoryID to be used elsewhere. Receives value passed to make a new streamID for each company review.

ko.bindingHandlers.gigya = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var commentParams = {
            "categoryID": "moving-companies",
            "streamID": value,
            "containerID": "container-" + value,
            "width" : "85%",
            "cid": "",
            "useSiteLogin" : true,
            "templates" : {
                loginCanvas_loggedIn_guest : "<div class='comment-login-wrapper clearfix'>$photoDiv<div class='comment-login'><h3>Login to Post a Comment</h3><p>Please login with one of the following to submit a comment.</p><ul class='socialLoginButtons'><li><a href='#' class='facebook'></a></li><li><a href='#' class='twitter'></a></li><li><a href='#' class='google'></a></li><li><a href='#' class='blogger'></a></li><li><a href='#' class='wordpress'></a></li><li><a href='#' class='yahoo'></a></li></ul></div></div>",
                loginCanvas_loggedOut : "<div class='comment-login-wrapper clearfix'>$photoDiv<div class='comment-login'><h3>Login to Post a Comment</h3><p>Please login with one of the following to submit a comment.</p><ul class='socialLoginButtons'><li><a href='#' class='facebook'></a></li><li><a href='#' class='twitter'></a></li><li><a href='#' class='google'></a></li><li><a href='#' class='blogger'></a></li><li><a href='#' class='wordpress'></a></li><li><a href='#' class='yahoo'></a></li></ul></div></div>",
                commentBox : "<div class='gig-comments-commentBox-cr'>$loginCanvas $addComment</div>",
                comment : "<div class='gig-comments-comment-cr'><div class='comment-top'><h5>Comment by: $username</h5><small>$dateString</small><p>$body</p></div><hr></div>"
            },
            "enabledShareProviders" : "facebook,twitter,google,yahoo,messenger,linkedin,myspace",
            "onSiteLoginClicked" : function(e) {
                responsiveModal("#commentLogin", "Login");
            }
        };

        gigya.socialize.showCommentsUI(commentParams);
    }
};
/*
    Authored by CITYTECH INC June 2013

    // This binding is meant to be used on an <a>
    valueAccessor is a boolean observable
     - true will make the checkbox checked
     - false will un-check the checkbox
 */

ko.bindingHandlers.checkbox = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here

        var $checkbox = $(element);
        var checkedObservable = valueAccessor();
        var ischecked = checkedObservable();
        var onChange;

        if( allBindingsAccessor().onCheckboxChange ){
            onChange =  allBindingsAccessor().onCheckboxChange;
        }else{
            onChange = false;
        }

        var initialState = allBindingsAccessor().initialState;

        if(initialState != null){
            if(initialState == 'checked'){
                checkedObservable(true);
            }else{
                checkedObservable(false);
            }
        }

        $checkbox.on('click', function(event){
            if(!checkedObservable()){
                $checkbox.addClass('checked');
                checkedObservable(true);
            }else{
                $checkbox.removeClass('checked');
                checkedObservable(false);
            }
            if(onChange){
                onChange(event, checkedObservable());
            }
        })


    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
        var $checkbox = $(element);
        var checkedObservable = valueAccessor();
        var ischecked = checkedObservable();

        if(checkedObservable()){
            $checkbox.addClass('checked');
        }else{
            $checkbox.removeClass('checked');
        }

    }
};
/*
    Author: CITYTECH INC 2013

    How to use this binding:

            - dropDown = the observable that the selected value will be tied to
            - template = the name of the template you would like to render
            - dropDownArray = the array of options in the following object format
                {
                    "text" : "string",
                    "value" : "value"
                }
            - dropDownSelectedFunction = this function will run when the value is changed it will be passed the value that the dropdown is changed to
            - dropDownPlaceholderValue = the value you want it to default to.



    EX...
    <div class="inputContainer" data-bind="
        dropDown: capturedData.state,
        template: 'dropDownTemplate',
        dropDownArray: mymoveKOModel.statesArray,
        dropDownSelectedFunction: null,
        dropDownPlaceholderValue: 'Select A State'
    "></div>

 */

ko.bindingHandlers.dropDown = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here



        var textObservable = ko.observable(allBindingsAccessor().dropDownPlaceholderValue);
        var valueObservable = valueAccessor();
        var dropDownSelectedFunction = allBindingsAccessor().dropDownSelectedFunction;
        var dropDownArray = allBindingsAccessor().dropDownArray;

        var hasValidation = false;
        if(typeof valueObservable.validate == 'function'){
            hasValidation = true;
        }
        var template = '';
        if(allBindingsAccessor().template){
            template = allBindingsAccessor().template;
        }else{
            template = 'dropDownTemplate';
        }

        if(template == 'dropDownTemplate' && hasValidation){
            template = 'dropDownValidationTemplate';
        }




        var tmplContext = {
            textObservable : textObservable,
            valueObservable : valueObservable,
            dropDownData : allBindingsAccessor().dropDownArray,
            changeDropDown : function(viewModelContext, event){
                var jqDropDownElement = $(event.currentTarget);


                valueObservable(viewModelContext.value);
                textObservable(viewModelContext.text);
                jqDropDownElement.addClass('jsActive');

                jqDropDownElement.siblings().each(function(){
                    $(this).removeClass('jsActive');
                })
            },
            addActive : function(viewModel, event){
                $(event.currentTarget).toggleClass('jsActive');
                event.stopPropagation();

                if($(event.currentTarget).hasClass('jsActive')){
                    console.log('test');
                    $(document).on('click.DropDown', function(e){
                        $(event.currentTarget).removeClass('jsActive');
                        $(this).unbind(e);
                    });
                }else{
                    $(document).unbind('click.DropDown');
                }
            }
        }

        ko.renderTemplate(template, tmplContext, {}, element, 'replaceNode');


        valueObservable.subscribe(function(newValue){
            if(dropDownSelectedFunction){
                dropDownSelectedFunction(newValue);
            }
        })


    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.



    }
};
// jQuery UI tooltip binding - data-bind="tooltip: 'tooltip text'"

ko.bindingHandlers.tooltip = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var text;

        if(typeof valueAccessor() == 'function'){
            text = valueAccessor( )( );
        }else{
            text = valueAccessor( );
        }


        $(element).attr("title", text).tooltip({
            position: {
                my: "center top",
                at: "center bottom+10",
                collision: "none",
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                        .addClass( "arrow" )
                        .addClass( feedback.vertical )
                        .addClass( feedback.horizontal )
                        .appendTo( this );
                }
            }
        });
    }
};
//key up binding expects the value accessor to be a function
ko.bindingHandlers.keypress = {
    init: function(element, valueAccessor, viewModel){
        var el = $(element);
        el.on('keypress',function(event){
            valueAccessor()(element, event);
        })
    }
};
ko.bindingHandlers.selectDropDown = {
    update: function(element, valueAccessor, allBindingsAccessor) {
        valueAccessor().unshift("");
        ko.bindingHandlers.options.update(element, valueAccessor, allBindingsAccessor);
        $(element).attr("title", "").selectpicker("refresh");
    }
};

/**
 * Used to tie JQuery Validation to a form.  This binding is expected to be used on a
 * DOM element of type form.
 *
 * The binding expects to be passed an object of options for the validation plugin.
 * Documentation on the effect of these options is available at
 * http://jqueryvalidation.org/validate
 *
 * This binding will react to the following additional bindings:
 *
 * <ul>
 *   <li>jqFieldErrors : This is expected to be a reference to a viewModel element
 *                       that exposes an object of field name : error message
 *                       pairs.  If the viewModel element is an observable then,
 *                       on change, any error messages present in the object
 *                       will be presented alongside their respective field.</li>
 * </ul>
 */
ko.bindingHandlers.jqValidate = {

        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {

            var validationOptions = valueAccessor();

            var validator = $( element ).validate( validationOptions );

            var allBindings = allBindingsAccessor();

            if ( allBindings.jqFieldErrors && allBindings.jqFieldErrors.subscribe ) {
                allBindings.jqFieldErrors.subscribe( function( newValue ) {
                    //see if there are errors to show
                    var numberOfErrors = 0;

                    for ( var curErrorKey in newValue ) {
                        numberOfErrors += 1;
                    }

                    if ( numberOfErrors ) {
                        /*
                         * Run showErrors on the validator associated with the
                         * form.  See http://jqueryvalidation.org/Validator.showErrors/
                         */
                        validator.showErrors( newValue );
                    }
                } );
            }
        }

};


ko.bindingHandlers.bootstrapModal = {
	
		init : function( element, valueAccessor, allBindings, viewModel, bindingContext ) {
			
		}, 
		update : function( element, valueAccessor, allBindings, viewModel, bindingContext ) {
			
			var unwrappedValue = ko.utils.unwrapObservable( valueAccessor() );
			
			var isMobileMode = binaryMobile() === 'mobile';
			
			if ( unwrappedValue ) {
				
				if ( isMobileMode ) {
					$( element ).slideDown( 400, function() {
							$.scrollTo( $( element ).offset().top, 0 );
						} );
					$( element ).addClass( 'ko-bootstrapModal-openmode-mobile' );
				}
				else {
					$( element ).modal( 'show' );
					$( element ).removeClass( 'ko-bootstrapModal-openmode-mobile' );
				}
				
			}
			else {
				
				var isOpenModeMobile = $( element ).hasClass( 'ko-bootstrapModal-openmode-mobile' );
				
				if ( isOpenModeMobile ) {
					$( element ).slideUp();
				}
				else {
					$( element ).modal( 'hide' );
				}
				
			}
			
		}
		
};
/**
 * Created by CITYTECH INC on 10/29/13.
 */


ko.bindingHandlers.validationError = {
    update : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var field = valueAccessor();
        var originalError = $(element).text();

        if(!field.isValid() && field.isModified() || field.showServerValidation()){

            if( field.isValid( ) ) {
                $( element ).hide( );
                field.showServerValidation( false );
            } else {
                if ( field.showServerValidation( ) ) {
                    $( element ).text( field.serverErrorMessage( ) );
                } else {
                    $( element ).text( originalError );
                }

                $( element ).show( );
            }


        }else{
            $(element).hide();
        }


    }
};
ko.bindingHandlers.accordion = {

    init : function( element , valueAccessor ){

        var showToggle = valueAccessor( );
        var jqTitle    = $( element ).children( ".accordion_title" );
        var jqContent  = $( element ).children( ".accordion_content" );

        if ( showToggle() ){
            jqContent.slideDown( );
        } else {
            jqContent.hide( );
        }

        jqTitle.on( 'click' , function( ) {
            if ( showToggle( ) ) {
                showToggle( false );
            } else {
                showToggle( true );
            }
        } );

    },

    update : function( element , valueAccessor , allBindings ) {

        var showToggle = ko.utils.unwrapObservable( valueAccessor( ) );
        var jqContent  = $( element ).children( ".accordion_content" );
        var hideOtherAccordionContainers = allBindings( ).hideOtherAccordionContainers;
        var accordionIndex = allBindings( ).accordionIndex;


        if ( typeof hideOtherAccordionContainers == "function" && showToggle ){
            hideOtherAccordionContainers( accordionIndex );
        }

        if ( showToggle ){
            jqContent.slideDown( );
        } else {
            jqContent.slideUp( );
        }


    }

};
ko.bindingHandlers.selectPlaceholder = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var placeHolderValue = valueAccessor();
        var valueObservable  = allBindingsAccessor().value;
        
        if(typeof valueObservable.isValid == 'function'){

            if(placeHolderValue == valueObservable()){
                valueObservable('');
                valueObservable.isModified(false);
            }

        }else{

            if(placeHolderValue == valueObservable()){
                valueObservable('');
            }

        }
    }
};
ko.validation.rules['placeholder'] = {
    validator: function(currentValue, placeHolderValue) {
        return currentValue != placeHolderValue;
    },
    message: 'Please change the default value'
};

ko.validation.registerExtenders();

mymoveKOModel.modals = {

    /**
     * <p>
     * A DOM may be made to open a fancybox modal by `data-bind`ing mymoveKOModel.modals.fancybox.responsiveOpen as a click
     * handler.  The content of the modal to be opened should exist as a separate, identifiable, DOM element.  The ID of
     * the DOM element containing the modal content may be identified in one of two ways:
     * </p>
     * <ol>
     *   <li>By providing a `data-modal-id` attribute</li>
     *   <li>Setting the fragment identifier in the href</li>
     * <ol>
     * <p>
     * An id defined in a `data-modal-id` attribute will take precedence over the href if both are defined.  The href
     * mechanism should only be used if the DOM element to which you are binding is an `a` element.
     * </p>
     * <p>
     * The title to associate with the modal may be defined in two ways:
     * </p>
     * <ol>
     *   <li>By providing a `data-modal-title` attribute</li>
     *   <li>By providing a `title` attribute</li>
     * </ol>
     * <p>
     * A title defined in `data-modal-title` will take precedence over the `title` attribute if both are defined.
     * </p>
     */
	fancybox : new function() {

	    var self = this;

	    var openMobileModal = function( modalElement, modalId, title ) {

	        var hiddenModalContainer = modalElement.closest( '.hideMe' );

	        hiddenModalContainer.prependTo( '#contentContainer' );

	        $.scrollTo( $( '#contentContainer' ), 500, {
	            onAfter : function() {
	                hiddenModalContainer.slideDown( 1000, toggleModal );
	            }
	        } );
	    };

	    var openDesktopModal = function( modalElement, modalId, title ) {

	        //TODO: I don't like this being here but to get the existing responsive switch to work it needs to be here
	        var hiddenModalContainer = modalElement.closest( '.hideMe' );

	        hiddenModalContainer.prependTo( '#contentContainer' );

	        $.fancybox( {
	            scrolling: 'no',
	            href: modalId,
	            title: title,
	            titlePosition: 'inside',
	            onComplete: toggleModal,
	            onClosed: function() {
	                $( 'body' ).removeClass( 'toggleModal' );
	                MyMove.onModalClose( thisHref, thisTitle );
	            }
	        } );

	    };

	    this.responsiveOpenById = function( elementId, modalTitle ) {

	        var internalElementId = elementId;

            if ( !internalElementId.indexOf( '#' ) === 0 ) {
                internalElementId = '#' + internalElementId;
            }

            //run clicktale code
            var paramClickTale = "mymoveKOModel.modals.fancyBox.responsiveOpenById('" + internalElementId + "','" + modalTitle + "')";
            if(typeof ClickTaleExec == 'function') {
                ClickTaleExec(paramClickTale);
            }

            var modalContentDom = $( internalElementId );

            //determine mode
            var mode = binaryMobile();

            if ( mode === 'mobile' ) {
                openMobileModal( modalContentDom, internalElementId, modalTitle );
            }
            else {
                openDesktopModal( modalContentDom, internalElementId, modalTitle );
            }

            //for now the setting of this global variable needs to be maintained so as to not
            //break things which are currently working.  Once we reach a point where were mobile
            //resize functionality is moved into the KO model this shouldn't be needed
            thisHref = internalElementId;

	    };

		this.responsiveOpen = function( data, event ) {

		    //retrieve the element which was clicked on
		    var element = $( event.target );

		    //find the element which is the content of the modal
		    var modalContentId = element.data( 'modal-id' ) || element.attr( 'href' );
		    var modalTitle = element.data( 'modal-title' ) || element.attr( 'title' );

		    if ( modalContentId ) {

		        self.responsiveOpenById( modalContentId, modalTitle );

		    }

		    return false;

		};

	}

};
/*
*    trackingObject = { category : '', action   : '', label    : '' }
*/
mymoveKOModel.gaTag = {
    _trackEvent: function(trackingObject){
        _gaq.push(['_trackEvent', trackingObject.category, trackingObject.action, trackingObject.label])
    },

    _setCustomVar : function(trackingObject){
        _gaq.push(['_setCustomVar', trackingObject.category, trackingObject.action, trackingObject.label, 1])
    }
};
mymoveKOModel.statesObject = {

    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"

};

mymoveKOModel.statesArray = [
    {  },
    { value: "AL", text: "Alabama" },
    { value: "AK", text: "Alaska" },
    { value: "AZ", text: "Arizona" },
    { value: "AR", text: "Arkansas" },
    { value: "CA", text: "California" },
    { value: "CO", text: "Colorado" },
    { value: "CT", text: "Connecticut" },
    { value: "DE", text: "Delaware" },
    { value: "DC", text: "District Of Columbia" },
    { value: "FL", text: "Florida" },
    { value: "GA", text: "Georgia" },
    { value: "HI", text: "Hawaii" },
    { value: "ID", text: "Idaho" },
    { value: "IL", text: "Illinois" },
    { value: "IN", text: "Indiana" },
    { value: "IA", text: "Iowa" },
    { value: "KS", text: "Kansas" },
    { value: "KY", text: "Kentucky" },
    { value: "LA", text: "Louisiana" },
    { value: "ME", text: "Maine" },
    { value: "MD", text: "Maryland" },
    { value: "MA", text: "Massachusetts" },
    { value: "MI", text: "Michigan" },
    { value: "MN", text: "Minnesota" },
    { value: "MS", text: "Mississippi" },
    { value: "MO", text: "Missouri" },
    { value: "MT", text: "Montana" },
    { value: "NE", text: "Nebraska" },
    { value: "NV", text: "Nevada" },
    { value: "NH", text: "New Hampshire" },
    { value: "NJ", text: "New Jersey" },
    { value: "NM", text: "New Mexico" },
    { value: "NY", text: "New York" },
    { value: "NC", text: "North Carolina" },
    { value: "ND", text: "North Dakota" },
    { value: "OH", text: "Ohio" },
    { value: "OK", text: "Oklahoma" },
    { value: "OR", text: "Oregon" },
    { value: "PA", text: "Pennsylvania" },
    { value: "RI", text: "Rhode Island" },
    { value: "SC", text: "South Carolina" },
    { value: "SD", text: "South Dakota" },
    { value: "TN", text: "Tennessee" },
    { value: "TX", text: "Texas" },
    { value: "UT", text: "Utah" },
    { value: "VT", text: "Vermont" },
    { value: "VA", text: "Virginia" },
    { value: "WA", text: "Washington" },
    { value: "WV", text: "West Virginia" },
    { value: "WI", text: "Wisconsin" },
    { value: "WY", text: "Wyoming" }

];

mymoveKOModel.statesObservableArray = ko.observableArray([
    {},
    {
        "text":"Alabama",
        "value":"AL",
        "show": ko.observable(true)
    },
    {
        "text":"Alaska",
        "value":"AK",
        "show": ko.observable(true)
    },
    {
        "text":"Arizona",
        "value":"AZ",
        "show": ko.observable(true)
    },
    {
        "text":"Arkansas",
        "value":"AR",
        "show": ko.observable(true)
    },
    {
        "text":"California",
        "value":"CA",
        "show": ko.observable(true)
    },
    {
        "text":"Colorado",
        "value":"CO",
        "show": ko.observable(true)
    },
    {
        "text":"Connecticut",
        "value":"CT",
        "show": ko.observable(true)
    },
    {
        "text":"Delaware",
        "value":"DE",
        "show": ko.observable(true)
    },
    {
        "text":"District Of Columbia",
        "value":"DC",
        "show": ko.observable(true)
    },
    {
        "text":"Florida",
        "value":"FL",
        "show": ko.observable(true)
    },
    {
        "text":"Georgia",
        "value":"GA",
        "show": ko.observable(true)
    },
    {
        "text":"Hawaii",
        "value":"HI",
        "show": ko.observable(true)
    },
    {
        "text":"Idaho",
        "value":"ID",
        "show": ko.observable(true)
    },
    {
        "text":"Illinois",
        "value":"IL",
        "show": ko.observable(true)
    },
    {
        "text":"Indiana",
        "value":"IN",
        "show": ko.observable(true)
    },
    {
        "text":"Iowa",
        "value":"IA",
        "show": ko.observable(true)
    },
    {
        "text":"Kansas",
        "value":"KS",
        "show": ko.observable(true)
    },
    {
        "text":"Kentucky",
        "value":"KY",
        "show": ko.observable(true)
    },
    {
        "text":"Louisiana",
        "value":"LA",
        "show": ko.observable(true)
    },
    {
        "text":"Maine",
        "value":"ME",
        "show": ko.observable(true)
    },
    {
        "text":"Maryland",
        "value":"MD",
        "show": ko.observable(true)
    },
    {
        "text":"Massachusetts",
        "value":"MA",
        "show": ko.observable(true)
    },
    {
        "text":"Michigan",
        "value":"MI",
        "show": ko.observable(true)
    },
    {
        "text":"Minnesota",
        "value":"MN",
        "show": ko.observable(true)
    },
    {
        "text":"Mississippi",
        "value":"MS",
        "show": ko.observable(true)
    },
    {
        "text":"Missouri",
        "value":"MO",
        "show": ko.observable(true)
    },
    {
        "text":"Montana",
        "value":"MT",
        "show": ko.observable(true)
    },
    {
        "text":"Nebraska",
        "value":"NE",
        "show": ko.observable(true)
    },
    {
        "text":"Nevada",
        "value":"NV",
        "show": ko.observable(true)
    },
    {
        "text":"New Jersey",
        "value":"NJ",
        "show": ko.observable(true)
    },
    {
        "text":"New Mexico",
        "value":"NM",
        "show": ko.observable(true)
    },
    {
        "text":"New York",
        "value":"NY",
        "show": ko.observable(true)
    },
    {
        "text":"North Carolina",
        "value":"NC",
        "show": ko.observable(true)
    },
    {
        "text":"Ohio",
        "value":"OH",
        "show": ko.observable(true)
    },
    {
        "text":"Oklahoma",
        "value":"OK",
        "show": ko.observable(true)
    },
    {
        "text":"Oregon",
        "value":"OR",
        "show": ko.observable(true)
    },
    {
        "text":"Pennsylvania",
        "value":"PA",
        "show": ko.observable(true)
    },
    {
        "text":"Rhode Island",
        "value":"RI",
        "show": ko.observable(true)
    },
    {
        "text":"South Carolina",
        "value":"SC",
        "show": ko.observable(true)
    },
    {
        "text":"South Dakota",
        "value":"SD",
        "show": ko.observable(true)
    },
    {
        "text":"Tennessee",
        "value":"TN",
        "show": ko.observable(true)
    },
    {
        "text":"Texas",
        "value":"TX",
        "show": ko.observable(true)
    },
    {
        "text":"Utah",
        "value":"UT",
        "show": ko.observable(true)
    },
    {
        "text":"Vermont",
        "value":"VT",
        "show": ko.observable(true)
    },
    {
        "text":"Virginia",
        "value":"VA",
        "show": ko.observable(true)
    },
    {
        "text":"Washington",
        "value":"WA",
        "show": ko.observable(true)
    },
    {
        "text":"West Virginia",
        "value":"WV",
        "show": ko.observable(true)
    },
    {
        "text":"Wisconsin",
        "value":"WI",
        "show": ko.observable(true)
    }
]);
mymoveKOModel.dropDownModel = function(dropDownArray, value, userSelectedFunction){
    $(".dropDownContainer").attr("tabindex", "0");
    var self = this;

    self.dropDownOptions = dropDownArray;
    self.valueObservable = value;
    self.textObservable = ko.observable();

    if(self.valueObservable() != null){
        self.textObservable(self.valueObservable());
    }


    self.setDefaultText = function(defaultText){
        self.textObservable(defaultText);
    };

//    $(".dropDownContainer").on("focus", function(event) {
//        $(event.currentTarget).addClass('jsActive');
//    });
//
//    $(".dropDownContainer").off("focus", function(event) {
//        $(event.currentTarget).removeClass('jsActive');
//    });


    self.addActive = function(context, event){
        $(event.currentTarget).toggleClass('jsActive');
        event.stopPropagation();


        if($(event.currentTarget).hasClass('jsActive')){
            console.log('test');
            $(document).on('click.DropDown', function(e){
                $(event.currentTarget).removeClass('jsActive');
                $(this).unbind(e);
            });

//            var holdingLetters = $('<div class="searching-string"></div>');
//
//
//            function typing(letter){
//                letter = letter.toLowerCase();
//                $('.dropdown li').removeClass('jsActive'); //reset everything
//                $.each($('.dropdown li'),function(index,el){
//                    if($(el).data("value").toLowerCase().charAt(0) == letter){
//                        $(el).addClass('jsActive');
//                        $(".dropdown").scrollTo(el);
//                        return false; //found, 'break' the each loop
//                    }
//                });
//            }

            var letterPressed = [];
            var timeOutResetLetters = null;

//            $(document).on("keypress.DropDown", function(e) {
//                e.stopPropagation();
//                clearTimeout(timeOutResetLetters);
//                timeOutResetLetters = setTimeout(function(){
//                    letterPressed = [];
//                    holdingLetters.html('');
//                },300);
//                letterPressed.push(String.fromCharCode(e.keyCode));
//                holdingLetters.html(letterPressed.join(''));
//                typing(letterPressed.join(''));
//            });

//            $(document).on("keydown.DropDown", function(e){
//
//                var currSelected = $('.dropdown li.jsActive');
//                var context = ko.contextFor(currSelected);
//
//                if(e.keyCode == "38"){
//                    if(currSelected.prev() && currSelected.prev().hasClass('option')){
//                        currSelected.prev().addClass('jsActive');
//                        currSelected.removeClass('jsActive');
//                        $(".dropdown").scrollTo(currSelected.prev());
//                        e.preventDefault();
//                    }
//                }else if(e.keyCode == "40"){
//                    if(currSelected.next() && currSelected.next().hasClass('option')){
//                        currSelected.next().addClass('jsActive');
//                        currSelected.removeClass('jsActive');
//                        $(".dropdown").scrollTo(currSelected.next());
//                        e.preventDefault();
//                    }
//                }
//                else if(e.keyCode == "13"){ //enter
////                 self.onSelect(context.$data, $(currSelected[0]));
//                    e.preventDefault();
////                    $(currSelected[0]).parent().parent().removeClass('jsActive');
////                    $(this).unbind(e);
//                } else if(e.keyCode == "9"){ //tab
//                    e.preventDefault();
////                    self.onSelect(context.$data, $(currSelected[0]));
////                    $(currSelected[0]).parent().parent().removeClass('jsActive');
////                    $(this).unbind(e);
//                }
//
//
//            });

        }else{
            $(document).unbind('click.DropDown');
//            $(document).unbind("keypress.DropDown");
//            $(document).unbind("keydown.DropDown");
        }

    };
    self.onSelect = function(context, event){

        var jqDropDownElement = $(event.currentTarget);

        //check to see if there is a key value paring
        if(context.value){
            self.valueObservable(context.value);
            self.textObservable(context.text);
        }else{
            self.valueObservable(context);
            self.textObservable(context);
        }

        jqDropDownElement.addClass('jsActive');

        jqDropDownElement.siblings().each(function(){
            $(this).removeClass('jsActive');
        });

        userSelectedFunction(context.value);

    };




};

mymoveKOModel.verifiedUserData = new function() {

    var self = this;
    var mUserData = null;

    this.hasUserData = ko.observable( false );

    this.setUserData = function( userData ) {
        mUserData = userData;
        self.hasUserData( true );
    };

    this.getUserData = function() {
        var retData = mUserData;

        if ( mUserData && mUserData.oneTimeUse ) {
            mUserData = null;
            self.hasUserData( false );
        }

        return retData;
    };

    this.expireUserData = function() {
        mUserData = null;
    };

};
mymoveKOModel.sessionUser = new function() {

	var self = this;
	
	this.isLoggedIn = ko.observable( false );
	this.firstName = ko.observable();
	
	var populateViaSessionUser = function() {
	
		self.isLoggedIn( MyMove.SessionUser.getProperty( MyMove.SessionUser.IS_LOGGED_IN_PROPERTY ) );
		self.firstName( MyMove.SessionUser.getProperty( MyMove.SessionUser.FIRSTNAME_PROPERTY ) );
		
	};
	
	this.refresh = function() {
		
		MyMove.SessionUser.getSessionUser();
		populateViaSessionUser();
		
	};
	
	populateViaSessionUser();
	
};
mymoveKOModel.validationUtilities = {

    initializeValidation  : function( fieldsObject ){

        $.each( fieldsObject, function( key , field ){

            field.showServerValidation = ko.observable( false );

            field.serverErrorMessage = ko.observable( );

        });

    },

    showServerValidation : function( fieldsObject , serverResponse ) {

        $.each( serverResponse , function( key , fieldErrorMessage ) {

            if( fieldsObject[ key ] ){

                fieldsObject[ key ].__valid__( false );

                if( typeof fieldsObject[ key ].serverErrorMessage == 'function' ){

                    fieldsObject[ key ].showServerValidation( true );

                    fieldsObject[ key ].serverErrorMessage( fieldErrorMessage );

                }

            }
        });

    },

    validateForm : function ( fieldsObject , fieldsToValidate ) {

        var formValid = true;

        var validatedFields = { };
        var inValidFields   = { };

        $.each( fieldsToValidate , function( index , key ) {

            var field = fieldsObject[ key ];

            if( !field.validate( ) ) {
                formValid = false;
                inValidFields[ key ] = field;
            }else{

                validatedFields[ key ] = field;

            }

        });

        if(formValid){
            return {
                valid           : formValid ,
                validatedFields : validatedFields
            };
        }else{
            return {
                valid           : formValid ,
                inValidFields   : validatedFields
            };
        }

    },

    addChangeValidationRule : function ( observable , ruleName , ruleValue ) {

    	if ( typeof observable.rules !== 'function' ) {
    		return;
    	}
    	
        var allRules = observable.rules();

        var foundRule = false;

        for( var ruleIndex in allRules ) {

            var ruleObject = allRules[ruleIndex];

            if ( ruleObject.rule == ruleName ) {

                ruleObject.params = ruleValue;

                foundRule = true;

            }

        }

        if ( !foundRule ) {

            observable.rules.push( {
                params : ruleValue,
                rule   : ruleName
            } )

        }
        
    }, 
    
    removeValidationRule : function( observable, ruleName ) {
    	
    	if ( typeof observable.rules !== 'function' ) {
    		return;
    	}
    	
    	var allRules = observable.rules(); 
    	
    	for ( var curRuleIndex in allRules ) { 
    	
    		if ( allRules[ curRuleIndex ].rule && allRules[ curRuleIndex ].rule === ruleName ) {
    			
    			allRules.splice( curRuleIndex, 1 );
    			return;
    			
    		}
    		
    	}
    	
    }

};



//jqAuto -- main binding (should contain additional options to pass to autocomplete)
//jqAutoSource -- the array to populate with choices (needs to be an observableArray)
//jqAutoQuery -- function to return choices (if you need to return via AJAX)
//jqAutoValue -- where to write the selected value
//jqAutoSourceLabel -- the property that should be displayed in the possible choices
//jqAutoSourceInputValue -- the property that should be displayed in the input box
//jqAutoSourceValue -- the property to use for the value
ko.bindingHandlers.jqAuto = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var options = valueAccessor() || {},
            allBindings = allBindingsAccessor(),
            unwrap = ko.utils.unwrapObservable,
            modelValue = allBindings.jqAutoValue,
            source = allBindings.jqAutoSource,
            query = allBindings.jqAutoQuery,
            valueProp = allBindings.jqAutoSourceValue,
            inputValueProp = allBindings.jqAutoSourceInputValue || valueProp,
            labelProp = allBindings.jqAutoSourceLabel || inputValueProp;

        //function that is shared by both select and change event handlers
        function writeValueToModel(valueToWrite) {
            if (ko.isWriteableObservable(modelValue)) {
                modelValue(valueToWrite );
            } else {  //write to non-observable
                if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['jqAutoValue'])
                    allBindings['_ko_property_writers']['jqAutoValue'](valueToWrite );
            }
        }

        //on a selection write the proper value to the model
        options.select = function(event, ui) {
            writeValueToModel(ui.item ? ui.item.actualValue : null);
        };

        //on a change, make sure that it is a valid value or clear out the model value
        options.change = function(event, ui) {
            var currentValue = $(element).val();
            var matchingItem =  ko.utils.arrayFirst(unwrap(source), function(item) {
                return unwrap(item[inputValueProp]) === currentValue;
            });

            if (!matchingItem) {
                writeValueToModel(null);
            }
        }

        //hold the autocomplete current response
        var currentResponse = null;

        //handle the choices being updated in a DO, to decouple value updates from source (options) updates
        var mappedSource = ko.dependentObservable({
            read: function() {
                mapped = ko.utils.arrayMap(unwrap(source), function(item) {
                    var result = {};
                    result.label = labelProp ? unwrap(item[labelProp]) : unwrap(item).toString();  //show in pop-up choices
                    result.value = inputValueProp ? unwrap(item[inputValueProp]) : unwrap(item).toString();  //show in input box
                    result.actualValue = valueProp ? unwrap(item[valueProp]) : item;  //store in model
                    return result;
                });
                return mapped;
            },
            write: function(newValue) {
                source(newValue);  //update the source observableArray, so our mapped value (above) is correct
                if (currentResponse) {
                    currentResponse(mappedSource());
                }
            }
        });

        if (query) {
            options.source = function(request, response) {
                currentResponse = response;
                query.call(this, request.term, mappedSource);
            }
        } else {
            //whenever the items that make up the source are updated, make sure that autocomplete knows it
            mappedSource.subscribe(function(newValue) {
                $(element).autocomplete("option", "source", newValue);
            });

            options.source = mappedSource();
        }


        //initialize autocomplete
        $(element).autocomplete(options);
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        //update value based on a model change
        var allBindings = allBindingsAccessor(),
            unwrap = ko.utils.unwrapObservable,
            modelValue = unwrap(allBindings.jqAutoValue) || '',
            valueProp = allBindings.jqAutoSourceValue,
            inputValueProp = allBindings.jqAutoSourceInputValue || valueProp;

        //if we are writing a different property to the input than we are writing to the model, then locate the object
        if (valueProp && inputValueProp !== valueProp) {
            var source = unwrap(allBindings.jqAutoSource) || [];
            var modelValue = ko.utils.arrayFirst(source, function(item) {
                return unwrap(item[valueProp]) === modelValue;
            }) || {};
        }

        //update the element with the value that should be shown in the input
        $(element).val(modelValue && inputValueProp !== valueProp ? unwrap(modelValue[inputValueProp]) : modelValue.toString());
    }
};
/**
 *
 * Created by CITYTECH INC.
 * Date: 7/24/13
 * Time: 2:20 PM
 *
 *
 *
 *  <div id="dialog" data-bind="dialog: {autoOpen: false, title: 'Dialog test' }, dialogVisible: isOpen, positioningElement: htmlElement">foo dialog</div>
 *
 */

ko.bindingHandlers.jqDialog = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {};
        //do in a setTimeout, so the applyBindings doesn't bind twice from element being copied and moved to bottom
        setTimeout(function() {
            options.close = function() {
                allBindingsAccessor().dialogVisible(false);
            };


            $(element).dialog(options);
        }, 0);

        //handle disposal (not strictly necessary in this scenario)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).dialog("destroy");
        });
    },
    update: function(element, valueAccessor, allBindingsAccessor) {
        var shouldBeOpen = ko.utils.unwrapObservable(allBindingsAccessor().dialogVisible),
            $el = $(element),
            dialog = $el.data("uiDialog") || $el.data("dialog");



        //don't call open/close before initilization
        if (dialog) {
            $el.dialog(ko.utils.unwrapObservable(valueAccessor()));
            $el.dialog(shouldBeOpen ? "open" : "close");
        }
    }
};
mymoveKOModel.responsiveUtilities = new function(){

    var self = this;

    self.windowWidth = ko.observable($(window).width());

    self.isMobile = ko.computed(function(){
        if(self.windowWidth() < 768){
            return true;
        }else{
            return false;
        }
    }, this);

    self.isTablit = ko.computed(function(){
        if(self.windowWidth() > 768 && self.windowWidth() < 1024){
            return true;
        }else{
            return false;
        }
    }, this);

    self.isDesktop = ko.computed(function(){
        if(self.windowWidth() > 1024){
            return true;
        }else{
            return false;
        }
    }, this);

    self.isDesktopAndTablit = ko.computed(function(){

        if(self.isDesktop() || self.isTablit()){
            return true;
        }else{
            return false;
        }

    }, this);


    $(window).resize(function(){

        var ww = $(window).width();
        self.windowWidth(ww);
        console.log('the window was resized to: ', ww, ' px');



    });

}
/**
 *
 * Created by CITYTECH INC.
 * JULY 2013
 *
 */


mymoveKOModel.addressExpress = new function(){

    var self = this;
    self.categories = ko.observableArray();
    self.categoriesURL = "";

    self.selectedAccount = ko.observable({});


    self.autoCompleteList = ko.observableArray();
    self.searchUrl = '';

    self.loginURL = null;
    self.isLoggedIn = ko.observable(MyMove.SessionUser.getProperty('isLoggedIn'));

    self.hideSearch = ko.observable(false);
    self.showHideSearch = ko.computed(function(){
       return self.isLoggedIn() ? true : false;
    });

    self.addCompanyUrlPath = "";
    self.removeCompanyUrlPath = "";
    self.markCompanyCompleteUrlPath = "";
    self.markCompanyInCompleteUrlPath = "";

    self.teaserInfoURL = '';
    self.clickCount = ko.observable(0);
    self.firstClickedID = null;
    self.canSetTeaser = true;

    self.userInfo = {
        email    : ko.observable().extend({required: true, email:true}),
        password : ko.observable().extend({required: true}),
        zip      : ko.observable().extend({required: true}),
        moveDate : ko.observable().extend({required: true})
    }

    self.emailErrorText = ko.observable();

    self.showAutoCompleteSpinner = ko.observable(false);
    self.searchPlaceHolderTxt = ko.observable();
    self.totalAcouuntCount = ko.observable(0);
    self.originalSearchText = self.searchPlaceHolderTxt();
    self.totalAccounts = ko.computed(function(){
        if(self.totalAcouuntCount() >= 100) {
            self.searchPlaceHolderTxt(self.totalNumOfCompaniesText);
            return true;
        }else{
            self.searchPlaceHolderTxt(self.originalSearchText);
            return false;
        }

    }, this);
    self.searchError = ko.observable();


    /**
     * This object is for the spinner in the "add to list" button so that the user will know that the component is
     * searching for the current string in the input.
     *
     * @type {{lines: number, length: number, width: number, radius: number, corners: number, rotate: number, color: string, speed: number, trail: number, shadow: boolean, hwaccel: boolean, className: string, zIndex: number, top: string, left: string}}
     */
    self.autoCompleteSpinnerOptions = {
        "lines": 13, // The number of lines to draw
        "length": 5, // The length of each line
        "width": 3, // The line thickness
        "radius": 5, // The radius of the inner circle
        "corners": 1, // Corner roundness (0..1)
        "rotate": 0, // The rotation offset
        "color": '#fff', // #rgb or #rrggbb
        "speed": 1, // Rounds per second
        "trail": 60, // Afterglow percentage
        "shadow": false, // Whether to render a shadow
        "hwaccel": true, // Whether to use hardware acceleration
        "className": 'spinner', // The CSS class to assign to the spinner
        "zIndex": 2e9, // The z-index (defaults to 2000000000)
        "top": '-3px', // Top position relative to parent in px
        "left": 'auto' // Left position relative to parent in px
    };

    /**
     * This function gets called from the dashboard jsp and will load all the categories as well as sets up all the
     * other defaults from the component.
     *
     * @type {*}
     */
    self.initAddressExpress = function(){
        self.serverCalls.init(self.categoriesURL).
            done(function(userData){
                console.log('categories', userData);
                $.each(userData.categories, function(index, cat){
                    cat.isVisible = cat.renderEmpty;
                    self.categories.push(new self.categoryStub(cat));
                });



                $.each(userData.companies, function(index, company){
                    var parentCat = {}
                    $.each(self.categories(), function(index, cat){
                        if(company.categoryId == cat.id){
                            parentCat = cat;
                        }
                    })
                    if(company.completed){
                        self.completed.addAccount(new self.accountStub(company, parentCat, true));
                    }else{
                        if(!self.isLoggedIn() && !company.teaser){
                            self.firstClickedID = company.id;
                            self.canSetTeaser = false;
                        }
                        self.addAccount(company, true);
                    }

                });

            });
    };

    /**
     * This function is used by the auto complete "Typeahead" to grab the data for the suggested companies to add.
     *
     * @param searchTerm
     * @param sourceArray
     */
    self.getAccounts = function(searchTerm, sourceArray){
        console.log('search', searchTerm, sourceArray());
        self.showAutoCompleteSpinner(true);
        self.serverCalls.getAccount(self.searchUrl, searchTerm).
            done(function(results){
                var restultArray = [];
                self.searchError(null);

                if(results.length == 0){
                    self.searchError(mymoveKOModel.addressExpress.searchErrorText);
                }else{
                    $.each(results, function(index, item){
                        item.displayName = item.name + ' - ' + item.department;
                        restultArray.push(item);
                    });
                }

                self.showAutoCompleteSpinner(false);
                sourceArray(restultArray);
            }).
            fail(function(error){
                self.showAutoCompleteSpinner(false);
                self.searchError(mymoveKOModel.addressExpress.searchErrorText);
                console.log('Typeahead error', error);
            });
    };


    /**
     * this is the function that will add the company to the correct category and then clear the input so the user
     * can continue adding more companies.
     *
     * @param form
     */

    self.addAccount = function(form, isAddedByServer){
        $.each(self.categories(), function(index, category){
            //console.log('category', category);

            if(category.id == self.selectedAccount().categoryId){

                var account = new self.accountStub(self.selectedAccount(), category);

                self.totalAcouuntCount( self.totalAcouuntCount() + 1 );

                category.addAccount(account);

                if(!category.isActive()){
                    category.click();
                }
            }
            if(isAddedByServer && (category.id == form.categoryId)){
                var account = new self.accountStub(form, category);

                self.totalAcouuntCount( self.totalAcouuntCount() + 1 );

                category.addAccount(account, true);

                if(!category.isActive()){
                    category.click();
                }
            }
        });
        if(!isAddedByServer){
            self.gaTags.addToList();
        }
        $(form).find('input[type="text"]').val('');
    }

    /**
     * this is a utility function that will just submit the form so that we can use the same function for both click and submit.
     */

    self.addAccountSubmit = function(){
        $('form.searchForm').submit();
    }


    /**
     * this is just an utility function that will go through and look for all open categories and
     * close them. This is used so that when we add a company to a new category we can close the current category and
     * open the new one so the emphasis is on the new category.
     */

    self.closeOtherCategories = function(){
        $.each(self.categories(), function(index, category){
            if(category.isActive()){
                category.isActive(false);
            }
        })
    }


    /**
     * This function will fire the open command to the modals object to open the account modal.
     */

    self.logIn = function(){
        mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'ListBuild', label : 'StartNotifying_click'});
        mymoveKOModel.addressExpress.modals.open('accountModal');
    }

    /**
     * this function will be fired when the user submits their information from the registration from.
     * it will submit the user info object to the url specified.
     *
     * @param viewModel
     * @param event
     */

    self.submitRegisterForm = function(viewModel, event){
        console.log('self.userinfo', self.userInfo);
        var readyForSubmit = true;
        $.each(self.userInfo, function(index, field){
            if(!field.validate()){
                readyForSubmit = false;
            }
        });

        if(readyForSubmit){
            mymoveKOModel.addressExpress.gaTags.register();
            self.serverCalls.doLogIn(self.loginURL, ko.toJS(self.userInfo)).
                done(function(data){
                   if(data.success == false) {
                       $.each(data.formErrors, function(key, error){
                           self.userInfo[key].__valid__(false);
                           if(key == 'email'){
                               self.emailErrorText(error);
                           }
                       });
                   }
                   else {
                       location.reload();
                   }
                });
        }
    }

    self.toggleHideSearch = function(){
        if(self.hideSearch()){
            self.hideSearch(false);
            $.each(self.categories(), function(index, cat){
                cat.recommendedOpen(false);
            });
            self.gaTags.addMore();
        }else{

            self.hideSearch(true);
        }
    }

};


/**
 *
 * Created by CITYTECH INC.
 * Date: 7/22/13
 * Time: 4:22 PM
 *
 */

mymoveKOModel.addressExpress.serverCalls = {

    /**
     * This function will go to the specified url and GET the default data for the component.
     *
     * @param url = /url/to/get/path
     * @returns jquery promise object
     */
    init: function (url) {

        var d = $.Deferred();

        $.ajax({
            url: url,
            success: function (data) {
                console.log('data', data);
                d.resolve(data);
            }
        });

        return d;
    },

    /**
     * This function will go to the specified url and GET the returned data for the current search term.
     *
     * @param url = /url/to/get/path
     * @param searchTerm = string
     * @returns jquery promise object
     */

    getAccount: function (url, searchTerm) {
        var d = $.Deferred();
        $.ajax({
            url: url,
            data: {
                term: searchTerm
            },
            success: function (data) {
                d.resolve(data);
            },
            error: function (error) {


                d.reject(error);
            }
        })

        return d;
    },

    /**
     * This function will go to the specified url and POST the current company ID so that the server knows the state of
     * the component. This particular function will make a call to add the company to the list.
     *
     * @param url = /url/to/post/the/company/id
     * @param accountID = numeric value
     * @returns jquery promise object
     */

    submitCompanyInfo: function (url, accountID, intent) {
        var d = $.Deferred();
        $.ajax({
            url: url,
            type: "post",
            data: {
                intent: intent,
                companyId: accountID
            },
            success: function (data) {
                console.log('submitCompanyInfo', data);
            },
            error: function (error) {
                console.log('submitCompanyInfo error', error);
            }
        });
        return d;
    },


    /**
     * This function will POST to a particular url to log the user in to their account.
     *
     * @param url
     * @param userData = { email : "string", password: "string", moveDate: "string", zipCode: "string" }
     * @returns jquery promise object
     */

    doLogIn: function (url, userData) {
        var d = $.Deferred();

        $.ajax({
            url: url,
            type: "post",
            data: userData,
            success: function (data) {
                d.resolve(data);
            },
            error: function (error) {
                d.reject(error);
            }
        });

        return d;

    },

    /**
     * This will only be called once for the session. It will get the full teaser object from the service.
     *
     * @param url = /path/to/end/point
     * @param id = the id of the company that you are requesting full data for
     * @returns {*} = full data for the company that you are requesting
     */

    getFullCompanyInfo : function(url, id){
        var d = $.Deferred();
        $.ajax({
            url: url,
            type: "post",
            data: {
                companyId: id
            },
            success: function (data) {
                d.resolve(data);
            },
            error: function (error) {
                console.log('fullCompany INFO error', error);
            }
        });
        return d;
    }


};
/**
 * CITYTECH INC
 * August 2013
 */


mymoveKOModel.addressExpress.modals = new function () {

    var self = this;

    /**
     * this is the function that will launch the modals and will look for the options object and if it is not present
     * it will just go with the bootstrap default options.
     *
     * @param modalClass = the class which applies to the div
     * @param options = {
     *      backdrop: boolean,
     *      keyboard: boolean,
     *      show: boolean,
     *      remote: path,
     *  }
     *  for more info go to http://getbootstrap.com/2.3.2/javascript.html#modals
     */
    self.open = function( modalClass , options ){
        if(options){
            $( '.modal.' + modalClass ).modal( options );
        }else{
            $( '.modal.' + modalClass ).modal( 'show' );
        }
    };

    /**
     * This function will close all the modals on the page. Which should only be one.
     */

    self.close = function (){
        $( '.modal' ).modal('hide');
    }

};
/**
 *
 * Created by CITYTECH INC.
 * JULY 2013
 *
 */


mymoveKOModel.addressExpress.categoryStub = function(category){

    var self = this;

    self.id = category.id;
    self.title = category.name;
    self.isActive = ko.observable(false);
    self.icon = category.iconPath;


    self.accounts = ko.observableArray();
    self.numberOfAccounts = ko.observable(0);

    self.recommendedAccounts = ko.observableArray(category.featuredCompanies);
    self.addedRecommendedAccounts = ko.observableArray([]);

    self.recommendedOpen = ko.observable(false);
    self.recommendedElementID = Math.floor(Math.random()*300) + '_recommendedElement';

    self.recommendedText = ko.observable(category.recommendedText);

    self.modalID = "modal fade hide " + self.recommendedElementID + '_mobileModal';
    self.modalIDForLaunch = self.recommendedElementID + '_mobileModal';

    /**
     * This will hide a category if is visible is false and there are no companies currently added to the
     * category.
     *
     * @type {*}
     */
    self.isVisible = ko.computed(function(){

        if(category.isVisible){
            return true;
        }else{
            if(self.accounts().length > 0){
                return true;
            }else{
                return false
            }
        }

    }, this)

    /**
     * This object is for the positioning and look and feel of the popover for desktop recommendations
     *
     * @type {{appendTo: string, autoOpen: boolean, dialogClass: string, draggable: boolean, show: string, position: {my: string, at: string, of: string}, buttons: {}, resizable: boolean, minHeight: number}}
     */
    self.recommendedOptions  = {
        appendTo: ".addressExpressWrapper",
        autoOpen: false,
        dialogClass: "recommendations",
        draggable: false,
        show: "fade",
        position: {
            my: "left+17 top-16",
            at: "right top",
            of: '#' + self.recommendedElementID
        },
        buttons: {},
        resizable: false,
        minHeight: 40,
        width: 200,
        open: function(event, ui) { $('.ui-widget-overlay').bind('click', function(){ $(".recommendations").dialog('close'); }); }
    };



    /**
     * determine if the recommended accounts array is greater than 0 if it is return true
     * else return false. This function is meant to be used for determining if the recommended text should be displayed
     *
     * @type {*}
     */
    self.recommendedIsVisible = ko.computed(function(){
        if(self.recommendedAccounts().length > 0 && mymoveKOModel.addressExpress.totalAcouuntCount() < 100){
            return true;
        }else if(self.recommendedAccounts().length == self.addedRecommendedAccounts().length && self.recommendedAccounts().length != 0 && self.addedRecommendedAccounts().length != 0 && mymoveKOModel.addressExpress.totalAcouuntCount() < 100){
            return false;
        }else if(self.recommendedText()){
            return true;
        }else{
            return false;
        }
    }, this);


    /**
     * This will return true or false depending on if the accounts array has any accounts in it currently.
     *
     * @type {*}
     */
    self.hasAccounts = ko.computed(function(){
        if(self.accounts().length > 0){
            return true;
        }else{
            return false;
        }
    },this)


    /**
     * expand or collapse the category when there are accounts
     *
     * @type {*}
     */
    self.click = function(){
        mymoveKOModel.addressExpress.gaTags.category();
        if(self.hasAccounts()){
            if(self.isActive()){
                var recommendedOpen = self.recommendedOpen();
                if(recommendedOpen){
                    self.recommendedOpen(false);
                }
                self.isActive(false);
                if(recommendedOpen){
                    self.recommendedOpen(true);
                }
            }else{
                mymoveKOModel.addressExpress.closeOtherCategories();
                self.isActive(true);
            }
        }
    };


    /**
     * Add account to Category and increment number of accounts for the current category
     * then open the category to show new account
     *
     * @param account = the account object you are adding to the array.
     */
    self.addAccount = function(account, isAddedByServer){
        var alreadyAdded = false;
        $.each(self.accounts(), function(index, accountItem){
            if(accountItem.id == account.id){
                alreadyAdded = true;
            }
        });

        if(mymoveKOModel.addressExpress.isLoggedIn()){
            $.each(mymoveKOModel.addressExpress.completed.accounts(), function(index, accountItem){
                if(accountItem.id == account.id){
                    alreadyAdded = true;
                }
            });
        }

        if(!alreadyAdded){
            self.accounts.push(account);
            self.numberOfAccounts(self.numberOfAccounts() + 1);

            var companyToRemove = {};
            $.each(self.recommendedAccounts(), function(index, company){
               if(account.id == company.id){
                   companyToRemove = company;
               }
            });

            self.recommendedAccounts.remove(companyToRemove);
            self.addedRecommendedAccounts.push(companyToRemove);

            if(!isAddedByServer){
                mymoveKOModel.addressExpress.serverCalls.submitCompanyInfo(mymoveKOModel.addressExpress.handleIntentPath, account.id, 'addcompany');
            }
        }
        else{
            mymoveKOModel.addressExpress.searchError(mymoveKOModel.addressExpress.companyAlreadyAddedText);
        }


    }

    /**
     * Remove the current account from the category
     * and decrement the number of accounts by one
     *
     * @param account = the account object that you are removing from the array
     */
    self.removeAccount = function(account, complete){
        self.accounts.remove(account);
        self.numberOfAccounts(self.numberOfAccounts() - 1);


        if(!complete){
            var found = null;
            mymoveKOModel.addressExpress.totalAcouuntCount(mymoveKOModel.addressExpress.totalAcouuntCount()-1);
            mymoveKOModel.addressExpress.gaTags.removeCompany();
            mymoveKOModel.addressExpress.serverCalls.submitCompanyInfo(mymoveKOModel.addressExpress.handleIntentPath, account.id, 'removecompany');
            $.each(self.addedRecommendedAccounts(), function(index, company){
                if(account.id == company.id){
                    found = company;
                }
            });

            if(found){
                self.addedRecommendedAccounts.remove(found);
                self.recommendedAccounts.push(account.originalAccount);
            }


        }

    }


    /**
     * for each account in accounts add 150px to the max height of the accounts container
     * this is for animation slide down
     *
     * @type {*}
     */
    self.categoryHeight = ko.computed(function(){
        if(self.isActive()){

            if(mymoveKOModel.responsiveUtilities.isMobile()) {
                var maxHeightMobile = self.numberOfAccounts() * 400;
                return maxHeightMobile + 'px';
            } else {
                var maxHeight = self.numberOfAccounts() * 350;
                return maxHeight + 'px';
            }
        }else{
            return '0px';
        }

    }, this);


    /**
     * this function will toggle the recommendation popover on and off and also close other popovers that are
     * already open.
     *
     * @param viewModel = the current context of the recommendations button
     * @param event = the click event object
     */
    self.openRecommendations = function(viewModel, event){

        if(self.recommendedOpen()){
            self.recommendedOpen(false);
        }else{
            mymoveKOModel.addressExpress.gaTags.recommendedShow();

            $.each(mymoveKOModel.addressExpress.categories(), function(index, category){
                if(category.recommendedOpen() && mymoveKOModel.responsiveUtilities.isDesktopAndTablit()){
                    category.recommendedOpen(false);
                }else{
                    mymoveKOModel.addressExpress.modals.close();
                }
            });
            if(mymoveKOModel.responsiveUtilities.isDesktopAndTablit()){
                self.recommendedOpen(true);
            }else{
                mymoveKOModel.addressExpress.modals.open(self.modalIDForLaunch);
            }
        }

        $(document).on('click.Recommendations', function(event){
            self.recommendedOpen(false);
            $(this).unbind('click.Recommendations');
        });

        event.stopPropagation();
    }

    /**
     * this function will take a recommended account that is clicked on and added it to the category
     * if the recommended accounts array is equal to zero we will hide the popover
     *
     * @param viewModel = the account object
     * @param event = event object from the click event
     */
    self.addRecommendedAccount = function(viewModel, event){
        var account = new mymoveKOModel.addressExpress.accountStub(viewModel, self);
        if(mymoveKOModel.addressExpress.totalAcouuntCount() < 100){
            self.recommendedAccounts.remove(viewModel);

            self.addedRecommendedAccounts.push(account);

            if(self.recommendedAccounts().length == 0){
                self.recommendedOpen(false);
            }

            mymoveKOModel.addressExpress.gaTags.recommendedAdd();

            self.addAccount(account);
            mymoveKOModel.addressExpress.totalAcouuntCount( mymoveKOModel.addressExpress.totalAcouuntCount() + 1 );
            if(!self.isActive()){
                self.click();
            }
        }


    }


    self.closeRecommendations = function(){
        self.recommendedOpen(false);
    }

}
/**
 *
 * Created by CITYTECH INC.
 * JULY 2013
 *
 */


mymoveKOModel.addressExpress.accountStub = function(account, category, complete){

    var self = this;

    self.id = account.id;
    self.categoryID = account.categoryId;


    self.title = ko.observable(account.name);
    self.website = ko.observable(account.websiteAddress);
    self.phone = ko.observable(account.phoneNumber);
    self.link = ko.observable(account.link);
    self.hours = ko.observable(account.hours);
    self.department = ko.observable(account.department);
    self.description = ko.observable(account.description);
    self.email = ko.observable(account.email);
    self.instructions = ko.observable(account.instructions);


    self.isActive = ko.observable(false);
    self.complete = complete ? ko.observable(true) : ko.observable(false);

    self.parentCategory = category;

    self.originalAccount = account;

    self.isFirstClicked = account.teaser ? ko.observable(false) : ko.observable(true);

    /**
     * this function will open the company that was clicked on
     *
     *
     * @param viewModel NOT USED
     * @param event  used to stop the click from propagating up to the category container
     */
    self.open = function(viewModel, event){
        mymoveKOModel.addressExpress.gaTags.company();
        if(!self.isActive()){
            self.isActive(true);
            if( ( mymoveKOModel.addressExpress.clickCount() < 1 || mymoveKOModel.addressExpress.firstClickedID == self.id ) && mymoveKOModel.addressExpress.canSetTeaser ){
                self.isFirstClicked(true);
                mymoveKOModel.addressExpress.serverCalls.getFullCompanyInfo(mymoveKOModel.addressExpress.teaserInfoURL, self.id).
                    done(function(data){
                        self.website(data.websiteAddress);
                        self.phone(data.phoneNumber);
                        self.link(data.link);
                        self.hours(data.hours);
                        self.department(data.department);
                        self.description(data.description);
                        self.email(data.email);
                        self.instructions(data.instructions);
                    });
                mymoveKOModel.addressExpress.firstClickedID = self.id;
            }
            mymoveKOModel.addressExpress.clickCount(mymoveKOModel.addressExpress.clickCount() + 1);
        }
        event.stopPropagation();
    };

    /**
     * this will close the account
     *
     * @param viewModel
     * @param event
     */

    self.close = function(viewModel, event){
        viewModel.isActive(false);
        event.stopPropagation();
    };

    /**
     * this function will remove the company from the category
     *
     * @param viewModel = this is the current company object to search for in the list of companies
     * @param event = this is used to stop the propagation of the event up to the category
     */

    self.remove = function(viewModel, event){
        self.parentCategory.removeAccount(viewModel);
        event.stopPropagation();
    }

    /**
     * This function will toggle the complete button on each company. It will also add the company to the completed list
     * or take it out and show it back in its category.
     *
     * @param viewModel
     * @param event
     */

    self.toggleComplete = function(viewModel, event){
        mymoveKOModel.addressExpress.gaTags.statusChange();

        if(self.complete()){
            mymoveKOModel.addressExpress.completed.removeAccount(viewModel, true);
            self.parentCategory.addAccount(viewModel, true);
            self.complete(false);
        }else{
            mymoveKOModel.addressExpress.completed.addAccount(viewModel);
            self.parentCategory.removeAccount(viewModel, true);
            self.complete(true);
        }

        event.stopPropagation();
    }

    /**
     *
     *
     * @type {*}
     */

    self.showFullInformation = ko.computed(function(){
        if(mymoveKOModel.addressExpress.clickCount() <= 1 || mymoveKOModel.addressExpress.isLoggedIn() || self.isFirstClicked()){
            return true;
        }else{
            return false;
        }
    },this)
}
mymoveKOModel.addressExpress.completed = new function(){

    var self = this;

    self.title = 'Completed';
    self.isActive = ko.observable(false);


    self.accounts = ko.observableArray();
    self.numberOfAccounts = ko.observable(0);
    self.recommendedAccounts = ko.observableArray();
    self.addedRecommendedAccounts = ko.observableArray();

    /**
     * This will hide a category if is visible is false and there are no companies currently added to the
     * category.
     *
     * @type {*}
     */
    self.isVisible = ko.computed(function(){

       if(mymoveKOModel.addressExpress.isLoggedIn()){
           return true;
       }else{
           return false;
       }

    }, this);







    /**
     * This will return true or false depending on if the accounts array has any accounts in it currently.
     *
     * @type {*}
     */
    self.hasAccounts = ko.computed(function(){
        if(self.accounts().length > 0){
            return true;
        }else{
            return false;
        }
    },this);


    /**
     * expand or collapse the category when there are accounts
     *
     * @type {*}
     */
    self.click = function(){
        if(self.hasAccounts()){
            if(self.isActive()){

                self.isActive(false);

            }else{
                mymoveKOModel.addressExpress.closeOtherCategories();
                self.isActive(true);
            }
        }
    };


    /**
     * Add account to Category and increment number of accounts for the current category
     * then open the category to show new account
     *
     * @param account = the account object you are adding to the array.
     */
    self.addAccount = function(account){
        var alreadyAdded = false;
        $.each(self.accounts(), function(index, accountItem){
            if(accountItem.id == account.id){
                alreadyAdded = true;
            }
        })

        if(!alreadyAdded){
            self.accounts.push(account);
            self.numberOfAccounts(self.numberOfAccounts() + 1);

            var companyToRemove = {};
            $.each(account.parentCategory.recommendedAccounts(), function(index, company){
                if(account.id == company.id){
                    companyToRemove = company;
                }
            });

            account.parentCategory.recommendedAccounts.remove(companyToRemove);
            self.isActive(true);
            account.parentCategory.addedRecommendedAccounts.push(companyToRemove);

            mymoveKOModel.addressExpress.serverCalls.submitCompanyInfo(mymoveKOModel.addressExpress.handleIntentPath, account.id, 'markcompanycomplete');
        }


    };

    /**
     * Remove the current account from the category
     * and decrement the number of accounts by one
     *
     * @param account = the account object that you are removing from the array
     */
    self.removeAccount = function(account, complete){
        self.accounts.remove(account);
        self.numberOfAccounts(self.numberOfAccounts() - 1);
        mymoveKOModel.addressExpress.serverCalls.submitCompanyInfo(mymoveKOModel.addressExpress.handleIntentPath, account.id, 'markcompanyincomplete');

        if(!complete){
            self.addedRecommendedAccounts.remove(account);
            self.recommendedAccounts.push(account.originalAccount);
        }

    };


    /**
     * for each account in accounts add 150px to the max height of the accounts container
     * this is for animation slide down
     *
     * @type {*}
     */
    self.categoryHeight = ko.computed(function(){
        if(self.isActive()){

            if(mymoveKOModel.responsiveUtilities.isMobile()) {
                var maxHeightMobile = self.numberOfAccounts() * 400;
                return maxHeightMobile + 'px';
            } else {
                var maxHeight = self.numberOfAccounts() * 350;
                return maxHeight + 'px';
            }
        }else{
            return '0px';
        }

    }, this);


};
mymoveKOModel.addressExpress.gaTags = {

    addMore: function(){
        if(mymoveKOModel.addressExpress.isLoggedIn()){
            mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'Dashboard', label : 'AddMore_click'});
        }
    },
    logIn: function(){
        mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'ListBuild', label : 'Login_click'});
    },

    addToList: function(){
        if(mymoveKOModel.addressExpress.isLoggedIn()){
            mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'Dashboard', label : 'AddToList_click'});
        }else{
            mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'ListBuild', label : 'AddToList_click'});
        }
    },
    recommendedShow: function(){
        if(mymoveKOModel.addressExpress.isLoggedIn()){
            mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'Dashboard', label : 'Recommendation_show'});
        }else{
            mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'ListBuild', label : 'Recommendation_show'});
        }
    },
    recommendedAdd: function(){
        if(mymoveKOModel.addressExpress.isLoggedIn()){
            mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'Dashboard', label : 'Recommendation_add'});
        }else{
            mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'ListBuild', label : 'Recommendation_add'});
        }
    },
    category: function(){
        if(mymoveKOModel.addressExpress.isLoggedIn()){
            mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'Dashboard', label : 'Category_click'});
        }
    },
    company: function(){
        if(mymoveKOModel.addressExpress.isLoggedIn()){
            mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'Dashboard', label : 'ListItem_click'});
        }
    },
    statusChange: function(){
        if(mymoveKOModel.addressExpress.isLoggedIn()){
            mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'Dashboard', label : 'ListItem_statusChange'});
        }
    },
    removeCompany: function(){
        if(mymoveKOModel.addressExpress.isLoggedIn()){
            mymoveKOModel.gaTag._trackEvent({category : 'AdEx', action : 'Dashboard', label : 'ListItem_remove'});
        }
    },
    register: function(){
        mymoveKOModel.gaTag._trackEvent({category : 'Registration', action : 'AdEx', label : 'AdEx'});
    }


}
/**
 * The zipfinderutil model is used by the zipfinderutil component exposing its functionality.
 */
mymoveKOModel.zipfinderutil = new function() {

    var self = this;

    self.addressLine1 = ko.observable();
    self.addressLine2 = ko.observable();
    self.city = ko.observable();
    self.state = ko.observable();

    if ( MyMove.SessionUser.getProperty( MyMove.SessionUser.MOVE_TO_ADDRESS_LINE1_PROPERTY ) ) {
        self.addressLine1( MyMove.SessionUser.getProperty( MyMove.SessionUser.MOVE_TO_ADDRESS_LINE1_PROPERTY ) );
    }
    if ( MyMove.SessionUser.getProperty( MyMove.SessionUser.MOVE_TO_ADDRESS_LINE2_PROPERTY ) ) {
        self.addressLine2( MyMove.SessionUser.getProperty( MyMove.SessionUser.MOVE_TO_ADDRESS_LINE2_PROPERTY ) );
    }
    if ( MyMove.SessionUser.getProperty( MyMove.SessionUser.MOVE_TO_CITY_PROPERTY ) ) {
        self.city( MyMove.SessionUser.getProperty( MyMove.SessionUser.MOVE_TO_CITY_PROPERTY ) );
    }
    if ( MyMove.SessionUser.getProperty(MyMove.SessionUser.MOVE_TO_STATE_PROPERTY) ) {
        self.state( MyMove.SessionUser.getProperty(MyMove.SessionUser.MOVE_TO_STATE_PROPERTY) );
    }

    self.currentZipcodeField = null;

    self.currentZipfinderModalId = null;

    self.errorMessages = ko.observableArray();
    self.hasServerErrors = ko.computed( function() {
        return self.errorMessages() && self.errorMessages().length;
    } );

    /**
     * Initializes the zipfinderutil based on the dom element used to access the zipfinder. The key association
     * is that of the zipfinder to the zipcode field to be populated upon a successful zipcode lookup.  Attribution
     * of said zipcode field is based on the data property `data-zip-field-name` which should be set upon the DOM
     * element used to access the zipfinder and which should be equal to the `name` of the zipcode field in the associated
     * form.
     *
     * This function will presume the associated address form upon which the zipfinder is operating is the closest parent
     * form element of the element used to access the zipfinder.  This can be overridden via a `data-addr-form-id` property
     * which would be set upon the DOM element used to access the zipfinder and set equal to the ID of the address form
     * containing the zipcode field to be populated upon successful use of the zipfinder.
     */
    self.openZipFinder = function( data, event ) {

        //find the zipcode field we are interacting with
        var element = $( event.target );

        var addressForm = element.closest( 'form' );

        if ( element.data( 'addr-form-id' ) ) {
            addressForm = $( '#' + element.data( 'addr-form-id' ) );
        }

        self.currentZipcodeField = addressForm.find( '[name="' + element.data( 'zip-field-name' ) + '"]' ).first();

        self.currentZipfinderModalId = element.attr( 'href' );

        //open the zipfinder modal
        return mymoveKOModel.modals.fancybox.responsiveOpen.call( self, data, event );

    };

    self.submitAddress = function( form, placeholders ) {

        //clear the error container
        self.errorMessages.removeAll();

        //build data object
        var dataObject = {
            city : self.city(),
            stateCode : self.state(),
            addressLine1 : self.addressLine1(),
            addressLine2 : ( !placeholders.addressLine2 || self.addressLine2() !== placeholders.addressLine2 ) ? self.addressLine2() : ''
        };

        //perform the ajax call
        $.ajax( {
            url: form.action,
            data : dataObject,
            type : "GET",
            success : function( response, status, jqXHR ) {

                if ( response.success ) {

                    if ( response.zipCode && self.currentZipcodeField ) {
                        self.currentZipcodeField.val( response.zipCode );
                        self.currentZipcodeField.change();
                    }

                    //if we are in mobile mode, hide the form
                    if( jmediaQuery() === 'mobile' ){

                        //define the field here so it's held in the slideup callback's closure and we can reset it
                        //in the model itself
                        var scrollToZipField = self.currentZipcodeField;

                        //First close the form and then scroll to the zip field
                        $( form ).closest( '.hideMe' ).slideUp( 1000, function() {
                            $.scrollTo( scrollToZipField, 500 );
                            toggleModal();
                        } );

                    }

                    //close the fancybox modal
                    $.fancybox.close();

                    //cleanup the stored zip field
                    self.currentZipcodeField = null;
                }
                else {
                    //present error messages
                    self.errorMessages.push( response.response );
                }
            }

        } );

        return false;

    };

};
//zipfinder model would go here

mymoveKOModel.zipfinder = {};
;(function( $ ){

    $.fn.pietimer = function( method ) {
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.pietimer' );
        }
    };

    var methods = {
        init : function( options ) {
            var state = {
                timer: null,
                timerSeconds: 10,
                callback: function () {},
                timerCurrent: 0,
                showPercentage: false,
                fill: false,
                color: '#CCC'
            };

            state = $.extend(state, options);

            return this.each(function() {

                var $this = $(this);
                var data = $this.data('pietimer');
                if ( ! data ) {
                    $this.addClass('pietimer');
                    $this.css({fontSize: $this.width()});
                    $this.data('pietimer', state);
                    if (state.showPercentage) {
                        $this.find('.percent').show();
                    }
                    if (state.fill) {
                        $this.addClass('fill');
                    }
                    $this.pietimer('start');
                }
            });
        },

        stopWatch : function() {
            var data = $(this).data('pietimer');
            if ( data ) {
                var seconds = (data.timerFinish-(new Date().getTime()))/1000;
                if (seconds <= 0) {
                    clearInterval(data.timer);
                    $(this).pietimer('drawTimer', 100);
                    data.callback();
                    setTimeout(function() {
                       $('.pdf-wait').fadeOut('fast');
                    }, 1000);
                    setTimeout(function() {
                       $('.pdf-download').hide();
                       $('.pdf-download').fadeIn('slow');
                    }, 1500);

                } else {
                    var percent = 100-((seconds/(data.timerSeconds))*100);
                    $(this).pietimer('drawTimer', percent);
                }
            }
        },

        drawTimer : function (percent) {
            $this = $(this);
            var data = $this.data('pietimer');
            if (data) {
                $this.html('<div class="percent"></div><div class="slice'+(percent > 50?' gt50"':'"')+'><div class="pie"></div>'+(percent > 50?'<div class="pie fill"></div>':'')+'</div>');
                var deg = 360/100*percent;
                $this.find('.slice .pie').css({
                    '-moz-transform':'rotate('+deg+'deg)',
                    '-webkit-transform':'rotate('+deg+'deg)',
                    '-o-transform':'rotate('+deg+'deg)',
                    'transform':'rotate('+deg+'deg)'
                });
                $this.find('.percent').html(Math.round(percent)+'%');
                if (data.showPercentage) {
                    $this.find('.percent').show();
                }
                if ($this.hasClass('fill')) {
                    $this.find('.slice .pie').css({backgroundColor: data.color});
                }
                else {
                    $this.find('.slice .pie').css({borderColor: data.color});
                }
            }
        },
        
        start : function () {
            var data = $(this).data('pietimer');
            if (data) {
                data.timerFinish = new Date().getTime()+(data.timerSeconds*1000);
                $(this).pietimer('drawTimer', 0);
                data.timer = setInterval("$this.pietimer('stopWatch')", 50);
            }
        },

        reset : function () {
            var data = $(this).data('pietimer');
            if (data) {
                clearInterval(data.timer);
                $(this).pietimer('drawTimer', 0);
            }
        }

    };
})(jQuery);
mymoveKOModel.vr = {};

/**
 *
 *
 * @param vrServerCommunication
 * @param validationUtilities
 * @param firstStep
 * @param firstStepSubmitPath
 * @param secondStepSubmitPath
 */
mymoveKOModel.vr.voterRegMultiModel = function ( vrServerCommunication , validationUtilities , firstStep , firstStepSubmitPath , secondStepSubmitPath , showHomeStatus , isAuthor ) {

    var self = this;

    //set up steps
    self.showStepOne   = ko.observable( true );
    self.showStepTwo   = ko.observable( false );
    self.showStepThree = ko.observable( false );

    //set up current state
    self.currentStep         = ko.observable( 1 );
    self.loading             = ko.observable( false );
    self.spinnerOptions      = { 'top' : '150px' };
    self.isAuthor            = isAuthor;
    self.showGeneralErrorBox = ko.observable( false );

    //set up help step 1 accordion state
    self.helpQ1Toggle = ko.observable( false );
    self.helpQ2Toggle = ko.observable( false );
    self.helpQ3Toggle = ko.observable( false );

    //set up help step 1 accordion state
    self.helpStep2Q1Toggle = ko.observable( false );
    self.helpStep2Q2Toggle = ko.observable( false );
    self.helpStep2Q3Toggle = ko.observable( false );



    //Form display variables
    self.showNewNameFields               = ko.observable( false );
    self.hasAlreadySuccessfullySubmitted = ko.observable( false );

    //step two required variables
    self.needsId    = ko.observable( false );
    self.needsRace  = ko.observable( false );
    self.needsParty = ko.observable( false );

    //step two set up
    self.stateCode    = ko.observable();
    self.partyList    = ko.observableArray( [ 'Party' ] );
    self.partyMessage = ko.observable( 'No Message' );
    self.raceMessage  = ko.observable( 'No Message' );
    self.raceList     = ko.observableArray( [ { name : "Race" , value : "Race" } ] );
    self.idMessage    = ko.observable( 'No Message' );

    //step three set up
    self.pdfUrl = ko.observable( );

    //This is the object that holds all the user input
    self.userData = {

        //step one form fields
        name_title          : ko.observable().extend( { required: true } ),
        first_name          : ko.observable().extend( { required: true } ),
        last_name           : ko.observable().extend( { required: true } ),
        prev_name_title     : ko.observable().extend( { required: true } ),
        prev_first_name     : ko.observable().extend( { required: true } ),
        prev_last_name      : ko.observable().extend( { required: true } ),
        old_home_address    : ko.observable().extend( { required: true } ),
        old_home_zip_code   : ko.observable().extend( { required: true , maxLength: 5 , minLength: 5 } ),
        home_address        : ko.observable().extend( { required: true } ),
        home_zip_code       : ko.observable().extend( { required: true , maxLength: 5 , minLength: 5 } ),
        home_status         : ko.observable().extend( { required: true } ),
        email_address       : ko.observable().extend( { required: true , email: true } ),
        phone               : ko.observable().extend( { required: true , phoneUS: true } ),
        move_date           : ko.observable().extend( { required: true , date: true } ),

        //step two form fields
        id_number           : ko.observable().extend( { required: true } ),
        race                : ko.observable().extend( { required: true } ),
        party               : ko.observable().extend( { required: true } ),
        birthMonth          : ko.observable().extend( { required: true } ),
        birthDay            : ko.observable().extend( { required: true } ),
        birthYear           : ko.observable().extend( { required: true } ), 
        
        //for verified user data
        verifiedNewState       : ko.observable(), 
        verifiedNewCity        : ko.observable(), 
        verifiedOldState       : ko.observable(), 
        verifiedOldCity        : ko.observable()
    };


    validationUtilities.initializeValidation(self.userData);



    self.submitStepOne = function() {

        var fieldsToValidate = ['name_title', 'first_name' , 'last_name' , 'old_home_address' , 'old_home_zip_code' , 'home_address' , 'home_zip_code' , 'email_address' , 'phone' , 'move_date'];

        if(self.showNewNameFields()){
            fieldsToValidate.push('prev_name_title');
            fieldsToValidate.push('prev_first_name');
            fieldsToValidate.push('prev_last_name');
        }

        if( showHomeStatus ){
            fieldsToValidate.push('home_status');
        }

        var validatedForm = validationUtilities.validateForm(self.userData, fieldsToValidate);

        self.loading( true );

        if(validatedForm.valid){

            validatedForm.validatedFields.change_of_name = self.showNewNameFields;

            vrServerCommunication.submitStep( ko.toJSON( validatedForm.validatedFields ) , firstStepSubmitPath ).
                done( function( response ) {

                    //mark the form as already submitted
                    self.hasAlreadySuccessfullySubmitted( true );
                    
                    //setup verified properties
                    self.userData.verifiedNewState( response.location.stateCode );
                    self.userData.verifiedNewCity( response.location.cityName );
                    self.userData.verifiedOldState( response.oldLocation.stateCode );
                    self.userData.verifiedOldCity( response.oldLocation.cityName );

                    //set the state text for display on step two
                    self.stateCode(mymoveKOModel.statesObject[response.location.stateCode]);

                    //set race rules and the race disclaimer text
                    self.needsRace ( response.stateRequirement.requires_race );
                    self.raceMessage ( response.stateRequirement.requires_race_msg );

                    $.each( response.raceList , function( key , value ){
                        self.raceList.push( value );
                    } ) ;

                    //set the party rules message and populate the party list
                    self.needsParty ( response.stateRequirement.requires_party );
                    self.partyMessage ( response.stateRequirement.requires_party_msg );

                    $.each( response.stateRequirement.party_list , function( key , value ){
                        self.partyList.push( value );
                    } ) ;

                    //set id rules and message
                    self.needsId( true );
                    self.idMessage ( response.stateRequirement.id_number_msg );

                    self.loading( false );
                    //Move to the second Step
                    self.currentStep( 2 );
                    
                    //determine whether we need to present a profile update opportunity
                    if ( response.profileUpdateKey ) {
                    	mymoveKOModel.userProfileUpdateModel.availableUpdateKey( response.profileUpdateKey );
                        mymoveKOModel.userProfileUpdateModel.gaTagActionSource( 'Voter_Registration' );
                    }

                } ).
                fail( function( error ){

                    if( error.validationErrors ){
                        validationUtilities.showServerValidation( self.userData , error.validationErrors );
                    }else{
                        self.showGeneralErrorBox( true );
                    }

                    self.loading( false );

                });

        }else{
            self.loading( false );
        }
        // BI logging for different steps
        var urlParam = '_step2';
        self.logSteps(urlParam);

    };

    self.submitStepTwo = function( ) {

        var fieldsToValidate = ['birthMonth' , 'birthDay' , 'birthYear'];

        if (self.needsId()) {
            fieldsToValidate.push( 'id_number' );
        }

        if (self.needsRace()) {
            fieldsToValidate.push( 'race' );
        }

        if (self.needsParty()) {
            fieldsToValidate.push( 'party' );
        }

        var validatedForm = validationUtilities.validateForm( self.userData, fieldsToValidate );

        self.loading( true );

        if(validatedForm.valid){
            var formToSubmit = {
                id_number     : validatedForm.validatedFields.id_number,
                date_of_birth : self.userData.birthMonth() + "/" + self.userData.birthDay() + "/" + self.userData.birthYear()
            };


            if (self.needsRace()) {
                formToSubmit.race = validatedForm.validatedFields.race;
            }

            if(self.needsParty()){
                formToSubmit.party = validatedForm.validatedFields.party;
            }

            vrServerCommunication.submitStep( ko.toJSON( formToSubmit ) , secondStepSubmitPath ).
                done( function( response ) {

                    self.pdfUrl( response.pdfurl );

                    //TODO: User all verified data for addresses instead of a combination of input data and verified data
                    mymoveKOModel.verifiedUserData.setUserData( {
                        "firstName" : self.userData.first_name(),
                        "lastName" : self.userData.last_name(),
                        "email" : self.userData.email_address(),
                        "moveDate" : self.userData.move_date(),
                        
                        "zipCode" : self.userData.home_zip_code(),
                        "streetAddress" : self.userData.home_address(),
                        "city" : self.userData.verifiedNewCity(),
                        "state" : self.userData.verifiedNewState(),
                        
                        "oldZipCode" : self.userData.old_home_zip_code(), 
                        "oldStreetAddress" : self.userData.old_home_address(), 
                        "oldCity" : self.userData.verifiedOldCity(), 
                        "oldState" : self.userData.verifiedOldState(), 
                        
                        "oneTimeUse" : false
                    } );
                    
                    self.currentStep( 3 );


                    self.loading( false );
                }).
                fail( function( error ){

                    validationUtilities.showServerValidation( self.userData , error.validationErrors );

                    self.loading( false );

                } );


        }else{

            self.loading( false );

        }
        // BI logging for different steps
        var urlParam = '_success';
        self.logSteps(urlParam);
    }



    //make sure the state is represented in the view
    self.currentStep.subscribe( function ( currentStepNumber ) {

        if ( currentStepNumber == 1 ) {
            self.showStepOne( true );
            self.showStepTwo( false );
            self.showStepThree( false );
        } else if ( currentStepNumber == 2 ) {
            self.showStepOne( false );
            self.showStepTwo( true );
            self.showStepThree( false );
        } else if ( currentStepNumber == 3 ) {
            self.showStepOne( false );
            self.showStepTwo( false );
            self.showStepThree( true );
        } else if ( currentStepNumber == 'author' ) {
            self.showStepOne( true );
            self.showStepTwo( true );
            self.showStepThree( true );
        } else {
            self.showStepOne( true );
            self.showStepTwo( false );
            self.showStepThree( false );
        }
        self.hideHelpOtherNonActiveHelpSteps();

    } );

    //Display Functions

    self.goBackToStepOne = function( ) {
        self.currentStep( 1 );
    };

    self.hideHelpOtherNonActiveHelpSteps = function( currentStep ) {
        switch ( currentStep ) {
            case 1 :
                self.helpQ2Toggle( false );
                self.helpQ3Toggle( false );
                break;
            case 2 :
                self.helpQ1Toggle( false );
                self.helpQ3Toggle( false );
                break;
            case 3 :
                self.helpQ1Toggle( false );
                self.helpQ2Toggle( false );
                break;
            case 4 :
                self.helpStep2Q2Toggle( false );
                self.helpStep2Q3Toggle( false );
                break;
            case 5 :
                self.helpStep2Q1Toggle( false );
                self.helpStep2Q3Toggle( false );
                break;
            case 6 :
                self.helpStep2Q1Toggle( false );
                self.helpStep2Q2Toggle( false );
                break;
            default :
                self.helpQ1Toggle( false );
                self.helpQ2Toggle( false );
                self.helpQ3Toggle( false );
                self.helpStep2Q1Toggle( false );
                self.helpStep2Q2Toggle( false );
                self.helpStep2Q3Toggle( false );
                break;
        }
    };

    self.resetForm = function ( ) {

        $.post('/content/mymove/jcr:content/header/login.logout.html', function(){
            window.location.reload();
        })

    };


    if(!isAuthor){
        self.currentStep( firstStep );
    }else{
        self.currentStep( 'author' );
    }
    // BI logging
    self.logSteps = function(urlparam) {
       var currentUrl = window.location.pathname + urlparam;
        var logObject = {
            'linkPath' : currentUrl
        }
        $.ajax({
            dataType: "json",
            type: 'post',
            data: logObject,
            url: '/bin/mymove/loglinkclick'

        });
    }
    if(firstStep == 1){
        // BI logging for different steps
        var urlParams = '_step1';
        self.logSteps(urlParams);

    }
};

mymoveKOModel.vr.voterRegServerCommunication = {

    submitStep : function( userData , submitPath ) {
        var d = $.Deferred();

        $.ajax( {

            url     : submitPath,
            type    : 'POST',
            data    : userData,
            contentType : "application/json",
            success : function( response ) {
                d.resolve(response);
            },
            error : function( jqXHR, textStatus, errorThrown ) {



                switch ( jqXHR.status ) {

                    case 400:

                        try {
                            var validationErrors = JSON.parse( jqXHR.responseText );
                            console.log(validationErrors);
                            d.reject( {
                                success          : false,
                                errorType        : 400,
                                validationErrors : validationErrors
                            } );
                        }catch ( error ){
                            d.reject( {
                                success   : false,
                                errorType : 400
                            } );
                        }

                        break;
                    case 500 :

                        d.reject( {
                            success          : false,
                            errorType        : 500
                        } );


                        break;
                    default :
                        d.reject( {
                            success          : false,
                            errorType        : 500
                        } );
                }
            }

        } );

        return d;
    }

};
mymoveKOModel.voterRegistration = new function(){
    var self = this;
    
    /*
     * If a user is authenticated - the email field should not be editable
     */
    self.isEmailFieldEnabled = ko.observable( !MyMove.SessionUser.getProperty( MyMove.SessionUser.IS_LOGGED_IN_PROPERTY ) );
    
    self.isLoading = ko.observable(false);
    self.showSpinner = ko.observable(false);
    self.submitPath = '';
    self.resultPagePath = '';

    self.titlesArray = ['Mr.', 'Mrs.', 'Ms.'];
    self.suffixArray = ["Jr.", "Sr.", "II", "III","IV"];
    self.raceArray = ['American Indian / Alaskan Native', 'Asian / Pacific Islander', 'Black (not Hispanic)', 'Hispanic', 'Multi-racial', 'White (not Hispanic)', 'Other', 'Decline to State'];
    self.partyArray = ko.observableArray();

    self.idMsg = ko.observable();
    self.raceMsg = ko.observable();
    self.partyMsg = ko.observable();
    self.pdfLink = ko.observable();
    self.errorBoxText = ko.observable();
    self.showSuccess = ko.observable(false);
    self.stepOneErrorBox = ko.observable(false);
    self.componentErrorBox = ko.observable(false);
    self.stateReqError = ko.observable(false);


    self.showSubmit = ko.computed(function(){
        if(self.showSuccess()){
            return false;
        }else{
            return true;
        }
    });


    self.capturedData = {
        //step one
        home_state_id : ko.observable().extend({ required: true, placeholder:''}),
        us_citizen : ko.observable(false).extend({ required: true, notEqual: false}),

        //step two
        first_name : ko.observable().extend({ required: true, placeholder:''}),
        last_name : ko.observable().extend({ required: true, placeholder:''}),
        name_title : ko.observable().extend({ required: true}),
        name_suffix : ko.observable().extend({ required: false}),
        //step two point 1
        changedName : {
            change_of_name: ko.observable(false),
            prev_first_name : ko.observable().extend({ required: false, placeholder:''}),
            prev_last_name : ko.observable().extend({ required: false, placeholder:''}),
            prev_name_title : ko.observable().extend({ required: false, placeholder:''}),
            prev_name_suffix : ko.observable().extend({ required: false, placeholder:''})
        },
        phone : ko.observable().extend({ required: true, placeholder:'' }),
        email_address : 
        	self.isEmailFieldEnabled() ? 
        			ko.observable().extend( { required : true, placeholder : "", email : true } ) : 
        			ko.observable().extend( { required : false } ), 
        home_address : ko.observable().extend({ required: true, placeholder:''}),
        home_unit : ko.observable().extend({ required: false, placeholder:''}),
        opt_in_email : ko.observable(false).extend({ required: true, equal: true}),
        //home_city : ko.observable().extend({ required: true, placeholder:''}),
        home_zip_code : ko.observable().extend({ required: true, placeholder:'', number: true}),
        old_home_address : ko.observable().extend({ required: true, placeholder:''}),
        old_home_unit : ko.observable().extend({ required: false, placeholder:''}),
        old_home_zip_code : ko.observable().extend({ required: true, placeholder:'', number: true, minLength: 4}),
        mailingAddress : {
            has_mailing_address : ko.observable(false),
            mailing_address : ko.observable().extend({ required: false, placeholder:''}),
            mailing_unit : ko.observable().extend({ required: false, placeholder:''}),
            //mailing_city : ko.observable().extend({ required: false, placeholder:''}),
            mailing_zip_code : ko.observable().extend({ required: false, number: true, placeholder:'', minLength: 4})
        },

        //step 3
        party : ko.observable().extend({ required: true}),
        race : ko.observable().extend({ required: true}),

        id_number: ko.observable().extend({required: true, placeholder:'', maxLength: 0}),
        date_of_birth : ko.observable().extend({required: true, placeholder:''}),
        move_date : ko.observable().extend({required:true, placeholder:'', date: true}),

        partner_opt_in_email: ko.observable(true).extend({required:true})

    }


    self.setStateRulesPath = function(path){
        self.stateRulesPath = path;
    };
    self.setSubmitPath = function(path){
        self.submitPath = path;
    }
    self.setResultPagePath = function(path){
        self.resultPagePath = path;
    }
    self.getStateRules = function(state){
        console.log('state', state);

        mymoveKOModel.gaTag._trackEvent({ category : 'Content', action : 'Voter_Registration', label : 'State_StateName' });

        $.ajax({
            type: 'get',
            data: {state: state},
            url : self.stateRulesPath,
            success: function(data){
                console.log('data', data);

                if(data.requires_party){
                    self.capturedData.party.rules()[0].params = true;
                }else{
                    self.capturedData.party.rules()[0].params = false;
                }

                $.each(self.capturedData.id_number.rules(), function(index, rule){
                    if(rule.rule == 'maxLength'){
                        rule.params = data.id_length_max;
                    }
                })

                $.each(self.capturedData.race.rules(), function(index, rule){
                    if(rule.rule == 'required'){
                        rule.params = data.requires_race;
                    }
                });
                $.each(self.capturedData.party.rules(), function(index, rule){
                    if(rule.rule == 'required'){
                        rule.params = data.requires_party;
                    }
                });

                self.partyArray( data.party_list );

                self.idMsg(data.id_number_msg);
                self.partyMsg(data.requires_party_msg);
                self.partyRequired = data.requires_party;
                self.raceMsg(data.requires_race_msg);
                self.raceRequired = data.requires_race;
                self.stepOne();
            },
            error: function(){
                self.stepOneErrorBox(true);
                self.stateReqError(true);
            }
        })
    }
    self.stepOne = function(){
        if(self.capturedData.home_state_id.validate() && self.capturedData.us_citizen.validate()){
            self.showNextStep('Step2');
        }else{
            self.hideStep('Step2');
            self.hideStep('Step3');
            self.hideStep('Step4');
        }
    }
    self.changeName = function(event, checked){
        if(checked){
            $.each(self.capturedData.changedName.prev_name_title.rules(), function(index, ruleObject){
                if(ruleObject.rule == 'required'){
                    ruleObject.params = true;
                }
            });
            $.each(self.capturedData.changedName.prev_first_name.rules(), function(index, ruleObject){
                if(ruleObject.rule == 'required'){
                    ruleObject.params = true;
                }
            });
            $.each(self.capturedData.changedName.prev_last_name.rules(), function(index, ruleObject){
                if(ruleObject.rule == 'required'){
                    ruleObject.params = true;
                }
            });

        }
    }
    self.mailingAddress = function(event, checked){
        if(checked){
            $.each(self.capturedData.mailingAddress.mailing_address.rules(), function(index, ruleObject){
                if(ruleObject.rule == 'required'){
                    ruleObject.params = true;
                }
            });

            $.each(self.capturedData.mailingAddress.mailing_zip_code.rules(), function(index, ruleObject){
                if(ruleObject.rule == 'required'){
                    ruleObject.params = true;
                }
            });

        }
    }



    self.stepTwo = function(element){
        var fieldsToValidate = ['name_title','first_name','last_name','phone','email_address','opt_in_email', 'home_address', 'home_zip_code', 'old_home_address', 'old_home_zip_code', 'changedName', 'mailingAddress'];
        var readyForStepThree = true;
        var $input = $(element);
        var inputName = $input.attr('name');

        switch (inputName){

            case 'first_name':
                self.capturedData.name_title.validate();
                break;
            case 'last_name':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                break;
            case 'prev_first_name':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                break;
            case 'prev_last_name':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                break;
            case 'phone':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                break;
            case 'email_address':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                break;
            case 'old_home_address':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                break;
             case 'old_home_zip_code':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                break;
            case 'home_address':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                break;
            case 'home_city':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.home_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                break;
            case 'home_zip_code':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                break;
            case 'mailing_address':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                self.capturedData.home_zip_code.validate();
                break;
            /*case 'mailing_city':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                self.capturedData.home_zip_code.validate();
                self.capturedData.mailingAddress.mailing_address.validate();
                break;   */
            case 'mailing_zip_code':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                self.capturedData.home_zip_code.validate();
                self.capturedData.mailingAddress.mailing_address.validate();
                //self.capturedData.mailingAddress.mailing_city.validate();
                break;

        }

        $.each(fieldsToValidate, function(index, fieldName){
            var field = self.capturedData[fieldName];

            if(fieldName == 'changedName'){
                if(field.change_of_name()){
                    $.each(field, function(subFieldKey, subField){
                        if(subFieldKey != 'change_of_name'){
                            if(!subField.isValid()){
                                readyForStepThree = false;
                            }
                        }
                    })
                }
            }else if(fieldName == 'mailingAddress'){
                if(field.has_mailing_address()){
                    $.each(field, function(subFieldKey, subField){
                        if(subFieldKey != 'has_mailing_address'){
                            if(!subField.isValid()){
                                if(subFieldKey != 'mailing_unit'){
                                    readyForStepThree = false;
                                }
                            }
                        }
                    })
                }
            }else if(!field.isValid()){
                if(field.isModified()){
                    if(!field.validate()){
                        if(fieldName != 'home_unit'){
                            readyForStepThree = false;
                            console.log("first field validation if");
                        }
                    }
                }else{
                    if(fieldName != 'home_unit'){
                        readyForStepThree = false;
                        console.log("second field validation if");
                    }
                }
            }

        })



        if(readyForStepThree){
            self.showNextStep('Step3');
        }else{
            self.hideStep('Step3');
        }
    }
    self.capturedData.opt_in_email.subscribe(self.stepTwo);
    self.stepThree = function(element){
        var fieldsToValidate = ['name_title','first_name','last_name','phone','email_address','opt_in_email', 'home_address', 'home_zip_code', 'old_home_address', 'old_home_zip_code','changedName', 'mailingAddress', 'id_number', 'date_of_birth', 'party', 'race', 'move_date'];
        var readyForStepFour = true;

        var $input = $(element);
        var inputName = $input.attr('name');

        switch (inputName){

            case 'first_name':
                self.capturedData.name_title.validate();
                break;
            case 'last_name':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                break;
            case 'prev_first_name':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                break;
            case 'prev_last_name':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                break;
            case 'phone':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                break;
            case 'email_address':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                break;
            case 'old_home_address':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                break;
            case 'old_home_zip_code':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                break;
            case 'home_address':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                break;
            case 'home_city':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.home_address.validate();
                break;
            case 'home_zip_code':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                break;
            case 'mailing_address':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                self.capturedData.home_zip_code.validate();
                break;
            /*case 'mailing_city':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                self.capturedData.home_zip_code.validate();
                self.capturedData.mailingAddress.mailing_address.validate();
                break;   */
            case 'mailing_zip_code':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                self.capturedData.home_zip_code.validate();
                self.capturedData.mailingAddress.mailing_address.validate();
                //self.capturedData.mailingAddress.mailing_city.validate();
                break;

            case 'id_number':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                self.capturedData.home_zip_code.validate();
                self.capturedData.mailingAddress.mailing_address.validate();
                //self.capturedData.mailingAddress.mailing_city.validate();
                self.capturedData.mailingAddress.mailing_zip_code.validate();
                break;
            case 'date_of_birth':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                self.capturedData.home_zip_code.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.mailingAddress.mailing_address.validate();
                //self.capturedData.mailingAddress.mailing_city.validate();
                self.capturedData.mailingAddress.mailing_zip_code.validate();
                self.capturedData.mailingAddress.id_number.validate();
                break;
            case 'party':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                self.capturedData.home_zip_code.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.mailingAddress.mailing_address.validate();
                //self.capturedData.mailingAddress.mailing_city.validate();
                self.capturedData.mailingAddress.mailing_zip_code.validate();
                self.capturedData.mailingAddress.id_number.validate();
                self.capturedData.mailingAddress.date_of_birth.validate();


                break;
            case 'race':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                self.capturedData.home_zip_code.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.mailingAddress.mailing_address.validate();
                //self.capturedData.mailingAddress.mailing_city.validate();
                self.capturedData.mailingAddress.mailing_zip_code.validate();
                self.capturedData.mailingAddress.id_number.validate();
                self.capturedData.mailingAddress.date_of_birth.validate();
                self.capturedData.mailingAddress.party.validate();

                break;
            case 'move_date':
                self.capturedData.name_title.validate();
                self.capturedData.first_name.validate();
                self.capturedData.last_name.validate();
                self.capturedData.changedName.prev_name_title.validate();
                self.capturedData.changedName.prev_first_name.validate();
                self.capturedData.changedName.prev_last_name.validate();
                self.capturedData.phone.validate();
                self.capturedData.email_address.validate();
                self.capturedData.home_address.validate();
                //self.capturedData.home_city.validate();
                self.capturedData.home_zip_code.validate();
                self.capturedData.old_home_address.validate();
                self.capturedData.old_home_zip_code.validate();
                self.capturedData.mailingAddress.mailing_address.validate();
                //self.capturedData.mailingAddress.mailing_city.validate();
                self.capturedData.mailingAddress.mailing_zip_code.validate();
                self.capturedData.mailingAddress.id_number.validate();
                self.capturedData.mailingAddress.date_of_birth.validate();
                self.capturedData.mailingAddress.party.validate();
                self.capturedData.mailingAddress.race.validate();
                break;

        }

        $.each(fieldsToValidate, function(index, fieldName){
            var field = self.capturedData[fieldName];

            if(fieldName == 'changedName'){
                if(field.change_of_name()){
                    $.each(field, function(subFieldKey, subField){
                        if(subFieldKey != 'change_of_name'){
                            if(!subField.isValid()){
                                readyForStepFour = false;
                            }
                        }
                    })
                }
            }else if(fieldName == 'mailingAddress'){
                if(field.has_mailing_address()){
                    $.each(field, function(subFieldKey, subField){
                        if(subFieldKey != 'has_mailing_address'){
                            if(!subField.isValid()){
                                if(subFieldKey != 'mailing_unit'){
                                    readyForStepFour = false;
                                }
                            }
                        }
                    })
                }
            }else if(!field.isValid()){
                if(field.isModified()){
                    if(!field.validate()){
                        if(fieldName != 'home_unit'){
                            readyForStepFour = false;
                        }
                    }
                }else{
                    if(fieldName != 'home_unit' && fieldName != 'race' && fieldName != 'party'){
                        readyForStepFour = false;
                    }else if(fieldName == 'race'){
                        if(self.raceRequired){
                            readyForStepFour = false;
                        }
                    }else if(fieldName == 'party'){
                        if(self.partyRequired){
                            readyForStepFour = false;
                        }
                    }
                }
            }

        })



        if(readyForStepFour){
            self.showNextStep('Step4');
        }else{
            self.hideStep('Step4');
        }
    };
    self.capturedData.partner_opt_in_email.subscribe(function(newValue){
        if(!newValue){
            mymoveKOModel.gaTag._trackEvent({ category : 'Registration', action : 'mymove', label : 'Voter_Registration' })
        }
    })

    self.submit = function(){
        console.log('submit');
        mymoveKOModel.gaTag._trackEvent({ category : 'Content', action : 'Voter_Registration', label : 'Register_to_Vote' })
        var readyForSubmitt = true;
        var submitObject = {};

        self.showSpinner(true);

        $.each(self.capturedData, function(key, field){

            if(key == 'changedName'){

                if(field.change_of_name()){
                    $.each(field, function(subKey, subField){

                        if(subKey != 'change_of_name'){
                            if(!subField.validate()){
                                readyForSubmitt = false;
                            }else{
                                submitObject[subKey] = subField;
                            }
                        }
                        else {
                            submitObject[subKey] = subField;
                        }

                    })
                }

            }else if(key == 'mailingAddress'){
                if(field.has_mailing_address()){
                    $.each(field, function(subKey, subField){

                        if(subKey != 'has_mailing_address'){
                            if(!subField.validate()){
                                if(subKey == 'mailing_unit'){
                                    subField(null);
                                    submitObject[subKey] = subField
                                }else{
                                    readyForSubmitt = false;
                                    console.log("mailing address field not validating");
                                    console.log(subField);
                                }
                            }else{
                                submitObject[subKey] = subField;
                            }
                        }
                        else {
                            submitObject[subKey] = subField;
                        }

                    })
                }
            }else{

                if(!field.validate()){
                    if(key == 'home_unit' || key == 'old_home_unit'){
                        field(null);
                        submitObject[key] = field;
                    }else{
                        readyForSubmitt = false;
                        console.log(field);
                    }

                }else{
                    submitObject[key] = field;
                }

            }

        })

        if(readyForSubmitt){
            var submitString = ko.toJS(submitObject);
            submitString = JSON.stringify(submitString);

            $.ajax({
                type: 'post',
                url : self.submitPath,
                contentType: 'application/json',
                data: submitString,
                success : function(data){
                    console.log('response Data', data);

                    if(data.voterRegistrationResult.success){
                        //self.pdfLink(data.voterRegistrationResult.pdfurl);
                        //self.showSuccess(true);
                        self.componentErrorBox(false);
                        self.stepOneErrorBox(false);
                        setTimeout( function() {
                                self.showSpinner(false);
                            }, 1000
                        );
                        window.location = self.resultPagePath;
                        console.log("data success");
                    }else{
                        console.log("data unsuccessful");
                        if(data.voterRegistrationResult.hasServerError){
                            //do something if there is a server error
                            self.errorBoxText(self.defaultErrorMsg);
                            self.componentErrorBox(true);
                        }else{
                             $.each(data.formErrors, function(key, error){

                                if(key == 'mailing_address' || key == 'mailing_zip_code'){
                                    self.capturedData.mailingAddress[key].__valid__(false);
                                }else if(key == 'mailing_unit'){
                                    self.capturedData.mailingAddress[key].__valid__(false);
                                } else {
                                    self.capturedData[key].__valid__(false);
                                }
                            });

                            self.errorBoxText('A few of the fields are invalid please look over the form.');
                            self.componentErrorBox(true);

                        }
                        self.showSpinner(false);

                    }

                }
            })

            console.log('submitObject', submitString);
        }else{
            self.showSpinner(false);
        }
    }

    self.goToPDF = function(){
        mymoveKOModel.gaTag._trackEvent({ category : 'Content', action : 'Voter_Registration', label : 'Print_Registration_Form' });
        window.open(self.pdfLink(), '_blank');
    }

    self.showNextStep = function(nextStepClass){
        nextStepClass = '.js' + nextStepClass;

        console.log('next step class', nextStepClass);

        $(nextStepClass + ' .steppedFormComponentOverlay').fadeOut();
    }
    self.hideStep = function(nextStepClass){
        nextStepClass = '.js' + nextStepClass;

        $(nextStepClass + ' .steppedFormComponentOverlay').fadeIn();
    }

    self.resetForm = function() {
        location.reload();
    };


    //Dropdown context's

    self.stateDropdownContext = new mymoveKOModel.dropDownModel(mymoveKOModel.statesArray, self.capturedData.home_state_id, self.getStateRules);

    self.titleDropdownContext = new mymoveKOModel.dropDownModel(self.titlesArray, self.capturedData.name_title, self.stepTwo);
    self.suffixDropdownContext = new mymoveKOModel.dropDownModel(self.suffixArray, self.capturedData.name_suffix, self.stepTwo);

    self.changedTitleDropdownContext = new mymoveKOModel.dropDownModel(self.titlesArray, self.capturedData.changedName.prev_name_title, self.stepTwo);
    self.changedSuffixDropdownContext = new mymoveKOModel.dropDownModel(self.suffixArray, self.capturedData.changedName.prev_name_suffix, self.stepTwo);

    self.partyArrayDropDownContext = new mymoveKOModel.dropDownModel(self.partyArray, self.capturedData.party, self.stepThree);
    self.raceArrayDropDownContext = new mymoveKOModel.dropDownModel(self.raceArray, self.capturedData.race, self.stepThree);


};
mymoveKOModel.userProfileUpdateModel = new function() {

	var self = this;
	
	this.endpointUrl = '/bin/mymove/userprofile/updateprofile';
	this.cancelUrl = '/bin/mymove/userprofile/cancelprofileupdate';
	
	/*
	 * Represents an available update.  Other mechanisms may indicate that an update 
	 * is available to a user by setting this observable to the key identifying the update.
	 */
	this.availableUpdateKey = ko.observable();
    this.gaTagActionSource = ko.observable( );

	this.cancelUpdate = function() {
	
		if ( self.availableUpdateKey() ) {
			$.ajax( self.cancelUrl, {
				type : "POST", 
				data : {
					"profileUpdateKey" : self.availableUpdateKey()
				}
			} );
		}
	};
	
	/**
	 * 
	 * @param password
	 * @param callback A callback function which expects to receive a success parameter as a first required parameter and a 
	 *        status code paramater as an optional second parameter. A third parameter will be sent for validation errors.  This 
	 *        will be populated with the error information.
	 */
	this.processUpdate = function( password, callback ) {
	
		/*
		 * If there is no available update - then we do not try to perform any processing
		 */
		if ( !self.availableUpdateKey() ) {
			return;
		}
		
		$.ajax( self.endpointUrl, {
			
			type : "POST", 
			data : {
				profileUpdateKey : self.availableUpdateKey(), 
				password : password
			},
			success : function( data, textStatus, jqXHR ) {
				
				/*
				 * Refresh the session user as a successful update will 
				 * authenticate the updater 
				 */
				if ( mymoveKOModel.sessionUser ) {
					mymoveKOModel.sessionUser.refresh();
				}
				
				if ( callback ) {
					callback( true, 200 );
				}
				
			}, 
			/*
			 * A catch all for other error types.  Users of this model should treat this as a 500 meaning 
			 * there will be nothing that the end user can do to rectify the situation
			 */
			error : function( jqXHR, textStatus, errorThrown ) {
				
				switch ( jqXHR.status ) {
				
					case 400: 
						
						try {
							var validationErrors = JSON.parse( jqXHR.responseText );
							
							if ( callback ) {
								callback( false, 400, validationErrors );
							}
						}
						catch ( ex ) {
							if ( callback ) {
								callback( false, 400 );
							}
						}
						
						return;
						
						break;
						
					case 404:
						
						if ( callback ) {
							callback( false, 404 );
						}
						
						return;
						
						break;
						
					case 500:
						
						if ( callback ) {
							callback( false, 500 )
						}
						
						return; 
						
						break;
					
					default:
						
						if ( callback ) {
							callback( false, 500 )
						}
					
						return;
						
						break;
					
				}
				
				
			}
			
		} );
		
	};
	
};
mymoveKOModel.userProfileUpdateFormModel = function( userProfileUpdateModel, options ) {

	var UPDATE_PROFILE_MODE = "update-profile-mode";
	var PASSWORD_ENTRY_MODE = "password-entry-mode";
	var COMPLETED_MODE = "completed";
	
	options = options || {};
	var self = this;
	
	this.userProfileUpdateModel = userProfileUpdateModel;
	
	this.password = ko.observable();
	
	this.password.isInvalid = ko.observable( false );
	this.userNotFound = ko.observable( false );
	this.hasServerError = ko.observable( false );
	
	this.canceled = ko.observable( false );
	
	this.mode = ko.observable( UPDATE_PROFILE_MODE );
	this.isUpdateProfileMode = ko.computed( function() {
		return self.mode() === UPDATE_PROFILE_MODE;
	} );
	this.isPasswordEntryMode = ko.computed( function() {
		return self.mode() === PASSWORD_ENTRY_MODE;
	} );
	
	this.hasUpdateAvailable = ko.computed( function() {
		return !!self.userProfileUpdateModel.availableUpdateKey() && 
			   self.isUpdateProfileMode() && 
			   !self.canceled();
	} );
	
	this.isPasswordRequired = ko.computed( function() {
		return !!self.userProfileUpdateModel.availableUpdateKey() && 
		   self.isPasswordEntryMode() && 
		   !self.canceled();
	} );
	
	/**
	 * Represents a user opting not to update their profile information
	 */
	this.cancel = function() {
		
		/*
		 * Set the request to cancelled 
		 */
		self.canceled( true );
		self.reset();
		
		/*
		 * Post a cancellation 
		 */
		self.userProfileUpdateModel.cancelUpdate();
		
		/*
		 * Perform analytics
		 */
        if(this.userProfileUpdateModel.gaTagActionSource()){
            mymoveKOModel.gaTag._trackEvent( {
                category : 'Content',
                action : this.userProfileUpdateModel.gaTagActionSource(),
                label : 'Modal_Skip'
            } );
        }

	};
	
	/**
	 * Represents a user opting to update their profile information
	 */
	this.submit = function() {
		
		//TODO: GA Event
		
		self.clearErrors();
		
		/*
		 * Check whether the user is authenticated or a password is provided
		 */
		if ( mymoveKOModel.sessionUser.isLoggedIn() || self.password() ) {
			
			/*
			 * Perform analytics
			 */
            if(this.userProfileUpdateModel.gaTagActionSource()){
                mymoveKOModel.gaTag._trackEvent( {
                    category : 'Content',
                    action : this.userProfileUpdateModel.gaTagActionSource(),
                    label : 'Modal_Update'
                } );
            }

			
			/*
			 * Process the update
			 */
			self.userProfileUpdateModel.processUpdate( self.password(), function( success, statusCode, data ) {
				
				if ( !success ) {
					if ( statusCode === 404 ) {
						self.userNotFound( true );
					}
					else if ( statusCode === 500 ) {
						self.hasServerError( true );
					}
					else if ( statusCode === 400 ) {
						if ( data && data.length ) {
							for ( var i = 0; i < data.length; i++ ) {
								if ( data[ i ].errorType === 'FIELDMISSING' && data[ i ].fieldName === 'password' ) {
									self.password.isInvalid( true );
								}
								else { 
									self.hasServerError( true );
								}
							}
						}
						else {
							self.hasServerError( true );
						}
					}
				}
				else {
					self.mode( COMPLETED_MODE );
				}
				
			} );
			
		}
		
		/*
		 * If neither is the case - switch to password entry mode
		 */
		else {
			if ( self.isPasswordEntryMode() ) {
				if ( !self.password() ) {
					self.password.isInvalid( true );
				}
			}
			else {
				self.mode( PASSWORD_ENTRY_MODE );
			}
		}
		
	};
	
	this.reset = function() {
		self.mode( UPDATE_PROFILE_MODE );
		self.password( null );
	};
	
	this.clearErrors = function() {
		self.password.isInvalid( false );
		self.userNotFound( false );
		self.hasServerError( false );
	};
	
};
/**
 * This is defined so that we can add models to the object before the model is instantiated
 * @type {{}}
 */
mymoveKOModel.myOffers = {};


mymoveKOModel.myOffers.myOffersModel = function(getOffersPath, saveOrderPath, getBarCodPath, serverCalls, isAuthor){

    var self = this;
    self.offers = ko.observableArray();
    self.loading = ko.observable(true);

    /**
     * This function calls the get offers function which returns the current offers.
     * init is called from the component jsp.
     */

    self.init = function ( ) {
        serverCalls.getOffers ( getOffersPath ) .
            done( function ( offers ) {
                //If there are old coupon templates on the page, adjust the viewport tag
                if(offers.offersType == 'old' || offers.offersType == 'mix'){
                    $('.myoffers').attr('offertype', 'mix');
                }

                if(offers.success){
                    console.log( 'offers' , offers.myOffers );


                   //Hide mobile ad buttons if there is no text inside
                   $('.mbuttonText').each(function(){
                        if ($(this).find('div').length == 0) {
                            $(this).parent().hide();
                        }
                    });

                    //Change ADMT template CSS if there are old coupons on the page
                    if(offers.offersType == 'old' || offers.offersType == 'mix'){
                        $("head").append('<link rel="stylesheet" href="https://www.mymove.com/content/dam/mymove/common/templateTemp.css" type="text/css" />');
                    } else {
                        $("head").append('<link rel="stylesheet" href="https://www.mymove.com/content/dam/mymove/common/template.css" type="text/css" />');
                    }


                    $.each( offers.myOffers , function ( index , offer ) {
                        offer.redeemed = ko.observable(offer.redeemed);
                        offer.fullPageADHTMLContentVisible = ko.observable(true);
                        offer.teaseOldCoupon = ko.observable(false);
                        offer.returnButtonText = ko.computed(function(){
                            return offer.redeemed() ? "Mark this coupon un-redeemed" : "Mark this coupon redeemed";
                        }, this);
                        var barCodeOfferID = {
                            offerId : offer.id
                        };

                        if( offer.hasBarCode ){
                            console.log(offer.providerName ,offer.hasBarCode);
                            serverCalls.getBarCode(getBarCodPath, barCodeOfferID).
                                done(function(response){
                                    console.log(response);
                                    var indexOfOffer = self.offers.indexOf(offer);
                                    var offerhtml = $("<div/>").append(offer.fullPageADHTMLContent);
                                    offerhtml.find('.barcode').attr('src', response.barCodeImageUrl);
                                    self.offers.remove(offer);
                                    offer.fullPageADHTMLContent = offerhtml.html();
                                    self.offers.splice(indexOfOffer, 0, offer);
                                });
                        }
                        if(offer.hasMobileContent){
                            setTimeout(function(){
                                $('.toggleArrow').attr('data-bind','click: $root.mobileToggle');
                            }, 1000);

                        };
                        //Show thumbnail and title only if ad isn't mobile
                        if(!offer.hasMobileContent){
                            offer.teaseOldCoupon(true);
                        }

                    } );

                    self.offers( offers.myOffers );

                    setTimeout(function(){
                        self.loading(false);
                    }, 1000)

                }else{
                    window.location = offers.errorPageRedirectPath;
                }


            });
    };


    /**
     * This function will toggle the received button check mark as well as
     * hide the deal html
     *
     * @param offer
     * @param event
     */

    self.toggleMarkReceived = function ( offer , event ) {
        var jqMarkReceived = $( event.currentTarget );
        var jqCheckMark = $( jqMarkReceived.children( 'i' )[0] );
        var jqParent = jqMarkReceived.parent( );
        var offerState = false;

        if ( offer.redeemed() != true ) {
            jqCheckMark.addClass( 'checked' );
            $(jqMarkReceived).prev(".couponCode").hide();
            offer.redeemed(true);
            offerState = true;
            offer.teaseOldCoupon(true);

        } else {
            jqCheckMark.removeClass( 'checked' );
            $(jqMarkReceived).prev(".couponCode").show();
            offer.redeemed(false);
            offerState = false;
            if(offer.hasMobileContent){
                offer.teaseOldCoupon(false);
            }

        }

        $.scrollTo( jqParent );

        var offerObject = {
            "offerId"    : offer.id,
            "isRedeemed" : offer.redeemed()
        };



        serverCalls.sendToggledOfferState( saveOrderPath , offerObject ).
            done( function ( successObject ) {
                console.log( 'successObject' , successObject );
            } );



    };


    self.toggleVisibleCoupon = function( offer , event ){



    };

    self.mobileToggle = function (offer , event) {

       //Toggle arrow inside mobile coupon HTML
       var toggleArrow = $(offer).find('.mobile-top');
       $(toggleArrow).click(function(){
            $(this).next('.couponDetails').slideToggle('100');
            $(this).children('.toggleArrow').children().toggle();
        });

        //Toggle legal copy inside mobile coupon HTML
        var showLegal = $(offer).find('.show-legal');
        var hideLegal = $(offer).find('.hide-legal');
        var legalCopy = $(offer).find('#legal');

		$(showLegal).click(function(){
            $(hideLegal, legalCopy).show();
			$(legalCopy).show();
			$(showLegal).hide();
		});
		$(hideLegal).click(function(){
			$(this).siblings(showLegal).show();
			$(legalCopy).hide();
			$(hideLegal).hide();
		});

    };
};

mymoveKOModel.myOffers.serverCalls = {

    /**
     * This function goes to the specified path and GETs all the offers that the user has access to.
     *
     * @param path = path to the servelet
     * @returns {*} = differed object
     */

    getOffers : function( path ) {
        var d = $.Deferred( );

        $.ajax( {
            type: 'GET',
            url: path,
            dataType: 'json',
            success: function ( response ) {
                d.resolve( response );
            },
            error : function ( err ){
                d.fail( err );
            }
        } );

        return d;
    },

    sendToggledOfferState : function ( postPath , offerObject ) {
        var d = $.Deferred( );

        $.ajax( {
            type    : 'GET',
            url     : postPath,
            data    : offerObject,
            success : function ( response ) {
                d.resolve( response );
            },
            error   : function ( err ) {
                d.fail( err );
            }
        } );

        return d;

    },
    getBarCode : function ( postPath , offerObject ) {
        var d = $.Deferred( );

        $.ajax( {
            type    : 'GET',
            url     : postPath,
            data    : offerObject,
            success : function ( response ) {
                d.resolve( response );
            },
            error   : function ( err ) {
                d.fail( err );
            }
        } );

        return d;

    }
};




mymoveKOModel.optimizelyStateLogging = {

    logPath : "/bin/mymove/optimizely/logstate",

    /**
     * See https://www.optimizely.com/docs/api#state
     */
    log : function( pageURL, state ) {

        if ( !state || !state.activeExperiments || !state.activeExperiments.length ) {
            return;
        }

        var logObject = {
            pageURL : pageURL,
            optimizelyState : state
        };

        $.ajax( mymoveKOModel.optimizelyStateLogging.logPath, {
            type : "POST",
            contentType : "application/json",
            data : JSON.stringify( logObject )
        } );
    }

};
mymoveKOModel.msvr = {};

/**
 *
 *
 * @param vrServerCommunication
 * @param validationUtilities
 * @param firstStep
 * @param firstStepSubmitPath
 * @param secondStepSubmitPath
 */
mymoveKOModel.msvr.msvrModel = function ( mvrCommunication , validationUtilities , firstStep , firstStepSubmitPath , secondStepSubmitPath , showHomeStatus , isAuthor ) {

    var self = this;

    //set up steps
    self.showStepOne   = ko.observable( true );
    self.showStepTwo   = ko.observable( false );
    self.showStepThree = ko.observable( false );

    //set up current state
    self.currentStep         = ko.observable( 1 );
    self.loading             = ko.observable( false );
    self.spinnerOptions      = { 'top' : '150px' };
    self.isAuthor            = isAuthor;
    self.showGeneralErrorBox = ko.observable( false );

    //Form display variables
    self.showNewNameFields               = ko.observable( false );
    self.hasAlreadySuccessfullySubmitted = ko.observable( false );

    //step two required variables
    self.needsId    = ko.observable( false );
    self.needsRace  = ko.observable( false );
    self.needsRaceList = ko.observable (true);
    self.needsParty = ko.observable( false );
    self.needsPartyList = ko.observable (true);

    //step two set up
    self.stateCode    = ko.observable();
    self.partyList    = ko.observableArray( [ 'Party' ] );
    self.partyMessage = ko.observable( 'No Message' );
    self.raceMessage  = ko.observable( 'No Message' );
    self.raceList     = ko.observableArray( [ 'Race' ] );
    self.idMessage    = ko.observable( 'No Message' );

    //step three set up
    self.pdfUrl = ko.observable( );

    //This is the object that holds all the user input
    self.userData = {

        //step one form fields
        current_title          : ko.observable().extend( { required: true } ),
        current_first_name          : ko.observable().extend( { required: true } ),
        current_last_name           : ko.observable().extend( { required: true } ),
        prev_title     : ko.observable().extend( { required: true } ),
        prev_first_name     : ko.observable().extend( { required: true } ),
        prev_last_name      : ko.observable().extend( { required: true } ),
        old_address_line_1    : ko.observable().extend( { required: true } ),
        old_zip_code_5   : ko.observable().extend( { required: true , maxLength: 5 , minLength: 5 } ),
        new_address_line_1       : ko.observable().extend( { required: true } ),
        new_zip_code_5       : ko.observable().extend( { required: true , maxLength: 5 , minLength: 5 } ),
        home_status         : ko.observable().extend( { required: true } ),
        email_address       : ko.observable().extend( { required: true , email: true } ),
        phone               : ko.observable().extend( { required: true , phoneUS: true } ),
        move_date           : ko.observable().extend( { required: true , date: true } ),

        //step two form fields
        id           : ko.observable().extend( { required: true, minLength:4, maxLength: 60 } ),
        race                : ko.observable().extend( { required: true } ),
        party               : ko.observable().extend( { required: true } ),
        birthMonth          : ko.observable().extend( { required: true } ),
        birthDay            : ko.observable().extend( { required: true } ),
        birthYear           : ko.observable().extend( { required: true } ), 
        
        //for verified user data
        verifiedNewState       : ko.observable(), 
        verifiedNewCity        : ko.observable(), 
        verifiedOldState       : ko.observable(), 
        verifiedOldCity        : ko.observable()
    };


    validationUtilities.initializeValidation(self.userData);


    self.submitStepOne = function() {
        self.partyMessage( 'No Message' );
        self.raceMessage( 'No Message' );
        var fieldsToValidate = ['current_title', 'current_first_name' , 'current_last_name' , 'old_address_line_1' , 'old_zip_code_5' , 'new_address_line_1' , 'new_zip_code_5' , 'email_address' , 'phone' , 'move_date'];

        if(self.showNewNameFields()){
            fieldsToValidate.push('prev_title');
            fieldsToValidate.push('prev_first_name');
            fieldsToValidate.push('prev_last_name');
        }

        if( showHomeStatus ){
            fieldsToValidate.push('home_status');
        }

        var validatedForm = validationUtilities.validateForm(self.userData, fieldsToValidate);

        self.loading( true );

        if(validatedForm.valid){

            validatedForm.validatedFields.is_name_changed = self.showNewNameFields;

            mvrCommunication.submitStep( ko.toJSON( validatedForm.validatedFields ) , firstStepSubmitPath ).
                done( function( response ) {

                    //mark the form as already submitted
                    self.hasAlreadySuccessfullySubmitted( true );
                    
                    //setup verified properties
                    self.userData.verifiedNewState( response.location.stateCode );
                    self.userData.verifiedNewCity( response.location.cityName );
                    self.userData.verifiedOldState( response.oldLocation.stateCode );
                    self.userData.verifiedOldCity( response.oldLocation.cityName );

                    //set the state text for display on step two
                    self.stateCode(mymoveKOModel.statesObject[response.location.stateCode]);

                    // only set race rules is race is required
                    if(response.stateRequirement.hasOwnProperty('race_required')){
                        self.needsRace (response.stateRequirement.race_required);
                        self.raceMessage ( response.stateRequirement.race_required_msg);
                        if(self.needsRaceList()){
                            $.each( response.raceList , function( key , value ){
                                self.raceList.push( value );
                            } ) ;
                        }
                        self.needsRaceList(false);
                    } else {
                        self.needsRace(false);
                    }

                    //only set rules if party is required
                    if(response.stateRequirement.hasOwnProperty('party_required')){
                        self.needsParty ( response.stateRequirement.party_required );
                        self.partyMessage ( response.stateRequirement.party_required_msg );
                        //prevents party list from doubling up between steps
                        if(self.needsPartyList()){
                            $.each( response.partyList , function( key , value ){
                                self.partyList.push( value );
                            } ) ;
                        }
                        self.needsPartyList(false);
                    } else {
                        self.needsParty(false);
                    }


                    //set id rules and message
                    if(response.stateRequirement.hasOwnProperty('id_required_msg')){
                        self.needsId( true );
                        self.idMessage ( response.stateRequirement.id_required_msg );
                    }


                    self.loading( false );
                    //Move to the second Step
                    self.currentStep( 2 );
                    
                    //determine whether we need to present a profile update opportunity
                    if ( response.profileUpdateKey ) {
                        mymoveKOModel.userProfileUpdateModel.availableUpdateKey( response.profileUpdateKey );
                        mymoveKOModel.userProfileUpdateModel.gaTagActionSource( 'Voter_Registration' );
                    }

                } ).
                fail( function( error ){

                    if( error.validationErrors ){
                        validationUtilities.showServerValidation( self.userData , error.validationErrors );
                    }else{
                        self.showGeneralErrorBox( true );
                    }

                    self.loading( false );

                });

        }else{
            self.loading( false );
        }
        // BI logging for different steps
        var urlParam = '_step2';
        self.logSteps(urlParam);
    };

    self.submitStepTwo = function( ) {

        var fieldsToValidate = ['birthMonth' , 'birthDay' , 'birthYear'];

        if (self.needsId()) {
            fieldsToValidate.push( 'id' );
        }

        if (self.needsRace()) {
            fieldsToValidate.push( 'race' );
        }

        if (self.needsParty()) {
            fieldsToValidate.push( 'party' );
        }

        var validatedForm = validationUtilities.validateForm( self.userData, fieldsToValidate );
        console.log(validatedForm);
        self.loading( true );

        if(validatedForm.valid){
            var formToSubmit = {
                id     : validatedForm.validatedFields.id,
                date_of_birth : self.userData.birthMonth() + "/" + self.userData.birthDay() + "/" + self.userData.birthYear()
            };


            if (self.needsRace()) {
                formToSubmit.race = validatedForm.validatedFields.race;
            }

            if(self.needsParty()){
                formToSubmit.party = validatedForm.validatedFields.party;
            }

            mvrCommunication.submitStep( ko.toJSON( formToSubmit ) , secondStepSubmitPath ).
                done( function( response ) {

                    self.pdfUrl( response.pdfurl );

                    //TODO: User all verified data for addresses instead of a combination of input data and verified data
                    mymoveKOModel.verifiedUserData.setUserData( {
                        "firstName" : self.userData.current_first_name(),
                        "lastName" : self.userData.current_last_name(),
                        "email" : self.userData.email_address(),
                        "moveDate" : self.userData.move_date(),
                        
                        "zipCode" : self.userData.new_zip_code_5(),
                        "streetAddress" : self.userData.new_address_line_1(),
                        "city" : self.userData.verifiedNewCity(),
                        "state" : self.userData.verifiedNewState(),
                        
                        "oldZipCode" : self.userData.old_zip_code_5(),
                        "oldStreetAddress" : self.userData.old_address_line_1(),
                        "oldCity" : self.userData.verifiedOldCity(), 
                        "oldState" : self.userData.verifiedOldState(), 
                        
                        "oneTimeUse" : false
                    } );
                    
                    self.currentStep( 3 );


                    self.loading( false );
                }).
                fail( function( error ){

                    validationUtilities.showServerValidation( self.userData , error.validationErrors );

                    self.loading( false );

                } );


        }else{

            self.loading( false );

        }
        // BI logging for different steps
        var urlParam = '_success';
        self.logSteps(urlParam);
    }

    //make sure the state is represented in the view
    self.currentStep.subscribe( function ( currentStepNumber ) {

        if ( currentStepNumber == 1 ) {
            self.showStepOne( true );
            self.showStepTwo( false );
            self.showStepThree( false );
        } else if ( currentStepNumber == 2 ) {
            self.showStepOne( false );
            self.showStepTwo( true );
            self.showStepThree( false );
        } else if ( currentStepNumber == 3 ) {
            self.showStepOne( false );
            self.showStepTwo( false );
            self.showStepThree( true );
        } else if ( currentStepNumber == 'author' ) {
            self.showStepOne( true );
            self.showStepTwo( true );
            self.showStepThree( true );
        } else {
            self.showStepOne( true );
            self.showStepTwo( false );
            self.showStepThree( false );
        }


    } );

    //Display Functions

    self.goBackToStepOne = function( ) {
        self.currentStep( 1 );
    };


    self.resetForm = function ( ) {

        $.post('/content/mymove/jcr:content/header/login.logout.html', function(){
            window.location.reload();
        })

    };


    if(!isAuthor){
        self.currentStep( firstStep );
    }else{
        self.currentStep( 'author' );
    }
    // BI logging
    self.logSteps = function(urlparam) {
       var currentUrl = window.location.pathname + urlparam;
        var logObject = {
            'linkPath' : currentUrl
        }
        $.ajax({
            dataType: "json",
            type: 'post',
            data: logObject,
            url: '/bin/mymove/loglinkclick'

        });
    }
    if(firstStep == 1){
        // BI logging for different steps
        var urlParams = '_step1';
        self.logSteps(urlParams);

    }

    // Accordion code
    $(document).ready(function()
    {
        //Add Inactive Class To All Accordion Headers
        $('.accordion_title').toggleClass('inactive-header');

        // The Accordion Effect
        $('.accordion_title').click(function () {
            if($(this).is('.inactive-header')) {
                $('.active-header').toggleClass('active-header').toggleClass('inactive-header').next().slideToggle().toggleClass('open-content');
                $(this).toggleClass('active-header').toggleClass('inactive-header');
                $(this).next().slideToggle().toggleClass('open-content');
            }
            else {
                $(this).toggleClass('active-header').toggleClass('inactive-header');
                $(this).next().slideToggle().toggleClass('open-content');
            }
        });

        return false;
    });
};

mymoveKOModel.msvr.voterRegServerCommunication = {

    submitStep : function( userData , submitPath ) {
        var d = $.Deferred();
        $.ajax( {

            url     : submitPath,
            type    : 'POST',
            data    : userData,
            contentType : "application/json",
            success : function( response ) {
                d.resolve(response);
            },
            error : function( jqXHR, textStatus, errorThrown ) {



                switch ( jqXHR.status ) {

                    case 400:

                        try {
                            var validationErrors = JSON.parse( jqXHR.responseText );
                            console.log(validationErrors);
                            d.reject( {
                                success          : false,
                                errorType        : 400,
                                validationErrors : validationErrors
                            } );
                        }catch ( error ){
                            d.reject( {
                                success   : false,
                                errorType : 400
                            } );
                        }

                        break;
                    case 500 :

                        d.reject( {
                            success          : false,
                            errorType        : 500
                        } );


                        break;
                    default :
                        d.reject( {
                            success          : false,
                            errorType        : 500
                        } );
                }
            }

        } );

        return d;
    }

};
mymoveKOModel.moversReviewSearchResultsModel = new function() {
    var self = this;
    var stateMapping = {
        "AL" : "Alabama",
        "AK" : "Alaska",
        "AZ" : "Arizona",
        "AR" : "Arkansas",
        "CA" : "California",
        "CO" : "Colorado",
        "CT" : "Connecticut",
        "DE" : "Delaware",
        "FL" : "Florida",
        "GA" : "Georgia",
        "HI" : "Hawaii",
        "ID" : "Idaho",
        "IL" : "Illinois",
        "IN" : "Indiana",
        "IA" : "Iowa",
        "KS" : "Kansas",
        "KY" : "Kentucky",
        "LA" : "Louisiana",
        "ME" : "Maine",
        "MD" : "Maryland",
        "MA" : "Massachusetts",
        "MI" : "Michigan",
        "MN" : "Minnesota",
        "MS" : "Mississippi",
        "MO" : "Missouri",
        "MT" : "Montana",
        "NE" : "Nebraska",
        "NV" : "Nevada",
        "NH" : "New Hampshire",
        "NJ" : "New Jersey",
        "NM" : "New Mexico",
        "NY" : "New York",
        "NC" : "North Carolina",
        "ND" : "North Dakota",
        "OH" : "Ohio",
        "OK" : "Oklahoma",
        "OR" : "Oregon",
        "PA" : "Pennsylvania",
        "RI" : "Rhode Island",
        "SC" : "South Carolina",
        "SD" : "South Dakota",
        "TN" : "Tennessee",
        "TX" : "Texas",
        "UT" : "Utah",
        "VT" : "Vermont",
        "VA" : "Virginia",
        "WA" : "Washington",
        "WV" : "West Virginia",
        "WI" : "Wisconsin",
        "WY" : "Wyoming"
    };

    // Bringing Data In - Setting as Observable Array
    self.fields = {
        loaded: ko.observable(false),
        data: ko.observableArray().extend({ paging: 10 }),
        error: ko.observable(),
        searchCity: ko.observable(),
        searchName: ko.observable(),
        searchState: ko.observable()
    };
    self.fields.searchStateName = ko.computed(function() {
        var bigState = ko.utils.unwrapObservable(self.fields.searchState);
        return stateMapping[bigState];
    });




    self.initialize = function( city, state, name ) {
        self.initialize.params = function() {
            if (city && state && name) {
                return {
                    city: city,
                    state: state,
                    name: name
                };
            } else if (!name) {
                return {
                    city: city,
                    state: state
                };
                
            } else if (!city) {
                return {
                    state: state,
                    name: name
                };
            } else {
                return {
                    state: state
                };
            }
        };

        $.getJSON("/bin/mymove/moversreviews/companysearch.json", self.initialize.params())
            .done(function(data){
                var searchResponse = data.response;
                if (searchResponse === "OK") {
                    self.fields.data(data.companies);
                    self.fields.error(data.response);
                    self.fields.searchCity(data.city);
                    self.fields.searchState(data.state);
                    self.fields.searchState(self.fields.searchState().toUpperCase());
                    self.fields.searchName(data.name);
                    self.fields.loaded(true);
                    $(".fn-search-loading").stop();
                } else if (searchResponse === "MISSPELLED_LOCATION") {
                    self.fields.loaded(true);
                    self.fields.searchCity(data.city);
                    self.fields.searchState(data.state);
                    self.fields.error(data.response);
                    $(".fn-search-loading").stop();
                    $(".search-misspelled").show();
                    $(".search-bad-generic").hide();
                } else if (searchResponse === "INVALID_ZIP") {
                    self.fields.loaded(true);
                    self.fields.searchCity(data.city);
                    self.fields.searchState(data.state);
                    self.fields.error(data.response);
                    $(".fn-search-loading").stop();
                    $(".search-no-zip").show();
                    $(".search-bad-generic").hide();
                } else {
                    self.fields.response(data.response);
                    self.fields.searchCity(data.city);
                    self.fields.searchState(data.state);
                    self.fields.loaded(true);
                    $(".fn-search-loading").stop();
                    $(".search-bad-generic").show();
                }
            });

    };

    //Sorting for Search Results
    self.doResultSort = ko.observable();
    var sortFunctionMap = {
        "asc_reviews" : function(a, b) {
            var va = (a.companyStatistics === null) ? 0 : a.companyStatistics.totalReviewCount,
                vb = (b.companyStatistics === null) ? 0 : b.companyStatistics.totalReviewCount;
            return va < vb ? -1 : 1;
        },
        "dec_reviews" : function(a, b) {
            var va = (a.companyStatistics === null) ? 0 : a.companyStatistics.totalReviewCount,
                vb = (b.companyStatistics === null) ? 0 : b.companyStatistics.totalReviewCount;
            return va > vb ? -1 : 1;
        },
        "asc_rating" : function(a, b) {
            var aRating = (a.companyStatistics === null) ? 0 : a.companyStatistics.avgOverallRating,
                bRating = (b.companyStatistics === null) ? 0 : b.companyStatistics.avgOverallRating;
            return aRating < bRating ? -1 : 1;
        },
        "dec_rating" : function(a, b) {
            var aRating = (a.companyStatistics === null) ? 0 : a.companyStatistics.avgOverallRating,
                bRating = (b.companyStatistics === null) ? 0 : b.companyStatistics.avgOverallRating;
            return aRating > bRating ? -1 : 1;
        },
        "asc_alpha" : function(a, b) {
            return a.stdname.toLowerCase() < b.stdname.toLowerCase() ? -1 : 1;
        },
        "dec_alpha" : function(a, b) {
            return a.stdname.toLowerCase() > b.stdname.toLowerCase() ? -1 : 1;
        }

    };
    self.doResultSort.subscribe(function(typeOfSort) {
        self.fields.data.sort(sortFunctionMap[typeOfSort]);
    });
};
mymoveKOModel.moversReviewConsumerReviewsModel = new function() {
    var self = this;
    // Bringing Data In - Setting as Observable Array
    self.moverReview = ko.observableArray().extend({ paging: 10 });
    self.initialize = function( id ) {
            $.getJSON("/bin/mymove/moversreviews/consumerreviews.json",{
                companyId: id
            })
            .done(function(reviews) {
                self.moverReview(reviews);
            });
    };

    // Consumer Review Tooltip
    self.conReviewJS = function() {
        $(".tooltip-wrapper a.info").tooltip({
            position: {
                my: "center top",
                at: "center bottom+10",
                collision: "none",
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                        .addClass( "arrow" )
                        .addClass( feedback.vertical )
                        .addClass( feedback.horizontal )
                        .appendTo( this );
                }
            }
        });

        // Bind to custom share bar.
        $(".share li a").on("click", function(e) {
            // Parse provider from share data-provider. If not present, use <a> element class.
            var provider = $(this).data("provider") ? $(this).data("provider") : $(this).attr("class");

            // Parse share content. Use data-* attributes if they're present on the .share element. Otherwise, use the page metadata.
            var parent = $(this).parents(".share");
            var title = $(parent).data("title") ? $(parent).data("title") : $("meta[property='og:title']").attr("content");
            var description = $(parent).data("description") ? $(parent).data("description") : $("meta[property='og:description']").attr("content");
            var url = $(parent).data("url") ? $(parent).data("url") : window.location.toString();
            var image = $(parent).data("image") ? $(parent).data("image") : $("meta[property='og:image']").attr("content");

            if(provider === "mail") {
                gigya.socialize.showShareUI({
                    initialView: "email",
                    hideSidebar: true,
                    userAction: new gigya.socialize.UserAction({
                        title: title,
                        description: description,
                        images: [image],
                        linkBack: url
                    })
                });
            } else {
                gigya.socialize.postBookmark({
                    provider: provider,
                    title: title,
                    description: description,
                    url: url
                });
            }

            return false;
        });
        // Bind to custom social login buttons.
        $(".BVRReviewComments").unbind("click").on("click",
            ".socialLoginButtons a", function() {
                gigya.socialize.login({
                    "provider" : $(this).attr("class"),
                    "enabledProviders" : "facebook,twitter,google,yahoo,wordpress,blogger"
                });
                return false; // Cancel click event.
            });


        gigya.socialize.showLoginUI({
            "containerID" : "gigyaModalLogin",
            "width" : 220,
            "height" : 160,
            "showTermsLink" : false,
            "showWhatsThis" : false,
            "hideGigyaLink" : true,
            "enabledProviders" : "facebook,twitter,google,yahoo",
            "autoDetectUserProviders" : "facebook",
            "buttonsStyle" : "signInWith",
            "onLogin" : function(r) {
                console.log(r);
                $.fancybox.close();
            }
        });

        $("a.comment-cr").unbind("click").click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).closest("li").find(".BVRReviewComments .gig-comments-commentBox-cr").slideToggle("slow");
            return false;
        });

    };


    // Taking Boolean to html for Recommend data on reviews
    self.recommendDisplay = function(reco) {
        if (reco) {
            return "<span class='yes'>Yes, I recommend this moving company.</span>";
        } else {
            return "<span class='no'>No, I would not recommend this moving company.</span>";
        }
    };

    self.confirmedBadge = function(badge) {
        if (badge) {
            return "certified";
        }
    };

    //Sorting for Search Results
    self.doResultSort = ko.observable();
    var sortFunctionMap = {
        "asc_date" : function(a, b) {
            var va = (a.reviewDate === null) ? 0 : a.reviewDate,
                vb = (b.reviewDate === null) ? 0 : b.reviewDate;
            return va < vb ? -1 : 1;
        },
        "dec_date" : function(a, b) {
            var va = (a.reviewDate === null) ? 0 : a.reviewDate,
                vb = (b.reviewDate === null) ? 0 : b.reviewDate;
            return va > vb ? -1 : 1;
        },
        "asc_rating" : function(a, b) {
            var aRating = (a.overallRating === null) ? 0 : a.overallRating,
                bRating = (b.overallRating === null) ? 0 : b.overallRating;
            return aRating < bRating ? -1 : 1;
        },
        "dec_rating" : function(a, b) {
            var aRating = (a.overallRating === null) ? 0 : a.overallRating,
                bRating = (b.overallRating === null) ? 0 : b.overallRating;
            return aRating > bRating ? -1 : 1;
        }

    };
    self.doResultSort.subscribe(function(typeOfSort) {
        self.moverReview.sort(sortFunctionMap[typeOfSort]);
    });
}();
ko.validation.init({
    insertMessages    : false,
    decorateElement   : true,
    errorElementClass : 'error'
});

ko.validation.rules['defaultValue'] = {
    validator: function(val, otherVal) {
        return val != otherVal;
    },
    message: 'Please change the default value'
};

ko.validation.registerExtenders();

mymoveKOModel.moveQuoteModel = new function(){
    var self = this;
    self.showSpinner = ko.observable(false);
    self.fromZipSent = false;
    self.toZipSent = false;
    self.moveDateSent = false;

    self.dataCaptured = {
        workType    : ko.observable('').extend({ required: true}),
        moveType    : ko.observable('').extend({ required: true}),
        moveSize    : ko.observable('').extend({ required: true}),
        toZip       : ko.observable('5 digit ZIP').extend({ required: true, maxLength: 5, minLength: 5, number: true, defaultValue: '5 digit ZIP'}),
        fromZip     : ko.observable('5 digit ZIP').extend({ required: true, maxLength: 5, minLength: 5, number: true, defaultValue: '5 digit ZIP'}),
        moveDate    : ko.observable('').extend({ required: true, date: true }),
        firstName   : ko.observable('First Name').extend({ required: true, defaultValue: 'First Name'}),
        lastName    : ko.observable('Last Name').extend({ required: true, defaultValue: 'Last Name'}),
        email       : ko.observable('Email Address').extend({ required: true, email: true, defaultValue: 'Email Address' }),
        phoneNumber : ko.observable('xxx-xxx-xxxx').extend({ required: true, phoneUS:true, defaultValue: 'xxx-xxx-xxxx'}),
        coreg       : ko.observable(false),
        invalidResponseError : ko.observable(false)
    }


    self.workType = function(viewModel, event){

        var jqCurrentTarget = $(event.currentTarget);
        var jqParent = $(event.currentTarget).parent();

        self.markActive(jqParent, jqCurrentTarget)
        var boxID = self.upDateData(jqCurrentTarget, 'workType');
        var newWindow = jqCurrentTarget.attr('data-new-window');


        /* Check to see if a link is present */
        var link = jqCurrentTarget.attr('data-link');

        if(link){

            self.hideAll();
            if(newWindow == "true"){
                window.open(link, '_blank');
            }else{
                window.open(link, '_self');
            }
        }
        else{
            self.showNextStep('step2');
        }

    }

    self.moveType = function(viewModel, event){
        var jqCurrentTarget = $(event.currentTarget);
        var jqParent = $(event.currentTarget).parent();

        self.markActive(jqParent, jqCurrentTarget);
        self.upDateData(jqCurrentTarget, 'moveType');

        if(self.dataCaptured.moveSize() != ''){
            self.showNextStep($(event.currentTarget).attr('data-nextstep'));
        }
    }

    self.zipValid = function(element, viewModel){
        var fromZip = self.dataCaptured.fromZip.isValid();
        var toZip = self.dataCaptured.toZip.isValid();
        var moveDate = self.dataCaptured.moveDate.isValid();

        var eventType = $(element.currentTarget).attr('name');

        //This is a hack because the date input works differently than the zip fields.
        if(!eventType) {
            eventType = $(element).attr('name');
        }

        var label = '';
        switch (eventType){
            case 'fromZip':
                if(fromZip && !self.fromZipSent){
                    self.fromZipSent = true;
                    label = 'From';

                    self.gaTag({
                        category : 'Content',
                        action : 'Move_Quote_Tool',
                        label : label
                    });
                }

                break;
            case 'toZip':
                if(toZip && !self.toZipSent){
                    self.toZipSent = true;
                    label = 'To';

                    self.gaTag({
                        category : 'Content',
                        action : 'Move_Quote_Tool',
                        label : label
                    });
                }

                break;
            case 'moveDate':
                if(moveDate && !self.moveDateSent){
                    self.moveDateSent = true;
                    label = 'Move_Date';

                    self.gaTag({
                        category : 'Content',
                        action : 'Move_Quote_Tool',
                        label : label
                    });
                }

                break;
        }
        //console.log('zip Label', label);


        //console.log('fromZip', fromZip, 'toZip', toZip, 'moveDate', moveDate);

        if(fromZip && toZip && moveDate){
            self.showNextStep('step3')
        }

    }

    self.moveSize = function(viewModel, event){
        var jqCurrentTarget = $(event.currentTarget);
        var jqParent = $(event.currentTarget).parent();

        self.markActive(jqParent, jqCurrentTarget);
        self.upDateData(jqCurrentTarget, 'moveSize');
        if(self.dataCaptured.moveType() != ''){
            self.showNextStep($(event.currentTarget).attr('data-nextstep'));
        }
    }

    self.changeCheck = function(){
        if(self.dataCaptured.coreg()){
            self.dataCaptured.coreg(false);
        }else{
            self.dataCaptured.coreg(true);
        }
    }

    self.formSubmit = function(formElement){
        self.showSpinner(true);
        var formValid = true;

        for(var validatingItem in self.dataCaptured){

            var item = self.dataCaptured[validatingItem];
            if(validatingItem != 'coreg' && validatingItem != 'invalidResponseError'){
                if(item.validate()){
                    continue;
                }else{
                    formValid = false;
                }
            }



        }
        if(formValid){

            //Form is valid.  Send GA information
            self.gaTag({
                category : 'Revenue',
                action : 'Lead',
                label : 'Move_Quote_Tool:Get_Quotes'
            });

            var cleanData = ko.toJS(self.dataCaptured);
            $.ajax({
                type: 'post',
                url : formElement.action,
                data: cleanData,
                success: function(data){
                    self.showSpinner(false);
                    console.log('data from ', data);
                    if(data.success){
                        window.location = data.successPageUrl;
                    }else{
                        var errors = data.formErrors;

                        for(var error in errors){

                            if(error != 'invalidResponseError' && error != 'coreg' && error != 'debugServiceMessage'){
                                self.dataCaptured[error].__valid__(false);
                            }else if(error == "invalidResponseError"){
                                self.dataCaptured[error](true);
                            }
                        }
                    }
                },
                error: function(){
                    self.showSpinner(false);
                    self.showInvalidResponseError(true);
                }
            })

            console.log('data', cleanData);
        }else{
            self.showSpinner(false);
        }


    }



    self.showNextStep = function(divID){
        $('#'+divID + ' .moveQuoteOverlay').fadeOut();
        $('#'+divID).find('input').each(function(){
            $(this).removeAttr('disabled');
        })
    }
    self.hideAll = function(){
        $('.moveQuoteOverlay').fadeIn();
        $('.moveQuoteOverlay.component').hide();
        $('.moveQuoteWrapper').find('input').each(function(){
            $(this).attr('disabled', true);
        })
    }

    self.markActive = function(parent, currentTarget){
        var boxID = $(currentTarget).attr('data-boxID');
        if(parent.siblings('.moveQuoteContainer').length > 0){
            parent = parent.parent();
        }

        var label = '';
        switch (boxID){
            case 'FsvcWorkType':
                label = 'Movers_Pack_Ship_And_Unpack';
                break;
            case 'PsvcWorkType':
                label = 'You_Pack_And_Unpack_Movers_Ship';
                break
            case 'YditWorkType':
                label = 'You_Do_It_Yourself';
                break
            case 'Fsvc':
                label = 'Type_of_Move_Home';
                break;
            case 'Auto':
                label = 'Type_of_Move_Auto_Transport';
                break
            case 'Office':
                label = 'Type_of_Move_Office';
                break
            case 'Piano':
                label = 'Type_of_Move_Piano_Move';
                break;
            case 'Art':
                label = 'Type_of_Move_Art_&_Antique';
                break
            case 'Intl':
                label = 'Type_of_Move_International';
                break
            case '1500':
                label = 'Size_of_Move_Studio';
                break
            case '2000':
                label = 'Size_of_Move_1_Bedroom';
                break;
            case '5000':
                label = 'Size_of_Move_2_Bedroom';
                break
            case '7500':
                label = 'Size_of_Move_2-3_Bedroom';
                break
            case '10000':
                label = 'Size_of_Move_3_Bedroom';
                break;
            case '15000':
                label = 'Size_of_Move_4_Bedroom';
                break
            case '20000':
                label = 'Size_of_Move_5+_Bedroom';
                break
        }
        console.log('label', label);
        self.gaTag({
            category : 'Content',
            action : 'Move_Quote_Tool',
            label : label
        });

        var selectBoxes = parent.find('.gradientBox');

        selectBoxes.each(function(index, box){
            if($(box).hasClass('active')){
                $(box).removeClass('active');
            }
        })

        currentTarget.addClass('active');


    }

    self.gaTagForm = function(event){
        var fieldType = $(event.currentTarget).attr('name');
        var label;

        switch (fieldType){
            case 'firstName':
                label = 'First_Name';
                break;
            case 'lastName':
                label = 'Last_Name';
                break;
            case 'email':
                label = 'Email_Address';
                break;
            case 'phoneNumber':
                label = 'Phone';
                break;
        }

        console.log('gaTagForm label', label);
        self.gaTag({
            category : 'Content',
            action : 'Move_Quote_Tool',
            label : label
        });

    }

    self.upDateData = function(currentTarget, caller){

        var boxID = currentTarget.attr('data-boxID');
        self.dataCaptured[caller](boxID);
        return boxID;

    }

    self.gaTag = function(tagObj, viewModel, event){
        _gaq.push(['_trackEvent', tagObj.category, tagObj.action, tagObj.label])
    }
};


function showRulesState(){
    var data = mymoveKOModel.moveQuoteModel.dataCaptured;

    $.each(data, function(index, value){
        console.log('----------' + index + '----------');
        if(value.rulesThatHaveErrors){
            $.each(value.rulesThatHaveErrors, function(index, value){
                console.log(index, value());
            })
        }
        console.log('');

    })
};
/**
 * Created by CITYTECH on 10/25/13.
 */


mymoveKOModel.homeSecurityModel = function( submitPath , validationUtilities ){

    var self = this;
    self.submitPath = submitPath;
    self.loading    = ko.observable( false );

    self.userData = {
        firstName       : ko.observable( ).extend({ required: true }),
        lastName        : ko.observable( ).extend({ required: true }),
        email           : ko.observable( ).extend({ required: true }),
        phoneNumber     : ko.observable( ).extend({ required: true }),
        addressLine1    : ko.observable( ).extend({ required: true }),
        addressLine2    : ko.observable( ).extend({ required: false }),
        city            : ko.observable( ).extend({ required: true }),
        state           : ko.observable( ).extend({ required: true }),
        zipCode         : ko.observable( ).extend({ required: true }),
        ownHome         : ko.observable( true ).extend({ required: false }),
        signUpCheckBox  : ko.observable( false ).extend({ required: true , equal: true })
    };



    validationUtilities.initializeValidation(self.userData);

    self.loading = ko.observable(false);

    self.submit = function(){
        self.loading(true);
        var formIsValid = true;
        $.each(self.userData, function(key, field){
           if(!field.validate()){
               formIsValid = false;
               self.loading(false);
           }
        });


        if(formIsValid){
            mymoveKOModel.gaTag._trackEvent({ category : 'Revenue', action   : 'Lead', label : 'Home_Security:Submit' });
            $.ajax({
                type    : 'POST',
                url     : self.submitPath,
                data    : ko.toJS(self.userData),
                success : function ( response ) {
                    if(response.success){
                        window.location = response.successPageUrl;
                    }else{
                        mymoveKOModel.validationUtilities.showServerValidation(self.userData, response.formErrors);
                        self.loading(false);
                    }
                },
                error   : function ( response ) {
                    self.loading(false);
                }
            });
        }


    }

    self.tagFirstName = function(){
        mymoveKOModel.gaTag._trackEvent({ category : 'Content', action   : 'Home_Security', label : 'First_Name' });
    }

};
/**
 * Backing model for Global Registration.  This model supports the functionality necessary
 * to submit registrations and to handle responses from the submission.
 */
mymoveKOModel.globalRegistrationModel = new function() {

    var self = this;

    this.formErrorMessages = ko.observableArray();
    this.fieldErrorMessages = ko.observableArray();

    this.submissionError = ko.observable( false );
    this.submitting = ko.observable( false );

    this.presentableFieldErrorMessages = ko.computed( function() {
        var errorsToDisplay = {};

        if ( self.fieldErrorMessages().length ) {
            for ( var i = 0; i < self.fieldErrorMessages().length; i++ ) {
                var curFieldErrorMessage = self.fieldErrorMessages()[ i ];

                errorsToDisplay[ curFieldErrorMessage.fieldName ] = curFieldErrorMessage.errorMessage;
            }
        }

        return errorsToDisplay;
    } );



    this.submit = function( form ) {

        var productRedirectionTarget = $( form ).attr( 'data-from-product' );

        self.formErrorMessages.removeAll();
        self.fieldErrorMessages.removeAll();
        self.submissionError( false );
        self.submitting( true );

        $.ajax( $( form ).attr( 'target' ), {
            type : "POST",
            data : $( form ).serialize(),
            success : function( data ) {
                self.submitting( false );

                if( data.success ) {

                    if ( productRedirectionTarget ) {
                        location = productRedirectionTarget;
                    }

                    return;
                }

                for ( var i=0; i<data.formErrors.length; i++ ) {
                    var curError = data.formErrors[ i ];

                    if ( curError.fieldName ) {
                        self.fieldErrorMessages.push( curError );
                    }
                    else {
                        self.formErrorMessages.push( curError );
                    }
                }

            },
            error : function( xhr, textStatus, errorThrown ) {
                self.submissionError( true );
                self.submitting( false );
            }
        } );

    };

    this.cancel = function( data, event ) {

        var redirectTarget = $( event.target ).parents( 'form' ).attr( 'data-from-product' );

        if ( redirectTarget ) {
            location = redirectTarget;
        }

    };

    this.getErrorsForField = function( fieldName ) {

        var retErrors = Array();
        var fieldErrorMessagesArray = fieldErrorMessages();
        for ( var i=0; i < fieldErrorMessagesArray.length; i++ ) {
            var curError = fieldErrorMessagesArray[ i ];
            if ( curError.fieldName === fieldName ) {
                retErrors.push( curError );
            }
        }

        return retErrors;

    };

    this.getErrorForField = function( fieldName ) {

        var fieldErrorsArray = self.getErrorsForField( fieldName );

        if ( fieldErrorsArray && fieldErrorsArray.length ) {
            return fieldErrorsArray[ 0 ];
        }

        return null;

    };

    this.hasFormErrors = ko.computed( function() {
        return self.formErrorMessages().length;
    } );

}();
mymoveKOModel.businessmoverModel = function( submitPath , yextSubmitPath ,  validationUtilities ){

    var self = this;

    self.userData = {
        name              : ko.observable( ).extend( { required: true } ),
        business_website  : ko.observable( ).extend( { required: false } ),
        firstName         : ko.observable( ).extend( { required: true } ),
        lastName          : ko.observable( ).extend( { required: true } ),
        address           : ko.observable( ).extend( { required: true } ),
        business_city     : ko.observable( ).extend( { required: true } ),
        business_state_id : ko.observable( ).extend( { required: true } ),
        zip               : ko.observable( ).extend( { required: true , number:true } ),
        email             : ko.observable( ).extend( { required: true , email: true } ),
        phone             : ko.observable( ).extend( { required: true , phoneUS: true } ),
        moveDate       : ko.observable( ).extend( { required: true } )
    }

    self.loading = ko.observable( false );

    validationUtilities.initializeValidation(self.userData);

    self.submit = function(  ) {

        self.loading( true );



        var fieldsToValidate = [
            'name',
            //'business_website',
            'firstName',
            'lastName',
            'address',
            'business_city',
            'business_state_id',
            'zip',
            'email','phone', 'moveDate'
        ];

        var formData = validationUtilities.validateForm(self.userData, fieldsToValidate);

        if(formData.valid){
            var cleanData = ko.toJS(formData.validatedFields);

            mymoveKOModel.gaTag._trackEvent({ category : 'Content', action   : 'Business', label : 'Basic_Info' });
            mymoveKOModel.gaTag._trackEvent({ category : 'Revenue', action   : 'Lead', label : 'Business:Continue' });

            $.ajax( {

                url     : submitPath,
                type    : 'POST',
                data    : cleanData,
                success : function( response ) {
                   console.log(response);

                    if( response.requestProfileUpdate ){

                        mymoveKOModel.userProfileUpdateModel.availableUpdateKey( response.profileUpdateKey );

                        mymoveKOModel.userProfileUpdateFormModel.mode.subscribe( function ( changedValue ) {
                            if( changedValue == "completed" ){
                                $(".businessmoverForm").submit();
                            }
                        } );

                        mymoveKOModel.userProfileUpdateFormModel.canceled.subscribe(function(changedValue){
                            if(changedValue){
                                $(".businessmoverForm").submit();
                            }
                        })

                    }else{

                        $(".businessmoverForm").submit();

                    }


                    self.loading(false);
                },
                error : function( jqXHR, textStatus, errorThrown ) {



                    switch ( jqXHR.status ) {

                        case 400:

                            try {
                                var validationErrors = JSON.parse( jqXHR.responseText );
                                validationUtilities.showServerValidation( self.userData , validationErrors )

                            }catch ( error ){
                                console.log(error);
                            }

                            break;
                        case 500 :

                            try {
                                var validationErrors = JSON.parse( jqXHR.responseText );
                                validationUtilities.showServerValidation( self.userData , validationErrors )

                            }catch ( error ){
                                console.log(error);
                            }


                            break;
                        default :

                    }
                    self.loading(false);
                }


            } );





        } else {
            self.loading( false );
        }

        console.log(cleanData);
    };

};
