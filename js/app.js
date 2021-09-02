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
        var closer = document.getElementById('close')
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
            var canvasSetting = { x: 50, y: 20, width: 200, height: 80 }
            var rect = video.getBoundingClientRect()
            canvas.style.height = rect.height + 'px'
            canvas.style.width = rect.width + 'px'
            canvas.style.top = rect.top + 'px'
            canvas.style.left = rect.left + 'px'
            const overlayColor = 'rgba(0,0,0,0.9)'
            context.fillStyle = overlayColor
            context.fillRect(0, 0, rect.width, rect.height)
            context.clearRect(canvasSetting.x, canvasSetting.y, canvasSetting.width, canvasSetting.height)
            context.strokeStyle = '#FFF'
            context.strokeRect(canvasSetting.x, canvasSetting.y, canvasSetting.width, canvasSetting.height)
            video.play()
            BarcodeScanner.DecodeStream(video)
        }
    }).catch(function(err) {})
}
$('button[name="submit"]').on('click', function(e) { e.preventDefault();
    $.ajax({ url: 'script.php', type: 'POST', data: { barcode: $('input[name="barcode"]').val(), lang: $('input[name="lang"]').val() }, success: function(result) { $('#result').html(result); } }); });
