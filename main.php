<?php
  include_once('includes/header.php');
?>
  </head>

  <body id="top">
    <div class="rotate">
      <img src="../img/rotatedevice.svg" alt="<?php echo L::other_rotate; ?>">
      <h1><?php echo L::other_rotate; ?></h1>
    </div>

    <div class="modal_view animatedfaster fadeIn" id="nutriscore" style="display:none;">
      <div class="modal_close"><a class="btn-dark">&times;</a></div>
          <h2>Nutriscore</h2>
          <p><?php echo L::modal_nutriscore_desc; ?></p>
    </div>

    <div class="modal_view animatedfaster fadeIn" id="palmoil" style="display:none;">
      <div class="modal_close"><a class="btn-dark">&times;</a></div>
          <h2><?php echo L::modal_palmoil; ?></h2>
          <p><?php echo L::modal_palmoil_desc; ?></p>
    </div>

    <div class="modal_view animatedfaster fadeIn" id="processed" style="display:none;">
      <div class="modal_close"><a class="btn-dark">&times;</a></div>
          <h2><?php echo L::modal_processed; ?></h2>
          <p><?php echo L::modal_processed_desc; ?></p>
    </div>
    <div class="modal_view animatedfaster fadeIn" id="license" style="display:none;">
      <div class="modal_close"><a class="btn-dark">&times;</a></div>
          <h2><?php echo L::modal_licenses; ?></h2>
          <p><?php echo L::modal_licenses_desc; ?></p>
          <p>
            &copy; OpenFoodFacts Contributors, licensed under <a href="https://opendatacommons.org/licenses/odbl/1.0/">Open Database License</a> and <a href="https://opendatacommons.org/licenses/dbcl/1.0/">Database Contents License</a>.<br>
            Brocade.io Contributors, licensed under <a href="https://creativecommons.org/publicdomain/zero/1.0/">Creative-Commons Zero</a>.<br>
            &copy; Open EAN/GTIN Database Contributors, licensed under <a href="https://www.gnu.org/licenses/fdl-1.3.html">GNU FDL</a>.<br>
            &copy; VeganCheck.me Contributors and Hamed Montazeri, licensed under <a href="https://github.com/JokeNetwork/vegan-ingredients-api/blob/master/LICENSE">MIT License</a>, sourced from <a href="https://www.veganpeace.com/ingredients/ingredients.htm">VeganPeace</a>, <a href="https://www.peta.org/living/food/animal-ingredients-list/">PETA</a> and <a href="http://www.veganwolf.com/animal_ingredients.htm">The VEGAN WOLF</a>.<br>
            &copy; VeganCheck.me Contributors, sourced from &copy; <a href="https://crueltyfree.peta.org">PETA (Beauty without Bunnies)</a>. 
    </div>
    <noscript>
      <div class="noscript">
        <h3>VeganCheck.me only works properly with Javascript enabled. <a href="https://www.enable-javascript.com">Learn how to enable Javascript here</a>.</h3>
      </div>
    </noscript>
    <div class="container">
      <div id="main">
        <div class="form" id="resscroll">
        <img src="../img/VeganCheck.svg" alt="Logo" class="logo">
        <form action="../script.php">
          <fieldset>
            <legend><?php echo L::form_enterbarcode; ?></legend>
            <span class="btn_scan" onclick="setupLiveReader()" aria-label="<?php echo L::form_scanbarcode; ?>" role="button" tabindex="0"><span class="icon-barcode"></span></span>
            <input type="number" id="barcode" name="barcode" placeholder="<?php echo L::form_enterbarcode.'"'; if(isset($_GET['ean'])){echo 'value="'.$_GET['ean'].'"';}?> autofocus>
            <button name="submit" aria-label="<?php echo L::form_submit; ?>" role="button"><span class="icon-right-open"></span></button>
          </fieldset>
        </form>
        <div class="timeout animated fadeIn" style="display:none;"><?php echo L::other_timeout; ?><span>.</span><span>.</span><span>.</span></div>
         <div class="timeout-final animated fadeIn" style="display:none;"><?php echo L::other_timeoutfinal; ?></div>
        <div id="result">&nbsp;</div> 
        <a href="/ingredients"><span class="icon-right-open"></span><?php echo L::ingredients_title; ?></a><br>
      </div>
        <footer>
            <a href="https://shareshortcuts.com/download/2224-vegancheck.html" id="shortcut"><img src="../img/shortcuts.svg" alt="Add to Shortcuts" style="width: 7rem!important; padding-top: 2rem;"></a>
            <p><?php echo L::footer_credits; ?>
            <br><?php echo L::footer_legal; ?></p>
            <?php if(date('m')=="01"){echo '<a href="https://veganuary.com/try-vegan/"><img src="../img/veganuary.svg" alt="We are taking part in Veganuary" class="labels"></a>';} ?>
            <a href="https://github.com/jokenetwork/vegancheck.me"><img src="../img/opensource.svg" alt="Open Source" class="labels"></a>
            <a href="https://www.thegreenwebfoundation.org/green-web-check/?url=https%3A%2F%2Fvegancheck.me"><img src="../img/greenhosted.svg" alt="Hosted Green" class="labels"></a>
            <a href="https://iplantatree.org/user/VeganCheck.me"><img src="../img/treelabel.svg" alt="We plant trees. We're carbon neutral." class="labels"></a>
            <a href="https://philip.media"><img src="../img/pml.svg" alt="philip.media" class="labels"></a>
        </footer>
      </div>
    </div>

 <div id="controls" style="display:none;">
  <span id="close"><span class="btn-dark" id="closebtn">&times; <?php echo L::layover_close; ?></span><span class="btn-dark" id="torch"><span class="icon-flash"></span></span><span class="btn-dark" id="flipbutton"><span class="icon-flipcamera"></span></span></span>
  <span id="barcodeicon"><span class="icon-barcode"></span></span>
  <div id="background"></div>
</div>

<?php
  include_once('includes/footer.php');
?>
  </body>
</html>