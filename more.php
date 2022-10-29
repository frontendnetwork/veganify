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
    <div class="container top">
      <div id="main">
        <div class="form">
          <!--<a href="javascript:history.back();" class="icon-left-open"></a>-->
            <a href="https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536" class="Grid links">
                  <div class="Grid-cell description"><?php echo L::more_supportus; ?></div>
                  <div class="Grid-cell icons"><span class="unknown icon-right-open"></span></div>
            </a>
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
<?php
  include_once('includes/footer.php');
?>
  </body>
</html>