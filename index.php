<?php
  $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
  $supportedLanguages=['en','de', 'fr', 'es', 'nl'];
  if(!in_array($lang,$supportedLanguages)){
     $lang='en';
  }
    require("localization/".$lang.".php");

?>

<!DOCTYPE html>
<!-- VeganCheck.me is Open Source
Check the project out on GitHub: 
https://github.com/jokenetwork/vegancheck.me
-->
<html lang="<?php echo $lang; ?>">
  <head>
    <title><?php echo $title; ?></title>
    <meta charset="UTF-8">

    <meta name="description" content="<?php echo $description; ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta property="og:title" content="<?php echo $title; ?>">
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

    <link href="css/style.min.css?v=3.9.31" rel="stylesheet">
  </head>

  <body>
    <div class="rotate">
      <img src="img/rotatedevice.svg" alt="<?php echo $rotatedevice; ?>">
      <h1><?php echo $rotatedevice; ?></h1>
    </div>
    <div class="container">
      <div id="main">
        <img src="img/VeganCheck.svg" alt="Logo">
        <h1>VeganCheck.me</h1>
        <p id="code"></p>

        <form action="script.php">
          <fieldset>
            <legend><?php echo $enterbarcode; ?></legend>
            <span class="btn_scan" onclick="setupLiveReader()" aria-label="<?php echo $scanbarcode; ?>" role="button" tabindex="0"><span class="icon-barcode"></span></span>
            <input type="number" id="barcode" name="barcode" placeholder="<?php echo $enterbarcode; ?>" autofocus> 
            <input type="hidden" id="lang" name="lang" value="<?php echo $lang; ?>">
            <button name="submit" aria-label="<?php echo $submit; ?>" role="button"><span class="icon-right-open"></span></button>
          </fieldset>
        </form>
        <div id="result">&nbsp;</div> 
        <footer>
          <p><?php echo $footercredits; ?>
            <br><?php echo $footerlegal; ?></p>
            <a href="https://github.com/jokenetwork/vegancheck.me"><img src="img/opensource.svg" alt="Open Source" class="labels"></a>
            <a href="https://www.thegreenwebfoundation.org/green-web-check/?url=https%3A%2F%2Fvegancheck.me"><img src="img/greenhosted.svg" alt="Hosted Green" class="labels"></a>
            <a href="https://iplantatree.org/user/VeganCheck.me"><img src="img/treelabel.svg" alt="We plant trees. We're carbon neutral." class="labels"></a>
            <a href="https://philip.media"><img src="img/pml.svg" alt="philip.media" class="labels"></a>
        </footer>
      </div>
    </div>

     <div class="pwa-install-prompt__container">
            <button class="pwa-install-prompt__overlay"><?php echo $pwaclose; ?></button>
            <div class="pwa-install-prompt">
                <div class="pwa-install-prompt__icon__container">
                    <img class="pwa-install-prompt__icon" src="img/icon.png" alt="VeganCheck">
                </div>
                <div class="pwa-install-prompt__content">
                    <h3 class="pwa-install-prompt__title"><?php echo $pwainstall; ?></h3>
                    <p class="pwa-install-prompt__text"><?php echo $pwadescription; ?></p>
                    <p class="pwa-install-prompt__guide"><?php echo $pwainfo; ?></p>
                </div>
            </div>
        </div>
 
  <span id="close" style="display:none;">&times; <?php echo $closescanner; ?></span>
  <script src="js/main.bundle.min.js"></script>
<?php 
        header('Access-Control-Allow-Origin: https://analytics.vegancheck.me'); 
        if (isset($_COOKIE['log']) && $_COOKIE['log'] == "Yes"){echo '<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts=\'{ "detailed": true }\'></script>';}  
        elseif (isset($_COOKIE['log']) && $_COOKIE['log'] == "No"){echo '<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5"></script>';}  
        else{echo '<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts=\'{ "detailed": true }\'></script>';} 
?>
  </body>
</html>