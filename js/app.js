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
    let container = document.createElement('div')
    container.className = 'eanscanner'
    container.style.position = 'absolute'
    container.style.zIndex = '999'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.left = '0'
    container.style.top = '0'
    let canvas = document.createElement('canvas')
    let video = document.createElement('video')
    let context = canvas.getContext('2d')
    canvas.style.position = 'absolute'
    container.appendChild(canvas)
    document.body.insertBefore(container, resultElement)

    // Define camera facingMode once
    let camera = 'environment'

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
            let closer = document.getElementById('controls')
            let btnclose = document.getElementById('closebtn')
            let barcodeicon = document.getElementById('barcodeicon')
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

            // Share button init
            if (document.getElementById("share")) {
                const title = document.title;
                const text = document.getElementById('name_sh').innerHTML + " - Checked using VeganCheck";
                const ean = document.getElementById('barcode').value;
                const url = "https://vegancheck.me/en/?ean=" + ean;

                if (navigator.share == undefined) {
                    document.getElementById("share").setAttribute("data-toggle", "modal");
                    document.getElementById("share").setAttribute("data-target", "sharemodal");
                    document.getElementById("share").removeAttribute("onclick");

                    // Copy
                    document.getElementById("copy").addEventListener('click', function handleClick() { navigator.clipboard.writeText(text+": "+url); document.querySelector('.btn-dark').click(); });

                    // Twitter
                    document.getElementById("twitter").addEventListener('click', function handleClick() {window.location = `https://twitter.com/intent/tweet?url=https://vegancheck.me/en/?ean=${encodeURI(ean)}&text=${encodeURI(text)}`; document.querySelector('.btn-dark').click();});

                    // WhatsApp
                    document.getElementById("whatsapp").addEventListener('click', function handleClick() {window.location = `whatsapp://send?text=https://vegancheck.me/en/?ean=${encodeURI(ean)}`+` `+`${encodeURI(text)}`; document.querySelector('.btn-dark').click();});

                    // Facebook
                    document.getElementById("facebook").addEventListener('click', function handleClick() {window.location = `https://www.facebook.com/sharer/sharer.php?u=https://vegancheck.me/en/?ean=${encodeURI(ean)}`; document.querySelector('.btn-dark').click();});

                    // Message
                    document.getElementById("message").addEventListener('click', function handleClick() {window.location = `sms:&body=https://vegancheck.me/en/?ean=${encodeURI(ean)}`+` `+`${encodeURI(text)}`; document.querySelector('.btn-dark').click();});

                    // E-Mail
                    document.getElementById("email").addEventListener('click', function handleClick() {window.location = `mailto:?body="https://vegancheck.me/en/ean=${ean}"&subject=${text}`; document.querySelector('.btn-dark').click();});

                    // Telegram
                    document.getElementById("telegram").addEventListener('click', function handleClick() {window.location = `https://telegram.me/share/url?url=https://vegancheck.me/en/?ean=${encodeURI(ean)}&text=${encodeURI(text)}`; document.querySelector('.btn-dark').click();});



                } else {
                    document.getElementById("share").addEventListener('click', function handleClick() {
                        navigator.share({
                                title,
                                text,
                                ean,
                                url
                            })
                            .catch(err => "");
                    });
                }
            }

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
    let shortcut = document.getElementById('shortcut');
    let mainpage = document.getElementById('mainpage');

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
}

// Donation Modal 
if (document.getElementById("donationmodal")) {
    document.getElementById("option_monthly").onclick = function() {
        document.getElementById("option_kofi").classList.remove("active");
        document.getElementById("option_once").classList.remove("active");
        document.getElementById("option_gh").classList.remove("active");
        document.getElementById("option_stripe").classList.remove("active");
        document.getElementById("option_monthly").classList.add("active");
        document.getElementById("once").checked = false;
        document.getElementById("monthly").checked = true;
        document.getElementById("gh").checked = false;
        document.getElementById("stripe").checked = false;
        document.getElementById("kofi").checked = false;
        document.getElementById('supportbtn').setAttribute('href', 'https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536');
        document.getElementById('supportbtn').innerHTML = '<span class="icon-paypal"></span> Donate with PayPal';
        document.getElementById('vendor').innerHTML = 'PayPal';
    }
    document.getElementById("option_once").onclick = function() {
        document.getElementById("option_kofi").classList.remove("active");
        document.getElementById("option_monthly").classList.remove("active");
        document.getElementById("option_gh").classList.remove("active");
        document.getElementById("option_stripe").classList.remove("active");
        document.getElementById("option_once").classList.add("active");
        document.getElementById("once").checked = true;
        document.getElementById("monthly").checked = false;
        document.getElementById("gh").checked = false;
        document.getElementById("stripe").checked = false;
        document.getElementById("kofi").checked = false;
        document.getElementById('supportbtn').setAttribute('href', 'https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536');
        document.getElementById('supportbtn').innerHTML = '<span class="icon-paypal"></span> Donate with PayPal';
        document.getElementById('vendor').innerHTML = 'PayPal';
    }
    document.getElementById("option_gh").onclick = function() {
        document.getElementById("option_kofi").classList.remove("active");
        document.getElementById("option_monthly").classList.remove("active");
        document.getElementById("option_once").classList.remove("active");
        document.getElementById("option_stripe").classList.remove("active");
        document.getElementById("option_gh").classList.add("active");
        document.getElementById("gh").checked = true;
        document.getElementById("monthly").checked = false;
        document.getElementById("once").checked = false;
        document.getElementById("stripe").checked = false;
        document.getElementById("kofi").checked = false;
        document.getElementById('supportbtn').setAttribute('href', 'https://github.com/sponsors/philipbrembeck');
        document.getElementById('supportbtn').innerHTML = '<span class="icon-github-circled"></span> Sponsor on GitHub';
        document.getElementById('vendor').innerHTML = 'GitHub';
    }
    document.getElementById("option_stripe").onclick = function() {
        document.getElementById("option_kofi").classList.remove("active");
        document.getElementById("option_monthly").classList.remove("active");
        document.getElementById("option_once").classList.remove("active");
        document.getElementById("option_gh").classList.remove("active");
        document.getElementById("option_stripe").classList.add("active");
        document.getElementById("stripe").checked = true;
        document.getElementById("monthly").checked = false;
        document.getElementById("once").checked = false;
        document.getElementById("gh").checked = false;
        document.getElementById("kofi").checked = false;
        document.getElementById('supportbtn').setAttribute('href', 'https://donate.stripe.com/3cs5mzgy42jd2645kk');
        document.getElementById('supportbtn').innerHTML = '<span class="icon-credit-card-alt"></span>&nbsp; Donate with Stripe';
        document.getElementById('vendor').innerHTML = 'Stripe';
    }
    document.getElementById("option_kofi").onclick = function() {
        document.getElementById("option_monthly").classList.remove("active");
        document.getElementById("option_once").classList.remove("active");
        document.getElementById("option_gh").classList.remove("active");
        document.getElementById("option_stripe").classList.remove("active");
        document.getElementById("option_kofi").classList.add("active");
        document.getElementById("kofi").checked = true;
        document.getElementById("stripe").checked = false;
        document.getElementById("monthly").checked = false;
        document.getElementById("once").checked = false;
        document.getElementById("gh").checked = false;
        document.getElementById('supportbtn').setAttribute('href', 'https://ko-fi.com/vegancheck');
        document.getElementById('supportbtn').innerHTML = '<svg viewBox="0 0 25 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;width:1em;margin-right: 0.2em;text-align: center;text-transform: none;line-height: 1em;margin-left: 0.2em;"><g id="ArtBoard1" transform="matrix(0.964946,0,0,0.898431,0.0552102,-7.08779)"><rect x="-0.057" y="7.889" width="24.977" height="17.024" style="fill:none;"/><clipPath id="_clip1"><rect x="-0.057" y="7.889" width="24.977" height="17.024"/></clipPath><g clip-path="url(#_clip1)"><g transform="matrix(1.03633,0,0,1.11305,0.0143001,3.06776)"><path d="M23.881,8.948C23.108,4.863 19.022,4.355 19.022,4.355L0.723,4.355C0.119,4.355 0.044,5.153 0.044,5.153C0.044,5.153 -0.038,12.477 0.022,16.975C0.186,19.399 2.608,19.647 2.608,19.647C2.608,19.647 10.875,19.624 14.574,19.598C17.012,19.172 17.257,17.032 17.232,15.864C21.584,16.104 24.654,13.033 23.881,8.948ZM12.819,12.459C11.573,13.912 8.808,16.435 8.808,16.435C8.808,16.435 8.687,16.554 8.498,16.458C8.422,16.401 8.39,16.368 8.39,16.368C7.947,15.927 5.022,13.319 4.356,12.414C3.647,11.449 3.315,9.714 4.265,8.704C5.216,7.694 7.27,7.618 8.628,9.111C8.628,9.111 10.193,7.329 12.096,8.148C14,8.968 13.928,11.159 12.819,12.459ZM18.992,12.937C18.064,13.053 17.31,12.965 17.31,12.965L17.31,7.284L19.08,7.284C19.08,7.284 21.051,7.835 21.051,9.922C21.051,11.835 20.066,12.589 18.992,12.937Z" style="fill:white;fill-rule:nonzero;"/></g></g></g></svg>&nbsp; Donate with Ko-Fi';
        document.getElementById('vendor').innerHTML = 'Ko-Fi.com';
    }
}

// Initialize SW
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('../sw.js');
    });
}

// Spinner while AJAX request
let $loading = $('#spinner').hide();
$(document)
    .ajaxStart(function() {
        $('.logo').addClass('spinner');
    })
    .ajaxStop(function() {
        $('.logo').removeClass('spinner');
    });

// "Timeout"-Warning
let ajaxLoadTimeout;
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

if (document.getElementById("ocr")) {
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

}

// OLED function
if (localStorage.getItem("oled") === "true") {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute("data-theme", "oled");
        document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]').setAttribute("content", "#000");
        if (document.getElementById("oled-switch")) {
            document.getElementById('oled-switch').checked = true;
        }
    }
}

if (document.getElementById("oled-switch")) {
    let oled = document.getElementById('oled-switch');
    let info = document.getElementById('cookieinfo');
    let error = document.getElementById('oledinfo');

    error.style.display = "none";

    oled.onclick = function() {
        if (localStorage.getItem("oled") === "false" || localStorage.getItem("oled") === null) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute("data-theme", "oled");
                document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]').setAttribute("content", "#000");
                localStorage.setItem('oled', 'true');
                error.style.display = "none";
                info.style.display = "block";
            } else {
                oled.checked = false;
                oled.classList.add("animated");
                oled.classList.add("shake");
                info.style.display = "none";
                error.style.display = "block";
                error.classList.add("animated");
                error.classList.add("fadeIn");
                setTimeout(() => {
                    oled.classList.remove("animated");
                    oled.classList.remove("shake");
                }, 300);
            }
        } else {
            localStorage.clear();
            document.documentElement.removeAttribute("data-theme");
            document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]').setAttribute("content", "#141414");
        }
    };
}

// Modal
document.addEventListener('click', function(e) {
    e = e || window.event;
    let target = e.target || e.srcElement;

    if (target.hasAttribute('data-toggle') && target.getAttribute('data-toggle') == 'modal') {
        if (target.hasAttribute('data-target')) {
            let m_ID = target.getAttribute('data-target');
            let modal = document.getElementById(m_ID);
            document.getElementById(m_ID).classList.add('open');
            document.getElementById("mainpage").classList.remove("modalIsClosed");
            document.getElementById("mainpage").classList.add("modalIsOpen");
            e.preventDefault();

            modal.addEventListener("touchstart", startTouch, false);
            modal.addEventListener("touchmove", moveTouch, false);

            // Swipe Up / Down / Left / Right
            let initialX = null;
            let initialY = null;

            function startTouch(e) {
                initialX = e.touches[0].clientX;
                initialY = e.touches[0].clientY;
            };

            function moveTouch(e) {
                if (initialX === null) {
                    return;
                }

                if (initialY === null) {
                    return;
                }

                let currentX = e.touches[0].clientX;
                let currentY = e.touches[0].clientY;

                let diffX = initialX - currentX;
                let diffY = initialY - currentY;

                if (Math.abs(diffX) < Math.abs(diffY)) {
                    // sliding vertically
                    if (diffY < 0) {
                        document.querySelector('.btn-dark').click();
                    }
                }

                initialX = null;
                initialY = null;
            };
        }
    }

    // Close modal window with 'data-dismiss' attribute or when the backdrop is clicked
    if ((target.hasAttribute('data-dismiss') && target.getAttribute('data-dismiss') == 'modal') || target.classList.contains('modalIsOpen') || target.classList.contains('form')) {
        let modal = document.querySelector('[class="modal_view animatedfaster fadeInUp open"]');
        modal.classList.add("fadeOutDown");
        setTimeout(() => {
            document.getElementById("mainpage").classList.remove("modalIsOpen");
            document.getElementById("mainpage").classList.add("modalIsClosed");
            modal.classList.remove("fadeOutDown");
            modal.classList.add("fadeInUp");
            modal.classList.remove('open');
        }, 200);
        e.preventDefault();
    }
}, false);

document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelector('.btn-dark').click();
    }
});