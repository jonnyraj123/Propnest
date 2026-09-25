<?php
/**
 * 404.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<div class="container not-found">
	<div class="big">404</div>
	<h1><?php esc_html_e( 'পাতাটি খুঁজে পাওয়া যায়নি', 'sohag-exclusive' ); ?></h1>
	<p><?php esc_html_e( 'হয়তো লিংকটি বদলে গেছে। আমাদের কালেকশন ঘুরে দেখুন।', 'sohag-exclusive' ); ?></p>
	<a class="btn" href="<?php echo esc_url( sohag_shop_url() ); ?>"><?php esc_html_e( 'শপে যান', 'sohag-exclusive' ); ?></a>
</div>
<?php
get_footer();
