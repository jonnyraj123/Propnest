<?php
/**
 * Pages (also cart, checkout and my-account, which WooCommerce renders via shortcodes).
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

get_header();

while ( have_posts() ) :
	the_post();
	$sohag_is_wc_page = sohag_is_wc() && ( is_cart() || is_checkout() || is_account_page() );
	?>
	<div class="page-hero">
		<div class="container">
			<h1><?php the_title(); ?></h1>
		</div>
	</div>
	<div class="container content-area">
		<?php if ( $sohag_is_wc_page ) : ?>
			<?php
			if ( is_checkout() && ! is_wc_endpoint_url( 'order-received' ) ) {
				sohag_checkout_steps( 2 );
			} elseif ( is_cart() ) {
				sohag_checkout_steps( 1 );
			}
			the_content();
			?>
		<?php else : ?>
			<article <?php post_class( 'entry-content' ); ?>>
				<?php the_content(); ?>
			</article>
		<?php endif; ?>
	</div>
	<?php
endwhile;

get_footer();
