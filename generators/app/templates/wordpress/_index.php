<?php
/* ========================================
 * Index
 * ======================================== */
?>

<?php get_header(); ?>

<div class="Container">
  <div class="Wrap">
    Generated on <%= (generatorDate) %> using <a href="<%= (generatorRepository) %>"><%= pkg.name %> v<%= pkg.version %></a>.
  </div>
</div>

<?php get_footer(); ?>
