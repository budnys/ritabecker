$.fn.goValidate = function() {
    var $form = this,
        $inputs = $form.find('input[type="text"], input[type="email"]'),
        $selects = $form.find('select'),
        $textAreas = $form.find('textarea');
  
    var validators = {
        name: {
            regex: /^[A-Za-z]{3,}$/
        },
        email: {
            regex: /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/
        },
        body: {
            regex: /^.{3,}$/
        }
    };
    var validate = function(klass, value) {
        var isValid = true,
            error = '';
            
        if (!value && /required/.test(klass)) {
            error = 'Este campo é requerido';
            isValid = false;
        } else {
            klass = klass.split(/\s/);
            $.each(klass, function(i, k){
                if (validators[k]) {
                    if (value && !validators[k].regex.test(value)) {
                        isValid = false;
                        error = validators[k].error;
                    }
                }
            });
        }
        return {
            isValid: isValid,
            error: error
        }
    };
    var showError = function($e) {
        var klass = $e.attr('class'),
            value = $e.val(),
            test = validate(klass, value);
      
        $e.removeClass('invalid');
        $('#form-error').addClass('hide');
        
        if (!test.isValid) {
            $e.addClass('invalid');
            
            if(typeof $e.data("shown") == "undefined" || $e.data("shown") == false){
               $e.popover('show');
            }
            
        }
      	else {
        	$e.popover('hide');
      	}
    };
   
    $inputs.keyup(function() {
        showError($(this));
    });
    $selects.change(function() {
        showError($(this));
    });
    $textAreas.keyup(function() {
        showError($(this));
    });
  
    $inputs.on('shown.bs.popover', function () {
  		$(this).data("shown",true);
	});
  
    $inputs.on('hidden.bs.popover', function () {
  		$(this).data("shown",false);
	});
  
    $form.submit(function(e) {
    	e.preventDefault();
    	r.clearErrors();
      
        $inputs.each(function() { /* test each input */
        	if ($(this).is('.required') || $(this).hasClass('invalid')) {
            	showError($(this));
        	}
    	});
    	$selects.each(function() { /* test each input */
        	if ($(this).is('.required') || $(this).hasClass('invalid')) {
            	showError($(this));
        	}
    	});
    	$textAreas.each(function() { /* test each input */
        	if ($(this).is('.required') || $(this).hasClass('invalid')) {
            	showError($(this));
        	}
    	});
        if ($form.find('input.invalid').length) { /* form is not valid */
            $('#form-error').toggleClass('hide');
        }

        //send the feedback e-mail
	    $.ajax({
			type: "POST",
			url: "./ext/send.php",
			data: $form.serialize(),
			success: function(data) {
				r.addMessage(data.message, false);
				//get new Captcha on success
				$('#captcha').attr('src', './ext/securimage/securimage_show.php?' + Math.random());
			},
			error: function(response) {
				r.addMessage(response.responseJSON.message, true);
			}
	    });
    });
    return this;
};

//namespace as not to pollute global namespace
var r = {
  clearErrors: function () {
    $('#messageAlert').remove();
  },
  addMessage: function(msg, isError) {
    $("form#contact-form").before('<div id="messageAlert" class="alert alert-' + (isError ? 'danger' : 'success') + '" style="margin-top: 5px;">' + $('<div/>').text(msg).html() + '</div>');
  }
};