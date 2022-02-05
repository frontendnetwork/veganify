<?php
if(isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])){
  $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
  $supportedLanguages=['en','de', 'fr', 'es', 'nl'];
    if(!in_array($lang,$supportedLanguages)){
       header("Location: https://vegancheck.me/en");
       die();
  }
  else {
    header("Location: https://vegancheck.me/$lang");
    die();
  }
}
else {
  header("Location: https://vegancheck.me/en");
  die();
}
?>