<?php
/**
 * Homepage.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

get_header();
$sohag_charges = sohag_delivery_charges();
$sohag_wa      = sohag_whatsapp_url();
?>

<section class="hero">
	<div class="container hero__inner">
		<div class="hero__copy">
			<span class="hero__script"><?php echo esc_html( sohag_opt( 'hero_script' ) ); ?></span>
			<h1><?php echo wp_kses( sohag_opt( 'hero_title' ), array( 'em' => array(), 'strong' => array(), 'br' => array() ) ); ?></h1>
			<p class="hero__lead"><?php echo esc_html( sohag_opt( 'hero_text' ) ); ?></p>
			<div class="hero__tags"><span>Unique</span><span>Artistic</span><span>For You</span></div>
			<div class="hero__cta">
				<a class="btn" href="<?php echo esc_url( sohag_shop_url() ); ?>"><?php esc_html_e( 'Shop Now', 'sohag-exclusive' ); ?> →</a>
				<a class="btn btn--ghost" href="#categories"><?php esc_html_e( 'Browse Categories', 'sohag-exclusive' ); ?></a>
			</div>
		</div>
		<div class="hero__media">
			<a class="hero__frame" href="<?php echo esc_url( sohag_shop_url() ); ?>">
				<img src="<?php echo esc_url( sohag_opt( 'hero_image' ) ); ?>" alt="<?php esc_attr_e( 'Sohag Exclusive handmade products', 'sohag-exclusive' ); ?>" width="1080" height="720" fetchpriority="high">
			</a>
			<div class="hero__badge">
				<span class="hero__badge-icon"><?php echo sohag_icon( 'cash' ); // phpcs:ignore ?></span>
				<span><strong><?php esc_html_e( 'Cash on Delivery', 'sohag-exclusive' ); ?></strong><?php esc_html_e( 'Pay when you receive it', 'sohag-exclusive' ); ?></span>
			</div>
		</div>
	</div>
</section>

<section class="trust" aria-label="<?php esc_attr_e( 'Why shop with us', 'sohag-exclusive' ); ?>">
	<div class="container trust__grid">
		<div class="trust__item">
			<span class="trust__icon"><?php echo sohag_icon( 'cash' ); // phpcs:ignore ?></span>
			<div><strong><?php esc_html_e( 'Cash on Delivery', 'sohag-exclusive' ); ?></strong><span><?php esc_html_e( 'All over Bangladesh', 'sohag-exclusive' ); ?></span></div>
		</div>
		<div class="trust__item">
			<span class="trust__icon"><?php echo sohag_icon( 'truck' ); // phpcs:ignore ?></span>
			<div><strong><?php esc_html_e( 'Fast Home Delivery', 'sohag-exclusive' ); ?></strong><span><?php echo esc_html( sprintf( 'Dhaka ৳%d • Outside ৳%d', $sohag_charges['inside'], $sohag_charges['outside'] ) ); ?></span></div>
		</div>
		<div class="trust__item">
			<span class="trust__icon"><?php echo sohag_icon( 'heart' ); // phpcs:ignore ?></span>
			<div><strong><?php esc_html_e( '100% Handmade', 'sohag-exclusive' ); ?></strong><span><?php esc_html_e( 'Crafted with love', 'sohag-exclusive' ); ?></span></div>
		</div>
		<div class="trust__item">
			<span class="trust__icon"><?php echo sohag_icon( 'refresh' ); // phpcs:ignore ?></span>
			<div><strong><?php esc_html_e( 'Easy Exchange', 'sohag-exclusive' ); ?></strong><span><?php esc_html_e( 'If anything is faulty', 'sohag-exclusive' ); ?></span></div>
		</div>
	</div>
</section>

<section class="section" id="categories">
	<div class="container">
		<div class="section-head">
			<span class="eyebrow">Shop by Category</span>
			<h2><?php esc_html_e( 'Find Your Favourite', 'sohag-exclusive' ); ?></h2>
			<div class="divider">♥</div>
		</div>
		<div class="cats">
			<?php foreach ( sohag_categories( 6 ) as $cat ) : ?>
				<a class="cat" href="<?php echo esc_url( $cat['url'] ); ?>">
					<span class="cat__img"><img src="<?php echo esc_url( $cat['img'] ); ?>" alt="" width="240" height="240" loading="lazy"></span>
					<span class="cat__name"><?php echo esc_html( $cat['name'] ); ?></span>
					<?php if ( $cat['count'] ) : ?>
						<?php /* translators: %d: number of products. */ ?>
						<span class="cat__count"><?php echo esc_html( sprintf( _n( '%d product', '%d products', $cat['count'], 'sohag-exclusive' ), $cat['count'] ) ); ?></span>
					<?php endif; ?>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<?php if ( sohag_is_wc() ) : ?>
<section class="section section--white">
	<div class="container">
		<div class="section-head">
			<span class="eyebrow">New Arrivals</span>
			<h2><?php esc_html_e( 'Fresh from Our Hands', 'sohag-exclusive' ); ?></h2>
			<p><?php esc_html_e( 'Newly made pieces — limited stock', 'sohag-exclusive' ); ?></p>
		</div>
		<?php echo do_shortcode( '[products limit="8" columns="4" orderby="date" order="DESC" visibility="visible"]' ); ?>
		<div class="section-foot">
			<a class="btn btn--ghost" href="<?php echo esc_url( sohag_shop_url() ); ?>"><?php esc_html_e( 'View All Products', 'sohag-exclusive' ); ?> →</a>
		</div>
	</div>
</section>
<?php endif; ?>

<section class="section">
	<div class="container story">
		<div class="story__media">
			<img src="<?php echo esc_url( SOHAG_URI . '/assets/img/logo.jpg' ); ?>" alt="Sohag Exclusive" width="600" height="600" loading="lazy">
		</div>
		<div>
			<p class="story__quote">Handmade is not just a product, it's a feeling ♥</p>
			<p><?php esc_html_e( 'Every piece is made by hand — from choosing the beads to the last stitch. That is why each one is a little different, just like you.', 'sohag-exclusive' ); ?></p>
			<ul class="story__list">
				<li><?php esc_html_e( 'Carefully selected beads, stones and fabrics', 'sohag-exclusive' ); ?></li>
				<li><?php esc_html_e( 'Custom colours and designs on request', 'sohag-exclusive' ); ?></li>
				<li><?php esc_html_e( 'Beautiful gift-ready packaging', 'sohag-exclusive' ); ?></li>
			</ul>
			<?php if ( $sohag_wa ) : ?>
				<a class="btn btn--gold" href="<?php echo esc_url( sohag_whatsapp_url( __( 'Hi, I would like to place a custom order.', 'sohag-exclusive' ) ) ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Request a Custom Order', 'sohag-exclusive' ); ?></a>
			<?php else : ?>
				<a class="btn btn--gold" href="<?php echo esc_url( sohag_shop_url() ); ?>"><?php esc_html_e( 'Explore the Collection', 'sohag-exclusive' ); ?></a>
			<?php endif; ?>
		</div>
	</div>
</section>

<?php if ( sohag_is_wc() ) : ?>
<section class="section section--white">
	<div class="container">
		<div class="section-head">
			<span class="eyebrow">Best Sellers</span>
			<h2><?php esc_html_e( 'Customer Favourites', 'sohag-exclusive' ); ?></h2>
		</div>
		<?php echo do_shortcode( '[products limit="4" columns="4" best_selling="true" visibility="visible"]' ); ?>
	</div>
</section>
<?php endif; ?>

<section class="section">
	<div class="container">
		<div class="section-head">
			<span class="eyebrow">Easy Ordering</span>
			<h2><?php esc_html_e( 'How to Order', 'sohag-exclusive' ); ?></h2>
		</div>
		<div class="steps">
			<div class="step">
				<h3><?php esc_html_e( 'Pick your favourite', 'sohag-exclusive' ); ?></h3>
				<p><?php esc_html_e( 'Tap "Order Now" or "Add to Cart" on any product.', 'sohag-exclusive' ); ?></p>
			</div>
			<div class="step">
				<h3><?php esc_html_e( 'Enter name, phone & address', 'sohag-exclusive' ); ?></h3>
				<p><?php esc_html_e( 'No account needed — checkout is a single page.', 'sohag-exclusive' ); ?></p>
			</div>
			<div class="step">
				<h3><?php esc_html_e( 'Pay on delivery', 'sohag-exclusive' ); ?></h3>
				<p><?php esc_html_e( 'Cash on Delivery, or pay in advance with bKash, Nagad or Rocket.', 'sohag-exclusive' ); ?></p>
			</div>
		</div>
		<?php sohag_pay_badges(); ?>
	</div>
</section>

<section class="section section--tight">
	<div class="container">
		<div class="cta-band">
			<div>
				<h2><?php esc_html_e( 'Follow Us on Facebook', 'sohag-exclusive' ); ?></h2>
				<p><?php esc_html_e( 'Be the first to see new designs, offers and live updates.', 'sohag-exclusive' ); ?></p>
			</div>
			<div class="cta-band__actions">
				<a class="btn" href="<?php echo esc_url( sohag_opt( 'facebook' ) ); ?>" target="_blank" rel="noopener"><?php echo sohag_icon( 'facebook' ); // phpcs:ignore ?> Facebook</a>
				<?php if ( $sohag_wa ) : ?>
					<a class="btn" href="<?php echo esc_url( $sohag_wa ); ?>" target="_blank" rel="noopener"><?php echo sohag_icon( 'whatsapp' ); // phpcs:ignore ?> WhatsApp</a>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>

<?php
get_footer();
