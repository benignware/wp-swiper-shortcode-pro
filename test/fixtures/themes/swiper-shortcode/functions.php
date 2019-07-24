<?php

add_action( 'wp_enqueue_scripts', function() {
  wp_deregister_style( 'twentyseventeen-style');
  wp_register_style('twentyseventeen-style', get_template_directory_uri(). '/style.css');
  wp_enqueue_style('twentyseventeen-style', get_template_directory_uri(). '/style.css');
  wp_enqueue_style( 'childtheme-style', get_stylesheet_directory_uri().'/style.css', array('twentyseventeen-style') );
} );

/**
 * Render featured galleries as post thumbnail
 */
add_filter( 'post_thumbnail_html', function($html, $post_id) {
	if (function_exists('get_post_gallery_ids')) {
		$post_gallery_ids = get_post_gallery_ids($post_id, 'string');
		if (strlen($post_gallery_ids) > 0) {
			$html = do_shortcode('[swiper_gallery ids="' . $post_gallery_ids . '"]');
		}
	}
	return $html;
}, 99, 5 );


add_filter( 'swiper_options', function($options) {
  $slides_per_view = $options['slides_per_view'];

  $breakpoints = [
    '375' => [
      'slides_per_view' => 1
    ]
  ];

  if ($slides_per_view >= 4) {
    $breakpoints = array_merge($breakpoints, [
      '768' => [
        'slides_per_view' => 2
      ]
    ]);
  }

	$options = array_merge(array(
    'theme' => 'primary',
    'breakpoints' => $breakpoints
  ), $options);
  return $options;
});

register_swiper_theme('primary', array(
	'classes' => array(
		'swiper-button-next' => 'swiper-button-primary',
		'swiper-button-prev' => 'swiper-button-primary',
		'swiper-pagination' => 'swiper-pagination-primary',
		'swiper-scrollbar' => 'swiper-scrollbar-primary'
	)
));
