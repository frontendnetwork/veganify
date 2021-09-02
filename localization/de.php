<!DOCTYPE html>
<!-- VeganCheck.me is Open Source
Check the project out on GitHub: 
https://github.com/jokenetwork/vegancheck.me
-->
<html lang="de">
  <head>
    <title>Ist es Vegan? - VeganCheck.me</title>
    <meta charset="UTF-8">

    <meta name="description" content="Mit VeganCheck.me kannst du den Barcode von einem Produkt scannen und überprüfen, ob es vegan ist oder nicht!">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta property="og:title" content="Ist es Vegan? - VeganCheck.me">
    <meta property="og:type" content="">
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

    <link href="css/style.min.css?v=3.1" rel="stylesheet">
  </head>

  <body>
    <div class="container animated zoomIn">
      <div id="main">
        <img src="img/VeganCheck.svg" alt="Logo">
        <h1>VeganCheck.me</h1>
        <p id="code"></p>

        <form action="script.php">
          <fieldset>
            <span class="btn_scan" onclick="setupLiveReader()" aria-label="Barcode scannen" role="button" tabindex="0"><i class="icon-barcode"></i></span>
            <input type="number" id="barcode" name="barcode" placeholder="Barcode eingeben" autofocus> 
            <input type="hidden" id="lang" name="lang" value="de">
            <button name="submit" aria-label="Absenden" role="button"><i class="icon-right-open"></i></button>
          </fieldset>
        </form>
        <div id="result">&nbsp;</div> 
        <footer>
          <p>Mit <i class="icon-love"></i> erstellt von <a href="https://philipbrembeck.com">Philip Brembeck</a> &amp; <a href="https://jokenetwork.de">JokeNetwork</a>
            <br><a href="privacy-policy">Datenschutzerklärung</a> / <a href="impressum">Impressum</a> / <a href="//github.com/sponsors/philipbrembeck/">Sponsor werden</a></p>
            <a href="https://github.com/philipbrembeck/vegancheck.me"><img src="img/opensource.svg" alt="Open Source" class="labels"></a>
            <a href="https://www.thegreenwebfoundation.org/green-web-check/?url=https%3A%2F%2Fvegancheck.me"><img src="img/greenhosted.svg" alt="Hosted Green" class="labels"></a>
        </footer>
      </div>
    </div>
 
  <span id="close" style="display:none;">&times; Scanner schließen</span>
  <script src="js/main.bundle.min.js"></script>
<?php 
        header('Access-Control-Allow-Origin: https://analytics.vegancheck.me'); 
        if (isset($_COOKIE['log']) && $_COOKIE['log'] == "Yes"){echo '<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts=\'{ "detailed": true }\'></script>';}  
        elseif (isset($_COOKIE['log']) && $_COOKIE['log'] == "No"){echo '<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5"></script>';}  
        else{echo '<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts=\'{ "detailed": true }\'></script>';} 
?>
  </body>
</html>