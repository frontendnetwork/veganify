/*!
 * VeganCheck.me app.js
 * https://vegancheck.me
 * https://isitvegan.io
 * Git-Repo: https://vegc.net/repo
 *
 * Includes JavaScript Only Barcode_Reader (JOB) by Eddie Larsson
 * https://github.com/EddieLa/BarcodeReader
 *
 * Copyright JokeNetwork and contributors
 * Released under the MIT license
 * https://vegc.net/license
 *
 */

function setupLiveReader(resultElement) {
    // Scroll to top
    window.location.hash = '#top';

    // Create scanner-container
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

    // Define camera facingMode once
    camera = 'environment'

    // Flip camera button
    document.getElementById('flipbutton').onclick = function() {
        if (camera == 'environment') {
            camera = 'user'
        } else if (camera == 'user') {
            camera = 'environment'
        } else {
            camera = 'environment'
        }

        // End stream and restart
        initendStream();
        startStream();
    };

    // Start the stream
    startStream();

    function startStream() {
        document.getElementById('result').style.display = 'none';

        // Scroll to top
        window.location.hash = '#top';

        // Check for the facingMode
        if (camera == 'environment' || camera == 'user') {
            var constraints = {
                audio: false,
                video: {
                    width: window.innerWidth * window.devicePixelRatio,
                    height: window.innerHeight * window.devicePixelRatio,
                    aspectRatio: { ideal: (window.innerHeight) / window.innerWidth },
                    focusMode: 'continuous',
                    facingMode: camera
                }
            };
        } else {
            camera = 'environment'
            var constraints = {
                audio: false,
                video: {
                    width: window.innerWidth * window.devicePixelRatio,
                    height: window.innerHeight * window.devicePixelRatio,
                    aspectRatio: { ideal: (window.innerHeight) / window.innerWidth },
                    focusMode: 'continuous',
                    facingMode: camera
                }
            };
        }

        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            const track = stream.getVideoTracks()[0];
            BarcodeScanner.init()
            var closer = document.getElementById('controls')
            var btnclose = document.getElementById('closebtn')
            var barcodeicon = document.getElementById('barcodeicon')
            closer.style.display = 'inline-block'

            // Torch/Flash on Android
            const btn = document.getElementById('torch');
            btn.addEventListener('click', function() {
                track.applyVideoConstraints({
                    advanced: [{ torch: powerOn }]
                });
            })

            function endStream() {
                track.stop();
            }
            initendStream = endStream;


            // When barcode is detected
            BarcodeScanner.streamCallback = function(result) {
                document.getElementById('barcode').value = result[0].Value
                barcodeicon.style.color = "#10ac84";
                barcodeicon.style.opacity = "1";
                setTimeout(function() {
                    BarcodeScanner.StopStreamDecode()
                    video.pause()
                    stream.getTracks()[0].stop()
                    container.classList.add('fadeOut')
                    closer.classList.add('fadeOut')
                    barcodeicon.style.color = "#fff";
                    barcodeicon.style.opacity = "0.4";
                }, 300);
                setTimeout(function() {
                    container.classList.remove('fadeOut')
                    closer.classList.remove('fadeOut')
                    container.style.display = 'none'
                    closer.style.display = 'none'
                }, 500);

                // Auto submit barcode
                document.getElementsByTagName('button')[0].click();
            }

            // Close stream when button is clicked
            btnclose.onclick = function(close) {
                BarcodeScanner.StopStreamDecode()
                video.pause()
                stream.getTracks()[0].stop()
                container.classList.add('fadeOut')
                closer.classList.add('fadeOut')
                setTimeout(function() {
                    container.classList.remove('fadeOut')
                    closer.classList.remove('fadeOut')
                    container.style.display = 'none'
                    closer.style.display = 'none'
                }, 1000);
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
    document.getElementById('result').style.display = 'block';
}

// Close modal on escape-key press
$(document).on('keyup', function(e) {
    if (e.key == "Escape") $('.modal_close').click();
    if (e.key == "Escape") $('#closebtn').click();
});

// Submit if parameter EAN is filled
$(document).ready(function() {
    if (window.location.href.indexOf("ean") > -1) {
        document.getElementsByTagName('button')[0].click();
    }
});

// submit.js
$('button[name="submit"]').on('click', function(e) {
    e.preventDefault();
    $(".timeout-final").css("display", "none");
    $.ajax({
        url: '../script.php',
        type: 'POST',
        timeout: 8000,
        data: {
            barcode: $('input[name="barcode"]').val(),
            lang: $('input[name="lang"]').val()
        },
        error: function() {
            $(".timeout").css("display", "none");
            $(".timeout-final").css("display", "block");
        },
        success: function(result) {
            $('#result').html(result);
            $('html, body').animate({
                scrollTop: $('#resscroll').offset().top
            }, 900, 'swing');

            // Scroll to result
            self.location.href = '#resscroll';

            $(document).on('click', function() {
                $(".container").removeClass('modalIsOpen').addClass('modalIsClosed')
                $(".modal_view").addClass('fadeOutDown')
                setTimeout(function() {
                    $(".modal_view").css("display", "none")
                    $(".modal_view").removeClass('fadeOutDown')
                    $(".modal_view").addClass('fadeInUp')
                }, 200);
            });
            $(".modal_view").on('click', function(event) {
                event.stopPropagation();
            });

            $('#nutri_modal').click(function() {
                $("#nutriscore").css("display", "block")
                $(".container").addClass('modalIsOpen').removeClass('modalIsClosed')
                event.stopPropagation();
            });
            $('.modal_close').click(function() {
                $("#nutriscore").addClass('fadeOutDown')
                $(".container").removeClass('modalIsOpen').addClass('modalIsClosed')
                setTimeout(function() {
                    $("#nutriscore").css("display", "none")
                    $("#nutriscore").removeClass('fadeOutDown')
                    $("#nutriscore").addClass('fadeInUp')
                }, 200);
            });
            $('#palm_modal').click(function() {
                $("#palmoil").css("display", "block")
                $(".container").addClass('modalIsOpen').removeClass('modalIsClosed')
                event.stopPropagation();
            });
            $('.modal_close').click(function() {
                $("#palmoil").addClass('fadeOutDown')
                $(".container").removeClass('modalIsOpen').addClass('modalIsClosed')
                setTimeout(function() {
                    $("#palmoil").removeClass('fadeOutDown')
                    $("#palmoil").addClass('fadeInUp')
                    $("#palmoil").css("display", "none")

                }, 200);
            });
            $('#processed_modal').click(function() {
                $("#processed").css("display", "block")
                $(".container").addClass('modalIsOpen').removeClass('modalIsClosed')
                event.stopPropagation();
            });
            $('.modal_close').click(function() {
                $("#processed").addClass('fadeOutDown')
                $(".container").removeClass('modalIsOpen').addClass('modalIsClosed')
                setTimeout(function() {
                    $("#processed").removeClass('fadeOutDown')
                    $("#processed").addClass('fadeInUp')
                    $("#processed").css("display", "none")

                }, 200);
            });
            $('#license_modal').click(function() {
                $("#license").css("display", "block")
                $(".container").addClass('modalIsOpen').removeClass('modalIsClosed')
                event.stopPropagation();
            });
            $('.modal_close').click(function() {
                $("#license").addClass('fadeOutDown')
                $(".container").removeClass('modalIsOpen').addClass('modalIsClosed')
                setTimeout(function() {
                    $("#license").removeClass('fadeOutDown')
                    $("#license").addClass('fadeInUp')
                    $("#license").css("display", "none")

                }, 200);
            });
        }
    });
});


// Ingredient checker
// submit.js
$('button[name="checkingredients"]').on('click', function(e) {
    e.preventDefault();
    $(".timeout-final").css("display", "none");
    $.ajax({
        url: '../ingredients_script.php',
        type: 'POST',
        timeout: 8000,
        data: {
            ingredients: $('textarea[name="ingredients"]').val(),
            lang: $('input[name="lang"]').val()
        },
        error: function() {
            $(".timeout").css("display", "none");
            $(".timeout-final").css("display", "block");
        },
        success: function(result) {
            $('#result').html(result);
            $('html, body').animate({
                scrollTop: $('#resscroll').offset().top
            }, 900, 'swing');

            // Scroll to result
            self.location.href = '#resscroll';
        }
    });
});

if (document.getElementById("shortcut")) {
    var shortcut = document.getElementById('shortcut');
    var mainpage = document.getElementById('mainpage');

    // Only show shortcut if PWA is not installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        shortcut.style.display = 'none';
        mainpage.classList.add('top');
    }

    // Only show shortcut on iOS
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (!isIOS) {
        shortcut.style.display = 'none';
        mainpage.classList.add('top');
    }

    // Don't show shortcut if the shortcut is already executed
    if (window.location.href.indexOf("shortcut") > -1) {
        shortcut.style.display = 'none';
        mainpage.classList.add('top');
    }
}

// PWA Prompt Display
if (document.getElementById("installation")) {
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    document.getElementById("pwaclose").onclick = function() {
        setCookie('pwa_install', 'true', 180);
        document.getElementById("pwainstall").style.display = 'none';
    }

    if ((getCookie('pwa_install') == "true") || (window.matchMedia('(display-mode: standalone)').matches) || (!isIOS) || (window.location.href.indexOf("shortcut") > -1)) {
        document.getElementById("pwainstall").style.display = 'none';
    } else if (isIOS) {
        document.getElementById("pwainstall").style.display = 'block';
    } else {
        document.getElementById("pwainstall").style.display = 'none';
    }

    // Installation instruction modal
    document.getElementById("getbtn").onclick = function() {
        document.getElementById("mainpage").classList.remove("modalIsClosed");
        var imodal = document.getElementById("installation");
        imodal.style.display = 'block';
        document.getElementById("mainpage").classList.add("modalIsOpen");

        document.getElementById("modal_close").onclick = function() {
            imodal.classList.add("fadeOutDown");
            document.getElementById("mainpage").classList.add("modalIsClosed");
            setTimeout(() => {
                document.getElementById("mainpage").classList.remove("modalIsOpen");
                imodal.classList.remove("fadeOutDown");
                imodal.classList.add("fadeInUp");
                imodal.style.display = 'none';
            }, 200);
        }
    }
}

// Donation Modal 
if (document.getElementById("donationmodal")) {
    document.getElementById("option_monthly").onclick = function() {
        document.getElementById("option_once").classList.remove("active");
        document.getElementById("option_gh").classList.remove("active");
        document.getElementById("option_stripe").classList.remove("active");
        document.getElementById("option_monthly").classList.add("active");
        document.getElementById("once").checked = false;
        document.getElementById("monthly").checked = true;
        document.getElementById("gh").checked = false;
        document.getElementById("stripe").checked = false;
        document.getElementById('supportbtn').setAttribute('href', 'https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536');
        document.getElementById('supportbtn').innerHTML = '<span class="icon-paypal"></span> Donate with PayPal';
        document.getElementById('vendor').innerHTML = 'PayPal';
    }
    document.getElementById("option_once").onclick = function() {
        document.getElementById("option_monthly").classList.remove("active");
        document.getElementById("option_gh").classList.remove("active");
        document.getElementById("option_stripe").classList.remove("active");
        document.getElementById("option_once").classList.add("active");
        document.getElementById("once").checked = true;
        document.getElementById("monthly").checked = false;
        document.getElementById("gh").checked = false;
        document.getElementById("stripe").checked = false;
        document.getElementById('supportbtn').setAttribute('href', 'https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536');
        document.getElementById('supportbtn').innerHTML = '<span class="icon-paypal"></span> Donate with PayPal';
        document.getElementById('vendor').innerHTML = 'PayPal';
    }
    document.getElementById("option_gh").onclick = function() {
        document.getElementById("option_monthly").classList.remove("active");
        document.getElementById("option_once").classList.remove("active");
        document.getElementById("option_stripe").classList.remove("active");
        document.getElementById("option_gh").classList.add("active");
        document.getElementById("gh").checked = true;
        document.getElementById("monthly").checked = false;
        document.getElementById("once").checked = false;
        document.getElementById("stripe").checked = false;
        document.getElementById('supportbtn').setAttribute('href', 'https://github.com/sponsors/philipbrembeck');
        document.getElementById('supportbtn').innerHTML = '<span class="icon-github-circled"></span> Sponsor on GitHub';
        document.getElementById('vendor').innerHTML = 'GitHub';
    }
    document.getElementById("option_stripe").onclick = function() {
        document.getElementById("option_monthly").classList.remove("active");
        document.getElementById("option_once").classList.remove("active");
        document.getElementById("option_gh").classList.remove("active");
        document.getElementById("option_stripe").classList.add("active");
        document.getElementById("stripe").checked = true;
        document.getElementById("monthly").checked = false;
        document.getElementById("once").checked = false;
        document.getElementById("gh").checked = false;
        document.getElementById('supportbtn').setAttribute('href', 'https://donate.stripe.com/3cs5mzgy42jd2645kk');
        document.getElementById('supportbtn').innerHTML = '<span class="icon-credit-card-alt"></span>&nbsp; Donate with Stripe';
        document.getElementById('vendor').innerHTML = 'Stripe';
    }

    document.getElementById("donate").onclick = function() {
        var modal = document.getElementById("donationmodal");
        modal.style.display = 'block';
        document.getElementById("mainpage").classList.remove("modalIsClosed");
        document.getElementById("mainpage").classList.add("modalIsOpen");

        document.getElementById("modal_close").onclick = function() {
            modal.classList.add("fadeOutDown");
            setTimeout(() => {
                document.getElementById("mainpage").classList.remove("modalIsOpen");
                document.getElementById("mainpage").classList.add("modalIsClosed");
                modal.classList.remove("fadeOutDown");
                modal.classList.add("fadeInUp");
                modal.style.display = 'none';
            }, 200);
        }
    }
}

// Initialize SW
if ('serviceWorker' in navigator) { navigator.serviceWorker.register('../sw.js'); }

// Spinner while AJAX request
var $loading = $('#spinner').hide();
$(document)
    .ajaxStart(function() {
        $('.logo').addClass('spinner');
    })
    .ajaxStop(function() {
        $('.logo').removeClass('spinner');
    });

// "Timeout"-Warning
var ajaxLoadTimeout;
$(document).ajaxStart(function() {
    ajaxLoadTimeout = setTimeout(function() {
        $(".timeout").css("display", "block");
    }, 1500);

}).ajaxSuccess(function() {
    clearTimeout(ajaxLoadTimeout);
    $(".timeout").css("display", "none");
});

// Check if user is offline
window.addEventListener('offline', function(e) { window.location.href = "/offline"; });

// Share button init
function sharebutton() {
    const title = document.title;
    const text = document.getElementById('name_sh').innerHTML + " - Checked using VeganCheck";
    const ean = document.getElementById('barcode').value;
    const url = "https://vegancheck.me/en/?ean=" + ean;

    if (navigator.share !== undefined) {
        navigator.share({
                title,
                text,
                ean,
                url
            })
            .catch(err => "");
    } else {
        window.location = `https://twitter.com/intent/tweet?url=https://vegancheck.me/en/?ean=${encodeURI(ean)}&text=${encodeURI(text)}`;
    }
}

// OCR Reader
let camera_button = document.querySelector("#ocr");
let video = document.querySelector("#video");
let close = document.querySelector("#close_ocr");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");

const width = 500;
let height = 0;
let streaming = false;
let tracks;

camera_button.addEventListener('click', async function() {
    const constraints = {
        audio: false,
        video: {
            width: window.innerWidth * window.devicePixelRatio,
            height: window.innerHeight * window.devicePixelRatio,
            aspectRatio: { ideal: (window.innerHeight) / window.innerWidth },
            focusMode: 'continuous',
            facingMode: 'environment'
        }
    }
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    const mediaStream = video.srcObject;
    tracks = mediaStream.getTracks();
    document.getElementById("controls").style.display = "block";
    video.style.display = "block";
    click_button.style.display = "block";
});

function stopBothVideoAndAudio(stream) {
    streaming = false;
    tracks[0].stop();
    click_button.innerHTML = "<span class='timeout' style='color:#FFF;'><span>.</span><span>.</span><span>.</span></span>";
    setTimeout(() => {
        document.getElementById("controls").style.display = "none";
        video.style.display = "none";
        click_button.style.display = "none";
        click_button.innerHTML = '<span class="icon-camera" id="click-photo"></span>';
    }, 500);
}

video.addEventListener(
    "canplay",
    (ev) => {
        if (!streaming) {
            height = (video.videoHeight / video.videoWidth) * width;
            video.setAttribute("width", width);
            video.setAttribute("height", height);
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            streaming = true;
        }
    },
    false
);

close.addEventListener('click', function() {
    stopBothVideoAndAudio();
});

click_button.addEventListener('click', function() {
    const context = canvas.getContext("2d");
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
    }
});


$("#click-photo").click(function() {
    stopBothVideoAndAudio();
    let img = canvas.toDataURL("image/png");
    startRecognize(img);
});

// Start recognition
function startRecognize(img) {
    recognizeFile(img);
}

function progressUpdate(packet) {
    if (packet.status == 'recognizing text') {
        document.getElementById('wait').style.display = "block";
        stopBothVideoAndAudio();
    }


    if (packet.status == 'done') {
        document.getElementById('ingredients').value = packet.data.text.replace(/\n\s*\n/g, '')
        document.getElementById('wait').style.display = "none"
        stopBothVideoAndAudio();
    }

}

function recognizeFile(file) {
    $("#log").empty();
    const corePath = window.navigator.userAgent.indexOf("Edge") > -1 ?
        'js/tesseract-core.asm.js' :
        'js/tesseract-core.wasm.js';


    const worker = new Tesseract.TesseractWorker({
        corePath,
    });

    worker.recognize(file, "eng")
        .progress(function(packet) {
            console.info(packet)
            progressUpdate(packet)

        })
        .then(function(data) {
            console.log(data)
            progressUpdate({ status: 'done', data: data })
        })
}