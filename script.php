<?php
// Vegan: https://world.openfoodfacts.org/api/v0/product/4251105509585.json
// Vegan uknown: https://world.openfoodfacts.org/api/v0/product/4008638170726.json
// Not vegan: 5000159404259

$barcode = $_POST['barcode'];
$lang = $_POST['lang'];

if (!empty($lang)){
  require("localization/script/".$lang.".php");
}
else {
  require("localization/script/en.php"); 
}
?>