    <?php
      if (defined('WP_DEV')) {
        get_template_part('partials/bottom');
      } else {
        get_template_part('dist/partials/bottom.dist');
      }
    ?>
  </body>
</html>
