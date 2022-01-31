function setupLiveReader(resultElement) {
    var container = document.createElement('div')
    container.className = 'eanscanner'
    container.style.position = 'absolute'
    container.style.zIndex = '999'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.left = '0'
    container.style.top = '0'
    var canvas = document.createElement('canvas')
    var video = document.createElement('video')
    var context = canvas.getContext('2d')
    canvas.style.position = 'absolute'
    container.appendChild(canvas)
    document.body.insertBefore(container, resultElement)
    const constraints = { audio: false, video: { facingMode: 'environment' } }

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        video.width = 320
        BarcodeScanner.init()
        var closer = document.getElementById('controls')
        closer.style.display = 'inline-block'
        BarcodeScanner.streamCallback = function(result) {
            document.getElementById('barcode').value = result[0].Value
            BarcodeScanner.StopStreamDecode()
            video.pause()
            stream.getTracks()[0].stop()
            container.style.display = 'none'
            closer.style.display = 'none';
            document.getElementsByTagName('button')[0].click();
        }

        closer.onclick = function(close) {
            BarcodeScanner.StopStreamDecode()
            video.pause()
            stream.getTracks()[0].stop()
            container.style.display = 'none'
            closer.style.display = 'none';
        }

        video.setAttribute('autoplay', '')
        video.setAttribute('playsinline', '')
        video.setAttribute('style', 'width: 100%; height: 100%;')
        video.srcObject = stream
        container.appendChild(video)
        video.onloadedmetadata = function(e) {
            video.play()
            BarcodeScanner.DecodeStream(video)
        }
    }).catch(function(err) {})
}

// submit.js
$('button[name="submit"]').on('click', function(e) {
    e.preventDefault();
    $.ajax({ url: 'script.php', type: 'POST', data: { barcode: $('input[name="barcode"]').val(), lang: $('input[name="lang"]').val() }, success: function(result) { $('#result').html(result); } });
});

// Initialize SW
if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js'); }
var $loading = $('#spinner').hide();
$(document)
    .ajaxStart(function() {
        $('.logo').addClass('spinner');
    })
    .ajaxStop(function() {
        $('.logo').removeClass('spinner');
    });