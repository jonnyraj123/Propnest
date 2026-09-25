<?php
/**
 * One-click store setup: Appearance → Sohag স্টোর সেটআপ.
 *
 * Configures WooCommerce for Bangladesh (৳ currency, BD only, billing-only address),
 * classic cart/checkout pages, Dhaka / outside-Dhaka delivery zones, Cash on Delivery,
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
			__( 'Sohag স্টোর সেটআপ', 'sohag-exclusive' ),
			__( 'Sohag স্টোর সেটআপ', 'sohag-exclusive' ),
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
			esc_html__( 'এক ক্লিকে স্টোর (টাকা, ডেলিভারি চার্জ, পেমেন্ট, ক্যাটাগরি, পেজ) সেটআপ করুন।', 'sohag-exclusive' ),
			esc_url( admin_url( 'themes.php?page=sohag-setup' ) ),
			esc_html__( 'সেটআপ শুরু করুন', 'sohag-exclusive' )
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
				'inside'   => isset( $_POST['inside'] ) ? absint( $_POST['inside'] ) : 70,
				'outside'  => isset( $_POST['outside'] ) ? absint( $_POST['outside'] ) : 130,
				'bkash'    => isset( $_POST['bkash'] ) ? sanitize_text_field( wp_unslash( $_POST['bkash'] ) ) : '',
				'nagad'    => isset( $_POST['nagad'] ) ? sanitize_text_field( wp_unslash( $_POST['nagad'] ) ) : '',
				'rocket'   => isset( $_POST['rocket'] ) ? sanitize_text_field( wp_unslash( $_POST['rocket'] ) ) : '',
				'phone'    => isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '',
				'whatsapp' => isset( $_POST['whatsapp'] ) ? sanitize_text_field( wp_unslash( $_POST['whatsapp'] ) ) : '',
				'facebook' => isset( $_POST['facebook'] ) ? esc_url_raw( wp_unslash( $_POST['facebook'] ) ) : '',
				'demo'     => ! empty( $_POST['demo'] ),
			)
		);
	}

	$charges = sohag_delivery_charges();
	$gw      = get_option( 'woocommerce_sohag_mobile_pay_settings', array() );
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Sohag Exclusive — স্টোর সেটআপ', 'sohag-exclusive' ); ?></h1>

		<?php if ( ! sohag_is_wc() ) : ?>
			<div class="notice notice-warning"><p>
				<?php esc_html_e( 'প্রথমে WooCommerce প্লাগইন ইনস্টল ও Activate করুন (Plugins → Add New → "WooCommerce")। তারপর এই পাতায় ফিরে আসুন।', 'sohag-exclusive' ); ?>
			</p></div>
		<?php endif; ?>

		<?php if ( $log ) : ?>
			<div class="notice notice-success"><p><strong><?php esc_html_e( 'সেটআপ সম্পন্ন:', 'sohag-exclusive' ); ?></strong></p>
				<ul style="list-style:disc;padding-left:20px">
					<?php foreach ( $log as $line ) : ?>
						<li><?php echo esc_html( $line ); ?></li>
					<?php endforeach; ?>
				</ul>
				<p><a class="button button-primary" href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank"><?php esc_html_e( 'ওয়েবসাইট দেখুন', 'sohag-exclusive' ); ?></a></p>
			</div>
		<?php endif; ?>

		<form method="post" style="max-width:720px;background:#fff;padding:20px 24px;border:1px solid #dcdcde;border-radius:8px">
			<?php wp_nonce_field( 'sohag_setup' ); ?>
			<h2><?php esc_html_e( 'ডেলিভারি চার্জ (৳)', 'sohag-exclusive' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr><th><label for="inside"><?php esc_html_e( 'ঢাকার ভিতরে', 'sohag-exclusive' ); ?></label></th><td><input id="inside" name="inside" type="number" min="0" value="<?php echo esc_attr( $charges['inside'] ); ?>"></td></tr>
				<tr><th><label for="outside"><?php esc_html_e( 'ঢাকার বাইরে', 'sohag-exclusive' ); ?></label></th><td><input id="outside" name="outside" type="number" min="0" value="<?php echo esc_attr( $charges['outside'] ); ?>"></td></tr>
			</table>

			<h2><?php esc_html_e( 'পেমেন্ট নম্বর (যেটা নেই খালি রাখুন)', 'sohag-exclusive' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr><th><label for="bkash">bKash</label></th><td><input id="bkash" name="bkash" type="text" class="regular-text" placeholder="01XXXXXXXXX" value="<?php echo esc_attr( $gw['bkash_number'] ?? '' ); ?>"></td></tr>
				<tr><th><label for="nagad">Nagad</label></th><td><input id="nagad" name="nagad" type="text" class="regular-text" placeholder="01XXXXXXXXX" value="<?php echo esc_attr( $gw['nagad_number'] ?? '' ); ?>"></td></tr>
				<tr><th><label for="rocket">Rocket</label></th><td><input id="rocket" name="rocket" type="text" class="regular-text" placeholder="01XXXXXXXXXX" value="<?php echo esc_attr( $gw['rocket_number'] ?? '' ); ?>"></td></tr>
			</table>

			<h2><?php esc_html_e( 'যোগাযোগ', 'sohag-exclusive' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr><th><label for="phone"><?php esc_html_e( 'ফোন', 'sohag-exclusive' ); ?></label></th><td><input id="phone" name="phone" type="text" class="regular-text" value="<?php echo esc_attr( get_theme_mod( 'sohag_phone', '' ) ); ?>" placeholder="01XXXXXXXXX"></td></tr>
				<tr><th><label for="whatsapp">WhatsApp</label></th><td><input id="whatsapp" name="whatsapp" type="text" class="regular-text" value="<?php echo esc_attr( get_theme_mod( 'sohag_whatsapp', '' ) ); ?>" placeholder="8801XXXXXXXXX"></td></tr>
				<tr><th><label for="facebook">Facebook</label></th><td><input id="facebook" name="facebook" type="url" class="regular-text" value="<?php echo esc_attr( get_theme_mod( 'sohag_facebook', '' ) ); ?>" placeholder="https://www.facebook.com/..."></td></tr>
			</table>

			<p><label><input type="checkbox" name="demo" value="1"> <?php esc_html_e( 'টেস্ট করার জন্য ৬টি নমুনা প্রোডাক্ট তৈরি করুন (Draft হিসেবে — পরে ছবি/দাম বদলে Publish করুন)', 'sohag-exclusive' ); ?></label></p>

			<p><button class="button button-primary button-hero" name="sohag_run_setup" value="1" <?php disabled( ! sohag_is_wc() ); ?>><?php esc_html_e( 'স্টোর সেটআপ চালান', 'sohag-exclusive' ); ?></button></p>
			<p class="description"><?php esc_html_e( 'যতবার খুশি চালাতে পারেন — আগের সেটিং আপডেট হবে, ডুপ্লিকেট হবে না।', 'sohag-exclusive' ); ?></p>
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
	foreach ( array( 'phone', 'whatsapp', 'facebook' ) as $key ) {
		if ( '' !== $args[ $key ] ) {
			set_theme_mod( 'sohag_' . $key, $args[ $key ] );
		}
	}
	set_theme_mod( 'sohag_delivery_inside', $args['inside'] );
	set_theme_mod( 'sohag_delivery_outside', $args['outside'] );

	// 1. Store basics.
	$options = array(
		'woocommerce_default_country'                    => 'BD:BD-13',
		'woocommerce_allowed_countries'                  => 'specific',
		'woocommerce_specific_allowed_countries'         => array( 'BD' ),
		'woocommerce_ship_to_countries'                  => '',
		'woocommerce_ship_to_destination'                => 'billing_only',
		'woocommerce_currency'                           => 'BDT',
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
		'woocommerce_checkout_address_2_field'           => 'hidden',
		'woocommerce_cart_redirect_after_add'            => 'no',
		'woocommerce_enable_ajax_add_to_cart'            => 'yes',
		'woocommerce_checkout_privacy_policy_text'       => 'আপনার দেওয়া তথ্য শুধু অর্ডার প্রসেস ও ডেলিভারির জন্য ব্যবহার করা হবে — বিস্তারিত: [privacy_policy]।',
		'woocommerce_registration_privacy_policy_text'   => 'আপনার তথ্য শুধু অ্যাকাউন্ট ও অর্ডার পরিচালনার জন্য ব্যবহার করা হবে — বিস্তারিত: [privacy_policy]।',
		// WooCommerce 9+ starts new stores in "Coming soon" mode — go live.
		'woocommerce_coming_soon'                        => 'no',
	);
	foreach ( $options as $k => $v ) {
		update_option( $k, $v );
	}
	$log[] = 'কারেন্সি ৳ (BDT), দেশ বাংলাদেশ, গেস্ট চেকআউট চালু, স্টোর লাইভ (Coming soon বন্ধ)';

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
					'post_title'   => 'cart' === $key ? 'কার্ট' : 'চেকআউট',
					'post_content' => $shortcode,
				)
			);
			update_option( 'woocommerce_' . $key . '_page_id', $page_id );
		}
	}
	// Bangla titles for WooCommerce pages.
	foreach ( array( 'shop' => 'শপ', 'cart' => 'কার্ট', 'checkout' => 'চেকআউট', 'myaccount' => 'আমার অ্যাকাউন্ট' ) as $key => $title ) {
		$pid = wc_get_page_id( $key );
		if ( $pid > 0 ) {
			wp_update_post( array( 'ID' => $pid, 'post_title' => $title ) );
		}
	}
	$log[] = 'কার্ট ও চেকআউট পেজ ক্লাসিক (সহজ বাংলা) চেকআউটে সেট করা হয়েছে';

	// 3. Shipping zones.
	sohag_upsert_zone( 'ঢাকার ভিতরে', array( array( 'BD:BD-13', 'state' ) ), 'ঢাকার ভিতরে ডেলিভারি', $args['inside'], 1 );
	sohag_upsert_zone( 'ঢাকার বাইরে (সারা বাংলাদেশ)', array( array( 'BD', 'country' ) ), 'ঢাকার বাইরে ডেলিভারি', $args['outside'], 2 );
	$log[] = sprintf( 'ডেলিভারি চার্জ: ঢাকার ভিতরে ৳%d, ঢাকার বাইরে ৳%d', $args['inside'], $args['outside'] );

	// 4. Cash on Delivery.
	$cod = get_option( 'woocommerce_cod_settings', array() );
	update_option(
		'woocommerce_cod_settings',
		array_merge(
			is_array( $cod ) ? $cod : array(),
			array(
				'enabled'            => 'yes',
				'title'              => 'ক্যাশ অন ডেলিভারি',
				'description'        => 'পণ্য হাতে পেয়ে ডেলিভারিম্যানকে টাকা দিন।',
				'instructions'       => 'আমাদের প্রতিনিধি অর্ডার কনফার্ম করতে আপনাকে কল করবেন।',
				'enable_for_methods' => array(),
				'enable_for_virtual' => 'yes',
			)
		)
	);
	$log[] = 'ক্যাশ অন ডেলিভারি চালু';

	// 5. Mobile banking gateway.
	$gw = get_option( 'woocommerce_sohag_mobile_pay_settings', array() );
	$gw = is_array( $gw ) ? $gw : array();
	$gw['bkash_number']  = $args['bkash'];
	$gw['nagad_number']  = $args['nagad'];
	$gw['rocket_number'] = $args['rocket'];
	$has_number          = $args['bkash'] || $args['nagad'] || $args['rocket'];
	$gw['enabled']       = $has_number ? 'yes' : 'no';
	update_option( 'woocommerce_sohag_mobile_pay_settings', $gw );
	$log[] = $has_number ? 'বিকাশ/নগদ/রকেট পেমেন্ট চালু' : 'বিকাশ/নগদ/রকেট নম্বর দেওয়া হয়নি — এই অপশন বন্ধ রাখা হলো';

	// Show COD first at checkout.
	$order = (array) get_option( 'woocommerce_gateway_order', array() );
	$order = array_merge( $order, array( 'cod' => 0, 'sohag_mobile_pay' => 1 ) );
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
	$log[] = 'ক্যাটাগরি তৈরি: Earrings, Bangles, Necklaces, Bags, Western Wear, Indian Wear';

	// 7. Info pages.
	$info_pages = sohag_info_pages();
	$page_ids   = array();
	foreach ( $info_pages as $slug => $page ) {
		$existing = get_page_by_path( $slug );
		if ( $existing ) {
			$page_ids[ $slug ] = $existing->ID;
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
	}
	if ( ! empty( $page_ids['privacy-policy'] ) ) {
		update_option( 'wp_page_for_privacy_policy', $page_ids['privacy-policy'] );
	}
	// Terms page is linked in the footer; no mandatory checkbox at checkout (keeps ordering quick).
	$log[] = 'পেজ তৈরি: আমাদের সম্পর্কে, যোগাযোগ, ডেলিভারি তথ্য, রিটার্ন পলিসি, প্রাইভেসি, শর্তাবলি';

	// 8. Menus.
	sohag_build_menus( $cat_ids, $page_ids );
	$log[] = 'প্রধান মেনু ও ফুটার মেনু সেট করা হয়েছে';

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
		$log[] = sprintf( '%d টি নমুনা প্রোডাক্ট Draft হিসেবে তৈরি (Products → Drafts)', $made );
	}

	update_option( 'sohag_setup_done', time() );
	delete_transient( 'sohag_setup_notice' );

	return $log;
}

/**
 * Create or update a shipping zone with one flat-rate method.
 */
function sohag_upsert_zone( $name, $locations, $method_title, $cost, $order ) {
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
	$zone->set_zone_order( $order );
	$zone->clear_locations();
	foreach ( $locations as $loc ) {
		$zone->add_location( $loc[0], $loc[1] );
	}
	$zone->save();

	$instance_id = 0;
	foreach ( $zone->get_shipping_methods() as $method ) {
		if ( 'flat_rate' === $method->id ) {
			$instance_id = $method->instance_id;
			break;
		}
	}
	if ( ! $instance_id ) {
		$instance_id = $zone->add_shipping_method( 'flat_rate' );
	}
	if ( $instance_id ) {
		update_option(
			'woocommerce_flat_rate_' . $instance_id . '_settings',
			array(
				'title'      => $method_title,
				'tax_status' => 'none',
				'cost'       => (string) $cost,
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
		$menu_id = wp_create_nav_menu( 'Sohag প্রধান মেনু' );
		if ( ! is_wp_error( $menu_id ) ) {
			wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'হোম', 'menu-item-url' => home_url( '/' ), 'menu-item-status' => 'publish' ) );
			wp_update_nav_menu_item(
				$menu_id,
				0,
				array(
					'menu-item-title'     => 'সব প্রোডাক্ট',
					'menu-item-object'    => 'page',
					'menu-item-object-id' => wc_get_page_id( 'shop' ),
					'menu-item-type'      => 'post_type',
					'menu-item-status'    => 'publish',
				)
			);
			$jewellery = wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'জুয়েলারি', 'menu-item-url' => '#', 'menu-item-status' => 'publish' ) );
			foreach ( array( 'earrings', 'bangles', 'necklaces' ) as $slug ) {
				if ( isset( $cat_ids[ $slug ] ) ) {
					sohag_menu_cat( $menu_id, $cat_ids[ $slug ], $jewellery );
				}
			}
			if ( isset( $cat_ids['bags'] ) ) {
				sohag_menu_cat( $menu_id, $cat_ids['bags'], 0 );
			}
			$fashion = wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'পোশাক', 'menu-item-url' => '#', 'menu-item-status' => 'publish' ) );
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
		$menu_id = wp_create_nav_menu( 'Sohag ফুটার মেনু' );
		if ( ! is_wp_error( $menu_id ) ) {
			foreach ( array( 'about-us', 'delivery-information', 'return-policy', 'privacy-policy', 'terms-and-conditions', 'contact' ) as $slug ) {
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
 * Starter content for info pages (edit freely afterwards).
 */
function sohag_info_pages() {
	$c = sohag_delivery_charges();
	return array(
		'about-us'             => array(
			'আমাদের সম্পর্কে',
			"<h2>Sohag Exclusive — Wear Your Story</h2>\n<p>Sohag Exclusive একটি হ্যান্ডমেড ফ্যাশন ব্র্যান্ড। আমরা নিজের হাতে যত্ন করে কানের দুল, চুড়ি, নেকলেস, ব্যাগ এবং ওয়েস্টার্ন ও ইন্ডিয়ান পোশাক তৈরি ও সংগ্রহ করি।</p>\n<p><em>Handmade is not just a product, it's a feeling.</em> প্রতিটি প্রোডাক্ট আলাদা — ঠিক আপনার মতো।</p>",
		),
		'delivery-information' => array(
			'ডেলিভারি তথ্য',
			"<ul>\n<li>ঢাকার ভিতরে ডেলিভারি চার্জ ৳{$c['inside']} — সাধারণত ১–২ কার্যদিবস।</li>\n<li>ঢাকার বাইরে ডেলিভারি চার্জ ৳{$c['outside']} — সাধারণত ২–৪ কার্যদিবস।</li>\n<li>সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা।</li>\n<li>অর্ডারের পর আমাদের প্রতিনিধি ফোন করে অর্ডার কনফার্ম করবেন।</li>\n</ul>",
		),
		'return-policy'        => array(
			'রিটার্ন ও এক্সচেঞ্জ পলিসি',
			"<ul>\n<li>ডেলিভারির সময় ডেলিভারিম্যানের সামনে পণ্য দেখে নিন।</li>\n<li>পণ্যে ত্রুটি থাকলে বা ভুল পণ্য গেলে ৪৮ ঘণ্টার মধ্যে ছবি/ভিডিওসহ জানান — আমরা বদলে দেব।</li>\n<li>হ্যান্ডমেড ও কাস্টম অর্ডারের পণ্য পছন্দ না হওয়ার কারণে ফেরত নেওয়া হয় না।</li>\n<li>অগ্রিম পেমেন্ট ফেরতযোগ্য হলে ৩–৭ কার্যদিবসের মধ্যে একই মাধ্যমে ফেরত দেওয়া হবে।</li>\n</ul>",
		),
		'privacy-policy'       => array(
			'প্রাইভেসি পলিসি',
			"<p>অর্ডার ডেলিভারির জন্য আমরা আপনার নাম, মোবাইল নম্বর ও ঠিকানা সংগ্রহ করি। এই তথ্য শুধু অর্ডার প্রসেস ও ডেলিভারির কাজে কুরিয়ার প্রতিষ্ঠানের সাথে শেয়ার করা হয়, অন্য কোথাও বিক্রি বা প্রকাশ করা হয় না।</p>",
		),
		'terms-and-conditions' => array(
			'শর্তাবলি',
			"<ul>\n<li>ছবির সাথে আসল পণ্যের রঙে সামান্য পার্থক্য হতে পারে (লাইট ও স্ক্রিনের কারণে)।</li>\n<li>হ্যান্ডমেড হওয়ায় প্রতিটি পণ্য সামান্য আলাদা হতে পারে।</li>\n<li>ফোনে কনফার্ম না হলে অর্ডার বাতিল হতে পারে।</li>\n</ul>",
		),
		'contact'              => array(
			'যোগাযোগ',
			'<p>ফোন / WhatsApp: ' . esc_html( sohag_opt( 'phone' ) ) . "</p>\n<p>Facebook: <a href=\"" . esc_url( sohag_opt( 'facebook' ) ) . "\">Sohag Exclusive</a></p>\n<p>প্রতিদিন সকাল ১০টা – রাত ১০টা</p>",
		),
	);
}

/**
 * Draft sample products so the owner can see the layout, then edit and publish.
 */
function sohag_create_demo_products( $cat_ids ) {
	$demo = array(
		array( 'Maroon Pearl Jhumka Earrings', 'earrings', 650, 490 ),
		array( 'Pink & Green Silk Thread Bangles (Set of 6)', 'bangles', 550, 0 ),
		array( 'Maroon Bead Pendant Necklace Set', 'necklaces', 1250, 990 ),
		array( 'Handmade Crochet Flower Bag', 'bags', 1650, 0 ),
		array( 'Mauve Cotton Midi Dress', 'western-wear', 1850, 1590 ),
		array( 'Maroon Banarasi Style Saree', 'indian-wear', 3200, 0 ),
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
		$p->set_short_description( 'হাতে তৈরি — Sohag Exclusive। (নমুনা বর্ণনা, নিজের মতো বদলে নিন)' );
		$p->set_description( 'এটি একটি নমুনা প্রোডাক্ট। আসল ছবি, দাম, সাইজ ও বর্ণনা দিয়ে আপডেট করে Publish করুন।' );
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
