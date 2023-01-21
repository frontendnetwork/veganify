<?php
  require('/var/www/virtual/jake/vegancheck.me/vendor/autoload.php');
  $i18n = new i18n('/var/www/virtual/jake/vegancheck.me/l10n/{LANGUAGE}.json', '/var/www/virtual/jake/vegancheck.me/langcache/', 'en');
  $str = trim("$_SERVER[REQUEST_URI]", '/');
  if (isset($_COOKIE['lang'])){
    $i18n->setForcedLang($_COOKIE['lang']);
  }
  else {
    if ($str == "en" || $str == "de" || $str == "fr" || $str == "es" || $str == "nl" || $str == "es" || $str == "zh"){
      $i18n->setForcedLang($str);
      setcookie("lang", $str, 0,'/');
    }
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
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

    <meta property="og:title" content="<?php echo L::meta_title;  ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://vegancheck.me">

    <meta name="twitter:card" content="summary">
    <meta name="twitter:image" content="https://vegancheck.me/img/icon-512x512.png?v=<?php echo $versions->img; ?>">
    <meta name="twitter:image:alt" content="VeganCheck.me">

    <link rel="shortcut icon" type="image/x-icon" href="../favicon.ico?v=<?php echo $versions->img; ?>">
    <link rel="apple-touch-icon" href="../img/icon.png?v=<?php echo $versions->img; ?>">

    <link rel="manifest" href="../img/site.webmanifest?v=<?php echo $versions->manifest; ?>">

    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="msapplication-starturl" content="/">
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#7f8fa6">
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#141414">

    <link rel="alternate" href="https://vegancheck.me/de" hreflang="de">
    <link rel="alternate" href="https://vegancheck.me/en" hreflang="en">
    <link rel="alternate" href="https://vegancheck.me/es" hreflang="es">
    <link rel="alternate" href="https://vegancheck.me/fr" hreflang="fr">
    <link rel="alternate" href="https://vegancheck.me/nl" hreflang="nl">
    <link rel="alternate" href="https://vegancheck.me/zh" hreflang="zh">

    <meta name="application-name" content="VeganCheck">
    <meta name="apple-mobile-web-app-title" content="VeganCheck">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="../img/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png?v=<?php echo $versions->img; ?>">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="../img/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png?v=<?php echo $versions->img; ?>">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="../img/splash_screens/iPhone_14_Pro_portrait.png?v=<?php echo $versions->img; ?>">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="../img/splash_screens/iPhone_14_Pro_Max_portrait.png?v=<?php echo $versions->img; ?>">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="../img/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png?v=<?php echo $versions->img; ?>">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="../img/splash_screens/iPhone_11__iPhone_XR_portrait.png?v=<?php echo $versions->img; ?>">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="../img/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png?v=<?php echo $versions->img; ?>">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="../img/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png?v=<?php echo $versions->img; ?>">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="../img/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png?v=<?php echo $versions->img; ?>">

    <link href="../css/style.min.css?v=<?php echo $versions->css; ?>" rel="stylesheet">