<!DOCTYPE html>
<!-- VeganCheck.me is Open Source
Check the project out on GitHub: 
https://github.com/philipbrembeck/vegancheck.me
-->
<html>
  <head>
    <title>Is it Vegan? - VeganCheck.me</title>
    <meta charset="UTF-8">

    <meta name="description" content="Check if a product is Vegan or not with VeganCheck.me">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta property="og:title" content="Is it Vegan? - VeganCheck.me">
    <meta property="og:type" content="">
    <meta property="og:url" content="https://vegancheck.me">

    <link rel="manifest" href="site.webmanifest">
    <link rel="apple-touch-icon" href="icon.png">

    <link href="css/style.min.css?v=3" rel="stylesheet">
    <script src="js/jquery.min.js"></script>
  </head>

  <body>
    <div class="container animated zoomIn">
      <div id="main">
        <img src="VeganCheck.svg" alt="Logo">
        <h1>VeganCheck.me</h1>

        <form action="script.php">
          <input type="text" id="barcode" name="barcode" placeholder="Enter Barcode of the product you'd like to check">
          <button name="submit"><i class="icon-right-open"></i></button>
        </form>

        <div id="result">&nbsp;</div>
        <footer>
          <p>Made with <i class="icon-love"></i> by <a href="https://philipbrembeck.com">Philip Brembeck</a>
            <br>Hosted environmentally friendly / <a href="privacy-policy">Privacy Policy</a></p>
        </footer>
      </div>
    </div>

 
  <script src="js/submit.js"></script>
<?php 
        header('Access-Control-Allow-Origin: https://analytics.vegancheck.me'); 
        if (isset($_COOKIE['log']) && $_COOKIE['log'] == "Yes"){echo '<script async src="https://analytics.vegancheck.me/tracker.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts=\'{ "detailed": true }\'></script>';}  
        elseif (isset($_COOKIE['log']) && $_COOKIE['log'] == "No"){echo '<script async src="https://analytics.vegancheck.me/tracker.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5"></script>';}  
        else{echo '<script async src="https://analytics.vegancheck.me/tracker.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts=\'{ "detailed": true }\'></script>';} 
?>
  </body>
</html>