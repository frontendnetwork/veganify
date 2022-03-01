<?php
/**
 * VeganCheck.me Script
 * @author Philip Brembeck
 * @license MIT License
 * @copyright (C) 2022 Philip Brembeck
 * @copyright (C) 2022 JokeNetwork
 * @copyright (C) 2022 VeganCheck.me Contributors
 * @link https://github.com/JokeNetwork/vegancheck.me/blob/main/LICENSE
 **/

require('vendor/autoload.php');

$dotenv = Dotenv\Dotenv::createImmutable('/var/www/virtual/jake/');
$dotenv->load();
$userid = $_ENV['USER_ID_OEANDB'];

$sent_barcode = filter_input(INPUT_POST, 'barcode');
$ticket = uniqid();

// Set all variables
$vegan = null;
$vegetarian = null;
$animaltestfree = null;
$palmoil = null;
$nutriscore = null;

// Language detection
if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE']))
{
    $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
    $supportedLanguages = ['en', 'de', 'fr', 'es', 'nl'];
    if (!in_array($lang, $supportedLanguages))
    {
        $lang = "en";
    }
}
else
{
    $lang = "en";
}

require_once ("localization/" . $lang . ".php");

// Open Issue on GitHub when error occurs
$openissue = '<a href="https://github.com/JokeNetwork/vegancheck.me/issues/new?assignees=philipbrembeck&labels=bug&body=' . urlencode('Error ticket #' . $ticket . ' (Please always include this number!) - Please describe your issue:') . '" target="_blank" class="btn-dark">' . $langArray['results']['reporterror'] . '</a>';

// Barcode is empty
if (empty($sent_barcode) || $sent_barcode == null)
{
    print_r('<span class="animated fadeIn"><div class="resultborder">' . $langArray['results']['invalid'] . '<br>' . $openissue . '</div></span>');
}

// Barcode is not empty
else
{
    $barcode = $sent_barcode;
    $data = Requests::get('https://world.openfoodfacts.org/api/v0/product/' . $barcode);
    $product = json_decode($data->body);

    $beautydata = Requests::get('https://world.openbeautyfacts.org/api/v0/product/' . $barcode);
    $beautyproduct = json_decode($beautydata->body);

    // When to use OpenBeautyFacts & when to use OpenFoodFacts
    if (empty($product->product) && !empty($beautyproduct->product))
    {
        $api = 'https://world.openbeautyfacts.org/api/v0/product/';
        $baseuri = "https://world.openbeautyfacts.org";
        $edituri = 'https://world.openbeautyfacts.org/cgi/product.pl?type=edit&code='.$barcode;
        $apiname = 'OpenBeautyFacts';
    }
    elseif (!empty($product->product) && empty($beautyproduct->product))
    {
        $api = 'https://world.openfoodfacts.org/api/v0/product/';
        $baseuri = "https://world.openfoodfacts.org";
        $edituri = 'https://world.openfoodfacts.org/cgi/product.pl?type=edit&code='.$barcode;
        $apiname = 'OpenFoodFacts';
    }
    else
    {
        $api = 'https://world.openfoodfacts.org/api/v0/product/';
        $baseuri = "https://world.openfoodfacts.org";
        $edituri = 'https://world.openfoodfacts.org/cgi/product.pl?type=edit&code='.$barcode;
        $apiname = 'OpenFoodFacts';
    }
    $data = Requests::get($api . $barcode);
    $product = json_decode($data->body);

    // Start JSON array request
    if (!empty($product->product))
    {
        $array = $product
            ->product->ingredients_analysis_tags;
        $productname = $product
            ->product->product_name;
        $genericname = $product
            ->product->generic_name;
        $response = $product->status_verbose;
        $nutriscore = $product
            ->product->nutriscore_grade;

        // Check for non-animal-tested products
        if ($apiname == "OpenBeautyFacts")
        {
            if (isset($product
                ->product
                ->labels_tags))
            {
                if (in_array("en:not-tested-on-animals", $product
                    ->product
                    ->labels_tags) || in_array("de:ohne-tierversuche", $product
                    ->product
                    ->labels_tags) || in_array("en:cruelty-free", $product
                    ->product
                    ->labels_tags) || in_array("fr:cruelty-free", $product
                    ->product
                    ->labels_tags) || in_array("en:cruelty-free-international", $product
                    ->product
                    ->labels_tags) || in_array("en:vegan-society", $product
                    ->product
                    ->labels_tags))
                {
                    $animaltestfree = '<span class="vegan"> ' . $langArray['results']['animaltestfree'] . '<span class="icon-ok"></span> </span>';
                }
                else
                {
                    $animaltestfree = null;
                }
            }
            else
            {
                $animaltestfree = null;
            }
        }
        else
        {
            $animaltestfree = null;
        }

        // Check if $productname is given or $genericname is given
        if (empty($productname) && !empty($genericname))
        {
            $productname = $genericname;
        }
        elseif (empty($genericname) && empty($productname))
        {
            $productname = $langArray['results']['unknown'];
        }

        // Set palmoil as unknown before checking it, to display "unknown" in case of no API response
        $palmoil = '<span class="unknown"> ' . $langArray['results']['palmoilunknown'] . '<sup id="palm_modal">?</sup><span class="icon-help"></span> </span>';

        // Set vegetarian as unknown before checking it
        $vegetarian = '<span class="unknown">' . $langArray['results']['vegetarian'] . '<span class="icon-help"></span> </span>';

        // Checks for the nutriscore
        if ($nutriscore == "a")
        {
            $nutriscore = '<span class="nutri_a">Nutriscore A<sup id="nutri_modal">?</sup><span class="icon-ok"></span></span>';
        }
        elseif ($nutriscore == "b")
        {
            $nutriscore = '<span class="nutri_b">Nutriscore B<sup id="nutri_modal">?</sup><span class="icon-ok"></span></span>';
        }
        elseif ($nutriscore == "c")
        {
            $nutriscore = '<span class="nutri_c">Nutriscore C<sup id="nutri_modal">?</sup><span class="icon-ok"></span></span>';
        }
        elseif ($nutriscore == "d")
        {
            $nutriscore = '<span class="nutri_d">Nutriscore D<sup id="nutri_modal">?</sup><span class="icon-cancel"></span></span>';
        }
        elseif ($nutriscore == "e")
        {
            $nutriscore = '<span class="nutri_e">Nutriscore E<sup id="nutri_modal">?</sup><span class="icon-cancel"></span></span>';
        }
        elseif ($apiname == "OpenBeautyFacts")
        {
            $nutriscore = null;
        }
        else
        {
            $nutriscore = '<span class="unknown">Nutriscore<sup id="nutri_modal">?</sup> ' . $langArray['results']['unknown'] . '<span class="icon-help"></span></span>';
        }

        if (isset($array))
        {
            // Checks for the palm-oil status
            // Needs to be after isset($array) because it checks within the array
            if (in_array("en:palm-oil", $array))
            {
                $palmoil = '<span class="non-vegan"> ' . $langArray['results']['containspalmoil'] . '<sup id="palm_modal">?</sup> <span class="icon-cancel"></span> </span>';
            }
            elseif (in_array("en:palm-oil-free", $array))
            {
                $palmoil = '<span class="vegan"> ' . $langArray['results']['nopalmoil'] . '<sup id="palm_modal">?</sup> <span class="icon-ok"></span> </span>';
            }
            else
            {
                $palmoil = '<span class="unknown"> ' . $langArray['results']['palmoilunknown'] . '<sup id="palm_modal">?</sup> <span class="icon-help"></span> </span>';
            }

            // Checks for the vegetarian status
            if (in_array("en:non-vegetarian", $array))
            {
                $vegetarian = '<span class="non-vegan">' . $langArray['results']['notvegetarian'] . '<span class="icon-cancel"></span> </span>';
            }
            elseif (in_array("en:vegetarian", $array))
            {
                $vegetarian = '<span class="vegan">' . $langArray['results']['vegetarian'] . '<span class="icon-ok"></span> </span>';
            }
            else
            {
                $vegetarian = '<span class="unknown">' . $langArray['results']['vegetarian'] . '<span class="icon-help"></span> </span>';
            }

            // if not vegan
            if (in_array("en:non-vegan", $array))
            {
                $vegan = "false";
            }
            // if vegan status unknown
            elseif (in_array("en:vegan-status-unknown", $array) || in_array("en:maybe-vegan", $array))
            {
                $vegan = "unknown";
            }
            // if vegan
            elseif (in_array("en:vegan", $array))
            {
                $vegan = "true";
            }
            elseif ($response == "no code or invalid code")
            {
                $endrepsone = "invalid";
            }
            // Product is not in OFF/OBF db
            else
            {
                $endrepsone = "notindb";
            }
        }
        // Fomer: $missinginfo, now: Name-output & nutriscore if available
        else
        {
            $vegan = "unknown";
        }
    }

    // Use brocade API if item is not in OFF and use OEDBAPI if item is not in brocade
    else
    {
        $brocade = Requests::get('https://www.brocade.io/api/items/' . $barcode);
        $product = json_decode($brocade->body);
        if (!empty($product->name))
        {
            $productname = $product->name;
            $ingredients = $product->ingredients;
            if (!empty($productname) && !empty($ingredients))
            {
                $apiname = 'Brocade.io';
                $baseuri = "https://www.brocade.io";
                $edituri = 'https://www.brocade.io/products/'.$barcode;
                include_once ('includes/isvegan.php');
                $response = explode(', ', $ingredients);
                $result = array_uintersect($isvegan, $response, fn($a, $b) => strcasecmp($a, $b));
                if (empty($result))
                {
                    $vegan = "true";
                }
                else
                {
                    $vegan = "false";
                }
            }
            else
            {
                $endrepsone = "notindb";
                $apiname = 'Brocade.io';
                $baseuri = "https://brocade.io";

            }
        }
        else
        {
            $oedb = Requests::get('https://opengtindb.org/?ean=' . $barcode . '&cmd=query&queryid=' . $userid );
            $array = parse_ini_string($oedb->body, false, INI_SCANNER_RAW);
            $status = $array['error'];
            $desc = utf8_encode($array['descr']);
            if ($status == "0")
            {
                $apiname = 'Open EAN Database';
                $baseuri = "https://opengtindb.org";
                $edituri = 'https://opengtindb.org/index.php?cmd=ean1&ean='.$barcode;
                $productname = utf8_encode($array['name'] . ' ' . $array['detailname']);
                $contents = $array['contents'];

                if(!empty($contents) && $contents >= "128" && $contents < "256"){
                    $vegan = "false";
                    $vegetarian = '<span class="vegan">' . $langArray['results']['vegetarian'] . '<span class="icon-ok"></span> </span>';
                }
                elseif(!empty($contents) && $contents >= "256" && $contents < "384" || $contents >= "384" && $contents < "512"){
                    $vegan = "true";
                    $vegetarian = '<span class="vegan">' . $langArray['results']['vegetarian'] . '<span class="icon-ok"></span> </span>';
                }
                elseif (!empty($desc))
                {
                    include_once ('includes/isvegan.php');
                    $response = explode(', ', $desc);
                    $result = array_uintersect($isvegan, $response, fn($a, $b) => strcasecmp($a, $b));

                    if (empty($result))
                    {
                        $vegan = "unknown";
                    }
                    else
                    {
                        $vegan = "false";
                    }
                }
                else
                {
                    $endrepsone = "notindb";
                }
            }
            else
            {
                $endrepsone = "notindb";
            }
        }
    }
}

// Return results
if($vegan == "false")
{
    if($apiname == "Brocade.io" || $apiname == "Open EAN Database"){
        $processed = ' &middot; ' . $langArray['results']['processed'] . '<sup id="processed_modal">?</sup>';
    }
    else{
        $processed = null;
    }
    print_r('<div class="animated fadeIn">
                    <div class="resultborder">
                      <span class="non-vegan">  
                        <span class="name" id="name_sh">"' . $productname . '":</span>
                      </span>
                      <span class="non-vegan"><span id="result_sh">' . $langArray['results']['notvegan'] . '</span><span class="icon-cancel"></span></span>' . $vegetarian . $animaltestfree . $palmoil . $nutriscore . '
                      <span class="source">' . $langArray['results']['datasource'] . ' <a href="' . $baseuri . '" target="_blank">' . $apiname . '</a><sup id="license_modal">?</sup>'. $processed .'</span>
                      <span class="btn-dark" id="share" onClick="sharebutton()">'.$langArray['footer']['share'].'</span>
                      <a href="'.$edituri.'" target="_blank" class="btn-dark"><span class="icon-pencil"></span> ' . $langArray['results']['edit'] . '</a>
                    </div>
                  </div>');
}
elseif($vegan == "true")
{
    // Vegetarian is always true when vegan is true
    $vegetarian = '<span class="vegan">' . $langArray['results']['vegetarian'] . '<span class="icon-ok"></span> </span>';

    if($apiname == "Brocade.io"){
        $processed = ' &middot; ' . $langArray['results']['processed'] . '<sup id="processed_modal">?</sup>';
    }
    else{
        $processed = null;
    }
    print_r('<div class="animated fadeIn">
                    <div class="resultborder">
                      <span class="vegan">
                        <span class="name" id="name_sh">"' . $productname . '":</span>
                      </span>
                      <span class="vegan"><span id="result_sh">' . $langArray['results']['vegan'] . '</span><span class="icon-ok"></span></span>' . $vegetarian . $animaltestfree . $palmoil . $nutriscore . '
                      <span class="source">' . $langArray['results']['datasource'] . ' <a href="' . $baseuri . '" target="_blank">' . $apiname . '</a><sup id="license_modal">?</sup>'. $processed .'</span>
                      <span class="btn-dark" id="share" onClick="sharebutton()">'.$langArray['footer']['share'].'</span>
                      <a href="'.$edituri.'" target="_blank" class="btn-dark"><span class="icon-pencil"></span> ' . $langArray['results']['edit'] . '</a>
                    </div>
                  </div>');
}
elseif($vegan == "unknown")
{
    print_r('<div class="animated fadeIn">
                    <div class="resultborder">
                      <span class="unknown">
                        <span class="name">"' . $productname . '":</span>
                      </span>
                      <span class="unknown">' . $langArray['results']['vegan'] . '<span class="icon-help"></span> </span>' . $vegetarian . $animaltestfree . $palmoil . $nutriscore . '
                      <span class="source">' . $langArray['results']['datasource'] . ' <a href="' . $baseuri . '" target="_blank">' . $apiname . '</a><sup id="license_modal">?</sup></span>
                      <a href="'.$edituri.'" target="_blank" class="btn-dark"><span class="icon-pencil"></span> ' . $langArray['results']['edit'] . '</a>
                    </div>
                  </div>');
}
elseif($endrepsone == "invalid")
{
    print_r('<div class="animated fadeIn"><div class="resultborder"><span class="missing">' . $langArray['results']['invalidscan'] . '</span><br>' . $openissue . '</div></div>');
}
elseif($endrepsone == "notindb" && !empty($productname) && $productname !== "n/a")
{
    print_r('<div class="animated fadeIn"><div class="resultborder"><span class="name">"' . $productname . '":</span><p class="missing">' . $langArray['results']['notindb'] . '</p><p class="missing">' . $langArray['results']['add'] . ' <a href="https://world.openfoodfacts.org/cgi/product.pl?code=' . $barcode . '" target="_blank">' . $langArray['results']['addonoff'] . '</a> ' . $langArray['results']['or'] . ' <a href="https://world.openbeautyfacts.org/cgi/product.pl?code=' . $barcode . '" target="_blank">' . $langArray['results']['addonobf'] . '</a>.</p>
                  <span class="source">' . $langArray['results']['datasource'] . ' <a href="' . $baseuri . ' target="_blank"">' . $apiname . '</a><sup id="license_modal">?</sup></span>' . $openissue . '</div></div>');
}
elseif($endrepsone == "notindb")
{
    print_r('<div class="animated fadeIn"><div class="resultborder"><span>' . $langArray['results']['notindb'] . '</span><p class="missing">' . $langArray['results']['add'] . ' <a href="https://world.openfoodfacts.org/cgi/product.pl?code=' . $barcode . '" target="_blank">' . $langArray['results']['addonoff'] . '</a> ' . $langArray['results']['or'] . ' <a href="https://world.openbeautyfacts.org/cgi/product.pl?code=' . $barcode . '" target="_blank">' . $langArray['results']['addonobf'] . '</a>.</p>
    ' . $openissue . '
    </div></div>');
}

// Remove before using on your own site
include_once ("stats.php");
?>