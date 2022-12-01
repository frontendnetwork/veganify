<?php
  include_once('../includes/header.php');
?>
    <style>
      .form h2, p, b, ul, li {
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
          <a href="javascript:history.back();" class="icon-left-open back"></a>
          <a href="//vegancheck.me"><img src="../img/VeganCheck.svg" alt="Logo"></a><br>
          <h2>Error 404.</h2>
          <p>This page does not exist.</p>
          <p>You can visit our <a href="https://stats.uptimerobot.com/LY1gRuP5j6">status page</a> or check in on us on <a href="https://twitter.com/vegancheckme">Twitter</a> to see if there are any current issues.
          </p>
          </div>
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
  <div class="flex-item">
    <a href="/more">
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