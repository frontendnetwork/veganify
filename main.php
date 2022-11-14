<?php
  include_once('includes/header.php');
?>
  </head>

  <body id="top">
       <nav class="nav">
    <div class="flex-container">
      <div class="flex-item active">
        <span class="icon icon-vegancheck"></span>
        <span class="menu-item">Home</span>
      </div>
  <div class="flex-item">
    <a href="/ingredients">
        <span class="icon icon-ingredients"></span>
        <span class="menu-item"><?php echo L::ingredients_shorttitle; ?></span>
    </a>
  </div>
  <div class="flex-item">
    <a href="/more">
      <span class="icon icon-ellipsis"></span>
      <span class="menu-item"><?php echo L::more_more; ?></span>
    </a>
  </div>
  </div>
  </nav>
    <div class="rotate">
      <img src="../img/rotatedevice.svg" alt="<?php echo L::other_rotate; ?>">
      <h1><?php echo L::other_rotate; ?></h1>
    </div>

    <div class="modal_view animatedfaster fadeInUp" id="nutriscore">
      <div class="modal_close"><a class="btn-dark" data-dismiss="modal">&times;</a></div>
          <h2>Nutriscore</h2>
          <p><?php echo L::modal_nutriscore_desc; ?></p>
    </div>

    <div class="modal_view animatedfaster fadeInUp" id="palmoil">
      <div class="modal_close"><a class="btn-dark" data-dismiss="modal">&times;</a></div>
          <h2><?php echo L::modal_palmoil; ?></h2>
          <p><?php echo L::modal_palmoil_desc; ?></p>
    </div>

    <div class="modal_view animatedfaster fadeInUp" id="processed">
      <div class="modal_close"><a class="btn-dark" data-dismiss="modal">&times;</a></div>
          <h2><?php echo L::modal_processed; ?></h2>
          <p><?php echo L::modal_processed_desc; ?></p>
    </div>
    <div class="modal_view animatedfaster fadeInUp" id="license">
      <div class="modal_close"><a class="btn-dark" data-dismiss="modal">&times;</a></div>
          <h2><?php echo L::modal_licenses; ?></h2>
          <p><?php echo L::modal_licenses_desc; ?></p>
          <p>
            &copy; OpenFoodFacts Contributors, licensed under <a href="https://opendatacommons.org/licenses/odbl/1.0/">Open Database License</a> and <a href="https://opendatacommons.org/licenses/dbcl/1.0/">Database Contents License</a>.<br>
            Brocade.io Contributors, licensed under <a href="https://creativecommons.org/publicdomain/zero/1.0/">Creative-Commons Zero</a>.<br>
            &copy; Open EAN/GTIN Database Contributors, licensed under <a href="https://www.gnu.org/licenses/fdl-1.3.html">GNU FDL</a>.<br>
            &copy; VeganCheck.me Contributors and Hamed Montazeri, licensed under <a href="https://github.com/JokeNetwork/vegan-ingredients-api/blob/master/LICENSE">MIT License</a>, sourced from <a href="https://www.veganpeace.com/ingredients/ingredients.htm">VeganPeace</a>, <a href="https://www.peta.org/living/food/animal-ingredients-list/">PETA</a> and <a href="http://www.veganwolf.com/animal_ingredients.htm">The VEGAN WOLF</a>.<br>
            &copy; VeganCheck.me Contributors, sourced from &copy; <a href="https://crueltyfree.peta.org">PETA (Beauty without Bunnies)</a>. 
    </div>
    <div class="modal_view animatedfaster fadeInUp" id="sharemodal">
      <div class="modal_close"><a class="btn-dark" data-dismiss="modal">&times;</a></div>
          <h2><?php echo L::footer_share; ?></h2>
          <div class="share-btn" id="copy">
            <span class="share-text">Copy</span>
            <span class="share-icon icon-docs"></span>
          </div>
          <div class="share-btn" id="twitter">
            <span class="share-text">Share on Twitter</span>
            <span class="share-icon icon-twitter"></span>
          </div>
          <div class="share-btn" id="whatsapp">
            <span class="share-text">Share on WhatsApp</span>
            <span class="share-icon icon-whatsapp"></span>
          </div>
          <div class="share-btn" id="telegram">
            <span class="share-text">Share on Telegram</span>
            <span class="share-icon icon-telegram"></span>
          </div>
          <div class="share-btn" id="facebook">
            <span class="share-text">Share on Facebook</span>
            <span class="share-icon icon-facebook"></span>
          </div>
          <div class="share-btn" id="message">
            <span class="share-text">Share as message</span>
            <span class="share-icon icon-chat"></span>
          </div>
          <div class="share-btn" id="email">
            <span class="share-text">Share via e-mail</span>
            <span class="share-icon icon-mail"></span>
          </div>
    </div>
    <noscript>
      <div class="noscript">
        <h3>VeganCheck.me only works properly with Javascript enabled. <a href="https://www.enable-javascript.com">Learn how to enable Javascript here</a>.</h3>
      </div>
    </noscript>
    <div class="container" id="mainpage">
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
      </div>
        <footer>
            <p><?php echo L::footer_credits; ?></p>
            <?php if(date('m')=="01"){echo '<a href="https://veganuary.com/try-vegan/"><img src="../img/veganuary.svg" alt="We are taking part in Veganuary" class="labels"></a>';} ?>
            <a href="https://github.com/jokenetwork/vegancheck.me"><img src="../img/opensource.svg" alt="Open Source" class="labels"></a>
            <a href="https://www.thegreenwebfoundation.org/green-web-check/?url=https%3A%2F%2Fvegancheck.me"><img src="../img/greenhosted.svg" alt="Hosted Green" class="labels"></a>
            <a href="https://iplantatree.org/user/VeganCheck.me"><img src="../img/treelabel.svg" alt="We plant trees. We're carbon neutral." class="labels"></a>
            <a href="https://philip.media"><img src="../img/pml.svg" alt="philip.media" class="labels"></a>
        </footer>
      </div>
    </div>

  <div id="shortcut">
    <div class="flex-container">
      <div class="flex-item">
    <img src="../img/shortcuts.png">
  </div>
  <div class="flex-item">
    <span class="heading">Shortcuts</span>
    <span class="subheading">Open in the shortcuts app</span>
  </div>
  <div class="flex-item">
    <a href="https://shareshortcuts.com/download/2224-vegancheck.html"> <span class="button">Open</span></a>
  </div>
  </div>
  </div>

 <div id="controls" style="display:none;">
  <span id="close">
    <div class="flex-container">
      <div class="flex-item"><span id="closebtn" class="icon-left-open"></span><span id="torch"></span></div>
      <div class="flex-item"><span class="icon-flipcamera" id="flipbutton"></span></div>
  </div>
  </span>
  <span id="barcodeicon"><span class="icon-barcode"></span></span>
  <div id="background"></div>
</div>

<?php
  include_once('includes/footer.php');
?>
  </body>
</html>