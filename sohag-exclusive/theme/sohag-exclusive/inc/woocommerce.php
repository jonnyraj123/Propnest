<?php
/**
 * WooCommerce customisations for a Bangladeshi store:
 * short checkout, BD phone validation, Order Now button, delivery info, cart badge fragments.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

/* -------------------------------------------------------------------------
 * Layout
 * ---------------------------------------------------------------------- */

// Theme provides its own wrappers (woocommerce.php), so remove sidebar and default breadcrumb position.
remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );
remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );

add_filter(
	'woocommerce_breadcrumb_defaults',
	function ( $d ) {
		$d['delimiter'] = ' <span aria-hidden="true">›</span> ';
		return $d;
	}
);

// Result count + ordering in one toolbar row.
remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );
remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30 );
add_action(
	'woocommerce_before_shop_loop',
	function () {
		echo '<div class="shop-toolbar">';
		woocommerce_result_count();
		woocommerce_catalog_ordering();
		echo '</div>';
	},
	25
);

// Title is already shown in the page hero (woocommerce.php).
add_filter( 'woocommerce_show_page_title', '__return_false' );

add_filter( 'loop_shop_columns', fn() => 4 );
add_filter( 'loop_shop_per_page', fn() => 16 );

// Wrap loop image so the hover zoom is clipped.
add_action( 'woocommerce_before_shop_loop_item_title', fn() => print '<span class="product-thumb">', 9 );
add_action( 'woocommerce_before_shop_loop_item_title', fn() => print '</span>', 11 );

add_filter(
	'woocommerce_product_add_to_cart_text',
	function ( $text, $product ) {
		if ( $product->is_type( 'variable' ) ) {
			return __( 'Choose Options', 'sohag-exclusive' );
		}
		return $text;
	},
	10,
	2
);

add_filter(
	'woocommerce_sale_flash',
	function ( $html, $post, $product ) {
		if ( $product->is_type( 'simple' ) && $product->get_regular_price() > 0 ) {
			$pct = round( 100 - ( (float) $product->get_sale_price() / (float) $product->get_regular_price() * 100 ) );
			return '<span class="onsale">-' . esc_html( $pct ) . '%</span>';
		}
		return '<span class="onsale">' . esc_html__( 'Sale', 'sohag-exclusive' ) . '</span>';
	},
	10,
	3
);

/* -------------------------------------------------------------------------
 * Header cart badge — refreshed via WooCommerce cart fragments.
 * ---------------------------------------------------------------------- */
add_filter(
	'woocommerce_add_to_cart_fragments',
	function ( $fragments ) {
		$fragments['span.cart-count[data-cart-count]'] = '<span class="cart-count" data-cart-count>' . esc_html( sohag_cart_count() ) . '</span>';
		return $fragments;
	}
);

add_action(
	'wp_enqueue_scripts',
	function () {
		// Needed so the header badge updates after AJAX add-to-cart on every page.
		wp_enqueue_script( 'wc-cart-fragments' );
	},
	30
);

/* -------------------------------------------------------------------------
 * Single product: Order Now, WhatsApp order, delivery info
 * ---------------------------------------------------------------------- */
add_action(
	'woocommerce_after_add_to_cart_button',
	function () {
		global $product;
		if ( ! $product || ! $product->is_purchasable() || ! $product->is_in_stock() ) {
			return;
		}
		$action = add_query_arg( 'sohag_buy_now', '1', $product->get_permalink() );
		// Simple products identify themselves via the submit button's name/value.
		$name = $product->is_type( 'simple' ) ? ' name="add-to-cart" value="' . esc_attr( $product->get_id() ) . '"' : '';
		printf(
			'<button type="submit" class="button alt sohag-buy-now" formaction="%s"%s>%s</button>',
			esc_url( $action ),
			$name, // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above.
			esc_html__( 'Order Now', 'sohag-exclusive' )
		);
	}
);

add_filter(
	'woocommerce_add_to_cart_redirect',
	function ( $url ) {
		if ( ! empty( $_GET['sohag_buy_now'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return wc_get_checkout_url();
		}
		return $url;
	},
	99
);

// Don't show the "added to cart" notice when going straight to checkout.
add_filter(
	'wc_add_to_cart_message_html',
	function ( $message ) {
		return ! empty( $_GET['sohag_buy_now'] ) ? '' : $message; // phpcs:ignore WordPress.Security.NonceVerification
	}
);

add_action(
	'woocommerce_single_product_summary',
	function () {
		global $product;
		$charges = sohag_delivery_charges();
		/* translators: 1: product name, 2: product URL. */
		$wa_text = sprintf( __( 'Hi, I would like to order: %1$s — %2$s', 'sohag-exclusive' ), $product->get_name(), $product->get_permalink() );
		$wa_url  = sohag_whatsapp_url( $wa_text );
		?>
		<?php if ( $wa_url ) : ?>
			<div class="buy-extra">
				<a class="btn btn--wa btn--block" href="<?php echo esc_url( $wa_url ); ?>" target="_blank" rel="noopener">
					<?php echo sohag_icon( 'whatsapp' ); // phpcs:ignore ?> <span><?php esc_html_e( 'Order on WhatsApp', 'sohag-exclusive' ); ?></span>
				</a>
			</div>
		<?php endif; ?>
		<div class="delivery-box">
			<div class="delivery-box__row"><?php echo sohag_icon( 'cash' ); // phpcs:ignore ?><span><strong><?php esc_html_e( 'Cash on Delivery', 'sohag-exclusive' ); ?></strong> — <?php esc_html_e( 'pay when you receive it', 'sohag-exclusive' ); ?></span></div>
			<div class="delivery-box__row"><?php echo sohag_icon( 'truck' ); // phpcs:ignore ?><span><?php echo esc_html( sprintf( 'Inside Dhaka ৳%d (1–2 days) • Outside Dhaka ৳%d (2–4 days)', $charges['inside'], $charges['outside'] ) ); ?></span></div>
			<div class="delivery-box__row"><?php echo sohag_icon( 'shield' ); // phpcs:ignore ?><span><?php esc_html_e( 'Check the item at delivery — exchange if anything is faulty', 'sohag-exclusive' ); ?></span></div>
			<?php if ( sohag_opt( 'phone' ) ) : ?>
				<div class="delivery-box__row"><?php echo sohag_icon( 'phone' ); // phpcs:ignore ?><span><?php esc_html_e( 'Questions? Call us:', 'sohag-exclusive' ); ?> <a href="<?php echo esc_url( sohag_tel_url() ); ?>"><strong><?php echo esc_html( sohag_opt( 'phone' ) ); ?></strong></a></span></div>
			<?php endif; ?>
		</div>
		<?php
	},
	35
);

/* -------------------------------------------------------------------------
 * Checkout: short form (name, mobile, district, area, address)
 * ---------------------------------------------------------------------- */
add_filter(
	'woocommerce_checkout_fields',
	function ( $fields ) {
		$b = &$fields['billing'];

		unset( $b['billing_last_name'], $b['billing_company'], $b['billing_address_2'], $b['billing_postcode'] );

		$b['billing_first_name']['label']       = __( 'Full name', 'sohag-exclusive' );
		$b['billing_first_name']['placeholder'] = __( 'Your full name', 'sohag-exclusive' );
		$b['billing_first_name']['class']       = array( 'form-row-wide' );
		$b['billing_first_name']['priority']    = 10;

		$b['billing_phone']['label']       = __( 'Mobile number', 'sohag-exclusive' );
		$b['billing_phone']['placeholder'] = '01XXXXXXXXX';
		$b['billing_phone']['required']    = true;
		$b['billing_phone']['class']       = array( 'form-row-wide' );
		$b['billing_phone']['priority']    = 20;

		if ( isset( $b['billing_email'] ) ) {
			$b['billing_email']['label']    = __( 'Email', 'sohag-exclusive' );
			$b['billing_email']['required'] = false;
			$b['billing_email']['priority'] = 90;
		}

		if ( isset( $b['billing_country'] ) ) {
			$b['billing_country']['priority'] = 25;
		}
		if ( isset( $b['billing_state'] ) ) {
			$b['billing_state']['label']    = __( 'District', 'sohag-exclusive' );
			$b['billing_state']['required'] = true;
			$b['billing_state']['class']    = array( 'form-row-first', 'address-field' );
			$b['billing_state']['priority'] = 30;
		}
		if ( isset( $b['billing_city'] ) ) {
			$b['billing_city']['label']       = __( 'Area / Thana', 'sohag-exclusive' );
			$b['billing_city']['placeholder'] = __( 'e.g. Mirpur', 'sohag-exclusive' );
			$b['billing_city']['class']       = array( 'form-row-last', 'address-field' );
			$b['billing_city']['priority']    = 40;
		}
		$b['billing_address_1']['label']       = __( 'Full address', 'sohag-exclusive' );
		$b['billing_address_1']['placeholder'] = __( 'House / road no., area', 'sohag-exclusive' );
		$b['billing_address_1']['priority']    = 50;

		if ( isset( $fields['order']['order_comments'] ) ) {
			$fields['order']['order_comments']['label']       = __( 'Order note', 'sohag-exclusive' );
			$fields['order']['order_comments']['placeholder'] = __( 'Anything about colour, size or delivery?', 'sohag-exclusive' );
		}

		return $fields;
	},
	20
);

// Country locale JS re-applies labels on page load; keep ours for Bangladesh.
add_filter(
	'woocommerce_get_country_locale',
	function ( $locale ) {
		$locale['BD']['state']     = array(
			'label'    => __( 'District', 'sohag-exclusive' ),
			'required' => true,
		);
		$locale['BD']['city']      = array( 'label' => __( 'Area / Thana', 'sohag-exclusive' ) );
		$locale['BD']['address_1'] = array(
			'label'       => __( 'Full address', 'sohag-exclusive' ),
			'placeholder' => __( 'House / road no., area', 'sohag-exclusive' ),
		);
		$locale['BD']['postcode']  = array(
			'required' => false,
			'hidden'   => true,
		);
		return $locale;
	}
);

add_filter(
	'woocommerce_default_address_fields',
	function ( $fields ) {
		if ( isset( $fields['last_name'] ) ) {
			$fields['last_name']['required'] = false;
		}
		if ( isset( $fields['postcode'] ) ) {
			$fields['postcode']['required'] = false;
		}
		return $fields;
	}
);

/**
 * Normalise a Bangladeshi mobile number to 01XXXXXXXXX, or return '' when invalid.
 * Accepts +880 / 880 prefixes, spaces, dashes and Bangla digits.
 */
function sohag_normalize_bd_phone( $raw ) {
	$bn     = array( "\u{09E6}", "\u{09E7}", "\u{09E8}", "\u{09E9}", "\u{09EA}", "\u{09EB}", "\u{09EC}", "\u{09ED}", "\u{09EE}", "\u{09EF}" );
	$digits = preg_replace( '/\D+/', '', str_replace( $bn, range( 0, 9 ), (string) $raw ) );
	if ( 0 === strpos( $digits, '880' ) ) {
		$digits = substr( $digits, 2 );
	}
	return preg_match( '/^01[3-9]\d{8}$/', $digits ) ? $digits : '';
}

add_action(
	'woocommerce_after_checkout_validation',
	function ( $data, $errors ) {
		if ( isset( $data['billing_phone'] ) && '' !== $data['billing_phone'] && ! sohag_normalize_bd_phone( $data['billing_phone'] ) ) {
			$errors->add( 'billing_phone_validation', __( 'Please enter a valid 11-digit mobile number (e.g. 017XXXXXXXX).', 'sohag-exclusive' ) );
		}
	},
	10,
	2
);

add_action(
	'woocommerce_checkout_create_order',
	function ( $order ) {
		$phone = sohag_normalize_bd_phone( $order->get_billing_phone() );
		if ( $phone ) {
			$order->set_billing_phone( $phone );
		}
	}
);

add_filter( 'woocommerce_order_button_text', fn() => __( 'Confirm Order', 'sohag-exclusive' ) );

add_action(
	'woocommerce_review_order_after_submit',
	function () {
		echo '<div class="checkout-assurance"><span>' . esc_html__( 'Secure order', 'sohag-exclusive' ) . '</span><span>' . esc_html__( 'Cash on Delivery', 'sohag-exclusive' ) . '</span><span>' . esc_html__( 'Confirmation call', 'sohag-exclusive' ) . '</span></div>';
	}
);

add_filter(
	'woocommerce_thankyou_order_received_text',
	fn() => __( 'Thank you! We have received your order and will call you shortly to confirm it. ♥', 'sohag-exclusive' )
);

add_filter( 'woocommerce_shipping_package_name', fn() => __( 'Delivery', 'sohag-exclusive' ) );

/**
 * Progress indicator above cart / checkout / thank-you.
 */
function sohag_checkout_steps( $current ) {
	$steps = array(
		1 => __( 'Cart', 'sohag-exclusive' ),
		2 => __( 'Details & Payment', 'sohag-exclusive' ),
		3 => __( 'Order Complete', 'sohag-exclusive' ),
	);
	echo '<ol class="checkout-steps">';
	foreach ( $steps as $n => $label ) {
		$class = $n < $current ? 'is-done' : ( $n === $current ? 'is-active' : '' );
		printf( '<li class="%s"><span>%d</span>%s</li>', esc_attr( $class ), (int) $n, esc_html( $label ) );
	}
	echo '</ol>';
}

add_action(
	'woocommerce_before_thankyou',
	function () {
		sohag_checkout_steps( 3 );
	}
);

/**
 * Clearer wording for a few WooCommerce defaults (billing-only store, so "billing" means delivery).
 */
add_filter(
	'gettext_woocommerce',
	function ( $translation, $text ) {
		static $map = array(
			'Billing &amp; Shipping' => 'Delivery Details',
			'Billing %s'             => '%s',
			'Billing details'        => 'Delivery Details',
			'Billing address'        => 'Delivery Address',
			'Shipping:'              => 'Delivery:',
			'Proceed to checkout'    => 'Proceed to Checkout',
			'Your order'             => 'Your Order',
			'Cart totals'            => 'Order Summary',
		);
		return isset( $map[ $text ] ) ? $map[ $text ] : $translation;
	},
	10,
	2
);
