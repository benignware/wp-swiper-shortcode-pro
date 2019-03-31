<?php
  global $post;
?>
<!-- Slider main container -->

<div class="swiper-gallery">
  <div
    <?php foreach ($html_atts as $name => $value): ?>
      <?= $name ?>="<?= $value ?>"
    <?php endforeach; ?>
  >
    <div class="swiper-wrapper">
      <?php while( have_posts()) : the_post() ?>
        <div class="swiper-slide">
          <div class="swiper-slide" style="background-image:url(<?= wp_get_attachment_image_src( $post->ID, 'post-thumbnail')[0] ?>)"></div>
        </div>
      <?php endwhile; ?>
    </div>
    <?php if ($options['pagination']): ?>
      <div class="swiper-pagination"></div>
    <?php endif; ?>

    <?php if ($options['navigation']): ?>
      <div class="<?= $options['navigation']['prev_el'] ?>"></div>
      <div class="<?= $options['navigation']['next_el'] ?>"></div>
    <?php endif; ?>
  </div>
  <?php if ($options['thumbs']): ?>
    <div
      <?php foreach ($thumbs_html_atts as $name => $value): ?>
        <?= $name ?>="<?= $value ?>"
      <?php endforeach; ?>
    >
      <div class="swiper-wrapper">
        <?php while( have_posts()) : the_post() ?>
          <div class="swiper-slide" style="background-image:url(<?= wp_get_attachment_image_src( $post->ID, 'thumbnail')[0] ?>)"></div>
        <?php endwhile; ?>
      </div>
    </div>
  <?php endif; ?>
</div>
