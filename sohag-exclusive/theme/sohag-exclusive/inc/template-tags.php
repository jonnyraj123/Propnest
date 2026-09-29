<?php
/**
 * Small template helpers.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

/**
 * Brand logo + name.
 */
function sohag_brand() {
	?>
	<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
		<?php
		$logo_id = get_theme_mod( 'custom_logo' );
		if ( $logo_id ) {
			echo wp_get_attachment_image( $logo_id, 'thumbnail', false, array( 'class' => 'custom-logo', 'alt' => get_bloginfo( 'name' ) ) );
		} else {
			printf( '<img src="%s" alt="%s" width="56" height="56">', esc_url( SOHAG_URI . '/assets/img/logo-sm.jpg' ), esc_attr( get_bloginfo( 'name' ) ) );
		}
		?>
		<span class="brand__text">
			<span class="brand__name">Sohag</span>
			<span class="brand__tag">Exclusive</span>
		</span>
	</a>
	<?php
}

function sohag_cart_count() {
	if ( ! sohag_is_wc() || ! WC()->cart ) {
		return 0;
	}
	return (int) WC()->cart->get_cart_contents_count();
}

function sohag_shop_url() {
	return sohag_is_wc() ? wc_get_page_permalink( 'shop' ) : home_url( '/' );
}

/**
 * Menu fallback when no menu is assigned yet.
 */
function sohag_fallback_menu( $args = array() ) {
	$items = array( home_url( '/' ) => __( 'Home', 'sohag-exclusive' ) );
	if ( sohag_is_wc() ) {
		$items[ sohag_shop_url() ] = __( 'All Products', 'sohag-exclusive' );
		foreach ( sohag_categories( 5 ) as $cat ) {
			if ( null === $cat['count'] ) {
				continue; // Theme placeholder, not a real category yet.
			}
			$items[ $cat['url'] ] = $cat['name'];
		}
	}
	$class = ! empty( $args['menu_class'] ) ? $args['menu_class'] : 'menu';
	echo '<ul class="' . esc_attr( $class ) . '">';
	foreach ( $items as $url => $label ) {
		printf( '<li><a href="%s">%s</a></li>', esc_url( $url ), esc_html( $label ) );
	}
	echo '</ul>';
}

/**
 * Default categories that ship with the theme (images from the brand banner).
 */
function sohag_default_categories() {
	return array(
		'earrings'     => array( 'Earrings' ),
		'bangles'      => array( 'Bangles' ),
		'necklaces'    => array( 'Necklaces' ),
		'bags'         => array( 'Bags' ),
		'western-wear' => array( 'Western Wear' ),
		'indian-wear'  => array( 'Indian Wear' ),
	);
}

/**
 * Category list for the homepage: real product categories when they exist, theme defaults otherwise.
 *
 * @return array[] { name, url, img, count }
 */
function sohag_categories( $limit = 6 ) {
	$out = array();

	if ( sohag_is_wc() ) {
		$terms = get_terms(
			array(
				'taxonomy'   => 'product_cat',
				'hide_empty' => true, // Only categories that have products.
				'parent'     => 0,
				'number'     => $limit,
				'orderby'    => 'term_order',
				'exclude'    => array( (int) get_option( 'default_product_cat' ) ),
			)
		);
		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				$thumb = get_term_meta( $term->term_id, 'thumbnail_id', true );
				$img   = $thumb ? wp_get_attachment_image_url( $thumb, 'woocommerce_thumbnail' ) : '';
				if ( ! $img && file_exists( SOHAG_DIR . '/assets/img/cat-' . $term->slug . '.jpg' ) ) {
					$img = SOHAG_URI . '/assets/img/cat-' . $term->slug . '.jpg';
				}
				$out[] = array(
					'name'  => $term->name,
					'url'   => get_term_link( $term ),
					'img'   => $img ? $img : SOHAG_URI . '/assets/img/logo-sm.jpg',
					'count' => (int) $term->count,
				);
			}
		}
	}

	if ( empty( $out ) ) {
		foreach ( sohag_default_categories() as $slug => $names ) {
			$out[] = array(
				'name'  => $names[0],
				'url'   => sohag_shop_url(),
				'img'   => SOHAG_URI . '/assets/img/cat-' . $slug . '.jpg',
				'count' => null,
			);
		}
	}

	return array_slice( $out, 0, $limit );
}

function sohag_pay_badges() {
	?>
	<div class="pay-badges" aria-label="<?php esc_attr_e( 'Payment methods', 'sohag-exclusive' ); ?>">
		<span class="pay-badge pay-badge--cod"><i></i><?php esc_html_e( 'Cash on Delivery', 'sohag-exclusive' ); ?></span>
		<span class="pay-badge pay-badge--upi"><i></i>UPI</span>
		<span class="pay-badge pay-badge--gpay"><i></i>Google Pay</span>
		<span class="pay-badge pay-badge--phonepe"><i></i>PhonePe</span>
		<span class="pay-badge pay-badge--paytm"><i></i>Paytm</span>
	</div>
	<?php
}

/**
 * Delivery time shown in info boxes (Appearance → Customize → Sohag Exclusive Settings).
 */
function sohag_delivery_days() {
	return (string) sohag_opt( 'delivery_days' );
}

function sohag_announcements() {
	$lines = preg_split( '/\r\n|\r|\n/', (string) sohag_opt( 'announcement' ) );
	return array_values( array_filter( array_map( 'trim', $lines ) ) );
}

function sohag_tel_url() {
	return 'tel:' . preg_replace( '/[^\d+]/', '', sohag_opt( 'phone' ) );
}
