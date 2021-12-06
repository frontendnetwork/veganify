<?php
// Vegan: https://world.openfoodfacts.org/api/v0/product/4251105509585.json
// Vegan uknown: https://world.openfoodfacts.org/api/v0/product/4008638170726.json
// Not vegan: 5000159404259

$barcode = $_POST['barcode'];
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
$supportedLanguages=['en','de', 'fr', 'es', 'nl'];
  if(!in_array($lang,$supportedLanguages)){
     $lang='en';
}

if (!empty($lang)){
  require("localization/script/".$lang.".php");
}

if (empty($barcode)){
  echo '<span class="animated fadeIn">'.$invalidrequest.'</span>';
}

else {
  $data = file_get_contents('https://world.openfoodfacts.org/api/v0/product/'.$barcode);
  $product = json_decode($data);
  $beautydata = file_get_contents('https://world.openbeautyfacts.org/api/v0/product/'.$barcode);
  $beautyproduct = json_decode($beautydata);

  if(empty($product->product) && !empty($beautyproduct->product)) {
    $api = 'https://world.openbeautyfacts.org/api/v0/product/';
    $baseuri = "https://world.openbeautyfacts.org";
  }
  elseif(!empty($product->product) && empty($beautyproduct->product)) {
    $api = 'https://world.openfoodfacts.org/api/v0/product/';
    $baseuri = "https://world.openfoodfacts.org";
  }
  else {
    echo '<div class="animated fadeIn"><span>'.$notindb.'</span><p class="missing">'.$addit.' <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">'.$addonoff.'</a>.</p></div>';
  }

  $data = file_get_contents($api.$barcode);
  $product = json_decode($data);

  if (!empty($product->product)) {
    $array = $product->product->ingredients_analysis_tags;
    $name = $product->product->product_name;
    $response = $product->status_verbose;
    $nutriscore = $product->product->nutriscore_grade;

    if(isset($array)){

      if($nutriscore == "a"){
        $nutriscore = '<span class="vegan">Nutriscore A<span class="icon-ok"></span> </span>';
      }
      elseif($nutriscore == "b"){
        $nutriscore = '<span class="vegan">Nutriscore B<span class="icon-ok"></span> </span>';
      }
      elseif($nutriscore == "c"){
        $nutriscore = '<span class="vegan">Nutriscore C<span class="icon-ok"></span> </span>';
      }
      elseif($nutriscore == "d"){
        $nutriscore = '<span class="non-vegan">Nutriscore D<span class="icon-cancel"></span> </span>';
      }
      elseif($nutriscore == "e"){
        $nutriscore = '<span class="non-vegan">Nutriscore E<span class="icon-cancel"></span> </span>';
      }
      elseif(empty($nutriscore)){
        $nutriscore = null;
      }
      else {
        $nutriscore = '<span class="unknown">Nutriscore '.$unknown.'<span class="icon-help"></span> </span>';
      }

      if (in_array("en:palm-oil", $array)) {
        $palmoil = '<span class="non-vegan"> '.$containspalmoil.'<span class="icon-cancel"></span> </span>';
      }
      elseif (in_array("en:palm-oil-free", $array)) {
        $palmoil = '<span class="vegan"> '.$nopalmoil.'<span class="icon-ok"></span> </span>';
      }
      else {
        $palmoil = '<span class="unknown"> '.$palmoilunknown.'<span class="icon-help"></span> </span>';
      }

        if (in_array("en:non-vegan", $array)) {
            echo '<div class="animated fadeIn"><span class="non-vegan">"<span class="name">'.$name.'</span>":<br>'.$notvegan.'<span class="icon-cancel"></span> </span>'.$palmoil.$nutriscore.'<br><a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.urlencode($name).$tweettext.'" class="btn-dark" id="tweet"><span class="icon-twitter"></span> Tweet</a><a href="'.$baseuri.'/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark"><span class="icon-pencil"></span> '.$edit.'</a></div>';
        }
        elseif (in_array("en:vegan-status-unknown", $array) || in_array("en:maybe-vegan", $array)) {
            echo  '<div class="animated fadeIn"><span class="unknown">"<span class="name">'.$name.'</span>":<br>Vegan<span class="icon-help"></span> </span>'.$palmoil.$nutriscore.'<br><a href="'.$baseuri.'/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark"><span class="icon-pencil"></span> '.$edit.'</a></div>';
        }
        elseif (in_array("en:vegan", $array)) {
          echo '<div class="animated fadeIn"><span class="vegan">"<span class="name">'.$name.'</span>":<br>'.$vegan.'<span class="icon-ok"></span> </span>'.$palmoil.$nutriscore.'<br><a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.urlencode($name).$tweettextvegan.'" class="btn-dark" id="tweet"><span class="icon-twitter"></span> Tweet</a><a href="'.$baseuri.'/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark"><span class="icon-pencil"></span> '.$edit.'</a></div>';
        }
        elseif ($response == "no code or invalid code"){
          echo '<div class="animated fadeIn"><span class="missing">'.$invalidscan.'</span></div>';
        }
        else {
          echo '<div class="animated fadeIn"><span>'.$notindb.'</span><p class="missing">'.$addit.' <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">'.$addonoff.'</a>.</p></div>';
        }
    }
    else {
      echo '<div class="animated fadeIn"><span>'.$missinginfo.'</span><p class="missing">'.$addinfo.' <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">'.$editonoff.'</a>.</p></span></div>'; 
    }

  }
  else {
    echo '<div class="animated fadeIn"><span>'.$notindb.'</span><p class="missing">'.$addit.' <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">'.$addonoff.'</a>.</p></div>';
  }
}
?>