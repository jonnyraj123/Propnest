<?php
/**
 * WooCommerce wrapper for shop, category and single product pages.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<?php if ( ! is_product() ) : ?>
	<div class="page-hero">
		<div class="container">
			<h1><?php woocommerce_page_title(); ?></h1>
			<?php woocommerce_breadcrumb(); ?>
		</div>
	</div>
<?php endif; ?>

<div class="container content-area">
	<?php
	if ( is_product() ) {
		woocommerce_breadcrumb();
	}
	woocommerce_content();
	?>
</div>
<?php
get_footer();
