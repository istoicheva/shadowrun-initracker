// -- Enable sortable list options
$(function() {
	$( "#inilist" ).sortable();
	$( "#inilist" ).disableSelection();
});


$(document).ready(function() {

    // -- COOKIES SEPCIALS -- //

    // Suppose to check for cookies, but nobody uses it
    var cookies_present = 1;
    if (typeof $.cookie() === 'undefined') {
        cookies_present = 0;
    }

    // Purge cookies function used at teh begining of Save Button and Purge Button
    function PurgeCookies () {
        var total_fields = $.cookie('total_fields');
        var all_cookies = $.cookie();
        for (var item in all_cookies) {
            $.removeCookie(item);
        }
       $.removeCookie('total_fields');
    }

    // -- DEFINE HANDLERS //

    // HANDLER: Tags with Editable Class
    // This will create an input field on the place of any text inbetween .editable tags,
    // and on enter or focusout it will confirm none empty selections
    var handler_Editable = function() {
        var original_value = $(this).text();    // Text between tags
        $(this).text("");                       // Empty between tags
        var $parent = $(this);                  // Take to make it editable or not

        var $element = $('<input type="text" class="in-edit-name"/>');
        $element.val(original_value).appendTo(this).focus();
        $parent.removeClass('editable');

        // FUNCTION : Confirm value in field .editable
        function confirm_field ( target_this, previous_value ) {
            $this = $(target_this);             // Make sure this is the right object
            var old_value = previous_value;     // Previous value of field before edit
            var $new_value = $this.val();       // The currunt value of the field

            // Make sure it is not empty
            if ($new_value.length <= 0) {
                $new_value = old_value;
            }

            // If field is initiative => evaluate
            if ($parent.hasClass('inivalue')) {
                try {
                    var ini_eval = eval($new_value);
                    $new_value = ini_eval;
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        console.log("Invalid Initiative input.");
                    }
                }
            } 

            $this.parent().text($new_value);    // Assign new value
            $parent.addClass('editable');       // Make it editable again
            $this.remove();                     // Remove input field.
        }

        // Confirm on key press
        $('input.in-edit-name').keypress( function(e) {
             if (e.which == 13) {
                var value = $(this).val();
                confirm_field( this, original_value );
            }
        });
        // Confirm on focusout
        $('input.in-edit-name').focusout( function() {
            var value = $(this).val();
            confirm_field( this, original_value );
        });
    }


	// -- DEFINE BOTTOM BUTTONS -- //

    // BUTTON : Switch All Types
    $('#switchalltypes').click(function() {
        var $list = $('#inilist li');
        var $button = $(this);
        var $type;

        if ($button.hasClass('globe')) {
            $type = 'fa-globe';
            $button.removeClass('globe');
            $button.addClass('usb');
        } else if (($button.hasClass('usb')) || ($button.hasClass('default'))) {
            $type = 'fa-usb';
            $button.removeClass('default');
            $button.removeClass('usb');
            $button.addClass('star');   
        } else {
            $type = 'fa-star';
            $button.removeClass('star');
            $button.addClass('globe');
        }
        
        $list.each(function ( index ) {
            var $icon = $(this).find('.fa');
            
            $icon.removeClass('fa-globe');
            $icon.removeClass('fa-usb');
            $icon.removeClass('fa-star');

            $icon.addClass($type);
        } );
    });

	// BUTTON : Sort Initiave
    $('#sort').click(function(e) {
        var $sort = this;
        var $list = $('#inilist');
        var $listLi = $('li',$list);
        $listLi.sort(function(a, b){
            var keyA = parseInt($(a).find('.inivalue').text());
            var keyB = parseInt($(b).find('.inivalue').text());
            return (keyA < keyB) ? 1 : 0;
        });
        $.each($listLi, function(index, row){
            $list.append(row);
        });
        e.preventDefault();
    });

    // BUTTON : End Pass
	$('#endpass').click(function() {

		// Remove 10 of each initiative score that is over 0
		var $list = $('#inilist li');

		$list.each(function ( index ) {
			var $element_value = $(this).find('span.inivalue').text();
	    	var $start_ini = parseInt($element_value);
	    	var $new_ini = $start_ini - 10;

	    	if ($start_ini > 0) {
	    		// Remove 10 ini
	    		$(this).find('span.inivalue').text($new_ini);
				if ($new_ini <= 0) {
					$(this).addClass('nomoves');
				}
	    	} else {
                $(this).addClass('nomoves');
            }
		} );

		// Remove all classes
		$('.exhosted').removeClass('exhosted');
		//$('.nomoves').removeClass('nomoves');
	});

	// BUTTON : Clear All
	$('#clear').click(function() {
		// Remove all classes
		$('.exhosted').removeClass('exhosted');
		$('.nomoves').removeClass('nomoves');
		$('.active').removeClass('active');

		// Set all initiatives to 0
		var $list = $('#inilist li');

		$list.each(function ( index ) {
			var $element_value = $(this).find('span.inivalue').text();
    		$(this).find('span.inivalue').text(0);
		});
	});

    // BUTTON : Save (to cookie) - TODO
    $('#save').click( function() {
        PurgeCookies();     // Remove all privious cookie saves (if any)
        var $list = $('#inilist li');
        var count = -1;

        $list.each(function ( index ) {
            count++;
            var input_collection = new Array();

            var liclasses = $(this).attr("class");
            input_collection.push(liclasses);

            var type = $(this).find('span.location i').attr("class");
            input_collection.push(type);

            var ininame = $(this).find('span.ininame').text();
            input_collection.push(ininame);

            var inivalue = $(this).find('span.inivalue').text();
            input_collection.push(inivalue);

            var fulldef = $(this).find('input[name="fulldef"]:checked').length;
            input_collection.push(fulldef);

            var notes = $(this).find('input.notes').value;
            input_collection.push(notes);

            $.cookie(count, input_collection, { expires: 30 });
        });

        $.cookie('total_fields', count, { expires: 30 }); // for fast reading later
    });

    // BUTTON : Purge (cookies)
    $('#purge').click( function() {
        PurgeCookies();
    });

    // -- DEFINE LINE BUTTONS -- //

    // BUTTON : Acted
    $('#inilist').on('click', 'button.tookturn', function() {
    	var $wrapping_element = $(this).parent().parent();
		$($wrapping_element).toggleClass('exhosted');
    });

    // BUTTON : Remove
    $('#inilist').on('click', 'button.remove', function(){
    	var $line_element = $(this).parent().parent();
    	$($line_element).remove();
    });

    // BUTTON : Deduct -5
    $('#inilist').on('click', 'button.deduct5', function() {
        var $line_element = $(this).parent().parent();
        var $ini_value_spot = $line_element.find('.inivalue');
        var $ini_value = $ini_value_spot.text();
        var $new_value;
        if ($.isNumeric($ini_value)) {
            $new_value = $ini_value - 5;
            $ini_value_spot.text($new_value);
        }
    });

    // BUTTON : Deduct -10
    $('#inilist').on('click', 'button.deduct10', function() {
        var $line_element = $(this).parent().parent();
        var $ini_value_spot = $line_element.find('.inivalue');
        var $ini_value = $ini_value_spot.text();
        var $new_value;
        if ($.isNumeric($ini_value)) {
            $new_value = $ini_value - 10;
            $ini_value_spot.text($new_value);
        }
    });


    // Change type
    $('#inilist').on('dblclick', ' i.fa', function() {
    	var $icon = $(this);
    	if ($icon.hasClass('fa-globe')) {
    		$icon.removeClass('fa-globe');
    		$icon.addClass('fa-usb');
    	} else if ($icon.hasClass('fa-usb')) {
    		$icon.removeClass('fa-usb');
    		$icon.addClass('fa-star');	
    	} else {
    		$icon.removeClass('fa-star');
    		$icon.addClass('fa-globe');
    	}
    });

    // Active Line
    $('li.ini-line').click(function() {
    	if ($(this).hasClass('active')){
    		$(this).removeClass('active');
    	} else {
	    	$('.active').removeClass('active');
	    	$(this).addClass('active');
    	}
    });

    // -- ADD A NEW NPC/PLAYER -- //

    // Add new entry
    $('#newentry').on('click', 'button.addnew', function() {
    	var $entry_parent = $('#newentry');

    	var $entry_name = $entry_parent.find('input.newename').val();
    	var $entry_ini = $entry_parent.find('input.newini').val();

    	if ($entry_name == '') {
    		$entry_name = 'Enemy';
    	}
    	if ($entry_ini == '') {
    		$entry_ini = 0;
    	}

        // This is a hell of a line >.<
    	var $new_line = '<li class="ini-line ui-sortable-handle"><span class="location"><i class="fa fa-globe"></i></span><span class="ininame editable">' + $entry_name +'</span><span class="inivalue editable">' + $entry_ini + '</span><span class="inibuttons"><button class="tookturn">Acted</button><button class="remove">Remove</button><button class="deduct5">-5</button><button class="deduct10">-10</button><span><span class="tickbox fulldefence"><input type="checkbox" name="fulldef"></span><span class="notes"><input type="text" class="notes" placeholder="Notes"/></span></li>';
		$("#inilist").append($new_line);
    });

    // -- EDITING TEXT WITH INPUT FIELDS -- //

    // Add input field to edit on click
    $('#inilist').on('click', '.editable', handler_Editable );

    // Table Toggle Buttons
    $('#btn-iniformulas').click(function() { $('#iniformulas-box').toggle("slow"); });
    $('#btn-actioncombat').click(function() { $('#action-combat-box').toggle("slow"); });
    $('#btn-actionmatrix').click(function() { $('#action-matrix-box').toggle("slow"); });

});