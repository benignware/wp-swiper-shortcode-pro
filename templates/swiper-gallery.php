<!-- Slider main container -->
<?php global $wp_query; ?>
<div class="swiper-gallery">
  <div id="<?= $id; ?>" class="swiper-container">
    <div class="swiper-wrapper">
      <?php while( have_posts()) : the_post() ?>
        <<?= $itemtag; ?> class="swiper-slide swiper-gallery-item">
          <?php $caption = $captions[$wp_query->current_post] ?: wp_get_attachment_caption($post->ID); ?>
          <img
            class="swiper-gallery-img"
            <?php if ($fit): ?>
              style="width: 100%; height: 100%; object-position: center; object-fit: <?= $fit; ?>"
            <?php endif; ?>
            src="<?= wp_get_attachment_image_src($post->ID, $size)[0] ?>"
          />
          <?php if ( $captiontag && trim( $caption ) ): ?>
            <<?= $captiontag; ?> class="swiper-gallery-caption">
              <?= $caption; ?>
            </<?= $captiontag; ?>>
          <?php endif; ?>
        </<?= $itemtag; ?>>
      <?php endwhile; ?>
    </div>

    <?php if ($pagination): ?>
      <div class="swiper-pagination <?= $theme['classes']['swiper-pagination']; ?>"></div>
    <?php endif; ?>

    <?php if ($scrollbar): ?>
      <div class="swiper-scrollbar <?= $theme['classes']['swiper-scrollbar']; ?>"></div>
    <?php endif; ?>

    <?php if ($navigation): ?>
      <div class="swiper-button-next <?= $theme['classes']['swiper-button-next']; ?>"></div>
      <div class="swiper-button-prev <?= $theme['classes']['swiper-button-prev']; ?>"></div>
    <?php endif; ?>
  </div>
  <?php if ($thumbs): ?>
    <?php get_swiper($template, 'thumbs', $thumbs); ?>
  <?php endif; ?>
</div>
