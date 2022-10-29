<?php
  include_once('includes/header.php');
?>
  </head>

  <body id="top">
    <div class="rotate">
      <img src="../img/rotatedevice.svg" alt="<?php echo L::other_rotate; ?>">
      <h1><?php echo L::other_rotate; ?></h1>
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
            &copy; VeganCheck.me Contributors and Hamed Montazeri, licensed under <a href="https://github.com/JokeNetwork/vegan-ingredients-api/blob/master/LICENSE">MIT License</a>, sourced from <a href="https://www.veganpeace.com/ingredients/ingredients.htm">VeganPeace</a>, <a href="https://www.peta.org/living/food/animal-ingredients-list/">PETA</a> and <a href="http://www.veganwolf.com/animal_ingredients.htm">The VEGAN WOLF</a>.
    </div>
    <noscript>
      <div class="noscript">
        <h3>VeganCheck.me only works properly with Javascript enabled. <a href="https://www.enable-javascript.com">Learn how to enable Javascript here</a>.</h3>
      </div>
    </noscript>

    <div class="container top">
      <div id="main">
        <div class="form ingredients" id="resscroll">
          <img src="../img/VeganCheck.svg" alt="Logo" class="logo">
          <h2><?php echo L::ingredients_title; ?></h2>
          <p><?php echo L::ingredients_subtitle; ?> - <?php echo L::ingredients_placeholder; ?></p>
          <form action="../ingredients_script.php">
            <fieldset>
              <legend><?php echo L::ingredients_placeholder; ?></legend>
              <textarea id="ingredients" name="ingredients" placeholder="<?php echo L::ingredients_placeholder; ?>" autofocus></textarea>
              <button name="checkingredients" aria-label="<?php echo L::form_submit; ?>" role="button"><span class="icon-right-open"></span></button>
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

      <nav class="nav">
    <div class="flex-container">
      <div class="flex-item">
        <a href="/">
          <span class="icon icon-vegancheck"></span>
          <span class="menu-item">Home</span>
      </a>
      </div>
  <div class="flex-item active">
        <span class="icon icon-ingredients"></span>
        <span class="menu-item"><?php echo L::ingredients_shorttitle; ?></span>
  </div>
  <div class="flex-item">
    <a href="../more">
      <span class="icon icon-ellipsis"></span>
      <span class="menu-item"><?php echo L::more_more; ?></span>
    </a>
  </div>
  </div>
  </nav>

<?php
  include_once('includes/footer.php');
?>
  </body>
</html>