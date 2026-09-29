<?php
/**
 * Sohag Exclusive theme bootstrap.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

define( 'SOHAG_VERSION', '1.2.0' );
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
 * Asset version from the file's modified time, so browsers and page caches fetch fresh files after every theme upload.
 */
function sohag_asset_ver( $file ) {
	$path = SOHAG_DIR . '/assets/' . $file;
	return file_exists( $path ) ? SOHAG_VERSION . '.' . filemtime( $path ) : SOHAG_VERSION;
}

/**
 * Styles & scripts.
 */
function sohag_assets() {
	wp_enqueue_style(
		'sohag-fonts',
		'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Great+Vibes&family=Jost:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap',
		array(),
		null
	);
	// Only the ₹ glyph, from a face drawn for Indian scripts, so the rupee sign is crisp in every browser.
	wp_enqueue_style( 'sohag-rupee', 'https://fonts.googleapis.com/css2?family=Hind:wght@600&text=%E2%82%B9&display=swap', array(), null );
	wp_enqueue_style( 'sohag-main', SOHAG_URI . '/assets/css/main.css', array(), sohag_asset_ver( 'css/main.css' ) );
	wp_enqueue_style( 'sohag-cinematic', SOHAG_URI . '/assets/css/cinematic.css', array( 'sohag-main' ), sohag_asset_ver( 'css/cinematic.css' ) );
	wp_enqueue_script( 'sohag-main', SOHAG_URI . '/assets/js/main.js', array(), sohag_asset_ver( 'js/main.js' ), true );
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
		'phone'            => '+91 82820 22581',
		'whatsapp'         => '918282022581',
		'email'            => '',
		'address'          => 'Amtala, D. H. Road, Kolkata, West Bengal 743398, India',
		'facebook'         => 'https://www.facebook.com/profile.php?id=100095053184804',
		'instagram'        => '',
		'messenger'        => '',
		'announcement'     => "Free delivery all over India\nFree Cash on Delivery — no extra charge\n100% handmade — crafted with love\nEasy 7-day exchange on damaged items",
		'hero_image'       => SOHAG_URI . '/assets/img/hero-puja.jpg',
		'hero_script'      => 'Wear Your Story',
		'hero_title'       => 'Bangaliana <em>Handcraft</em>',
		'hero_text'        => 'Handmade thread-bead necklaces, oxidised jewellery and red-and-white puja sarees — rooted in Bengali tradition, made with love.',
		'delivery_days'    => '4–7 working days',
		'grievance'        => 'Sohag Exclusive Customer Care',
		'about'            => 'Sohag Exclusive — handmade Bangaliana jewellery and puja fashion. More than a product, it is a feeling. Wear your story.',
	);
	$value = get_theme_mod( 'sohag_' . $key, null );
	if ( null === $value || '' === $value ) {
		return isset( $defaults[ $key ] ) ? $defaults[ $key ] : '';
	}
	return $value;
}


/**
 * One-time move of the customer-care contact to the Facebook page number (the UPI ID stays as it is).
 * Only replaces values that are empty or still the old number/placeholder.
 */
function sohag_migrate_contact() {
	if ( get_option( 'sohag_contact_v2' ) ) {
		return;
	}
	$old   = '9073766083';
	$phone = preg_replace( '/\D+/', '', (string) get_theme_mod( 'sohag_phone', '' ) );
	if ( '' === $phone || false !== strpos( $phone, $old ) ) {
		set_theme_mod( 'sohag_phone', '+91 82820 22581' );
	}
	$wa = preg_replace( '/\D+/', '', (string) get_theme_mod( 'sohag_whatsapp', '' ) );
	if ( '' === $wa || false !== strpos( $wa, $old ) ) {
		set_theme_mod( 'sohag_whatsapp', '918282022581' );
	}
	$fb = untrailingslashit( (string) get_theme_mod( 'sohag_facebook', '' ) );
	if ( '' === $fb || preg_match( '#^https?://(www\.)?facebook\.com$#', $fb ) ) {
		set_theme_mod( 'sohag_facebook', 'https://www.facebook.com/profile.php?id=100095053184804' );
	}
	$address = trim( (string) get_theme_mod( 'sohag_address', '' ) );
	if ( '' === $address || 'India' === $address ) {
		set_theme_mod( 'sohag_address', 'Amtala, D. H. Road, Kolkata, West Bengal 743398, India' );
	}
	update_option( 'sohag_contact_v2', 1 );
}
add_action( 'after_setup_theme', 'sohag_migrate_contact', 20 );

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
require SOHAG_DIR . '/inc/launch.php';

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
