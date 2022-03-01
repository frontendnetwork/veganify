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
require_once("l10n/".$lang.".php");
?>
<!DOCTYPE html>
<!-- VeganCheck.me is Open Source
Check the project out on GitHub: 
https://github.com/jokenetwork/vegancheck.me
-->
<html lang="<?php  print_r($langArray['meta']['lang']); ?>">
  <head>
    <title><?php print_r($langArray['meta']['title']); ?></title>
    <meta charset="UTF-8">

    <meta name="description" content="<?php print_r($langArray['meta']['description']); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta property="og:title" content="<?php print_r($langArray['meta']['title']); ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://vegancheck.me">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="https://vegancheck.me/img/icon-512x512.png">

    <link rel="shortcut icon" type="image/x-icon" href="../favicon.ico">
    <link rel="apple-touch-icon" href="../img/icon.png">

    <link rel="manifest" href="../img/site.webmanifest">

    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="msapplication-starturl" content="/">
    <meta name="theme-color" content="#121212">

    <meta name="application-name" content="VeganCheck">
    <meta name="apple-mobile-web-app-title" content="VeganCheck">
    <link rel="apple-touch-startup-image" href="../img/iossplash.png">

    <link href="../css/style.min.css" rel="stylesheet">
  </head>
  <body>
    <div class="container">
      <div id="main">
        <img src="../img/VeganCheck.svg" alt="Logo">
        <h1>VeganCheck.me</h1>
        <p id="code"></p>

        <h3><?php print_r($langArray['other']['offline']); ?></h3>
        <h3><a href="/"><?php print_r($langArray['other']['reload']); ?></a></h3>
      </div>
    </div>
    <script>
      window.addEventListener('online', function(e) { window.location.href = "/"; });
    </script>
  </body>
</html>