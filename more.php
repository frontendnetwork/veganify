<?php
  include_once('includes/header.php');
?>
    <style>
      .form h2, p {
        text-align: left;
        -webkit-hyphens: auto;
        -moz-hyphens: auto;
        -ms-hyphens: auto;
        hyphens: auto;
      }
    </style>
  </head>

  <body>
      <nav class="nav">
    <div class="flex-container">
      <div class="flex-item">
        <a href="/">
          <span class="icon icon-vegancheck"></span>
          <span class="menu-item">Home</span>
      </a>
      </div>
  <div class="flex-item">
    <a href="/ingredients">
        <span class="icon icon-ingredients"></span>
        <span class="menu-item"><?php echo L::ingredients_shorttitle; ?></span>
    </a>
  </div>
  <div class="flex-item active">
      <span class="icon icon-ellipsis"></span>
      <span class="menu-item"><?php echo L::more_more; ?></span>
  </div>
  </div>
  </nav>
    <div class="modal_view animatedfaster fadeInUp" id="donationmodal">
      <div class="modal_close" id="modal_close" ><a class="btn-dark" data-dismiss="modal">&times;</a></div>
          <span class="center">
            <img src="img/donate_img.svg" class="heading_img">
            <h1><?php echo L::more_supportus; ?></h1>
          </span>
          <div class="option active" id="option_once">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="once" checked>
            <span class="muted"><?php echo L::more_donate_once; ?> <?php echo L::more_donate_via; ?> PayPal</span>
            <span class="price">1-15€</span>
          </div>
          <div class="option" id="option_kofi">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="kofi">
            <span class="muted"><?php echo L::more_donate_once; ?> <?php echo L::more_donate_via; ?> Ko-Fi</span>
            <span class="price">1-50€</span>
          </div>
          <div class="option" id="option_monthly" style="display:none;">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="monthly">
            <span class="muted"><?php echo L::more_donate_monthly; ?></span>
            <span class="price">1-15€/<?php echo L::more_donate_month; ?></span>
          </div>
          <div class="option" id="option_stripe">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="stripe">
            <span class="muted"><?php echo L::more_donate_once; ?> <?php echo L::more_donate_via; ?> Stripe</span>
            <span class="price">1-100€</span>
          </div>
          <div class="option" id="option_gh">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="gh">
            <span class="muted"><?php echo L::more_donate_monthly; ?> <?php echo L::more_donate_via; ?> GitHub</span>
            <span class="price">1-100$/<?php echo L::more_donate_month; ?></span>
          </div>
          <div class="center donate">
            <a href="https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536" class="button" id="supportbtn"><span class="icon-paypal"></span> Donate with PayPal</a>
            <span class="info"><?php echo L::more_donate_vendor; ?></span>
        </div>
  </div>

  <div class="modal_view animatedfaster fadeInUp" id="followmodal">
      <div class="modal_close" id="modal_close"><a class="btn-dark" data-dismiss="modal">&times;</a></div>
          <span class="center">
            <img src="img/follow_img.svg" class="heading_img">
            <h1><?php echo L::more_follow; ?></h1>
          </span>
          <a href="https://twitter.com/vegancheckme" class="menu twitter">
            <span class="label">Twitter</span>
            <div class="social-icon"><span class="icon-twitter"></span></div>
        </a>
          <a href="https://instagram.com/vegancheck.me" class="menu">
            <span class="label">Instagram</span>
            <div class="social-icon"><span class="icon-instagram"></span></div>
          </a>
          <a href="https://facebook.com/vegancheck.me" class="menu facebook">
            <span class="label">Facebook</span>
            <div class="social-icon"><span class="icon-facebook"></span></div>
          </a>
  </div>

    <div class="container top" id="mainpage">
      <div id="main">
        <div class="form">
            <div class="Grid links">
                  <div class="Grid-cell description" data-target="donationmodal" data-toggle="modal"><?php echo L::more_supportus; ?></div>
                  <div class="Grid-cell icons"><span class="unknown icon-right-open" data-target="donationmodal" data-toggle="modal"></span></div>
            </div>
            <div class="Grid links">
                  <div class="Grid-cell description" data-target="followmodal" data-toggle="modal"><?php echo L::more_follow; ?></div>
                  <div class="Grid-cell icons"><span class="unknown icon-right-open" data-target="followmodal" data-toggle="modal"></span></div>
            </div>
            <a href="tos" class="Grid links">
                  <div class="Grid-cell description"><?php echo L::more_tos; ?></div>
                  <div class="Grid-cell icons"><span class="unknown icon-right-open"></span></div>
            </a>
            <a href="privacy-policy" class="Grid links">
                  <div class="Grid-cell description"><?php echo L::more_privacypolicy; ?></div>
                  <div class="Grid-cell icons"><span class="unknown icon-right-open"></span></div>
            </a>
            <a href="https://jokenetwork.de/vegancheck-api" class="Grid links">
                  <div class="Grid-cell description"><?php echo L::more_api; ?></div>
                  <div class="Grid-cell icons"><span class="unknown icon-right-open"></span></div>
            </a>
            <a href="impressum" class="Grid links">
                  <div class="Grid-cell description"><?php echo L::more_imprint; ?></div>
                  <div class="Grid-cell icons"><span class="unknown icon-right-open"></span></div>
            </a>
            <span class="Grid switcher">
              <div class="Grid-cell description">
              OLED-Mode
              <span class="info" id="cookieinfo"><?php echo L::more_oled_cookiewarning; ?></span>
              <span class="info" id="oledinfo"><?php echo L::more_oled_error; ?></span>
            </div>
            <div class="Grid-cell icons"><input class="switch" id="oled-switch" type="checkbox"></div>
          </span>
        </div>
        <span id="version" class="info"></span>
      </div>
    </div>

<?php
  include_once('includes/footer.php');
?>
  </body>
</html>