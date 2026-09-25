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
	<h1><?php esc_html_e( 'Page not found', 'sohag-exclusive' ); ?></h1>
	<p><?php esc_html_e( 'The link may have changed. Take a look at our collection instead.', 'sohag-exclusive' ); ?></p>
	<a class="btn" href="<?php echo esc_url( sohag_shop_url() ); ?>"><?php esc_html_e( 'Go to Shop', 'sohag-exclusive' ); ?></a>
</div>
<?php
get_footer();
