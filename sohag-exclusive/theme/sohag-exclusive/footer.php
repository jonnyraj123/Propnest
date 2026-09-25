<?php
/**
 * Site footer.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;
?>
</main>

<footer class="site-footer">
	<div class="container footer__top">
		<div class="footer__brand">
			<img src="<?php echo esc_url( SOHAG_URI . '/assets/img/logo-sm.jpg' ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" width="84" height="84" loading="lazy">
			<p><?php echo esc_html( sohag_opt( 'about' ) ); ?></p>
			<div class="socials">
				<?php if ( sohag_opt( 'facebook' ) ) : ?>
					<a href="<?php echo esc_url( sohag_opt( 'facebook' ) ); ?>" target="_blank" rel="noopener" aria-label="Facebook"><?php echo sohag_icon( 'facebook' ); // phpcs:ignore ?></a>
				<?php endif; ?>
				<?php if ( sohag_opt( 'instagram' ) ) : ?>
					<a href="<?php echo esc_url( sohag_opt( 'instagram' ) ); ?>" target="_blank" rel="noopener" aria-label="Instagram"><?php echo sohag_icon( 'instagram' ); // phpcs:ignore ?></a>
				<?php endif; ?>
				<a href="<?php echo esc_url( sohag_whatsapp_url() ); ?>" target="_blank" rel="noopener" aria-label="WhatsApp"><?php echo sohag_icon( 'whatsapp' ); // phpcs:ignore ?></a>
			</div>
		</div>

		<div>
			<h4><?php esc_html_e( 'শপ', 'sohag-exclusive' ); ?></h4>
			<ul>
				<?php if ( sohag_is_wc() ) : ?>
					<li><a href="<?php echo esc_url( sohag_shop_url() ); ?>"><?php esc_html_e( 'সব প্রোডাক্ট', 'sohag-exclusive' ); ?></a></li>
				<?php endif; ?>
				<?php foreach ( sohag_categories( 6 ) as $cat ) : ?>
					<?php if ( null !== $cat['count'] ) : ?>
						<li><a href="<?php echo esc_url( $cat['url'] ); ?>"><?php echo esc_html( $cat['name'] ); ?></a></li>
					<?php endif; ?>
				<?php endforeach; ?>
			</ul>
		</div>

		<div>
			<h4><?php esc_html_e( 'তথ্য', 'sohag-exclusive' ); ?></h4>
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'footer',
					'container'      => false,
					'depth'          => 1,
					'fallback_cb'    => false,
				)
			);
			?>
			<?php if ( ! has_nav_menu( 'footer' ) && sohag_is_wc() ) : ?>
				<ul>
					<li><a href="<?php echo esc_url( wc_get_page_permalink( 'myaccount' ) ); ?>"><?php esc_html_e( 'আমার অ্যাকাউন্ট', 'sohag-exclusive' ); ?></a></li>
					<li><a href="<?php echo esc_url( wc_get_cart_url() ); ?>"><?php esc_html_e( 'কার্ট', 'sohag-exclusive' ); ?></a></li>
				</ul>
			<?php endif; ?>
		</div>

		<div>
			<h4><?php esc_html_e( 'যোগাযোগ', 'sohag-exclusive' ); ?></h4>
			<ul class="footer__contact">
				<li><?php echo sohag_icon( 'phone' ); // phpcs:ignore ?><a href="tel:<?php echo esc_attr( preg_replace( '/[^\d+]/', '', sohag_opt( 'phone' ) ) ); ?>"><?php echo esc_html( sohag_opt( 'phone' ) ); ?></a></li>
				<?php if ( sohag_opt( 'email' ) ) : ?>
					<li><?php echo sohag_icon( 'mail' ); // phpcs:ignore ?><a href="mailto:<?php echo esc_attr( sohag_opt( 'email' ) ); ?>"><?php echo esc_html( sohag_opt( 'email' ) ); ?></a></li>
				<?php endif; ?>
				<li><?php echo sohag_icon( 'pin' ); // phpcs:ignore ?><span><?php echo esc_html( sohag_opt( 'address' ) ); ?></span></li>
				<li><?php echo sohag_icon( 'clock' ); // phpcs:ignore ?><span><?php esc_html_e( 'প্রতিদিন সকাল ১০টা – রাত ১০টা', 'sohag-exclusive' ); ?></span></li>
			</ul>
		</div>
	</div>

	<div class="container footer__bottom">
		<span>© <?php echo esc_html( sohag_bn_num( gmdate( 'Y' ) ) ); ?> <?php bloginfo( 'name' ); ?> — Wear Your Story</span>
		<?php sohag_pay_badges(); ?>
	</div>
</footer>

<div class="float-chat">
	<?php $sohag_ms = sohag_messenger_url(); ?>
	<?php if ( $sohag_ms ) : ?>
		<a class="float-chat__ms" href="<?php echo esc_url( $sohag_ms ); ?>" target="_blank" rel="noopener" aria-label="Messenger"><?php echo sohag_icon( 'messenger' ); // phpcs:ignore ?></a>
	<?php endif; ?>
	<a class="float-chat__wa" href="<?php echo esc_url( sohag_whatsapp_url( __( 'আসসালামু আলাইকুম, আমি একটি প্রোডাক্ট অর্ডার করতে চাই।', 'sohag-exclusive' ) ) ); ?>" target="_blank" rel="noopener" aria-label="WhatsApp"><?php echo sohag_icon( 'whatsapp' ); // phpcs:ignore ?></a>
</div>

<?php if ( sohag_is_wc() ) : ?>
<nav class="bottom-nav" aria-label="<?php esc_attr_e( 'মোবাইল নেভিগেশন', 'sohag-exclusive' ); ?>">
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="<?php echo is_front_page() ? 'is-active' : ''; ?>"><?php echo sohag_icon( 'home' ); // phpcs:ignore ?><?php esc_html_e( 'হোম', 'sohag-exclusive' ); ?></a>
	<a href="<?php echo esc_url( sohag_shop_url() ); ?>" class="<?php echo ( is_shop() || is_product_taxonomy() ) ? 'is-active' : ''; ?>"><?php echo sohag_icon( 'grid' ); // phpcs:ignore ?><?php esc_html_e( 'শপ', 'sohag-exclusive' ); ?></a>
	<a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="<?php echo is_cart() ? 'is-active' : ''; ?>"><?php echo sohag_icon( 'bag' ); // phpcs:ignore ?><span class="cart-count" data-cart-count><?php echo esc_html( sohag_cart_count() ); ?></span><?php esc_html_e( 'কার্ট', 'sohag-exclusive' ); ?></a>
	<a href="<?php echo esc_url( wc_get_page_permalink( 'myaccount' ) ); ?>" class="<?php echo is_account_page() ? 'is-active' : ''; ?>"><?php echo sohag_icon( 'user' ); // phpcs:ignore ?><?php esc_html_e( 'অ্যাকাউন্ট', 'sohag-exclusive' ); ?></a>
	<a href="<?php echo esc_url( sohag_whatsapp_url() ); ?>" target="_blank" rel="noopener"><?php echo sohag_icon( 'whatsapp' ); // phpcs:ignore ?><?php esc_html_e( 'চ্যাট', 'sohag-exclusive' ); ?></a>
</nav>
<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
