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
  </head>
  <body>
    <div class="container">
      <div id="main">
        <img src="../img/VeganCheck.svg" alt="Logo">
        <h1>VeganCheck.me</h1>
        <p id="code"></p>

        <h3><?php echo L::other_offline; ?></h3>
        <h3><a href="/"><?php echo L::other_reload; ?></a></h3>
      </div>
    </div>
    <script>
      window.addEventListener('online', function(e) { window.location.href = "/"; });
    </script>
  </body>
</html>