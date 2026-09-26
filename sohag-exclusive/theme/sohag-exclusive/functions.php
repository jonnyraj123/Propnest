<?php
/**
 * Sohag Exclusive theme bootstrap.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

define( 'SOHAG_VERSION', '1.0.0' );
define( 'SOHAG_DIR', get_template_directory() );
define( 'SOHAG_URI', get_template_directory_uri() );

/**
 * Theme supports, menus, image sizes.
 */
function sohag_setup() {
	load_theme_textdomain( 'sohag-exclusive', SOHAG_DIR . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 200,
			'width'       => 200,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	add_theme_support(
		'woocommerce',
		array(
			'thumbnail_image_width' => 600,
			'single_image_width'    => 900,
			'product_grid'          => array(
				'default_rows'    => 4,
				'min_rows'        => 1,
				'default_columns' => 4,
				'min_columns'     => 2,
				'max_columns'     => 5,
			),
		)
	);
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );

	register_nav_menus(
		array(
			'primary' => __( 'Main menu', 'sohag-exclusive' ),
			'footer'  => __( 'Footer — policy links', 'sohag-exclusive' ),
		)
	);
}
add_action( 'after_setup_theme', 'sohag_setup' );

/**
 * Styles & scripts.
 */
function sohag_assets() {
	wp_enqueue_style(
		'sohag-fonts',
		'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Jost:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap',
		array(),
		null
	);
	// Only the ₹ glyph, from a face drawn for Indian scripts, so the rupee sign is crisp in every browser.
	wp_enqueue_style( 'sohag-rupee', 'https://fonts.googleapis.com/css2?family=Hind:wght@600&text=%E2%82%B9&display=swap', array(), null );
	wp_enqueue_style( 'sohag-main', SOHAG_URI . '/assets/css/main.css', array(), SOHAG_VERSION );
	wp_enqueue_script( 'sohag-main', SOHAG_URI . '/assets/js/main.js', array(), SOHAG_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'sohag_assets', 20 );

function sohag_preconnect( $urls, $relation ) {
	if ( 'preconnect' === $relation ) {
		$urls[] = array( 'href' => 'https://fonts.gstatic.com', 'crossorigin' );
	}
	return $urls;
}
add_filter( 'wp_resource_hints', 'sohag_preconnect', 10, 2 );

/**
 * Setting helper with defaults (values edited in Appearance → Customize → Sohag Exclusive).
 */
function sohag_opt( $key ) {
	$defaults = array(
		'phone'            => '+91 90737 66083',
		'whatsapp'         => '919073766083',
		'email'            => '',
		'address'          => 'India',
		'facebook'         => 'https://www.facebook.com/',
		'instagram'        => '',
		'messenger'        => '',
		'announcement'     => "Free delivery all over India\nFree Cash on Delivery — no extra charge\n100% handmade — crafted with love\nEasy 7-day exchange on damaged items",
		'hero_image'       => SOHAG_URI . '/assets/img/banner.jpg',
		'hero_script'      => 'Crafted with Love',
		'hero_title'       => 'Handmade <em>Jewellery</em> &amp; Fashion',
		'hero_text'        => 'Earrings, bangles, necklaces, bags and outfits — each piece made by hand with care. Wear your story.',
		'delivery_days'    => '4–7 working days',
		'grievance'        => 'Sohag Exclusive Customer Care',
		'about'            => 'Sohag Exclusive — handmade products that are more than a product, they are a feeling. Unique • Artistic • For You.',
	);
	$value = get_theme_mod( 'sohag_' . $key, null );
	if ( null === $value || '' === $value ) {
		return isset( $defaults[ $key ] ) ? $defaults[ $key ] : '';
	}
	return $value;
}


function sohag_is_wc() {
	return class_exists( 'WooCommerce' );
}

function sohag_whatsapp_url( $text = '' ) {
	$number = preg_replace( '/\D+/', '', sohag_opt( 'whatsapp' ) );
	if ( '' === $number ) {
		return '';
	}
	$url    = 'https://wa.me/' . $number;
	return $text ? $url . '?text=' . rawurlencode( $text ) : $url;
}

function sohag_messenger_url() {
	$m = sohag_opt( 'messenger' );
	if ( $m ) {
		return $m;
	}
	// m.me/<page> derived from the Facebook URL when possible.
	$fb = untrailingslashit( sohag_opt( 'facebook' ) );
	if ( preg_match( '#facebook\.com/([^/?]+)$#', $fb, $m2 ) && 'profile.php' !== $m2[1] ) {
		return 'https://m.me/' . $m2[1];
	}
	return '';
}

require SOHAG_DIR . '/inc/icons.php';
require SOHAG_DIR . '/inc/customizer.php';
require SOHAG_DIR . '/inc/template-tags.php';

if ( sohag_is_wc() ) {
	require SOHAG_DIR . '/inc/woocommerce.php';
}

// Themes load after plugins, so WooCommerce classes are already available here.
if ( class_exists( 'WC_Payment_Gateway' ) ) {
	require_once SOHAG_DIR . '/inc/class-sohag-upi-payment.php';
}

if ( is_admin() ) {
	require SOHAG_DIR . '/inc/setup.php';
}
