<!DOCTYPE html>
<!-- VeganCheck.me is Open Source
Check the project out on GitHub: 
https://github.com/jokenetwork/vegancheck.me
-->
<html lang="en">
  <head>
    <title>Is it Vegan? - VeganCheck.me</title>
    <meta charset="UTF-8">

    <meta name="description" content="Are you unsure whether a product is vegan or not? With VeganCheck.me you can scan the bar code of an item while shopping and check whether it is vegan or not and that without a lot of other unnecessary information! Try it out now!">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta property="og:title" content="Is it Vegan? - VeganCheck.me">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://vegancheck.me">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="https://vegancheck.me/img/icon-512x512.png">

    <link rel="shortcut icon" type="image/x-icon" href="img/favicon.ico">
    <link rel="manifest" href="img/site.webmanifest">
    <link rel="apple-touch-icon" href="img/icon.png">

    <link rel="manifest" href="img/manifest.webmanifest">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="msapplication-starturl" content="/">
    <meta name="theme-color" content="#000">

    <link rel="apple-touch-startup-image" href="img/iossplash.png">

    <link href="css/style.min.css?v=3.8" rel="stylesheet">
  </head>

  <body>
    <div class="container animated zoomIn">
      <div id="main">
        <img src="img/VeganCheck.svg" alt="Logo">
        <h1>VeganCheck.me</h1>
        <p id="code"></p>

        <form action="script.php">
          <fieldset>
            <span class="btn_scan" onclick="setupLiveReader()" aria-label="Scan Barcode" role="button"><i class="icon-barcode"></i></span>
            <input type="number" id="barcode" name="barcode" placeholder="Enter product barcode" autofocus> 
            <input type="hidden" id="lang" name="lang" value="en">
            <button name="submit" aria-label="Submit" role="button"><i class="icon-right-open"></i></button>
          </fieldset>
        </form>
        <div id="result">&nbsp;</div>
        <footer>
          <p>Made with <i class="icon-vegancheck"></i> by <a href="https://philipbrembeck.com">Philip Brembeck</a> &amp; <a href="https://jokenetwork.de">JokeNetwork</a>
            <br><a href="privacy-policy">Privacy Policy</a> / <a href="impressum">Imprint</a> / <a href="//github.com/sponsors/philipbrembeck/">Sponsor</a></p>
            <a href="https://github.com/jokenetwork/vegancheck.me"><img src="img/opensource.svg" alt="Open Source" class="labels"></a>
            <a href="https://www.thegreenwebfoundation.org/green-web-check/?url=https%3A%2F%2Fvegancheck.me"><img src="img/greenhosted.svg" alt="Hosted Green" class="labels"></a>
            <a href="https://philip.media"><img src="img/pml.svg" alt="philip.media" class="labels"></a>
        </footer>
      </div>
    </div>

    <div class="pwa-install-prompt__container">
            <button class="pwa-install-prompt__overlay">Close</button>
            <div class="pwa-install-prompt">
                <div class="pwa-install-prompt__icon__container">
                    <img class="pwa-install-prompt__icon" src="img/icon.png" alt="VeganCheck">
                </div>
                <div class="pwa-install-prompt__content">
                    <h3 class="pwa-install-prompt__title">Install VeganCheck</h3>
                    <p class="pwa-install-prompt__text">Install VeganCheck on your home screen for quick and easy access when you’re on the go.</p>
                    <p class="pwa-install-prompt__guide">Just tap <svg class="pwa-install-prompt__guide__icon" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Share</title><path fill="#007AFF" d="M48.883,22.992L61.146,10.677L61.146,78.282C61.146,80.005 62.285,81.149 64,81.149C65.715,81.149 66.854,80.005 66.854,78.282L66.854,10.677L79.117,22.992C79.693,23.57 80.256,23.853 81.114,23.853C81.971,23.853 82.534,23.57 83.11,22.992C84.25,21.848 84.25,20.125 83.11,18.981L65.997,1.794C65.715,1.511 65.421,1.215 65.139,1.215C64.563,0.932 63.718,0.932 62.861,1.215C62.579,1.498 62.285,1.498 62.003,1.794L44.89,18.981C43.75,20.125 43.75,21.848 44.89,22.992C46.029,24.149 47.744,24.149 48.883,22.992ZM103.936,35.32L81.114,35.32L81.114,41.053L103.936,41.053L103.936,121.27L24.064,121.27L24.064,41.053L46.886,41.053L46.886,35.32L24.064,35.32C20.928,35.32 18.355,37.904 18.355,41.053L18.355,121.27C18.355,124.419 20.928,127.003 24.064,127.003L103.936,127.003C107.072,127.003 109.645,124.419 109.645,121.27L109.645,41.053C109.645,37.891 107.072,35.32 103.936,35.32Z" /></svg> then “Add to Home Screen”</p>
                </div>
            </div>
        </div>

  <span id="close" style="display:none;">&times; Close scanner</span>
  <script src="js/main.bundle.min.js"></script>
<?php 
        header('Access-Control-Allow-Origin: https://analytics.vegancheck.me'); 
        if (isset($_COOKIE['log']) && $_COOKIE['log'] == "Yes"){echo '<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts=\'{ "detailed": true }\'></script>';}  
        elseif (isset($_COOKIE['log']) && $_COOKIE['log'] == "No"){echo '<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5"></script>';}  
        else{echo '<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts=\'{ "detailed": true }\'></script>';} 
?>
  </body>
</html>