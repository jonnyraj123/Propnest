<?php
/**
 * Homepage.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

get_header();
$sohag_charges = sohag_delivery_charges();
?>

<section class="hero">
	<div class="container hero__inner">
		<div class="hero__copy">
			<span class="hero__script"><?php echo esc_html( sohag_opt( 'hero_script' ) ); ?></span>
			<h1><?php echo wp_kses( sohag_opt( 'hero_title' ), array( 'em' => array(), 'strong' => array(), 'br' => array() ) ); ?></h1>
			<p class="hero__lead"><?php echo esc_html( sohag_opt( 'hero_text' ) ); ?></p>
			<div class="hero__tags"><span>Unique</span><span>Artistic</span><span>For You</span></div>
			<div class="hero__cta">
				<a class="btn" href="<?php echo esc_url( sohag_shop_url() ); ?>"><?php esc_html_e( 'এখনই কিনুন', 'sohag-exclusive' ); ?> →</a>
				<a class="btn btn--ghost" href="#categories"><?php esc_html_e( 'ক্যাটাগরি দেখুন', 'sohag-exclusive' ); ?></a>
			</div>
		</div>
		<div class="hero__media">
			<a class="hero__frame" href="<?php echo esc_url( sohag_shop_url() ); ?>">
				<img src="<?php echo esc_url( sohag_opt( 'hero_image' ) ); ?>" alt="<?php esc_attr_e( 'Sohag Exclusive হ্যান্ডমেড প্রোডাক্ট', 'sohag-exclusive' ); ?>" width="1080" height="720" fetchpriority="high">
			</a>
			<div class="hero__badge">
				<span class="hero__badge-icon"><?php echo sohag_icon( 'cash' ); // phpcs:ignore ?></span>
				<span><strong><?php esc_html_e( 'ক্যাশ অন ডেলিভারি', 'sohag-exclusive' ); ?></strong><?php esc_html_e( 'পণ্য হাতে পেয়ে টাকা দিন', 'sohag-exclusive' ); ?></span>
			</div>
		</div>
	</div>
</section>

<section class="trust" aria-label="<?php esc_attr_e( 'আমাদের সুবিধা', 'sohag-exclusive' ); ?>">
	<div class="container trust__grid">
		<div class="trust__item">
			<span class="trust__icon"><?php echo sohag_icon( 'cash' ); // phpcs:ignore ?></span>
			<div><strong><?php esc_html_e( 'ক্যাশ অন ডেলিভারি', 'sohag-exclusive' ); ?></strong><span><?php esc_html_e( 'সারা বাংলাদেশে', 'sohag-exclusive' ); ?></span></div>
		</div>
		<div class="trust__item">
			<span class="trust__icon"><?php echo sohag_icon( 'truck' ); // phpcs:ignore ?></span>
			<div><strong><?php esc_html_e( 'দ্রুত হোম ডেলিভারি', 'sohag-exclusive' ); ?></strong><span><?php echo esc_html( sprintf( 'ঢাকায় ৳%s • বাইরে ৳%s', sohag_bn_num( $sohag_charges['inside'] ), sohag_bn_num( $sohag_charges['outside'] ) ) ); ?></span></div>
		</div>
		<div class="trust__item">
			<span class="trust__icon"><?php echo sohag_icon( 'heart' ); // phpcs:ignore ?></span>
			<div><strong><?php esc_html_e( '১০০% হ্যান্ডমেড', 'sohag-exclusive' ); ?></strong><span><?php esc_html_e( 'ভালোবাসা দিয়ে তৈরি', 'sohag-exclusive' ); ?></span></div>
		</div>
		<div class="trust__item">
			<span class="trust__icon"><?php echo sohag_icon( 'refresh' ); // phpcs:ignore ?></span>
			<div><strong><?php esc_html_e( 'সহজ এক্সচেঞ্জ', 'sohag-exclusive' ); ?></strong><span><?php esc_html_e( 'ত্রুটি থাকলে বদলে দেব', 'sohag-exclusive' ); ?></span></div>
		</div>
	</div>
</section>

<section class="section" id="categories">
	<div class="container">
		<div class="section-head">
			<span class="eyebrow">Shop by Category</span>
			<h2><?php esc_html_e( 'ক্যাটাগরি অনুযায়ী কেনাকাটা', 'sohag-exclusive' ); ?></h2>
			<div class="divider">♥</div>
		</div>
		<div class="cats">
			<?php foreach ( sohag_categories( 6 ) as $cat ) : ?>
				<a class="cat" href="<?php echo esc_url( $cat['url'] ); ?>">
					<span class="cat__img"><img src="<?php echo esc_url( $cat['img'] ); ?>" alt="" width="240" height="240" loading="lazy"></span>
					<span class="cat__name"><?php echo esc_html( $cat['name'] ); ?></span>
					<?php if ( $cat['count'] ) : ?>
						<span class="cat__count"><?php echo esc_html( sohag_bn_num( $cat['count'] ) . ' টি প্রোডাক্ট' ); ?></span>
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
			<h2><?php esc_html_e( 'নতুন কালেকশন', 'sohag-exclusive' ); ?></h2>
			<p><?php esc_html_e( 'সদ্য তৈরি হ্যান্ডমেড প্রোডাক্ট — স্টক সীমিত', 'sohag-exclusive' ); ?></p>
		</div>
		<?php echo do_shortcode( '[products limit="8" columns="4" orderby="date" order="DESC" visibility="visible"]' ); ?>
		<div class="section-foot">
			<a class="btn btn--ghost" href="<?php echo esc_url( sohag_shop_url() ); ?>"><?php esc_html_e( 'সব প্রোডাক্ট দেখুন', 'sohag-exclusive' ); ?> →</a>
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
			<p><?php esc_html_e( 'আমাদের প্রতিটি প্রোডাক্ট হাতে বানানো — পুঁতি বেছে নেওয়া থেকে শেষ সেলাই পর্যন্ত। তাই প্রতিটি জিনিস একটু আলাদা, একদম আপনার মতো।', 'sohag-exclusive' ); ?></p>
			<ul class="story__list">
				<li><?php esc_html_e( 'বাছাই করা মানসম্মত পুঁতি, স্টোন ও কাপড়', 'sohag-exclusive' ); ?></li>
				<li><?php esc_html_e( 'অর্ডার অনুযায়ী কাস্টম রঙ ও ডিজাইন', 'sohag-exclusive' ); ?></li>
				<li><?php esc_html_e( 'সুন্দর গিফট প্যাকিং', 'sohag-exclusive' ); ?></li>
			</ul>
			<a class="btn btn--gold" href="<?php echo esc_url( sohag_whatsapp_url( __( 'আমি কাস্টম অর্ডার দিতে চাই', 'sohag-exclusive' ) ) ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'কাস্টম অর্ডার দিন', 'sohag-exclusive' ); ?></a>
		</div>
	</div>
</section>

<?php if ( sohag_is_wc() ) : ?>
<section class="section section--white">
	<div class="container">
		<div class="section-head">
			<span class="eyebrow">Best Sellers</span>
			<h2><?php esc_html_e( 'সবচেয়ে জনপ্রিয়', 'sohag-exclusive' ); ?></h2>
		</div>
		<?php echo do_shortcode( '[products limit="4" columns="4" best_selling="true" visibility="visible"]' ); ?>
	</div>
</section>
<?php endif; ?>

<section class="section">
	<div class="container">
		<div class="section-head">
			<span class="eyebrow">Easy Ordering</span>
			<h2><?php esc_html_e( 'কীভাবে অর্ডার করবেন', 'sohag-exclusive' ); ?></h2>
		</div>
		<div class="steps">
			<div class="step">
				<h3><?php esc_html_e( 'পছন্দের প্রোডাক্ট বাছুন', 'sohag-exclusive' ); ?></h3>
				<p><?php esc_html_e( '"এখনই অর্ডার করুন" বা "কার্টে যোগ করুন" বাটনে চাপ দিন।', 'sohag-exclusive' ); ?></p>
			</div>
			<div class="step">
				<h3><?php esc_html_e( 'নাম, মোবাইল ও ঠিকানা দিন', 'sohag-exclusive' ); ?></h3>
				<p><?php esc_html_e( 'অ্যাকাউন্ট খোলার দরকার নেই — এক পাতাতেই চেকআউট।', 'sohag-exclusive' ); ?></p>
			</div>
			<div class="step">
				<h3><?php esc_html_e( 'পণ্য হাতে পেয়ে টাকা দিন', 'sohag-exclusive' ); ?></h3>
				<p><?php esc_html_e( 'ক্যাশ অন ডেলিভারি, অথবা বিকাশ/নগদ/রকেটে অগ্রিম পেমেন্ট।', 'sohag-exclusive' ); ?></p>
			</div>
		</div>
		<?php sohag_pay_badges(); ?>
	</div>
</section>

<section class="section section--tight">
	<div class="container">
		<div class="cta-band">
			<div>
				<h2><?php esc_html_e( 'ফেসবুকে আমাদের সাথে থাকুন', 'sohag-exclusive' ); ?></h2>
				<p><?php esc_html_e( 'নতুন ডিজাইন, অফার আর লাইভ আপডেট সবার আগে পেতে পেজে লাইক দিন।', 'sohag-exclusive' ); ?></p>
			</div>
			<div class="cta-band__actions">
				<a class="btn" href="<?php echo esc_url( sohag_opt( 'facebook' ) ); ?>" target="_blank" rel="noopener"><?php echo sohag_icon( 'facebook' ); // phpcs:ignore ?> Facebook</a>
				<a class="btn" href="<?php echo esc_url( sohag_whatsapp_url() ); ?>" target="_blank" rel="noopener"><?php echo sohag_icon( 'whatsapp' ); // phpcs:ignore ?> WhatsApp</a>
			</div>
		</div>
	</div>
</section>

<?php
get_footer();
