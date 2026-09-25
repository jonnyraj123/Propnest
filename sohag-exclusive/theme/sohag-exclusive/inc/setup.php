<?php
/**
 * One-click store setup: Appearance → Sohag Store Setup.
 *
 * Configures WooCommerce for India (₹ currency, India only, billing-only address),
 * classic cart/checkout pages, free delivery all over India, free Cash on Delivery,
 * mobile-banking gateway, product categories with images, info pages and menus.
 * Every step is idempotent — running it again updates rather than duplicates.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'admin_menu',
	function () {
		add_theme_page(
			__( 'Sohag Store Setup', 'sohag-exclusive' ),
			__( 'Sohag Store Setup', 'sohag-exclusive' ),
			'manage_options',
			'sohag-setup',
			'sohag_setup_page'
		);
	}
);

// Nudge towards the setup page after switching to the theme.
add_action(
	'after_switch_theme',
	function () {
		set_transient( 'sohag_setup_notice', 1, WEEK_IN_SECONDS );
	}
);

add_action(
	'admin_notices',
	function () {
		if ( ! current_user_can( 'manage_options' ) || get_option( 'sohag_setup_done' ) ) {
			return;
		}
		$screen = get_current_screen();
		if ( $screen && 'appearance_page_sohag-setup' === $screen->id ) {
			return;
		}
		if ( ! get_transient( 'sohag_setup_notice' ) && ! sohag_is_wc() ) {
			return;
		}
		printf(
			'<div class="notice notice-info"><p><strong>Sohag Exclusive:</strong> %s <a class="button button-primary" href="%s">%s</a></p></div>',
			esc_html__( 'Set up your store (currency, delivery charges, payments, categories, pages) in one click.', 'sohag-exclusive' ),
			esc_url( admin_url( 'themes.php?page=sohag-setup' ) ),
			esc_html__( 'Start setup', 'sohag-exclusive' )
		);
	}
);

function sohag_setup_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$log = array();
	if ( isset( $_POST['sohag_run_setup'] ) && check_admin_referer( 'sohag_setup' ) ) {
		$log = sohag_run_setup(
			array(
				'upi_id'   => isset( $_POST['upi_id'] ) ? sanitize_text_field( wp_unslash( $_POST['upi_id'] ) ) : '',
				'upi_name' => isset( $_POST['upi_name'] ) ? sanitize_text_field( wp_unslash( $_POST['upi_name'] ) ) : '',
				'address'  => isset( $_POST['address'] ) ? sanitize_text_field( wp_unslash( $_POST['address'] ) ) : '',
				'phone'    => isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '',
				'whatsapp' => isset( $_POST['whatsapp'] ) ? sanitize_text_field( wp_unslash( $_POST['whatsapp'] ) ) : '',
				'facebook' => isset( $_POST['facebook'] ) ? esc_url_raw( wp_unslash( $_POST['facebook'] ) ) : '',
				'email'    => isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '',
				'demo'     => ! empty( $_POST['demo'] ),
			)
		);
	}

	$gw = get_option( 'woocommerce_sohag_upi_settings', array() );
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Sohag Exclusive — Store Setup', 'sohag-exclusive' ); ?></h1>

		<?php if ( ! sohag_is_wc() ) : ?>
			<div class="notice notice-warning"><p>
				<?php esc_html_e( 'First install and activate the WooCommerce plugin (Plugins → Add New → "WooCommerce"), then come back to this page.', 'sohag-exclusive' ); ?>
			</p></div>
		<?php endif; ?>

		<?php if ( $log ) : ?>
			<div class="notice notice-success"><p><strong><?php esc_html_e( 'Setup complete:', 'sohag-exclusive' ); ?></strong></p>
				<ul style="list-style:disc;padding-left:20px">
					<?php foreach ( $log as $line ) : ?>
						<li><?php echo esc_html( $line ); ?></li>
					<?php endforeach; ?>
				</ul>
				<p><a class="button button-primary" href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank"><?php esc_html_e( 'View website', 'sohag-exclusive' ); ?></a></p>
			</div>
		<?php endif; ?>

		<form method="post" style="max-width:720px;background:#fff;padding:20px 24px;border:1px solid #dcdcde;border-radius:8px">
			<?php wp_nonce_field( 'sohag_setup' ); ?>
			<p><?php esc_html_e( 'Delivery is set to free all over India, and Cash on Delivery has no extra charge.', 'sohag-exclusive' ); ?></p>

			<h2><?php esc_html_e( 'UPI payment (optional)', 'sohag-exclusive' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr><th><label for="upi_id"><?php esc_html_e( 'UPI ID', 'sohag-exclusive' ); ?></label></th><td><input id="upi_id" name="upi_id" type="text" class="regular-text" placeholder="yourname@okaxis" value="<?php echo esc_attr( $gw['upi_id'] ?? '' ); ?>"><p class="description"><?php esc_html_e( 'Leave empty to offer Cash on Delivery only.', 'sohag-exclusive' ); ?></p></td></tr>
				<tr><th><label for="upi_name"><?php esc_html_e( 'Payee name', 'sohag-exclusive' ); ?></label></th><td><input id="upi_name" name="upi_name" type="text" class="regular-text" value="<?php echo esc_attr( $gw['payee_name'] ?? 'Sohag Exclusive' ); ?>"></td></tr>
			</table>

			<h2><?php esc_html_e( 'Contact', 'sohag-exclusive' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr><th><label for="phone"><?php esc_html_e( 'Phone', 'sohag-exclusive' ); ?></label></th><td><input id="phone" name="phone" type="text" class="regular-text" value="<?php echo esc_attr( get_theme_mod( 'sohag_phone', '' ) ); ?>" placeholder="+91 98XXX XXXXX"></td></tr>
				<tr><th><label for="whatsapp">WhatsApp</label></th><td><input id="whatsapp" name="whatsapp" type="text" class="regular-text" value="<?php echo esc_attr( get_theme_mod( 'sohag_whatsapp', '' ) ); ?>" placeholder="919876543210"></td></tr>
				<tr><th><label for="email">Email</label></th><td><input id="email" name="email" type="email" class="regular-text" value="<?php echo esc_attr( get_theme_mod( 'sohag_email', '' ) ); ?>" placeholder="info@sohagexclusive.com"></td></tr>
				<tr><th><label for="facebook">Facebook</label></th><td><input id="facebook" name="facebook" type="url" class="regular-text" value="<?php echo esc_attr( get_theme_mod( 'sohag_facebook', '' ) ); ?>" placeholder="https://www.facebook.com/..."></td></tr>
				<tr><th><label for="address"><?php esc_html_e( 'Address', 'sohag-exclusive' ); ?></label></th><td><input id="address" name="address" type="text" class="regular-text" value="<?php echo esc_attr( get_theme_mod( 'sohag_address', '' ) ); ?>" placeholder="City, State, India"></td></tr>
			</table>

			<p><label><input type="checkbox" name="demo" value="1"> <?php esc_html_e( 'Create 6 sample products for testing (as drafts — edit photos/prices, then publish)', 'sohag-exclusive' ); ?></label></p>

			<p><button class="button button-primary button-hero" name="sohag_run_setup" value="1" <?php disabled( ! sohag_is_wc() ); ?>><?php esc_html_e( 'Run Store Setup', 'sohag-exclusive' ); ?></button></p>
			<p class="description"><?php esc_html_e( 'Safe to run again — existing settings are updated, nothing is duplicated.', 'sohag-exclusive' ); ?></p>
		</form>
	</div>
	<?php
}

/**
 * Run all setup steps. Returns a human-readable log.
 */
function sohag_run_setup( $args ) {
	$log = array();

	// Contact details.
	foreach ( array( 'phone', 'whatsapp', 'facebook', 'email', 'address' ) as $key ) {
		if ( isset( $args[ $key ] ) && '' !== $args[ $key ] ) {
			set_theme_mod( 'sohag_' . $key, $args[ $key ] );
		}
	}
	update_option( 'timezone_string', 'Asia/Kolkata' );

	// 1. Store basics.
	$options = array(
		'woocommerce_default_country'                    => 'IN',
		'woocommerce_allowed_countries'                  => 'specific',
		'woocommerce_specific_allowed_countries'         => array( 'IN' ),
		'woocommerce_ship_to_countries'                  => '',
		'woocommerce_ship_to_destination'                => 'billing_only',
		'woocommerce_currency'                           => 'INR',
		'woocommerce_currency_pos'                       => 'left',
		'woocommerce_price_num_decimals'                 => 0,
		'woocommerce_calc_taxes'                         => 'no',
		'woocommerce_enable_guest_checkout'              => 'yes',
		'woocommerce_enable_checkout_login_reminder'     => 'yes',
		'woocommerce_enable_signup_and_login_from_checkout' => 'no',
		'woocommerce_enable_shipping_calc'               => 'no',
		'woocommerce_shipping_cost_requires_address'     => 'no',
		'woocommerce_checkout_phone_field'               => 'required',
		'woocommerce_checkout_company_field'             => 'hidden',
		'woocommerce_checkout_address_2_field'           => 'optional',
		'woocommerce_cart_redirect_after_add'            => 'no',
		'woocommerce_enable_ajax_add_to_cart'            => 'yes',
		'woocommerce_checkout_privacy_policy_text'       => 'Your details are only used to process and deliver your order. See our [privacy_policy].',
		'woocommerce_registration_privacy_policy_text'   => 'Your details are only used to manage your account and orders. See our [privacy_policy].',
		// WooCommerce 9+ starts new stores in "Coming soon" mode — go live.
		'woocommerce_coming_soon'                        => 'no',
	);
	foreach ( $options as $k => $v ) {
		update_option( $k, $v );
	}
	$log[] = 'Currency ₹ (INR), country India, time zone Asia/Kolkata, guest checkout on, store live (Coming soon off)';

	// 2. Classic cart & checkout (the custom payment fields need the classic checkout).
	$pages = array(
		'cart'     => '[woocommerce_cart]',
		'checkout' => '[woocommerce_checkout]',
	);
	foreach ( $pages as $key => $shortcode ) {
		$page_id = wc_get_page_id( $key );
		if ( $page_id > 0 && get_post( $page_id ) ) {
			wp_update_post(
				array(
					'ID'           => $page_id,
					'post_content' => '<!-- wp:shortcode -->' . $shortcode . '<!-- /wp:shortcode -->',
				)
			);
		} else {
			$page_id = wp_insert_post(
				array(
					'post_type'    => 'page',
					'post_status'  => 'publish',
					'post_title'   => 'cart' === $key ? 'Cart' : 'Checkout',
					'post_content' => $shortcode,
				)
			);
			update_option( 'woocommerce_' . $key . '_page_id', $page_id );
		}
	}
	// Clean titles for WooCommerce pages.
	foreach ( array( 'shop' => 'Shop', 'cart' => 'Cart', 'checkout' => 'Checkout', 'myaccount' => 'My Account' ) as $key => $title ) {
		$pid = wc_get_page_id( $key );
		if ( $pid > 0 ) {
			wp_update_post( array( 'ID' => $pid, 'post_title' => $title ) );
		}
	}
	$log[] = 'Cart and checkout pages switched to the short classic checkout';

	// 3. Free delivery all over India (one zone, free shipping). Remove zones from earlier versions.
	foreach ( WC_Shipping_Zones::get_zones() as $z ) {
		if ( in_array( $z['zone_name'], array( 'Inside Dhaka', 'Outside Dhaka (all Bangladesh)' ), true ) ) {
			WC_Shipping_Zones::delete_zone( $z['id'] );
		}
	}
	sohag_upsert_zone( 'India', array( array( 'IN', 'country' ) ), 'Free Delivery' );
	$log[] = 'Free delivery all over India';

	// 4. Cash on Delivery.
	$cod = get_option( 'woocommerce_cod_settings', array() );
	update_option(
		'woocommerce_cod_settings',
		array_merge(
			is_array( $cod ) ? $cod : array(),
			array(
				'enabled'            => 'yes',
				'title'              => 'Cash on Delivery (Free — no extra charge)',
				'description'        => 'Pay in cash or UPI to the delivery person when your order arrives. No COD fee.',
				'instructions'       => 'Please keep the exact amount ready. We will contact you to confirm your order.',
				'enable_for_methods' => array(),
				'enable_for_virtual' => 'yes',
			)
		)
	);
	$log[] = 'Free Cash on Delivery enabled (no extra charge)';

	// 5. UPI gateway. Turn off the old Bangladesh mobile-banking gateway if an earlier version enabled it.
	$old = get_option( 'woocommerce_sohag_mobile_pay_settings' );
	if ( is_array( $old ) ) {
		$old['enabled'] = 'no';
		update_option( 'woocommerce_sohag_mobile_pay_settings', $old );
	}
	$gw               = get_option( 'woocommerce_sohag_upi_settings', array() );
	$gw               = is_array( $gw ) ? $gw : array();
	$gw['upi_id']     = $args['upi_id'];
	$gw['payee_name'] = $args['upi_name'] ? $args['upi_name'] : 'Sohag Exclusive';
	$gw['enabled']    = $args['upi_id'] ? 'yes' : 'no';
	update_option( 'woocommerce_sohag_upi_settings', $gw );
	$log[] = $args['upi_id'] ? 'UPI payment enabled' : 'No UPI ID given — UPI stays off (Cash on Delivery only)';

	// Show COD first at checkout.
	$order = (array) get_option( 'woocommerce_gateway_order', array() );
	$order = array_merge( $order, array( 'cod' => 0, 'sohag_upi' => 1 ) );
	update_option( 'woocommerce_gateway_order', $order );

	// 6. Categories with images.
	$cat_ids = array();
	$i       = 0;
	foreach ( sohag_default_categories() as $slug => $names ) {
		$term = get_term_by( 'slug', $slug, 'product_cat' );
		if ( ! $term ) {
			$res = wp_insert_term( $names[0], 'product_cat', array( 'slug' => $slug ) );
			if ( is_wp_error( $res ) ) {
				continue;
			}
			$term_id = $res['term_id'];
		} else {
			$term_id = $term->term_id;
		}
		update_term_meta( $term_id, 'order', $i++ );
		if ( ! get_term_meta( $term_id, 'thumbnail_id', true ) ) {
			$att = sohag_import_theme_image( 'cat-' . $slug . '.jpg', $names[0] );
			if ( $att ) {
				update_term_meta( $term_id, 'thumbnail_id', $att );
			}
		}
		$cat_ids[ $slug ] = $term_id;
	}
	$log[] = 'Categories: Earrings, Bangles, Necklaces, Bags, Western Wear, Indian Wear';

	// 7. Info pages.
	$info_pages = sohag_info_pages();
	$page_ids   = array();
	foreach ( $info_pages as $slug => $page ) {
		$existing = get_page_by_path( $slug );
		if ( $existing ) {
			$page_ids[ $slug ] = $existing->ID;
			// Refresh the text only if the owner hasn't edited the page since the theme wrote it.
			$stored = get_post_meta( $existing->ID, '_sohag_content_hash', true );
			if ( $stored && md5( $existing->post_content ) === $stored ) {
				wp_update_post(
					array(
						'ID'           => $existing->ID,
						'post_title'   => $page[0],
						'post_content' => $page[1],
					)
				);
				update_post_meta( $existing->ID, '_sohag_content_hash', md5( get_post( $existing->ID )->post_content ) );
			}
			continue;
		}
		$page_ids[ $slug ] = wp_insert_post(
			array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_name'    => $slug,
				'post_title'   => $page[0],
				'post_content' => $page[1],
			)
		);
		if ( $page_ids[ $slug ] ) {
			update_post_meta( $page_ids[ $slug ], '_sohag_content_hash', md5( get_post( $page_ids[ $slug ] )->post_content ) );
		}
	}
	if ( ! empty( $page_ids['privacy-policy'] ) ) {
		update_option( 'wp_page_for_privacy_policy', $page_ids['privacy-policy'] );
	}
	// Terms page is linked in the footer; no mandatory checkbox at checkout (keeps ordering quick).
	$log[] = 'Pages: About Us, Contact, Shipping Policy, Returns & Refunds, Cancellation Policy, Privacy Policy, Terms & Conditions';

	// 8. Menus.
	sohag_build_menus( $cat_ids, $page_ids );
	$log[] = 'Main menu and footer menu assigned';

	// 9. Site icon + permalinks.
	if ( ! get_option( 'site_icon' ) ) {
		$icon = sohag_import_theme_image( 'site-icon.png', 'Sohag Exclusive' );
		if ( $icon ) {
			update_option( 'site_icon', $icon );
		}
	}
	if ( ! get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
	}
	flush_rewrite_rules();

	// 10. Demo products.
	if ( $args['demo'] ) {
		$made  = sohag_create_demo_products( $cat_ids );
		$log[] = sprintf( '%d sample products created as drafts (Products → Drafts)', $made );
	}

	update_option( 'sohag_setup_done', time() );
	delete_transient( 'sohag_setup_notice' );

	return $log;
}

/**
 * Create or update a shipping zone with one flat-rate method.
 */
function sohag_upsert_zone( $name, $locations, $method_title ) {
	$zone = null;
	foreach ( WC_Shipping_Zones::get_zones() as $z ) {
		if ( $z['zone_name'] === $name ) {
			$zone = new WC_Shipping_Zone( $z['id'] );
			break;
		}
	}
	if ( ! $zone ) {
		$zone = new WC_Shipping_Zone();
		$zone->set_zone_name( $name );
	}
	$zone->set_zone_order( 1 );
	$zone->clear_locations();
	foreach ( $locations as $loc ) {
		$zone->add_location( $loc[0], $loc[1] );
	}
	$zone->save();

	$instance_id = 0;
	foreach ( $zone->get_shipping_methods() as $method ) {
		if ( 'free_shipping' === $method->id ) {
			$instance_id = $method->instance_id;
		} elseif ( 'flat_rate' === $method->id ) {
			$zone->delete_shipping_method( $method->instance_id ); // Delivery is free — no paid options.
		}
	}
	if ( ! $instance_id ) {
		$instance_id = $zone->add_shipping_method( 'free_shipping' );
	}
	if ( $instance_id ) {
		update_option(
			'woocommerce_free_shipping_' . $instance_id . '_settings',
			array(
				'title'            => $method_title,
				'requires'         => '',
				'min_amount'       => '0',
				'ignore_discounts' => 'no',
			)
		);
	}
	WC_Cache_Helper::get_transient_version( 'shipping', true );
}

/**
 * Copy an image from the theme into the Media Library (once) and return its attachment ID.
 */
function sohag_import_theme_image( $file, $title ) {
	$existing = get_posts(
		array(
			'post_type'   => 'attachment',
			'meta_key'    => '_sohag_theme_image', // phpcs:ignore WordPress.DB.SlowDBQuery
			'meta_value'  => $file, // phpcs:ignore WordPress.DB.SlowDBQuery
			'numberposts' => 1,
			'fields'      => 'ids',
		)
	);
	if ( $existing ) {
		return (int) $existing[0];
	}

	$path = SOHAG_DIR . '/assets/img/' . $file;
	if ( ! file_exists( $path ) ) {
		return 0;
	}
	$upload = wp_upload_bits( $file, null, file_get_contents( $path ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	if ( ! empty( $upload['error'] ) ) {
		return 0;
	}
	$type = wp_check_filetype( $upload['file'] );
	$id   = wp_insert_attachment(
		array(
			'post_mime_type' => $type['type'],
			'post_title'     => $title,
			'post_status'    => 'inherit',
		),
		$upload['file']
	);
	if ( is_wp_error( $id ) || ! $id ) {
		return 0;
	}
	require_once ABSPATH . 'wp-admin/includes/image.php';
	wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $upload['file'] ) );
	update_post_meta( $id, '_sohag_theme_image', $file );
	return (int) $id;
}

function sohag_build_menus( $cat_ids, $page_ids ) {
	$locations = get_theme_mod( 'nav_menu_locations', array() );

	if ( empty( $locations['primary'] ) || ! wp_get_nav_menu_object( $locations['primary'] ) ) {
		$menu_id = wp_create_nav_menu( 'Sohag Main Menu' );
		if ( ! is_wp_error( $menu_id ) ) {
			wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'Home', 'menu-item-url' => home_url( '/' ), 'menu-item-status' => 'publish' ) );
			wp_update_nav_menu_item(
				$menu_id,
				0,
				array(
					'menu-item-title'     => 'Shop All',
					'menu-item-object'    => 'page',
					'menu-item-object-id' => wc_get_page_id( 'shop' ),
					'menu-item-type'      => 'post_type',
					'menu-item-status'    => 'publish',
				)
			);
			$jewellery = wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'Jewellery', 'menu-item-url' => '#', 'menu-item-status' => 'publish' ) );
			foreach ( array( 'earrings', 'bangles', 'necklaces' ) as $slug ) {
				if ( isset( $cat_ids[ $slug ] ) ) {
					sohag_menu_cat( $menu_id, $cat_ids[ $slug ], $jewellery );
				}
			}
			if ( isset( $cat_ids['bags'] ) ) {
				sohag_menu_cat( $menu_id, $cat_ids['bags'], 0 );
			}
			$fashion = wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'Clothing', 'menu-item-url' => '#', 'menu-item-status' => 'publish' ) );
			foreach ( array( 'western-wear', 'indian-wear' ) as $slug ) {
				if ( isset( $cat_ids[ $slug ] ) ) {
					sohag_menu_cat( $menu_id, $cat_ids[ $slug ], $fashion );
				}
			}
			if ( ! empty( $page_ids['contact'] ) ) {
				sohag_menu_page( $menu_id, $page_ids['contact'] );
			}
			$locations['primary'] = $menu_id;
		}
	}

	if ( empty( $locations['footer'] ) || ! wp_get_nav_menu_object( $locations['footer'] ) ) {
		$menu_id = wp_create_nav_menu( 'Sohag Footer Menu' );
		if ( ! is_wp_error( $menu_id ) ) {
			foreach ( array( 'about-us', 'shipping-policy', 'return-refund-policy', 'cancellation-policy', 'privacy-policy', 'terms-and-conditions', 'contact' ) as $slug ) {
				if ( ! empty( $page_ids[ $slug ] ) ) {
					sohag_menu_page( $menu_id, $page_ids[ $slug ] );
				}
			}
			$locations['footer'] = $menu_id;
		}
	}

	set_theme_mod( 'nav_menu_locations', $locations );
}

function sohag_menu_cat( $menu_id, $term_id, $parent ) {
	wp_update_nav_menu_item(
		$menu_id,
		0,
		array(
			'menu-item-object'    => 'product_cat',
			'menu-item-object-id' => $term_id,
			'menu-item-type'      => 'taxonomy',
			'menu-item-parent-id' => $parent,
			'menu-item-status'    => 'publish',
		)
	);
}

function sohag_menu_page( $menu_id, $page_id ) {
	wp_update_nav_menu_item(
		$menu_id,
		0,
		array(
			'menu-item-object'    => 'page',
			'menu-item-object-id' => $page_id,
			'menu-item-type'      => 'post_type',
			'menu-item-status'    => 'publish',
		)
	);
}

/**
 * Contact block reused on the policy pages (only the details that are filled in).
 */
function sohag_contact_html() {
	$rows = array();
	if ( sohag_opt( 'email' ) ) {
		$rows[] = 'Email: <a href="mailto:' . esc_attr( sohag_opt( 'email' ) ) . '">' . esc_html( sohag_opt( 'email' ) ) . '</a>';
	}
	if ( sohag_opt( 'phone' ) ) {
		$rows[] = 'Phone: ' . esc_html( sohag_opt( 'phone' ) );
	}
	if ( sohag_opt( 'whatsapp' ) ) {
		$rows[] = 'WhatsApp: <a href="' . esc_url( sohag_whatsapp_url() ) . '">+' . esc_html( preg_replace( '/\D+/', '', sohag_opt( 'whatsapp' ) ) ) . '</a>';
	}
	if ( sohag_opt( 'address' ) ) {
		$rows[] = 'Address: ' . esc_html( sohag_opt( 'address' ) );
	}
	$rows[] = 'Hours: every day, 10am – 8pm IST';
	return '<p>' . implode( '<br>', $rows ) . '</p>';
}

/**
 * Store policy pages, written for an Indian online store selling handmade products.
 * Edit them freely in Pages afterwards — re-running setup only refreshes pages you have not edited.
 */
function sohag_info_pages() {
	$days      = esc_html( sohag_delivery_days() );
	$contact   = sohag_contact_html();
	$grievance = esc_html( sohag_opt( 'grievance' ) );
	$updated   = esc_html( wp_date( 'j F Y' ) );

	return array(
		'about-us'             => array(
			'About Us',
			"<h2>Sohag Exclusive — Wear Your Story</h2>
<p>Sohag Exclusive is a handmade fashion brand from India. We make earrings, bangles, necklaces and bags by hand, and bring you carefully chosen western and Indian wear.</p>
<p><em>Handmade is not just a product, it's a feeling.</em> Every piece is made with care, so each one is a little different — just like you.</p>
<h3>Why shop with us</h3>
<ul>
<li>Free delivery all over India</li>
<li>Free Cash on Delivery — no extra charge</li>
<li>Easy 7-day exchange or refund on damaged or wrong items</li>
<li>Custom colours and designs on request</li>
</ul>",
		),
		'shipping-policy'      => array(
			'Shipping Policy',
			"<p><em>Last updated: {$updated}</em></p>
<h3>Delivery charges</h3>
<ul>
<li><strong>Delivery is free on every order, all over India.</strong> There is no minimum order value.</li>
<li><strong>Cash on Delivery is free.</strong> We do not charge any COD fee.</li>
</ul>
<h3>Dispatch and delivery time</h3>
<ul>
<li>Ready items are packed and dispatched within 1–3 working days.</li>
<li>Custom and made-to-order items are dispatched within 5–7 working days. We will tell you the timeline when you order.</li>
<li>After dispatch, delivery usually takes {$days}. Remote areas (for example parts of the North-East, Jammu &amp; Kashmir, Ladakh and the islands) can take a few days longer.</li>
<li>Working days are Monday to Saturday, excluding public holidays.</li>
</ul>
<h3>Tracking</h3>
<p>Once your order is dispatched, we send the courier name and tracking number by SMS, WhatsApp or email.</p>
<h3>Address and delivery attempts</h3>
<ul>
<li>Please enter your full address, correct 6-digit PIN code and an active mobile number. The courier may call you before delivery.</li>
<li>The courier usually makes up to 3 delivery attempts. If the order cannot be delivered because the address is wrong or the phone is unreachable, it returns to us and we will contact you.</li>
</ul>
<h3>Damaged parcel</h3>
<p>If the outer package looks damaged or tampered with, please do not accept it, or record an unboxing video while opening it, and contact us within 48 hours.</p>
<h3>Contact</h3>
{$contact}",
		),
		'return-refund-policy' => array(
			'Returns & Refunds',
			"<p><em>Last updated: {$updated}</em></p>
<p>We check every piece before it leaves us. If something is not right, we will make it right.</p>
<h3>When you can return or exchange</h3>
<ul>
<li>The item arrived <strong>damaged or defective</strong>, or</li>
<li>You received the <strong>wrong item</strong> (different product, colour or size from what you ordered).</li>
</ul>
<p>Please contact us <strong>within 7 days of delivery</strong>.</p>
<h3>Conditions</h3>
<ul>
<li>Please share photos, and an <strong>unboxing video</strong> where possible. It helps us resolve your request quickly.</li>
<li>The item must be unused, with its original packaging and tags.</li>
<li>For hygiene reasons, earrings can be returned only if they are damaged, defective or the wrong item.</li>
</ul>
<h3>Items we cannot take back</h3>
<ul>
<li>Custom-made or personalised items, unless they arrive damaged or different from what was agreed.</li>
<li>Items bought on final sale.</li>
<li>Returns for change of mind. Because every piece is handmade, small differences in shade, size or pattern are normal and are not defects.</li>
</ul>
<h3>How to request a return</h3>
<ol>
<li>Send your order number, photos and video by WhatsApp or email.</li>
<li>We reply within 48 hours. Once approved, we arrange a free reverse pickup. If pickup is not available at your PIN code, we will ask you to courier the item and refund the courier cost.</li>
<li>After we receive and check the item, we send a replacement or process your refund, as you prefer.</li>
</ol>
<h3>Refunds</h3>
<ul>
<li>Refunds are processed within 5–7 working days after we receive the returned item.</li>
<li>Prepaid (UPI) orders are refunded to the same UPI ID or account.</li>
<li>Cash on Delivery orders are refunded by UPI or bank transfer to details you share with us.</li>
<li>Delivery is free, so there are no delivery charges to deduct.</li>
</ul>
<h3>Contact</h3>
{$contact}",
		),
		'cancellation-policy'  => array(
			'Cancellation Policy',
			"<p><em>Last updated: {$updated}</em></p>
<ul>
<li><strong>Before dispatch:</strong> you can cancel free of charge. Message us on WhatsApp or email with your order number.</li>
<li><strong>After dispatch:</strong> the order cannot be cancelled. You may refuse a Cash on Delivery parcel at the door, but please tell us first.</li>
<li><strong>Custom orders:</strong> can be cancelled only before we start making them.</li>
<li>Prepaid orders cancelled before dispatch are refunded in full within 5–7 working days to the original payment method.</li>
<li>We may cancel an order if an item is out of stock, if the order cannot be confirmed by phone, or if the address is not serviceable. You will receive a full refund for any amount already paid.</li>
<li>To keep Cash on Delivery free for everyone, we may ask for prepayment from customers who have refused several COD orders without reason.</li>
</ul>
<h3>Contact</h3>
{$contact}",
		),
		'privacy-policy'       => array(
			'Privacy Policy',
			"<p><em>Last updated: {$updated}</em></p>
<p>This policy explains how Sohag Exclusive (\"we\", \"us\") collects and uses your personal data when you use sohagexclusive.com, in line with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.</p>
<h3>What we collect</h3>
<ul>
<li>Name, mobile number, email (optional), delivery address and PIN code, when you place an order.</li>
<li>Order details and, for UPI payments, the UTR / reference number you enter. We never ask for or store your UPI PIN, card or bank passwords.</li>
<li>Basic technical data such as browser type and pages visited, using cookies needed for the cart and checkout.</li>
</ul>
<h3>How we use it</h3>
<ul>
<li>To confirm, pack, ship and deliver your order, and to contact you about it.</li>
<li>To handle returns, refunds and customer support.</li>
<li>To send offers, only if you agree. You can opt out at any time.</li>
</ul>
<h3>Who we share it with</h3>
<ul>
<li>Courier and logistics partners, only what they need to deliver your order.</li>
<li>Payment and technology service providers that run this website.</li>
<li>Government authorities, when required by law.</li>
</ul>
<p>We do not sell or rent your personal data.</p>
<h3>How long we keep it</h3>
<p>We keep order records for as long as needed for delivery, support, accounting and legal requirements, and then delete them.</p>
<h3>Your rights</h3>
<p>You can ask to access, correct or delete your personal data, or withdraw consent for marketing, by contacting us below.</p>
<h3>Grievance Officer</h3>
<p>Name: {$grievance}</p>
{$contact}
<p>We acknowledge complaints within 48 hours and aim to resolve them within one month.</p>",
		),
		'terms-and-conditions' => array(
			'Terms & Conditions',
			"<p><em>Last updated: {$updated}</em></p>
<p>By using sohagexclusive.com and placing an order, you agree to these terms.</p>
<h3>Products</h3>
<ul>
<li>Our products are handmade. Small variations in colour, size and finish are part of their character and are not defects.</li>
<li>Colours may look slightly different on screen than in real life because of lighting and display settings.</li>
</ul>
<h3>Prices and payment</h3>
<ul>
<li>All prices are in Indian Rupees (₹) and include applicable taxes.</li>
<li>Delivery is free all over India, and Cash on Delivery has no extra charge.</li>
<li>You can pay by Cash on Delivery or UPI. UPI orders are confirmed after we verify the payment.</li>
</ul>
<h3>Orders</h3>
<ul>
<li>An order is confirmed once we accept it. We may call you to confirm Cash on Delivery orders.</li>
<li>We may refuse or cancel an order in case of a pricing error, stock issue, unverifiable details or suspected misuse, and will refund any amount paid.</li>
</ul>
<h3>Shipping, returns and cancellation</h3>
<p>Please read our Shipping Policy, Returns &amp; Refunds and Cancellation Policy, which form part of these terms.</p>
<h3>Intellectual property</h3>
<p>All designs, photos, logos and text on this website belong to Sohag Exclusive and may not be copied or reused without our written permission.</p>
<h3>Liability</h3>
<p>Our liability for any order is limited to the amount you paid for that order.</p>
<h3>Governing law</h3>
<p>These terms are governed by the laws of India.</p>
<h3>Grievance Officer</h3>
<p>Name: {$grievance}</p>
{$contact}",
		),
		'contact'              => array(
			'Contact',
			"<p>We are happy to help with orders, custom designs and returns.</p>
{$contact}
<p>Follow us on <a href=\"" . esc_url( sohag_opt( 'facebook' ) ) . "\">Facebook</a> for new designs and offers.</p>
<h3>Grievance Officer</h3>
<p>Name: {$grievance}<br>We acknowledge complaints within 48 hours and aim to resolve them within one month.</p>",
		),
	);
}

/**
 * Draft sample products so the owner can see the layout, then edit and publish.
 */
function sohag_create_demo_products( $cat_ids ) {
	$demo = array(
		array( 'Maroon Pearl Jhumka Earrings', 'earrings', 499, 349 ),
		array( 'Pink & Green Silk Thread Bangles (Set of 6)', 'bangles', 399, 0 ),
		array( 'Maroon Bead Pendant Necklace Set', 'necklaces', 899, 699 ),
		array( 'Handmade Crochet Flower Bag', 'bags', 1299, 0 ),
		array( 'Mauve Cotton Midi Dress', 'western-wear', 1499, 1199 ),
		array( 'Maroon Banarasi Style Saree', 'indian-wear', 2499, 0 ),
	);
	$made = 0;
	foreach ( $demo as $d ) {
		$exists = get_posts(
			array(
				'post_type'   => 'product',
				'post_status' => 'any',
				'title'       => $d[0],
				'numberposts' => 1,
				'fields'      => 'ids',
			)
		);
		if ( $exists ) {
			continue;
		}
		$p = new WC_Product_Simple();
		$p->set_name( $d[0] );
		$p->set_status( 'draft' );
		$p->set_regular_price( (string) $d[2] );
		if ( $d[3] ) {
			$p->set_sale_price( (string) $d[3] );
		}
		$p->set_short_description( 'Handmade by Sohag Exclusive. (Sample text — replace with your own description.)' );
		$p->set_description( 'This is a sample product. Update the photos, price, size and description, then publish it.' );
		$p->set_manage_stock( true );
		$p->set_stock_quantity( 10 );
		if ( isset( $cat_ids[ $d[1] ] ) ) {
			$p->set_category_ids( array( $cat_ids[ $d[1] ] ) );
		}
		$img = sohag_import_theme_image( 'cat-' . $d[1] . '.jpg', $d[0] );
		if ( $img ) {
			$p->set_image_id( $img );
		}
		$p->save();
		++$made;
	}
	return $made;
}
