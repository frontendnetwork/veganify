<?php
// Vegan: https://world.openfoodfacts.org/api/v0/product/4251105509585.json
// Vegan uknown: https://world.openfoodfacts.org/api/v0/product/4008638170726.json
// Not vegan: 5000159404259

$barcode = $_POST['barcode'];
$ticket = uniqid();

// Language detection 
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
$supportedLanguages=['en','de', 'fr', 'es', 'nl'];
  if(!in_array($lang,$supportedLanguages)){
     $lang='en';
}

if (!empty($lang)){
  require_once("localization/".$lang.".php");
}

// Open Issue on GitHub when error occurs
$openissue = '<a href="https://github.com/JokeNetwork/vegancheck.me/issues/new?assignees=philipbrembeck&labels=bug&body='.urlencode('Error ticket #'.$ticket.' (Please always include this number!) - Please describe your issue:').'" target="_blank" class="btn-dark">'.$langArray['results']['reporterror'].'</a>';

// Barcode is empty
if (empty($barcode)){
  echo '<span class="animated fadeIn"><div class="resultborder">'.$langArray['results']['invalid'].'<br>'.$openissue.'</div></span>';
}

// Barcode is not empty
else {
  $data = file_get_contents('https://world.openfoodfacts.org/api/v0/product/'.$barcode);
  $product = json_decode($data);
  $beautydata = file_get_contents('https://world.openbeautyfacts.org/api/v0/product/'.$barcode);
  $beautyproduct = json_decode($beautydata);

  // When to use OpenBeautyFacts & when to use OpenFoodFacts
  if(empty($product->product) && !empty($beautyproduct->product)) {
    $api = 'https://world.openbeautyfacts.org/api/v0/product/';
    $baseuri = "https://world.openbeautyfacts.org";
    $apiname = 'OBF';
  }
  elseif(!empty($product->product) && empty($beautyproduct->product)) {
    $api = 'https://world.openfoodfacts.org/api/v0/product/';
    $baseuri = "https://world.openfoodfacts.org";
    $apiname = 'OFF';
  }
  else {
    $api = 'https://world.openfoodfacts.org/api/v0/product/';
    $baseuri = "https://world.openfoodfacts.org";
    $apiname = 'OFF-else';
  }

  $data = file_get_contents($api.$barcode);
  $product = json_decode($data);

  // Start JSON array request
  if (!empty($product->product)) {
    $array = $product->product->ingredients_analysis_tags;
    $name = $product->product->product_name;
    $genericname = $product->product->generic_name; 
    $response = $product->status_verbose;
    $nutriscore = $product->product->nutriscore_grade;

    // Check for non-animal-tested products
    if($apiname == "OBF"){
      if(isset($product->product->labels_tags)){
        if(in_array("en:not-tested-on-animals", $product->product->labels_tags) || in_array("de:ohne-tierversuche", $product->product->labels_tags) || in_array("en:cruelty-free", $product->product->labels_tags) || in_array("fr:cruelty-free", $product->product->labels_tags) || in_array("en:cruelty-free-international", $product->product->labels_tags)){
          $animaltestfree = '<span class="vegan"> '.$langArray['results']['animaltestfree'].'<span class="icon-ok"></span> </span>';
        }
        else {
          $animaltestfree = null;
        }
      }
      else {
        $animaltestfree = null;
      }
    }
    else {
      $animaltestfree = null;
    }

    // Check if $name is given or $genericname is given
    if(empty($name) && !empty($genericname)){
      $name = $genericname;
    }
    elseif(empty($genericname) && empty($name)){
      $name = $langArray['results']['unknown'];
    }

      // Set palmoil as unknown before checking it, to display "unknown" in case of no API response
      $palmoil = '<span class="unknown"> '.$langArray['results']['palmoilunknown'].'<span class="icon-help"></span> </span>';

      // Set vegetarian as unknown before checking it
      $vegetarian = '<span class="unknown">'.$langArray['results']['vegetarian'].'<span class="icon-help"></span> </span>';

      // Checks for the nutriscore
      if($nutriscore == "a"){
        $nutriscore = '<span class="nutri_a">Nutriscore A<span class="icon-ok"></span> </span>';
      }
      elseif($nutriscore == "b"){
        $nutriscore = '<span class="nutri_b">Nutriscore B<span class="icon-ok"></span> </span>';
      }
      elseif($nutriscore == "c"){
        $nutriscore = '<span class="nutri_c">Nutriscore C<span class="icon-ok"></span> </span>';
      }
      elseif($nutriscore == "d"){
        $nutriscore = '<span class="nutri_d">Nutriscore D<span class="icon-cancel"></span> </span>';
      }
      elseif($nutriscore == "e"){
        $nutriscore = '<span class="nutri_e">Nutriscore E<span class="icon-cancel"></span> </span>';
      }
      elseif($apiname == "OBF"){
        $nutriscore = null;
      }
      else {
        $nutriscore = '<span class="unknown">Nutriscore '.$langArray['results']['unknown'].'<span class="icon-help"></span> </span>';
      }

    if(isset($array)){
      // Checks for the palm-oil status
      // Needs to be after isset($array) because it checks within the array 
      if (in_array("en:palm-oil", $array)) {
        $palmoil = '<span class="non-vegan"> '.$langArray['results']['containspalmoil'].'<span class="icon-cancel"></span> </span>';
      }
      elseif (in_array("en:palm-oil-free", $array)) {
        $palmoil = '<span class="vegan"> '.$langArray['results']['nopalmoil'].'<span class="icon-ok"></span> </span>';
      }
      else {
        $palmoil = '<span class="unknown"> '.$langArray['results']['palmoilunknown'].'<span class="icon-help"></span> </span>';
      }

      // Checks for the vegetarian status  
      if (in_array("en:non-vegetarian", $array)) {
        $vegetarian = '<span class="non-vegan">'.$langArray['results']['notvegetarian'].'<span class="icon-help"></span> </span>';
      }
      elseif (in_array("en:vegetarian", $array)) {
        $vegetarian = '<span class="vegan">'.$langArray['results']['vegetarian'].'<span class="icon-ok"></span> </span>';
      }
      else {
        $vegetarian = '<span class="unknown">'.$langArray['results']['vegetarian'].'<span class="icon-help"></span> </span>';
      }

        // if not vegan
        if (in_array("en:non-vegan", $array)) {
            echo '<div class="animated fadeIn">
                    <div class="resultborder">
                      <span class="non-vegan">  
                        <span class="name">"'.$name.'":</span>
                      </span>
                      <span class="non-vegan">'.$langArray['results']['notvegan'].'<span class="icon-cancel"></span></span>'.$vegetarian.$animaltestfree.$palmoil.$nutriscore.'
                      <a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.urlencode($name).$langArray['results']['tweettext'].'" class="btn-dark" id="tweet"><span class="icon-twitter"></span> Tweet</a>
                      <a href="'.$baseuri.'/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark"><span class="icon-pencil"></span> '.$langArray['results']['edit'].'</a>
                    </div>
                  </div>';
        }
        // if vegan status unknown
        elseif (in_array("en:vegan-status-unknown", $array) || in_array("en:maybe-vegan", $array)) {
            echo  '<div class="animated fadeIn">
                    <div class="resultborder">
                      <span class="unknown">
                        <span class="name">"'.$name.'":</span>
                      </span>
                      <span class="unknown">'.$langArray['results']['vegan'].'<span class="icon-help"></span> </span>'.$vegetarian.$animaltestfree.$palmoil.$nutriscore.'
                      <a href="'.$baseuri.'/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark"><span class="icon-pencil"></span> '.$langArray['results']['edit'].'</a>
                    </div>
                  </div>';
        }
        // if vegan
        elseif (in_array("en:vegan", $array)) {
          echo '<div class="animated fadeIn">
                  <div class="resultborder">
                    <span class="vegan">
                      <span class="name">"'.$name.'":</span>
                    </span>
                    <span class="vegan">'.$langArray['results']['vegan'].'<span class="icon-ok"></span> </span>'.$vegetarian.$animaltestfree.$palmoil.$nutriscore.'
                    <a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.urlencode($name).$langArray['results']['tweettextvegan'].'" class="btn-dark" id="tweet"><span class="icon-twitter"></span> Tweet</a>
                    <a href="'.$baseuri.'/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark"><span class="icon-pencil"></span> '.$langArray['results']['edit'].'</a>
                  </div>
                </div>';
        }
        elseif ($response == "no code or invalid code"){
          echo '<div class="animated fadeIn"><div class="resultborder"><span class="missing">'.$langArray['results']['invalidscan'].'</span><br>'.$openissue.'</div></div>';
        }
        // Product is not in OFF/OBF db
        else {
            echo '<div class="animated fadeIn"><div class="resultborder"><span>'.$langArray['results']['notindb'].'</span><p class="missing">'.$langArray['results']['add'].' <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">'.$langArray['results']['addonoff'].'</a>.</p>
            '.$openissue.'</div></div>';
        }
    }
    // Fomer: $missinginfo, now: Name-output & nutriscore if available 
    else {
      echo '<div class="animated fadeIn">
                    <div class="resultborder">
                      <span class="unknown">
                        <span class="name">"'.$name.'":</span>
                      </span>
                      <span class="unknown">'.$langArray['results']['vegan'].'<span class="icon-help"></span> </span>'.$vegetarian.$animaltestfree.$palmoil.$nutriscore.'
                      <a href="'.$baseuri.'/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark"><span class="icon-pencil"></span> '.$langArray['results']['edit'].'</a> '.$openissue.'
                    </div>
                  </div>'; 
    }
  }
  else {
    $brocade = file_get_contents('https://www.brocade.io/api/items/'.$barcode);
    $product = json_decode($brocade);
           if($brocade !== false){
             $productname = $product->name;
             $ingredients = $product->ingredients;
               if(!empty($productname) && !empty($ingredients)) {
                $apiname = 'brocade-analysis';
                $isveganapi = file_get_contents('https://is-vegan.netlify.app/.netlify/functions/api?ingredients='.rawurlencode($ingredients));
                $isvegancheck = json_decode($isveganapi);
                if ($isvegancheck->isVeganSafe == "true"){
                  echo '<div class="animated fadeIn">
                  <div class="resultborder">
                    <span class="vegan">
                      <span class="name">"'.$productname.'":</span>
                    </span>
                    <span class="vegan">'.$langArray['results']['vegan'].'<span class="icon-ok"></span> </span>
                    <a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.urlencode($productname).$langArray['results']['tweettextvegan'].'" class="btn-dark" id="tweet"><span class="icon-twitter"></span> Tweet</a>
                    <a href="'.$baseuri.'/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark"><span class="icon-pencil"></span> '.$langArray['results']['edit'].'</a>
                  </div>
                </div>';
                }
                else {
                  echo  '<div class="animated fadeIn">
                    <div class="resultborder">
                      <span class="unknown">
                        <span class="name">"'.$productname.'":</span>
                      </span>
                      <span class="unknown">'.$langArray['results']['vegan'].'<span class="icon-help"></span> </span>
                      <a href="'.$baseuri.'/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark"><span class="icon-pencil"></span> '.$langArray['results']['edit'].'</a>
                    </div>
                  </div>';
                }
               }
               else{
                echo '<div class="animated fadeIn"><div class="resultborder"><span><span class="name">"'.$productname.'":</span>'.$langArray['results']['notindb'].'</span><p class="missing">'.$langArray['results']['add'].' <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">'.$langArray['results']['addonoff'].'</a>.</p>
        '.$openissue.'
        </div></div>';
        $apiname = 'brocade-nameonly';
               }
           }
           else {
            echo '<div class="animated fadeIn"><div class="resultborder"><span>'.$langArray['results']['notindb'].'</span><p class="missing">'.$langArray['results']['add'].' <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">'.$langArray['results']['addonoff'].'</a>.</p>
    '.$openissue.'
    </div></div>';
           }
  }
}

// Remove before using on your own site
include_once("stats.php");
?>