<?php
/**
 * Fallback template (blog, search, archives).
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<div class="page-hero">
	<div class="container">
		<h1>
			<?php
			if ( is_search() ) {
				/* translators: %s: search query. */
				printf( esc_html__( '"%s" এর ফলাফল', 'sohag-exclusive' ), esc_html( get_search_query() ) );
			} elseif ( is_archive() ) {
				the_archive_title();
			} else {
				esc_html_e( 'ব্লগ', 'sohag-exclusive' );
			}
			?>
		</h1>
	</div>
</div>
<div class="container content-area">
	<?php if ( have_posts() ) : ?>
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article <?php post_class( 'post-card' ); ?>>
				<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
				<?php the_excerpt(); ?>
			</article>
		<?php endwhile; ?>
		<?php the_posts_pagination(); ?>
	<?php else : ?>
		<div class="not-found">
			<p><?php esc_html_e( 'কিছু পাওয়া যায়নি।', 'sohag-exclusive' ); ?></p>
			<a class="btn" href="<?php echo esc_url( sohag_shop_url() ); ?>"><?php esc_html_e( 'শপে যান', 'sohag-exclusive' ); ?></a>
		</div>
	<?php endif; ?>
</div>
<?php
get_footer();
