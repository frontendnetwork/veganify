<?php
  require('vendor/autoload.php');
  $i18n = new i18n('/var/www/virtual/jake/vegancheck.me/l10n/{LANGUAGE}.json', '/var/www/virtual/jake/vegancheck.me/langcache/', 'en');
  $i18n->init();
?>
<!DOCTYPE html>
<!-- VeganCheck.me is Open Source
Check the project out on GitHub: 
https://vegc.net/repo
-->
<html lang="<?php echo L::meta_lang; ?>">
  <head>
    <title><?php echo L::meta_title; ?></title>
    <meta charset="UTF-8">

    <meta name="description" content="<?php echo L::meta_description; ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta property="og:title" content="<?php echo L::meta_title;  ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://vegancheck.me">

    <meta name="twitter:card" content="summary">
    <meta name="twitter:image" content="https://vegancheck.me/img/icon-512x512.png?v=2.0.0">
    <meta name="twitter:image:alt" content="VeganCheck.me">

    <link rel="shortcut icon" type="image/x-icon" href="../favicon.ico">
    <link rel="apple-touch-icon" href="../img/icon.png?v=2.0.0">

    <link rel="manifest" href="../img/site.webmanifest?v=1.0.1">

    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="msapplication-starturl" content="/">
    <meta name="theme-color" content="#141414">

    <meta name="application-name" content="VeganCheck">
    <meta name="apple-mobile-web-app-title" content="VeganCheck">
    <link rel="apple-touch-startup-image" href="../img/iossplash.png?v=1.0.0">

    <link href="../css/style.min.css?v=4.0.1" rel="stylesheet">
    <link href="../node_modules/pwa-install-prompt/style.css" rel="stylesheet">
  </head>

  <body id="top">
    <div class="rotate">
      <img src="../img/rotatedevice.svg" alt="<?php echo L::other_rotate; ?>">
      <h1><?php echo L::other_rotate; ?></h1>
    </div>

    <div class="modal_view animatedfaster fadeIn" id="processed" style="display:none;">
      <div class="modal_close"><a class="btn-dark">&times;</a></div>
          <h2><?php echo L::modal_processed; ?></h2>
          <p><?php echo L::modal_processed_desc; ?></p>
    </div>

    <div class="modal_view animatedfaster fadeIn" id="license" style="display:none;">
      <div class="modal_close"><a class="btn-dark">&times;</a></div>
          <h2><?php echo L::modal_licenses; ?></h2>
          <p><?php echo L::modal_licenses_desc; ?></p>
          <p>
            &copy; VeganCheck.me Contributors and Hamed Montazeri, licensed under <a href="https://github.com/JokeNetwork/vegan-ingredients-api/blob/master/LICENSE">MIT License</a>, sourced from <a href="https://www.veganpeace.com/ingredients/ingredients.htm">VeganPeace</a>, <a href="https://www.peta.org/living/food/animal-ingredients-list/">PETA</a> and <a href="http://www.veganwolf.com/animal_ingredients.htm">The VEGAN WOLF</a>.
    </div>
    <noscript>
      <div class="noscript">
        <h3>VeganCheck.me only works properly with Javascript enabled. <a href="https://www.enable-javascript.com">Learn how to enable Javascript here</a>.</h3>
      </div>
    </noscript>

    <div class="container">
      <div id="main">
        <div class="form ingredients" id="resscroll">
          <a href="javascript:history.back();" class="icon-left-open"></a>
          <img src="../img/VeganCheck.svg" alt="Logo" class="logo">
          <h2><?php echo L::ingredients_title; ?></h2>
          <p><?php echo L::ingredients_subtitle; ?></p>
          <form action="../ingredients_script.php">
            <fieldset>
              <legend><?php echo L::ingredients_placeholder; ?></legend>
              <textarea id="ingredients" name="ingredients" placeholder="<?php echo L::ingredients_placeholder; ?>" autofocus></textarea>
              <button name="checkingredients" aria-label="<?php echo L::form_submit; ?>" role="button"><span class="icon-right-open"></span></button>
            </fieldset>
          </form>
          <div class="timeout animated fadeIn" style="display:none;"><?php echo L::other_timeout; ?><span>.</span><span>.</span><span>.</span></div>
           <div class="timeout-final animated fadeIn" style="display:none;"><?php echo L::other_timeoutfinal; ?></div>
          <div id="result">&nbsp;</div> 
      </div>
        <footer>
            <p><?php echo L::footer_credits; ?>
            <br><?php echo L::footer_legal; ?></p>
            <?php if(date('m')=="01"){echo '<a href="https://veganuary.com/try-vegan/"><img src="../img/veganuary.svg" alt="We are taking part in Veganuary" class="labels"></a>';} ?>
            <a href="https://github.com/jokenetwork/vegancheck.me"><img src="../img/opensource.svg" alt="Open Source" class="labels"></a>
            <a href="https://www.thegreenwebfoundation.org/green-web-check/?url=https%3A%2F%2Fvegancheck.me"><img src="../img/greenhosted.svg" alt="Hosted Green" class="labels"></a>
            <a href="https://iplantatree.org/user/VeganCheck.me"><img src="../img/treelabel.svg" alt="We plant trees. We're carbon neutral." class="labels"></a>
            <a href="https://philip.media"><img src="../img/pml.svg" alt="philip.media" class="labels"></a>
        </footer>
      </div>
    </div>

<script src="../node_modules/jquery/dist/jquery.min.js"></script>
<script src="../js/app.js?v=1.0.16"></script>
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