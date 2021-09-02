<?php
  $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
  $supportedLanguages=['en','de', 'fr'];
  if(!in_array($lang,$supportedLanguages)){
     $lang='en';
  }
    require("localization/".$lang.".php");

?>