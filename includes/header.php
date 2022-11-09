<?php
  require('/var/www/virtual/jake/vegancheck.me/vendor/autoload.php');
  $i18n = new i18n('/var/www/virtual/jake/vegancheck.me/l10n/{LANGUAGE}.json', '/var/www/virtual/jake/vegancheck.me/langcache/', 'en');
  $str = trim("$_SERVER[REQUEST_URI]", '/');
  if ($str == "en" || $str == "de" || $str == "fr" || $str == "es" || $str == "nl" || $str == "es" || $str == "zh"){
    $i18n->setForcedLang($str);
    setcookie("lang", $str, 0,'/');
  }
  elseif (isset($_COOKIE['lang'])){
    $i18n->setForcedLang($_COOKIE['lang']);
  }
  $i18n->init();
  $string = file_get_contents('/var/www/virtual/jake/vegancheck.me/includes/versions.json');
  $versions = json_decode($string);
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
    <meta name="twitter:image" content="https://vegancheck.me/img/icon-512x512.png?v=<?php echo $versions->img; ?>">
    <meta name="twitter:image:alt" content="VeganCheck.me">

    <link rel="shortcut icon" type="image/x-icon" href="../favicon.ico">
    <link rel="apple-touch-icon" href="../img/icon.png?v=<?php echo $versions->img; ?>">

    <link rel="manifest" href="../img/site.webmanifest?v=<?php echo $versions->manifest; ?>">

    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="msapplication-starturl" content="/">
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#7f8fa6">
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#141414">

    <meta name="application-name" content="VeganCheck">
    <meta name="apple-mobile-web-app-title" content="VeganCheck">
    <link rel="apple-touch-startup-image" href="../img/iossplash.png?v=<?php echo $versions->img; ?>">

    <link href="../css/style.min.css?v=<?php echo $versions->css; ?>" rel="stylesheet">