<?php
/**
 * Site header.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
	<meta name="theme-color" content="#7a1230">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="screen-reader-text" href="#main"><?php esc_html_e( 'Skip to content', 'sohag-exclusive' ); ?></a>

<?php $sohag_notes = sohag_announcements(); ?>
<?php if ( $sohag_notes ) : ?>
<div class="topbar">
	<div class="container topbar__inner">
		<div class="topbar__marquee">
			<div class="topbar__track">
				<?php
				// Rendered twice so the marquee loops seamlessly.
				for ( $i = 0; $i < 2; $i++ ) {
					foreach ( $sohag_notes as $note ) {
						echo '<span' . ( $i ? ' aria-hidden="true"' : '' ) . '>' . esc_html( $note ) . '</span>';
					}
				}
				?>
			</div>
		</div>
		<?php if ( sohag_opt( 'phone' ) ) : ?>
			<div class="topbar__contact">
				<a href="<?php echo esc_url( sohag_tel_url() ); ?>">☎ <?php echo esc_html( sohag_opt( 'phone' ) ); ?></a>
			</div>
		<?php endif; ?>
	</div>
</div>
<?php endif; ?>

<header class="site-header">
	<div class="container header__inner">
		<button class="icon-btn menu-toggle" type="button" aria-controls="sohag-drawer" aria-expanded="false" data-drawer-open>
			<?php echo sohag_icon( 'menu' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
			<span class="screen-reader-text"><?php esc_html_e( 'Menu', 'sohag-exclusive' ); ?></span>
		</button>

		<?php sohag_brand(); ?>

		<nav class="main-nav" aria-label="<?php esc_attr_e( 'Main menu', 'sohag-exclusive' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'menu',
					'depth'          => 2,
					'fallback_cb'    => 'sohag_fallback_menu',
				)
			);
			?>
		</nav>

		<div class="header__actions">
			<button class="icon-btn" type="button" data-search-toggle aria-expanded="false" aria-controls="sohag-search">
				<?php echo sohag_icon( 'search' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
				<span class="screen-reader-text"><?php esc_html_e( 'Search', 'sohag-exclusive' ); ?></span>
			</button>
			<?php if ( sohag_is_wc() ) : ?>
				<a class="icon-btn hide-mobile" href="<?php echo esc_url( wc_get_page_permalink( 'myaccount' ) ); ?>">
					<?php echo sohag_icon( 'user' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
					<span class="screen-reader-text"><?php esc_html_e( 'My account', 'sohag-exclusive' ); ?></span>
				</a>
				<a class="icon-btn header-cart" href="<?php echo esc_url( wc_get_cart_url() ); ?>">
					<?php echo sohag_icon( 'bag' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
					<span class="cart-count" data-cart-count><?php echo esc_html( sohag_cart_count() ); ?></span>
					<span class="screen-reader-text"><?php esc_html_e( 'Cart', 'sohag-exclusive' ); ?></span>
				</a>
			<?php endif; ?>
		</div>
	</div>

	<div class="header-search" id="sohag-search">
		<div class="container">
			<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
				<label class="screen-reader-text" for="sohag-s"><?php esc_html_e( 'Search products', 'sohag-exclusive' ); ?></label>
				<input type="search" id="sohag-s" name="s" placeholder="<?php esc_attr_e( 'Search earrings, bangles, bags…', 'sohag-exclusive' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>">
				<?php if ( sohag_is_wc() ) : ?>
					<input type="hidden" name="post_type" value="product">
				<?php endif; ?>
				<button class="btn" type="submit"><?php esc_html_e( 'Search', 'sohag-exclusive' ); ?></button>
			</form>
		</div>
	</div>
</header>

<div class="drawer" id="sohag-drawer" aria-hidden="true">
	<div class="drawer__backdrop" data-drawer-close></div>
	<aside class="drawer__panel" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Menu', 'sohag-exclusive' ); ?>">
		<div class="drawer__head">
			<?php sohag_brand(); ?>
			<button class="icon-btn" type="button" data-drawer-close>
				<?php echo sohag_icon( 'close' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
				<span class="screen-reader-text"><?php esc_html_e( 'Close', 'sohag-exclusive' ); ?></span>
			</button>
		</div>
		<nav class="drawer__nav">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'depth'          => 2,
					'fallback_cb'    => 'sohag_fallback_menu',
				)
			);
			?>
		</nav>
		<div class="drawer__foot">
			<?php if ( sohag_opt( 'phone' ) ) : ?>
				<p>☎ <?php echo esc_html( sohag_opt( 'phone' ) ); ?></p>
			<?php endif; ?>
			<?php sohag_pay_badges(); ?>
		</div>
	</aside>
</div>

<main id="main" class="site-main">
