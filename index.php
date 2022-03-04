<?php
require('vendor/autoload.php');
$i18n = new i18n('/var/www/virtual/jake/vegancheck.me/l10n/{LANGUAGE}.json', '/var/www/virtual/jake/vegancheck.me/langcache/', 'en');
$i18n->init();
$supportedLanguages=['en','de', 'fr', 'es', 'nl'];
$lang = $i18n->getAppliedLang();

if(!in_array($lang,$supportedLanguages)){
  header("Location: https://vegancheck.me/en");
  die();
}
else {
  header("Location: https://vegancheck.me/$lang");
  die();
}
?>