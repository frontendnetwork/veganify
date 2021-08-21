/**
 * @author Philip Brembeck
 * @version 0.0.1
 */
 
$('input[name="submit"]').on('click', function(e) {
    e.preventDefault();

    $.ajax({
        url: 'script.php',
        type: 'POST',
        data: {
            barcode: $('input[name="barcode"]').val()
        },
        success: function(result) {
            $('#result').html(result);
        }
    });
});