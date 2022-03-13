/**
 * @author Philip Brembeck
 * @version 0.0.1
 * @license MIT
 * @url https://vegc.net/license
 */
 
$('button[name="submit"]').on('click', function(e) {
    e.preventDefault();

    $.ajax({
        url: 'script.php',
        type: 'POST',
        data: {
            barcode: $('input[name="barcode"]').val(),
            lang: $('input[name="lang"]').val()
        },
        success: function(result) {
            $('#result').html(result);
        }
    });
});