<?php
if(isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])){
  $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
  $supportedLanguages=['en','de', 'fr', 'es', 'nl'];
    if(!in_array($lang,$supportedLanguages)){
       $lang = "en";
  }
}
else {
  $lang = "en";
}
require_once("localization/".$lang.".php");
?>
<!DOCTYPE html>
<!-- VeganCheck.me is Open Source
Check the project out on GitHub: 
https://github.com/jokenetwork/vegancheck.me
-->
<html lang="<?php print_r($langArray['meta']['lang']); ?>">
  <head>
    <title><?php print_r($langArray['meta']['title']); ?></title>
    <meta charset="UTF-8">

    <meta name="description" content="<?php print_r($langArray['meta']['description']); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta property="og:title" content="<?php print_r($langArray['meta']['title']); ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://vegancheck.me">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="https://vegancheck.me/img/icon-512x512.png?v=2.0.0">

    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
    <link rel="apple-touch-icon" href="img/icon.png?v=2.0.0">

    <link rel="manifest" href="img/site.webmanifest?v=1.0.1">

    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="msapplication-starturl" content="/">
    <meta name="theme-color" content="#121212">

    <meta name="application-name" content="VeganCheck">
    <meta name="apple-mobile-web-app-title" content="VeganCheck">
    <link rel="apple-touch-startup-image" href="img/iossplash.png?v=1.0.0">

    <link href="css/style.min.css?v=3.9.55" rel="stylesheet">
  </head>

  <body>
    <div class="rotate">
      <img src="img/rotatedevice.svg" alt="<?php print_r($langArray['other']['rotate']); ?>">
      <h1><?php print_r($langArray['other']['rotate']); ?></h1>
    </div>
    <noscript>
      <div class="noscript">
        <h3>VeganCheck.me only works properly with Javascript enabled. <a href="https://www.enable-javascript.com">Learn how to enable Javascript here</a>.</h3>
      </div>
    </noscript>
    <div class="container">
      <div id="main">
        <img src="img/VeganCheck.svg" alt="Logo" class="logo" id="resscroll">
        <h1>VeganCheck.me</h1>
        <p id="code"></p>

        <form action="script.php">
          <fieldset>
            <legend><?php print_r($langArray['form']['enterbarcode']); ?></legend>
            <span class="btn_scan" onclick="setupLiveReader()" aria-label="<?php print_r($langArray['form']['scanbarcode']); ?>" role="button" tabindex="0"><span class="icon-barcode"></span></span>
            <input type="number" id="barcode" name="barcode" placeholder="<?php print_r($langArray['form']['enterbarcode']); ?>" autofocus> 
            <input type="hidden" id="lang" name="lang" value="<?php print_r($lang); ?>">
            <button name="submit" aria-label="<?php print_r($langArray['form']['submit']); ?>" role="button"><span class="icon-right-open"></span></button>
          </fieldset>
        </form>
        <div class="timeout animated fadeIn" style="display:none;"><?php print_r($langArray['other']['timeout']); ?><span>.</span><span>.</span><span>.</span></div>
         <div class="timeout-final animated fadeIn" style="display:none;"><?php print_r($langArray['other']['timeoutfinal']); ?></div>
        <div id="result">&nbsp;</div> 
        <footer>
          <p><?php print_r($langArray['footer']['credits']); ?>
            <br><?php print_r($langArray['footer']['legal']); ?></p>
            <a href="https://github.com/jokenetwork/vegancheck.me"><img src="img/opensource.svg" alt="Open Source" class="labels"></a>
            <a href="https://www.thegreenwebfoundation.org/green-web-check/?url=https%3A%2F%2Fvegancheck.me"><img src="img/greenhosted.svg" alt="Hosted Green" class="labels"></a>
            <a href="https://iplantatree.org/user/VeganCheck.me"><img src="img/treelabel.svg" alt="We plant trees. We're carbon neutral." class="labels"></a>
            <a href="https://philip.media"><img src="img/pml.svg" alt="philip.media" class="labels"></a>
        </footer>
      </div>
    </div>

 <div id="controls" style="display:none;">
  <span id="close"><span class="btn-dark">&times; <?php print_r($langArray['layover']['close']); ?></span></span>
  <span id="barcodeicon"><span class="icon-barcode"></span></span>
  <div id="background"></div>
</div>

<script src="js/jquery.min.js"></script>
<script src="js/BarcodeScanner.min.js"></script>
<script src="js/app.js?v=1.0.8"></script>
<?php 
        if (isset($_COOKIE['log']) && $_COOKIE['log'] == "Yes"){
          print_r('<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts=\'{ "detailed": true }\'></script>');
        }  
        elseif (isset($_COOKIE['log']) && $_COOKIE['log'] == "No"){
          print_r('<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5"></script>');
        }  
        else{
          print_r('<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts=\'{ "detailed": true }\'></script>');
        } 
?>
  </body>
</html>