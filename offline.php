<?php
  include_once('includes/header.php');
?>
  </head>
  <body>
    <div class="container top">
      <div id="main">
        <div class="form">
          <a href="//vegancheck.me"><img src="img/VeganCheck.svg?v=<?php echo $versions->img; ?>" alt="Logo"></a><br>
          <h3><?php echo L::other_offline; ?></h3>
          <p><a href="/"><?php echo L::other_reload; ?></a></p>
      </div>
    </div>
    <script>
      window.addEventListener('online', function(e) { window.location.href = "/"; });
    </script>
  </body>
</html>