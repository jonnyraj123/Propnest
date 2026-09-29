<?php
/**
 * Grand Opening: until the owner "cuts the ribbon", visitors see a cinematic
 * Grand Opening curtain while the owner and team see the full store.
 *
 * - Logged-in staff (anyone who can edit posts) always see the store.
 * - Team members open the secret team link once (/?team=KEY); a cookie remembers them.
 * - Appearance → Grand Opening: set the opening date (countdown), copy the team link,
 *   preview the curtain, and press "Cut the Ribbon" to open the store.
 * - After opening, each visitor sees the ribbon-cutting ceremony once (for 14 days).
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

const SOHAG_TEAM_COOKIE = 'sohag_team';

/**
 * Launch settings with defaults. A new install starts with the curtain ON.
 */
function sohag_launch_settings() {
	$saved = get_option( 'sohag_launch', array() );
	$s     = wp_parse_args(
		is_array( $saved ) ? $saved : array(),
		array(
			'mode'      => 'closed', // closed = curtain on, open = store live.
			'date'      => '',       // Opening date/time in the site's time zone, "Y-m-d H:i".
			'key'       => '',       // Secret for the team link.
			'opened_at' => 0,        // Unix time the ribbon was cut.
		)
	);
	if ( '' === $s['key'] ) {
		$s['key'] = strtolower( wp_generate_password( 8, false, false ) );
		update_option( 'sohag_launch', $s );
	}
	return $s;
}

function sohag_launch_update( $changes ) {
	update_option( 'sohag_launch', array_merge( sohag_launch_settings(), $changes ) );
}

function sohag_store_is_open() {
	return 'open' === sohag_launch_settings()['mode'];
}

/**
 * Opening time as a Unix timestamp, or 0 when no date is set.
 */
function sohag_launch_timestamp() {
	$date = sohag_launch_settings()['date'];
	if ( ! $date ) {
		return 0;
	}
	try {
		return ( new DateTimeImmutable( $date, wp_timezone() ) )->getTimestamp();
	} catch ( Exception $e ) {
		return 0;
	}
}

function sohag_team_link() {
	return add_query_arg( 'team', sohag_launch_settings()['key'], home_url( '/' ) );
}

function sohag_is_team_member() {
	if ( current_user_can( 'edit_posts' ) ) {
		return true;
	}
	$cookie = isset( $_COOKIE[ SOHAG_TEAM_COOKIE ] ) ? sanitize_text_field( wp_unslash( $_COOKIE[ SOHAG_TEAM_COOKIE ] ) ) : '';
	return '' !== $cookie && hash_equals( sohag_launch_settings()['key'], $cookie );
}

/**
 * Requests that must never be blocked by the curtain (admin, login, AJAX, REST, payment callbacks, cron).
 */
function sohag_launch_is_exempt_request() {
	// phpcs:disable WordPress.Security.NonceVerification
	return is_admin()
		|| wp_doing_ajax()
		|| wp_doing_cron()
		|| ( defined( 'REST_REQUEST' ) && REST_REQUEST )
		|| isset( $_GET['wc-ajax'] )
		|| isset( $_GET['wc-api'] )
		|| is_robots()
		|| is_feed();
	// phpcs:enable
}

/* -------------------------------------------------------------------------
 * Team link: /?team=KEY sets a 60-day cookie and redirects to the clean URL.
 * ---------------------------------------------------------------------- */
add_action(
	'template_redirect',
	function () {
		if ( ! isset( $_GET['team'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return;
		}
		$given = sanitize_text_field( wp_unslash( $_GET['team'] ) ); // phpcs:ignore WordPress.Security.NonceVerification
		if ( hash_equals( sohag_launch_settings()['key'], $given ) ) {
			setcookie( SOHAG_TEAM_COOKIE, $given, time() + 60 * DAY_IN_SECONDS, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
			$_COOKIE[ SOHAG_TEAM_COOKIE ] = $given;
		}
		wp_safe_redirect( remove_query_arg( 'team' ) );
		exit;
	},
	0
);

/* -------------------------------------------------------------------------
 * The curtain.
 * ---------------------------------------------------------------------- */
add_action(
	'template_redirect',
	function () {
		if ( sohag_launch_is_exempt_request() ) {
			return;
		}
		// phpcs:ignore WordPress.Security.NonceVerification -- read-only preview switch for staff.
		$preview = isset( $_GET['sohag_curtain'] ) && current_user_can( 'edit_posts' );
		if ( ! $preview && ( sohag_store_is_open() || sohag_is_team_member() ) ) {
			return;
		}
		status_header( 200 );
		nocache_headers();
		header( 'X-Robots-Tag: noindex, follow' );
		sohag_render_curtain( $preview );
		exit;
	},
	1
);

function sohag_launch_assets_url( $file ) {
	return SOHAG_URI . '/assets/' . $file . '?ver=' . sohag_asset_ver( $file );
}

/**
 * Shared stage: drapes, satin ribbon with bow, golden scissors, gold dust.
 */
function sohag_launch_stage_parts() {
	?>
	<canvas class="go-dust" aria-hidden="true"></canvas>
	<div class="go-spot" aria-hidden="true"></div>
	<div class="go-drape go-drape--l" aria-hidden="true"></div>
	<div class="go-drape go-drape--r" aria-hidden="true"></div>
	<div class="go-valance" aria-hidden="true"></div>
	<?php
}

function sohag_launch_ribbon() {
	?>
	<div class="go-ribbon" aria-hidden="true">
		<div class="go-ribbon__half go-ribbon__half--l"></div>
		<div class="go-ribbon__half go-ribbon__half--r"></div>
		<svg class="go-bow" viewBox="0 0 220 150" focusable="false">
			<defs>
				<linearGradient id="goSatin" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stop-color="#ef4a63"/><stop offset=".45" stop-color="#c41c38"/><stop offset="1" stop-color="#7d0c20"/>
				</linearGradient>
				<linearGradient id="goSatinDark" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stop-color="#a3142d"/><stop offset="1" stop-color="#5e0818"/>
				</linearGradient>
			</defs>
			<path d="M96 70 C70 108 58 136 48 148 L70 144 L78 132 C86 112 96 92 104 76 Z" fill="url(#goSatinDark)"/>
			<path d="M124 70 C150 108 162 136 172 148 L150 144 L142 132 C134 112 124 92 116 76 Z" fill="url(#goSatinDark)"/>
			<path d="M100 62 C70 22 14 12 10 46 C6 78 58 92 100 76 Z" fill="url(#goSatin)" stroke="#6d0a1b" stroke-width="2"/>
			<path d="M120 62 C150 22 206 12 210 46 C214 78 162 92 120 76 Z" fill="url(#goSatin)" stroke="#6d0a1b" stroke-width="2"/>
			<path d="M34 44 C52 34 76 44 94 62" fill="none" stroke="#f6a3b1" stroke-width="3" stroke-linecap="round" opacity=".55"/>
			<path d="M186 44 C168 34 144 44 126 62" fill="none" stroke="#f6a3b1" stroke-width="3" stroke-linecap="round" opacity=".55"/>
			<rect x="94" y="54" width="32" height="30" rx="9" fill="url(#goSatin)" stroke="#6d0a1b" stroke-width="2"/>
		</svg>
		<svg class="go-scissors" viewBox="0 0 170 100" focusable="false">
			<defs>
				<linearGradient id="goGold" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stop-color="#fff1c1"/><stop offset=".35" stop-color="#e2b45a"/><stop offset=".7" stop-color="#b8893b"/><stop offset="1" stop-color="#f3d58a"/>
				</linearGradient>
			</defs>
			<g class="go-scissors__a">
				<path d="M74 50 L6 40 Q1 44 6 47 Z" fill="url(#goGold)" stroke="#8a6224" stroke-width="1"/>
				<path d="M74 50 L112 64" stroke="url(#goGold)" stroke-width="8" stroke-linecap="round"/>
				<circle cx="130" cy="72" r="17" fill="none" stroke="url(#goGold)" stroke-width="8"/>
			</g>
			<g class="go-scissors__b">
				<path d="M74 50 L6 60 Q1 56 6 53 Z" fill="url(#goGold)" stroke="#8a6224" stroke-width="1"/>
				<path d="M74 50 L112 36" stroke="url(#goGold)" stroke-width="8" stroke-linecap="round"/>
				<circle cx="130" cy="28" r="17" fill="none" stroke="url(#goGold)" stroke-width="8"/>
			</g>
			<circle cx="74" cy="50" r="5" fill="#fff4d2" stroke="#8a6224" stroke-width="1.5"/>
		</svg>
	</div>
	<?php
}

/**
 * A few pieces for the "sneak peek" under the curtain: newest products with photos, or the bundled photos.
 */
function sohag_launch_peek_items() {
	$items = array();
	if ( function_exists( 'wc_get_products' ) ) {
		foreach ( wc_get_products( array( 'status' => 'publish', 'limit' => 12, 'orderby' => 'date', 'order' => 'DESC' ) ) as $product ) {
			$img = $product->get_image_id() ? wp_get_attachment_image_url( $product->get_image_id(), 'woocommerce_thumbnail' ) : '';
			if ( $img ) {
				$terms   = get_the_terms( $product->get_id(), 'product_cat' );
				$items[] = array(
					'img' => $img,
					'cat' => ( $terms && ! is_wp_error( $terms ) ) ? $terms[0]->name : '',
				);
			}
			if ( count( $items ) >= 4 ) {
				break;
			}
		}
	}
	if ( count( $items ) < 4 ) {
		$items = array(
			array( 'img' => SOHAG_URI . '/assets/img/products/pendant-necklace.jpg', 'cat' => 'Necklaces' ),
			array( 'img' => SOHAG_URI . '/assets/img/products/puja-saree.jpg', 'cat' => 'Puja Sarees' ),
			array( 'img' => SOHAG_URI . '/assets/img/products/choker-set.jpg', 'cat' => 'Earrings' ),
			array( 'img' => SOHAG_URI . '/assets/img/products/oxidised-cuff.jpg', 'cat' => 'Bangles' ),
		);
	}
	return $items;
}

/**
 * The Grand Opening page shown to the public while the store is closed.
 */
function sohag_render_curtain( $preview = false ) {
	$opening = sohag_launch_timestamp();
	$wa      = sohag_whatsapp_url( __( 'Hi Sohag Exclusive! I would like to know when the store opens.', 'sohag-exclusive' ) );
	$fb      = sohag_opt( 'facebook' );
	$title   = __( 'Sohag Exclusive — Grand Opening Soon', 'sohag-exclusive' );
	$desc    = __( 'Bangaliana Handcraft — handmade jewellery and puja fashion. Our online store opens soon with free delivery and free Cash on Delivery all over India.', 'sohag-exclusive' );
	?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
	<meta name="theme-color" content="#2b0710">
	<meta name="robots" content="noindex, follow">
	<title><?php echo esc_html( $title ); ?></title>
	<meta name="description" content="<?php echo esc_attr( $desc ); ?>">
	<meta property="og:type" content="website">
	<meta property="og:title" content="<?php echo esc_attr( $title ); ?>">
	<meta property="og:description" content="<?php echo esc_attr( $desc ); ?>">
	<meta property="og:image" content="<?php echo esc_url( SOHAG_URI . '/assets/img/logo.jpg' ); ?>">
	<meta property="og:url" content="<?php echo esc_url( home_url( '/' ) ); ?>">
	<?php if ( get_option( 'site_icon' ) ) : ?>
		<link rel="icon" href="<?php echo esc_url( get_site_icon_url( 192 ) ); ?>">
	<?php endif; ?>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Great+Vibes&family=Jost:wght@400;500;600&display=swap">
	<link rel="stylesheet" href="<?php echo esc_url( sohag_launch_assets_url( 'css/launch.css' ) ); ?>">
</head>
<body class="go-page">
	<main class="go-stage go-stage--curtain" data-opening="<?php echo esc_attr( $opening ? $opening * 1000 : '' ); ?>">
		<?php sohag_launch_stage_parts(); ?>

		<div class="go-content">
			<img class="go-logo" src="<?php echo esc_url( SOHAG_URI . '/assets/img/logo-sm.jpg' ); ?>" alt="Sohag Exclusive" width="120" height="120">
			<p class="go-eyebrow">Sohag Exclusive</p>
			<h1 class="go-title"><span class="go-title__script">Grand Opening</span><span class="go-title__sub">Coming Soon</span></h1>
		</div>

		<?php sohag_launch_ribbon(); ?>

		<div class="go-below">
			<div class="go-count" <?php echo $opening ? '' : 'hidden'; ?> aria-live="polite">
				<div class="go-count__cell"><span data-u="d">00</span><small>Days</small></div>
				<div class="go-count__cell"><span data-u="h">00</span><small>Hours</small></div>
				<div class="go-count__cell"><span data-u="m">00</span><small>Minutes</small></div>
				<div class="go-count__cell"><span data-u="s">00</span><small>Seconds</small></div>
			</div>
			<?php if ( $opening ) : ?>
				<p class="go-date"><?php echo esc_html( sprintf( /* translators: opening date */ __( 'Opening %s', 'sohag-exclusive' ), wp_date( 'j F Y · g:i A', $opening ) ) ); ?></p>
			<?php endif; ?>
			<p class="go-soon" <?php echo $opening ? 'hidden' : ''; ?>><?php esc_html_e( 'The ribbon will be cut very soon', 'sohag-exclusive' ); ?></p>
			<p class="go-tagline">Bangaliana Handcraft <span aria-hidden="true">·</span> Wear Your Story</p>
			<p class="go-perks"><?php esc_html_e( 'Free delivery & free Cash on Delivery all over India', 'sohag-exclusive' ); ?></p>
			<div class="go-actions">
				<?php if ( $wa ) : ?>
					<a class="go-btn go-btn--gold" href="<?php echo esc_url( $wa ); ?>" target="_blank" rel="noopener"><?php echo sohag_icon( 'whatsapp' ); // phpcs:ignore ?> <?php esc_html_e( 'Message us on WhatsApp', 'sohag-exclusive' ); ?></a>
				<?php endif; ?>
				<?php if ( $fb ) : ?>
					<a class="go-btn" href="<?php echo esc_url( $fb ); ?>" target="_blank" rel="noopener"><?php echo sohag_icon( 'facebook' ); // phpcs:ignore ?> <?php esc_html_e( 'Follow on Facebook', 'sohag-exclusive' ); ?></a>
				<?php endif; ?>
			</div>
			<a class="go-peek-cue" href="#go-peek"><?php esc_html_e( 'A glimpse behind the curtain', 'sohag-exclusive' ); ?> <span aria-hidden="true">↓</span></a>
		</div>

		<section class="go-peek" id="go-peek" aria-label="<?php esc_attr_e( 'Sneak peek', 'sohag-exclusive' ); ?>">
			<p class="go-eyebrow"><?php esc_html_e( 'Sneak Peek', 'sohag-exclusive' ); ?></p>
			<h2 class="go-peek__title"><?php esc_html_e( 'A glimpse of what is coming', 'sohag-exclusive' ); ?></h2>
			<p class="go-peek__lead"><?php esc_html_e( 'Handmade thread-bead necklaces, oxidised silver and red-and-white puja sarees — the full collection is unveiled when the ribbon is cut.', 'sohag-exclusive' ); ?></p>
			<div class="go-peek__row">
				<?php foreach ( sohag_launch_peek_items() as $i => $item ) : ?>
					<figure class="go-peek__card<?php echo $i ? ' is-veiled' : ''; ?>">
						<img src="<?php echo esc_url( $item['img'] ); ?>" alt="" width="300" height="300" loading="lazy" decoding="async">
						<figcaption>
							<?php if ( $item['cat'] ) : ?><span><?php echo esc_html( $item['cat'] ); ?></span><?php endif; ?>
							<small><?php echo $i ? esc_html__( 'Unveiling soon', 'sohag-exclusive' ) : esc_html__( 'First look', 'sohag-exclusive' ); ?></small>
						</figcaption>
					</figure>
				<?php endforeach; ?>
			</div>
			<ul class="go-peek__promise">
				<li><?php esc_html_e( '100% handmade', 'sohag-exclusive' ); ?></li>
				<li><?php esc_html_e( 'Free delivery all over India', 'sohag-exclusive' ); ?></li>
				<li><?php esc_html_e( 'Free Cash on Delivery', 'sohag-exclusive' ); ?></li>
				<li><?php esc_html_e( 'Pay by UPI', 'sohag-exclusive' ); ?></li>
			</ul>
			<?php if ( $wa ) : ?>
				<a class="go-btn go-btn--gold" href="<?php echo esc_url( $wa ); ?>" target="_blank" rel="noopener"><?php echo sohag_icon( 'whatsapp' ); // phpcs:ignore ?> <?php esc_html_e( 'Tell me when it opens', 'sohag-exclusive' ); ?></a>
			<?php endif; ?>
		</section>
	</main>
	<?php if ( $preview ) : ?>
		<a class="go-preview-note" href="<?php echo esc_url( admin_url( 'themes.php?page=sohag-launch' ) ); ?>"><?php esc_html_e( 'Preview of what visitors see — back to Grand Opening settings', 'sohag-exclusive' ); ?></a>
	<?php endif; ?>
	<script src="<?php echo esc_url( sohag_launch_assets_url( 'js/launch.js' ) ); ?>"></script>
</body>
</html>
	<?php
}

/* -------------------------------------------------------------------------
 * After opening: ribbon-cutting ceremony, once per visitor, for 14 days.
 * ---------------------------------------------------------------------- */
function sohag_show_ceremony() {
	if ( is_admin() ) {
		return false;
	}
	// phpcs:ignore WordPress.Security.NonceVerification -- read-only preview switch.
	if ( isset( $_GET['sohag_ceremony'] ) ) {
		return true;
	}
	$s = sohag_launch_settings();
	return 'open' === $s['mode'] && $s['opened_at'] && ( time() - (int) $s['opened_at'] ) < 14 * DAY_IN_SECONDS;
}

add_action(
	'wp_enqueue_scripts',
	function () {
		if ( sohag_show_ceremony() ) {
			wp_enqueue_style( 'sohag-launch', SOHAG_URI . '/assets/css/launch.css', array(), sohag_asset_ver( 'css/launch.css' ) );
			wp_enqueue_script( 'sohag-launch', SOHAG_URI . '/assets/js/launch.js', array(), sohag_asset_ver( 'js/launch.js' ), true );
		}
		if ( ! sohag_store_is_open() && sohag_is_team_member() ) {
			wp_enqueue_style( 'sohag-launch', SOHAG_URI . '/assets/css/launch.css', array(), sohag_asset_ver( 'css/launch.css' ) );
		}
	},
	40
);

add_action(
	'wp_body_open',
	function () {
		if ( ! sohag_show_ceremony() ) {
			return;
		}
		// phpcs:ignore WordPress.Security.NonceVerification
		$force = isset( $_GET['sohag_ceremony'] );
		?>
		<div class="go-stage go-stage--ceremony" id="sohag-ceremony" role="dialog" aria-label="<?php esc_attr_e( 'Grand opening', 'sohag-exclusive' ); ?>" data-force="<?php echo $force ? '1' : ''; ?>">
			<?php sohag_launch_stage_parts(); ?>
			<?php sohag_launch_ribbon(); ?>
			<p class="go-open-text"><span>We're Open!</span><small><?php esc_html_e( 'Welcome to Sohag Exclusive', 'sohag-exclusive' ); ?></small></p>
			<button type="button" class="go-skip" data-go-skip><?php esc_html_e( 'Skip', 'sohag-exclusive' ); ?></button>
		</div>
		<script>
			// Seen it already? Remove before first paint so returning visitors never see a flash.
			(function () {
				var el = document.getElementById('sohag-ceremony');
				var seen = false;
				try { seen = localStorage.getItem('sohag_ribbon_cut_seen') === '1'; } catch (e) {}
				if (seen && !el.getAttribute('data-force')) { el.parentNode.removeChild(el); } else { document.documentElement.classList.add('go-lock'); }
			})();
		</script>
		<?php
	},
	1
);

/* -------------------------------------------------------------------------
 * Team badge + admin bar status while the curtain is on.
 * ---------------------------------------------------------------------- */
add_action(
	'wp_footer',
	function () {
		if ( sohag_store_is_open() || ! sohag_is_team_member() ) {
			return;
		}
		$href = current_user_can( 'edit_posts' ) ? admin_url( 'themes.php?page=sohag-launch' ) : home_url( '/' );
		printf(
			'<a class="go-team-badge" href="%s"><span aria-hidden="true">🎀</span> %s</a>',
			esc_url( $href ),
			esc_html__( 'Team preview — visitors still see the Grand Opening curtain', 'sohag-exclusive' )
		);
	}
);

add_action(
	'admin_bar_menu',
	function ( $bar ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}
		$bar->add_node(
			array(
				'id'    => 'sohag-launch',
				'title' => sohag_store_is_open() ? '✅ ' . __( 'Store is open', 'sohag-exclusive' ) : '🎀 ' . __( 'Grand Opening curtain is ON', 'sohag-exclusive' ),
				'href'  => admin_url( 'themes.php?page=sohag-launch' ),
			)
		);
	},
	90
);

/* -------------------------------------------------------------------------
 * Admin page: Appearance → Grand Opening.
 * ---------------------------------------------------------------------- */
add_action(
	'admin_menu',
	function () {
		add_theme_page(
			__( 'Grand Opening', 'sohag-exclusive' ),
			__( 'Grand Opening', 'sohag-exclusive' ),
			'manage_options',
			'sohag-launch',
			'sohag_launch_admin_page'
		);
	}
);

function sohag_launch_admin_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$notice = '';
	if ( isset( $_POST['sohag_launch_action'] ) && check_admin_referer( 'sohag_launch' ) ) {
		$action = sanitize_key( wp_unslash( $_POST['sohag_launch_action'] ) );
		if ( 'save_date' === $action ) {
			$date = isset( $_POST['opening_date'] ) ? sanitize_text_field( wp_unslash( $_POST['opening_date'] ) ) : '';
			$time = isset( $_POST['opening_time'] ) ? sanitize_text_field( wp_unslash( $_POST['opening_time'] ) ) : '';
			$ok   = preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) && preg_match( '/^\d{2}:\d{2}$/', $time ?: '10:00' );
			sohag_launch_update( array( 'date' => $ok ? $date . ' ' . ( $time ? $time : '10:00' ) : '' ) );
			$notice = $ok ? __( 'Opening date saved. The countdown is now on the Grand Opening page.', 'sohag-exclusive' ) : __( 'Opening date cleared. Visitors see "Coming Soon" without a countdown.', 'sohag-exclusive' );
		} elseif ( 'cut_ribbon' === $action ) {
			sohag_launch_update(
				array(
					'mode'      => 'open',
					'opened_at' => time(),
				)
			);
			$notice = __( 'The ribbon is cut — your store is open to everyone! Each visitor sees the ribbon-cutting once.', 'sohag-exclusive' );
		} elseif ( 'close' === $action ) {
			sohag_launch_update( array( 'mode' => 'closed' ) );
			$notice = __( 'The Grand Opening curtain is back on. Only you and your team can see the store.', 'sohag-exclusive' );
		} elseif ( 'new_key' === $action ) {
			sohag_launch_update( array( 'key' => strtolower( wp_generate_password( 8, false, false ) ) ) );
			$notice = __( 'New team link created. The old link no longer works — send the new one to your team.', 'sohag-exclusive' );
		}
	}

	$s       = sohag_launch_settings();
	$open    = 'open' === $s['mode'];
	$date    = $s['date'] ? substr( $s['date'], 0, 10 ) : '';
	$time    = $s['date'] ? substr( $s['date'], 11, 5 ) : '10:00';
	$link    = sohag_team_link();
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Grand Opening', 'sohag-exclusive' ); ?></h1>
		<?php if ( $notice ) : ?>
			<div class="notice notice-success"><p><?php echo esc_html( $notice ); ?></p></div>
		<?php endif; ?>

		<div style="max-width:760px;background:#fff;border:1px solid #dcdcde;border-radius:10px;padding:22px 26px;margin-top:16px">
			<h2 style="margin-top:0"><?php echo $open ? '✅ ' . esc_html__( 'Your store is open to everyone', 'sohag-exclusive' ) : '🎀 ' . esc_html__( 'The Grand Opening curtain is ON', 'sohag-exclusive' ); ?></h2>
			<p><?php echo $open ? esc_html__( 'Visitors can browse and order. You can put the curtain back on at any time.', 'sohag-exclusive' ) : esc_html__( 'Visitors see the Grand Opening page. You (logged in) and anyone with the team link see the full store.', 'sohag-exclusive' ); ?></p>
			<p>
				<a class="button" href="<?php echo esc_url( add_query_arg( 'sohag_curtain', 'preview', home_url( '/' ) ) ); ?>" target="_blank"><?php esc_html_e( 'Preview the curtain', 'sohag-exclusive' ); ?></a>
				<a class="button" href="<?php echo esc_url( add_query_arg( 'sohag_ceremony', 'preview', home_url( '/' ) ) ); ?>" target="_blank"><?php esc_html_e( 'Preview the ribbon-cutting', 'sohag-exclusive' ); ?></a>
			</p>
		</div>

		<?php if ( ! $open ) : ?>
		<div style="max-width:760px;background:#fff;border:1px solid #dcdcde;border-radius:10px;padding:22px 26px;margin-top:16px">
			<h2 style="margin-top:0"><?php esc_html_e( 'Team link', 'sohag-exclusive' ); ?></h2>
			<p><?php esc_html_e( 'Send this link to your team on WhatsApp. Opening it once lets them see the full store on that phone for 60 days — no login needed.', 'sohag-exclusive' ); ?></p>
			<p><input type="text" readonly class="large-text code" value="<?php echo esc_attr( $link ); ?>" onclick="this.select()" id="sohag-team-link">
			<button type="button" class="button" onclick="navigator.clipboard&&navigator.clipboard.writeText(document.getElementById('sohag-team-link').value).then(function(){this.textContent='Copied ✓'}.bind(this))"><?php esc_html_e( 'Copy link', 'sohag-exclusive' ); ?></button></p>
			<form method="post" onsubmit="return confirm('<?php echo esc_js( __( 'Create a new link? The old team link will stop working.', 'sohag-exclusive' ) ); ?>')">
				<?php wp_nonce_field( 'sohag_launch' ); ?>
				<button class="button-link" name="sohag_launch_action" value="new_key"><?php esc_html_e( 'Create a new team link', 'sohag-exclusive' ); ?></button>
			</form>
		</div>

		<div style="max-width:760px;background:#fff;border:1px solid #dcdcde;border-radius:10px;padding:22px 26px;margin-top:16px">
			<h2 style="margin-top:0"><?php esc_html_e( 'Opening date (countdown)', 'sohag-exclusive' ); ?></h2>
			<p><?php esc_html_e( 'Set a date to show a live countdown. Leave it empty to show "Coming Soon" without a countdown. The store only opens when you cut the ribbon below.', 'sohag-exclusive' ); ?></p>
			<form method="post">
				<?php wp_nonce_field( 'sohag_launch' ); ?>
				<p>
					<label><?php esc_html_e( 'Date', 'sohag-exclusive' ); ?> <input type="date" name="opening_date" value="<?php echo esc_attr( $date ); ?>"></label>
					<label style="margin-left:12px"><?php esc_html_e( 'Time', 'sohag-exclusive' ); ?> <input type="time" name="opening_time" value="<?php echo esc_attr( $time ); ?>"></label>
					<span class="description" style="margin-left:8px"><?php echo esc_html( wp_timezone_string() ); ?></span>
				</p>
				<p><button class="button button-primary" name="sohag_launch_action" value="save_date"><?php esc_html_e( 'Save date', 'sohag-exclusive' ); ?></button></p>
			</form>
		</div>
		<?php endif; ?>

		<div style="max-width:760px;background:#fff;border:1px solid #dcdcde;border-radius:10px;padding:22px 26px;margin-top:16px">
			<form method="post" onsubmit="return confirm('<?php echo esc_js( $open ? __( 'Put the Grand Opening curtain back on? Visitors will not be able to shop.', 'sohag-exclusive' ) : __( 'Cut the ribbon and open the store to everyone now?', 'sohag-exclusive' ) ); ?>')">
				<?php wp_nonce_field( 'sohag_launch' ); ?>
				<?php if ( $open ) : ?>
					<button class="button" name="sohag_launch_action" value="close"><?php esc_html_e( 'Put the curtain back on', 'sohag-exclusive' ); ?></button>
				<?php else : ?>
					<p><?php esc_html_e( 'When everything is ready, press the button. The store opens instantly and every visitor sees the ribbon being cut.', 'sohag-exclusive' ); ?></p>
					<button class="button button-primary button-hero" name="sohag_launch_action" value="cut_ribbon" style="background:#7a1230;border-color:#5a0c22">✂ <?php esc_html_e( 'Cut the Ribbon — Open Store', 'sohag-exclusive' ); ?></button>
				<?php endif; ?>
			</form>
		</div>
	</div>
	<?php
}
