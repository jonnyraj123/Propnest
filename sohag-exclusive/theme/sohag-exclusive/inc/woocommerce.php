<?php
/**
 * WooCommerce customisations for a Bangladeshi store:
 * simple Bangla checkout, phone validation, Buy Now, delivery info, cart badge fragments.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

/* -------------------------------------------------------------------------
 * Layout
 * ---------------------------------------------------------------------- */

// Theme provides its own wrappers (woocommerce.php), so remove sidebar and default wrappers.
remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );
remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );

add_filter(
	'woocommerce_breadcrumb_defaults',
	function ( $d ) {
		$d['home']      = __( 'হোম', 'sohag-exclusive' );
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
		if ( $product->is_type( 'simple' ) && $product->is_purchasable() && $product->is_in_stock() ) {
			return __( 'কার্টে যোগ করুন', 'sohag-exclusive' );
		}
		if ( $product->is_type( 'variable' ) ) {
			return __( 'অপশন দেখুন', 'sohag-exclusive' );
		}
		return $text;
	},
	10,
	2
);
add_filter( 'woocommerce_product_single_add_to_cart_text', fn() => __( 'কার্টে যোগ করুন', 'sohag-exclusive' ) );

add_filter(
	'woocommerce_sale_flash',
	function ( $html, $post, $product ) {
		if ( $product->is_type( 'simple' ) && $product->get_regular_price() > 0 ) {
			$pct = round( 100 - ( (float) $product->get_sale_price() / (float) $product->get_regular_price() * 100 ) );
			return '<span class="onsale">-' . esc_html( sohag_bn_num( $pct ) ) . '%</span>';
		}
		return '<span class="onsale">' . esc_html__( 'অফার', 'sohag-exclusive' ) . '</span>';
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
 * Single product: Buy Now, WhatsApp order, delivery info
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
			esc_html__( 'এখনই অর্ডার করুন', 'sohag-exclusive' )
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
		/* translators: %s: product name. */
		$wa_text = sprintf( __( 'আমি এই প্রোডাক্টটি অর্ডার করতে চাই: %1$s — %2$s', 'sohag-exclusive' ), $product->get_name(), $product->get_permalink() );
		?>
		<div class="buy-extra">
			<a class="btn btn--wa btn--block" href="<?php echo esc_url( sohag_whatsapp_url( $wa_text ) ); ?>" target="_blank" rel="noopener">
				<?php echo sohag_icon( 'whatsapp' ); // phpcs:ignore ?> <?php esc_html_e( 'WhatsApp-এ অর্ডার করুন', 'sohag-exclusive' ); ?>
			</a>
		</div>
		<div class="delivery-box">
			<div class="delivery-box__row"><?php echo sohag_icon( 'cash' ); // phpcs:ignore ?><span><strong><?php esc_html_e( 'ক্যাশ অন ডেলিভারি', 'sohag-exclusive' ); ?></strong> — <?php esc_html_e( 'পণ্য হাতে পেয়ে টাকা দিন', 'sohag-exclusive' ); ?></span></div>
			<div class="delivery-box__row"><?php echo sohag_icon( 'truck' ); // phpcs:ignore ?><span><?php echo esc_html( sprintf( 'ঢাকার ভিতরে ৳%s (১–২ দিন) • ঢাকার বাইরে ৳%s (২–৪ দিন)', sohag_bn_num( $charges['inside'] ), sohag_bn_num( $charges['outside'] ) ) ); ?></span></div>
			<div class="delivery-box__row"><?php echo sohag_icon( 'shield' ); // phpcs:ignore ?><span><?php esc_html_e( 'ডেলিভারির সময় পণ্য দেখে নিন — ত্রুটি থাকলে এক্সচেঞ্জ', 'sohag-exclusive' ); ?></span></div>
			<div class="delivery-box__row"><?php echo sohag_icon( 'phone' ); // phpcs:ignore ?><span><?php esc_html_e( 'প্রশ্ন আছে? কল করুন:', 'sohag-exclusive' ); ?> <a href="tel:<?php echo esc_attr( preg_replace( '/[^\d+]/', '', sohag_opt( 'phone' ) ) ); ?>"><strong><?php echo esc_html( sohag_opt( 'phone' ) ); ?></strong></a></span></div>
		</div>
		<?php
	},
	35
);

/* -------------------------------------------------------------------------
 * Checkout: short Bangla form (name, mobile, district, area, address)
 * ---------------------------------------------------------------------- */
add_filter(
	'woocommerce_checkout_fields',
	function ( $fields ) {
		$b = &$fields['billing'];

		unset( $b['billing_last_name'], $b['billing_company'], $b['billing_address_2'], $b['billing_postcode'] );

		$b['billing_first_name']['label']       = __( 'আপনার নাম', 'sohag-exclusive' );
		$b['billing_first_name']['placeholder'] = __( 'পূর্ণ নাম লিখুন', 'sohag-exclusive' );
		$b['billing_first_name']['class']       = array( 'form-row-wide' );
		$b['billing_first_name']['priority']    = 10;

		$b['billing_phone']['label']       = __( 'মোবাইল নম্বর', 'sohag-exclusive' );
		$b['billing_phone']['placeholder'] = '01XXXXXXXXX';
		$b['billing_phone']['required']    = true;
		$b['billing_phone']['class']       = array( 'form-row-wide' );
		$b['billing_phone']['priority']    = 20;

		if ( isset( $b['billing_email'] ) ) {
			$b['billing_email']['label']    = __( 'ইমেইল', 'sohag-exclusive' );
			$b['billing_email']['required'] = false;
			$b['billing_email']['priority'] = 90;
		}

		if ( isset( $b['billing_country'] ) ) {
			$b['billing_country']['priority'] = 25;
		}
		if ( isset( $b['billing_state'] ) ) {
			$b['billing_state']['label']    = __( 'জেলা', 'sohag-exclusive' );
			$b['billing_state']['required'] = true;
			$b['billing_state']['class']    = array( 'form-row-first', 'address-field' );
			$b['billing_state']['priority'] = 30;
		}
		if ( isset( $b['billing_city'] ) ) {
			$b['billing_city']['label']       = __( 'থানা / উপজেলা', 'sohag-exclusive' );
			$b['billing_city']['placeholder'] = __( 'যেমন: মিরপুর', 'sohag-exclusive' );
			$b['billing_city']['class']       = array( 'form-row-last', 'address-field' );
			$b['billing_city']['priority']    = 40;
		}
		$b['billing_address_1']['label']       = __( 'সম্পূর্ণ ঠিকানা', 'sohag-exclusive' );
		$b['billing_address_1']['placeholder'] = __( 'বাসা/রোড নম্বর, এলাকা', 'sohag-exclusive' );
		$b['billing_address_1']['priority']    = 50;

		if ( isset( $fields['order']['order_comments'] ) ) {
			$fields['order']['order_comments']['label']       = __( 'অর্ডার নোট', 'sohag-exclusive' );
			$fields['order']['order_comments']['placeholder'] = __( 'রঙ/সাইজ বা ডেলিভারি নিয়ে কিছু বলার থাকলে লিখুন', 'sohag-exclusive' );
		}

		return $fields;
	},
	20
);

// Country locale JS re-applies labels on page load; keep ours for Bangladesh.
add_filter(
	'woocommerce_get_country_locale',
	function ( $locale ) {
		$locale['BD']['state'] = array(
			'label'    => __( 'জেলা', 'sohag-exclusive' ),
			'required' => true,
		);
		$locale['BD']['city']      = array( 'label' => __( 'থানা / উপজেলা', 'sohag-exclusive' ) );
		$locale['BD']['address_1'] = array(
			'label'       => __( 'সম্পূর্ণ ঠিকানা', 'sohag-exclusive' ),
			'placeholder' => __( 'বাসা/রোড নম্বর, এলাকা', 'sohag-exclusive' ),
		);
		$locale['BD']['postcode'] = array(
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
 */
function sohag_normalize_bd_phone( $raw ) {
	$digits = preg_replace( '/\D+/', '', strtr( (string) $raw, array( '০' => '0', '১' => '1', '২' => '2', '৩' => '3', '৪' => '4', '৫' => '5', '৬' => '6', '৭' => '7', '৮' => '8', '৯' => '9' ) ) );
	if ( 0 === strpos( $digits, '880' ) ) {
		$digits = substr( $digits, 2 );
	}
	return preg_match( '/^01[3-9]\d{8}$/', $digits ) ? $digits : '';
}

add_action(
	'woocommerce_after_checkout_validation',
	function ( $data, $errors ) {
		if ( isset( $data['billing_phone'] ) && '' !== $data['billing_phone'] && ! sohag_normalize_bd_phone( $data['billing_phone'] ) ) {
			$errors->add( 'billing_phone_validation', __( 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)।', 'sohag-exclusive' ) );
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

add_filter( 'woocommerce_order_button_text', fn() => __( 'অর্ডার কনফার্ম করুন', 'sohag-exclusive' ) );

add_action(
	'woocommerce_review_order_after_submit',
	function () {
		echo '<div class="checkout-assurance"><span>' . esc_html__( 'নিরাপদ অর্ডার', 'sohag-exclusive' ) . '</span><span>' . esc_html__( 'ক্যাশ অন ডেলিভারি', 'sohag-exclusive' ) . '</span><span>' . esc_html__( 'কনফার্মেশন কল পাবেন', 'sohag-exclusive' ) . '</span></div>';
	}
);

add_filter(
	'woocommerce_thankyou_order_received_text',
	fn() => __( 'ধন্যবাদ! আপনার অর্ডারটি পেয়েছি। খুব শীঘ্রই কল করে কনফার্ম করা হবে। ♥', 'sohag-exclusive' )
);

/**
 * Progress indicator above cart / checkout.
 */
function sohag_checkout_steps( $current ) {
	$steps = array(
		1 => __( 'কার্ট', 'sohag-exclusive' ),
		2 => __( 'তথ্য ও পেমেন্ট', 'sohag-exclusive' ),
		3 => __( 'অর্ডার সম্পন্ন', 'sohag-exclusive' ),
	);
	echo '<ol class="checkout-steps">';
	foreach ( $steps as $n => $label ) {
		$class = $n < $current ? 'is-done' : ( $n === $current ? 'is-active' : '' );
		printf( '<li class="%s"><span>%s</span>%s</li>', esc_attr( $class ), esc_html( sohag_bn_num( $n ) ), esc_html( $label ) );
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
 * Bangla wording for the WooCommerce strings customers see most, so the store reads
 * naturally even when the site language is English. (A full Bangla translation pack
 * from Settings → General → Site Language also works and takes precedence where it exists.)
 */
add_filter(
	'gettext_woocommerce',
	function ( $translation, $text ) {
		static $map = null;
		if ( null === $map ) {
			$map = array(
				'Billing &amp; Shipping'               => 'ডেলিভারি তথ্য',
				'Billing details'                      => 'ডেলিভারি তথ্য',
				'Additional information'               => 'অতিরিক্ত তথ্য',
				'Your order'                           => 'আপনার অর্ডার',
				'Product'                              => 'প্রোডাক্ট',
				'Subtotal'                             => 'সাবটোটাল',
				'Subtotal:'                            => 'সাবটোটাল:',
				'Shipping'                             => 'ডেলিভারি চার্জ',
				'Total'                                => 'সর্বমোট',
				'Total:'                               => 'সর্বমোট:',
				'Price'                                => 'দাম',
				'Quantity'                             => 'পরিমাণ',
				'Cart totals'                          => 'কার্টের হিসাব',
				'Proceed to checkout'                  => 'চেকআউট করুন',
				'Update cart'                          => 'কার্ট আপডেট',
				'Apply coupon'                         => 'কুপন ব্যবহার করুন',
				'Coupon code'                          => 'কুপন কোড',
				'Coupon:'                              => 'কুপন:',
				'Have a coupon?'                       => 'কুপন আছে?',
				'Click here to enter your code'        => 'এখানে ক্লিক করে কোড দিন',
				'Returning customer?'                  => 'আগে অ্যাকাউন্ট খুলেছেন?',
				'Click here to login'                  => 'লগইন করুন',
				'Your cart is currently empty.'        => 'আপনার কার্ট এখন খালি।',
				'Return to shop'                       => 'শপে ফিরে যান',
				'optional'                             => 'ঐচ্ছিক',
				'Description'                          => 'বিবরণ',
				'Related products'                     => 'এরকম আরও প্রোডাক্ট',
				'You may also like&hellip;'            => 'আপনার পছন্দ হতে পারে',
				'Category:'                            => 'ক্যাটাগরি:',
				'Categories:'                          => 'ক্যাটাগরি:',
				'SKU:'                                 => 'কোড:',
				'Out of stock'                         => 'স্টক শেষ',
				'Default sorting'                      => 'সাজানো: ডিফল্ট',
				'Sort by popularity'                   => 'জনপ্রিয়তা অনুযায়ী',
				'Sort by average rating'               => 'রেটিং অনুযায়ী',
				'Sort by latest'                       => 'নতুন আগে',
				'Sort by price: low to high'           => 'দাম: কম থেকে বেশি',
				'Sort by price: high to low'           => 'দাম: বেশি থেকে কম',
				'Order number:'                        => 'অর্ডার নম্বর:',
				'Date:'                                => 'তারিখ:',
				'Payment method:'                      => 'পেমেন্ট মাধ্যম:',
				'Order details'                        => 'অর্ডারের বিবরণ',
				'Billing address'                      => 'ডেলিভারি ঠিকানা',
				'View cart'                            => 'কার্ট দেখুন',
				'Choose an option'                     => 'একটি বেছে নিন',
				'Clear'                                => 'মুছুন',
				'Showing the single result'            => '১ টি প্রোডাক্ট',
				'Shipping:'                            => 'ডেলিভারি চার্জ:',
				'Order received'                       => 'অর্ডার সম্পন্ন',
				'Country / Region'                     => 'দেশ',
				'Place order'                          => 'অর্ডার কনফার্ম করুন',
				'Add to cart'                          => 'কার্টে যোগ করুন',
				'Search results: &ldquo;%s&rdquo;'     => '"%s" এর ফলাফল',
				'Shop'                                 => 'শপ',
				'Home'                                 => 'হোম',
				'Remove this item'                     => 'মুছে ফেলুন',
			);
		}
		return isset( $map[ $text ] ) ? $map[ $text ] : $translation;
	},
	10,
	2
);

add_filter(
	'ngettext_woocommerce',
	function ( $translation, $single, $plural, $number ) {
		if ( 'Showing all %1$d results' === $plural ) {
			return 'মোট %1$d টি প্রোডাক্ট';
		}
		if ( 'Shipping' === $single ) {
			return 'ডেলিভারি চার্জ';
		}
		if ( '%s in stock' === $single ) {
			return 'স্টকে আছে %s টি';
		}
		return $translation;
	},
	10,
	4
);

add_filter(
	'ngettext_with_context_woocommerce',
	function ( $translation, $single ) {
		if ( 'Showing %1$d&ndash;%2$d of %3$d result' === $single ) {
			return '%3$d টির মধ্যে %1$d–%2$d দেখানো হচ্ছে';
		}
		return $translation;
	},
	10,
	2
);

add_filter( 'woocommerce_shipping_package_name', fn() => __( 'ডেলিভারি চার্জ', 'sohag-exclusive' ) );
