<?php
/**
 * Manual mobile-banking gateway: customer sends money by bKash / Nagad / Rocket
 * and enters sender number + Transaction ID. Order is placed "On hold" until you verify.
 *
 * WooCommerce → Settings → Payments → "bKash / Nagad / Rocket".
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

class Sohag_Mobile_Payment_Gateway extends WC_Payment_Gateway {

	/** @var array[] slug => [label, colour] */
	public static $providers = array(
		'bkash'  => array( 'bKash', '#e2136e' ),
		'nagad'  => array( 'Nagad', '#f7941d' ),
		'rocket' => array( 'Rocket', '#8c3494' ),
	);

	/** @var string Text shown on the thank-you page and in emails. */
	public $instructions = '';

	public function __construct() {
		$this->id                 = 'sohag_mobile_pay';
		$this->method_title       = __( 'bKash / Nagad / Rocket (Send Money)', 'sohag-exclusive' );
		$this->method_description = __( 'গ্রাহক আপনার নম্বরে টাকা পাঠিয়ে Transaction ID দেবে। অর্ডার "On hold" থাকবে — টাকা মিলিয়ে "Processing" করুন।', 'sohag-exclusive' );
		$this->has_fields         = true;
		$this->supports           = array( 'products' );

		$this->init_form_fields();
		$this->init_settings();

		$this->title        = $this->get_option( 'title' );
		$this->description  = $this->get_option( 'description' );
		$this->instructions = $this->get_option( 'instructions' );

		add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );
		add_action( 'woocommerce_thankyou_' . $this->id, array( $this, 'thankyou_page' ) );
		add_action( 'woocommerce_email_before_order_table', array( $this, 'email_instructions' ), 10, 3 );
	}

	public function init_form_fields() {
		$this->form_fields = array(
			'enabled'       => array(
				'title'   => __( 'চালু/বন্ধ', 'sohag-exclusive' ),
				'type'    => 'checkbox',
				'label'   => __( 'মোবাইল ব্যাংকিং পেমেন্ট চালু করুন', 'sohag-exclusive' ),
				'default' => 'no',
			),
			'title'         => array(
				'title'   => __( 'চেকআউটে নাম', 'sohag-exclusive' ),
				'type'    => 'text',
				'default' => __( 'বিকাশ / নগদ / রকেট', 'sohag-exclusive' ),
			),
			'description'   => array(
				'title'   => __( 'চেকআউটে বর্ণনা', 'sohag-exclusive' ),
				'type'    => 'textarea',
				'default' => __( 'নিচের নম্বরে মোট টাকা Send Money করে Transaction ID দিন।', 'sohag-exclusive' ),
			),
			'account_type'  => array(
				'title'   => __( 'অ্যাকাউন্টের ধরন', 'sohag-exclusive' ),
				'type'    => 'select',
				'options' => array(
					'Personal' => 'Personal (Send Money)',
					'Agent'    => 'Agent (Cash Out)',
					'Merchant' => 'Merchant (Payment)',
				),
				'default' => 'Personal',
			),
			'bkash_number'  => array(
				'title'       => __( 'bKash নম্বর', 'sohag-exclusive' ),
				'type'        => 'text',
				'description' => __( 'খালি রাখলে bKash অপশন দেখাবে না।', 'sohag-exclusive' ),
				'default'     => '',
			),
			'nagad_number'  => array(
				'title'       => __( 'Nagad নম্বর', 'sohag-exclusive' ),
				'type'        => 'text',
				'description' => __( 'খালি রাখলে Nagad অপশন দেখাবে না।', 'sohag-exclusive' ),
				'default'     => '',
			),
			'rocket_number' => array(
				'title'       => __( 'Rocket নম্বর', 'sohag-exclusive' ),
				'type'        => 'text',
				'description' => __( 'খালি রাখলে Rocket অপশন দেখাবে না।', 'sohag-exclusive' ),
				'default'     => '',
			),
			'instructions'  => array(
				'title'   => __( 'ধন্যবাদ পাতা ও ইমেইলে বার্তা', 'sohag-exclusive' ),
				'type'    => 'textarea',
				'default' => __( 'আপনার পেমেন্ট যাচাই করে খুব শীঘ্রই অর্ডার কনফার্ম করা হবে।', 'sohag-exclusive' ),
			),
		);
	}

	/**
	 * Providers that have a number configured.
	 */
	protected function active_providers() {
		$out = array();
		foreach ( self::$providers as $slug => $meta ) {
			$number = trim( (string) $this->get_option( $slug . '_number' ) );
			if ( '' !== $number ) {
				$out[ $slug ] = array( $meta[0], $meta[1], $number );
			}
		}
		return $out;
	}

	public function is_available() {
		return parent::is_available() && ! empty( $this->active_providers() );
	}

	public function payment_fields() {
		$providers = $this->active_providers();
		$first     = key( $providers );
		$total     = WC()->cart ? WC()->cart->get_total( 'edit' ) : 0;
		$type      = $this->get_option( 'account_type', 'Personal' );
		$verb      = array(
			'Personal' => 'Send Money',
			'Agent'    => 'Cash Out',
			'Merchant' => 'Payment',
		);
		$verb      = isset( $verb[ $type ] ) ? $verb[ $type ] : 'Send Money';
		// Keep the customer's choice when WooCommerce re-renders the checkout via AJAX.
		$posted = array();
		if ( isset( $_POST['post_data'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			parse_str( wp_unslash( $_POST['post_data'] ), $posted ); // phpcs:ignore
		} elseif ( isset( $_POST['sohag_mpay_method'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$posted['sohag_mpay_method'] = wp_unslash( $_POST['sohag_mpay_method'] ); // phpcs:ignore
		}
		$chosen = isset( $posted['sohag_mpay_method'] ) ? sanitize_key( $posted['sohag_mpay_method'] ) : $first;
		if ( ! isset( $providers[ $chosen ] ) ) {
			$chosen = $first;
		}
		?>
		<div class="sohag-mpay">
			<?php if ( $this->description ) : ?>
				<p style="margin:0"><?php echo esc_html( $this->description ); ?></p>
			<?php endif; ?>

			<div class="sohag-mpay__methods" role="radiogroup">
				<?php foreach ( $providers as $slug => $p ) : ?>
					<label>
						<input type="radio" name="sohag_mpay_method" value="<?php echo esc_attr( $slug ); ?>" <?php checked( $chosen, $slug ); ?> data-number="<?php echo esc_attr( $p[2] ); ?>" data-label="<?php echo esc_attr( $p[0] ); ?>">
						<span class="sohag-mpay__dot" style="background:<?php echo esc_attr( $p[1] ); ?>"></span>
						<?php echo esc_html( $p[0] ); ?>
					</label>
				<?php endforeach; ?>
			</div>

			<div class="sohag-mpay__info">
				<div>
					<span data-mpay-label><?php echo esc_html( $providers[ $chosen ][0] ); ?></span> <?php echo esc_html( $type ); ?>:
					<span class="sohag-mpay__number" data-mpay-number><?php echo esc_html( $providers[ $chosen ][2] ); ?></span>
					<button type="button" class="sohag-mpay__copy" data-mpay-copy><?php esc_html_e( 'কপি', 'sohag-exclusive' ); ?></button>
				</div>
				<ol>
					<li><?php echo esc_html( sprintf( 'অ্যাপ থেকে "%s" অপশনে যান', $verb ) ); ?></li>
					<li><?php echo wp_kses_post( sprintf( 'উপরের নম্বরে মোট <strong>%s</strong> পাঠান', wc_price( $total ) ) ); ?></li>
					<li><?php esc_html_e( 'যে নম্বর থেকে পাঠিয়েছেন ও Transaction ID নিচে লিখুন', 'sohag-exclusive' ); ?></li>
				</ol>
			</div>

			<p class="form-row form-row-wide">
				<label for="sohag_mpay_sender"><?php esc_html_e( 'যে নম্বর থেকে টাকা পাঠিয়েছেন', 'sohag-exclusive' ); ?> <abbr class="required" title="required">*</abbr></label>
				<input id="sohag_mpay_sender" class="input-text" type="tel" inputmode="numeric" name="sohag_mpay_sender" placeholder="01XXXXXXXXX" autocomplete="off">
			</p>
			<p class="form-row form-row-wide">
				<label for="sohag_mpay_trx"><?php esc_html_e( 'Transaction ID (TrxID)', 'sohag-exclusive' ); ?> <abbr class="required" title="required">*</abbr></label>
				<input id="sohag_mpay_trx" class="input-text" type="text" name="sohag_mpay_trx" placeholder="8N7A6XXXXX" autocomplete="off" style="text-transform:uppercase">
			</p>
		</div>
		<?php
	}

	public function validate_fields() {
		// phpcs:disable WordPress.Security.NonceVerification -- WooCommerce verifies the checkout nonce.
		$method = isset( $_POST['sohag_mpay_method'] ) ? sanitize_key( wp_unslash( $_POST['sohag_mpay_method'] ) ) : '';
		$sender = isset( $_POST['sohag_mpay_sender'] ) ? sanitize_text_field( wp_unslash( $_POST['sohag_mpay_sender'] ) ) : '';
		$trx    = isset( $_POST['sohag_mpay_trx'] ) ? sanitize_text_field( wp_unslash( $_POST['sohag_mpay_trx'] ) ) : '';
		// phpcs:enable

		$ok = true;
		if ( ! isset( $this->active_providers()[ $method ] ) ) {
			wc_add_notice( __( 'বিকাশ / নগদ / রকেট — একটি বেছে নিন।', 'sohag-exclusive' ), 'error' );
			$ok = false;
		}
		if ( ! function_exists( 'sohag_normalize_bd_phone' ) || ! sohag_normalize_bd_phone( $sender ) ) {
			wc_add_notice( __( 'যে নম্বর থেকে টাকা পাঠিয়েছেন সেটি সঠিকভাবে লিখুন।', 'sohag-exclusive' ), 'error' );
			$ok = false;
		}
		if ( ! preg_match( '/^[A-Za-z0-9]{6,20}$/', $trx ) ) {
			wc_add_notice( __( 'সঠিক Transaction ID লিখুন।', 'sohag-exclusive' ), 'error' );
			$ok = false;
		}
		return $ok;
	}

	public function process_payment( $order_id ) {
		$order = wc_get_order( $order_id );

		// phpcs:disable WordPress.Security.NonceVerification
		$method = sanitize_key( wp_unslash( $_POST['sohag_mpay_method'] ?? '' ) );
		$sender = sohag_normalize_bd_phone( sanitize_text_field( wp_unslash( $_POST['sohag_mpay_sender'] ?? '' ) ) );
		$trx    = strtoupper( sanitize_text_field( wp_unslash( $_POST['sohag_mpay_trx'] ?? '' ) ) );
		// phpcs:enable

		$label = isset( self::$providers[ $method ] ) ? self::$providers[ $method ][0] : $method;

		$order->update_meta_data( '_sohag_mpay_method', $label );
		$order->update_meta_data( '_sohag_mpay_sender', $sender );
		$order->update_meta_data( '_sohag_mpay_trx', $trx );
		$order->set_transaction_id( $trx );
		$order->save();

		$order->update_status(
			'on-hold',
			/* translators: 1: provider, 2: sender, 3: trx id */
			sprintf( __( '%1$s পেমেন্ট যাচাই বাকি — প্রেরক: %2$s, TrxID: %3$s', 'sohag-exclusive' ), $label, $sender, $trx )
		);

		wc_reduce_stock_levels( $order_id );
		WC()->cart->empty_cart();

		return array(
			'result'   => 'success',
			'redirect' => $this->get_return_url( $order ),
		);
	}

	public function thankyou_page( $order_id ) {
		if ( $this->instructions ) {
			echo '<p class="woocommerce-info">' . esc_html( $this->instructions ) . '</p>';
		}
	}

	public function email_instructions( $order, $sent_to_admin, $plain_text = false ) {
		if ( $this->instructions && ! $sent_to_admin && $this->id === $order->get_payment_method() && $order->has_status( 'on-hold' ) ) {
			echo $plain_text ? esc_html( $this->instructions ) . PHP_EOL : wpautop( esc_html( $this->instructions ) ); // phpcs:ignore
		}
	}
}

add_filter(
	'woocommerce_payment_gateways',
	function ( $gateways ) {
		$gateways[] = 'Sohag_Mobile_Payment_Gateway';
		return $gateways;
	}
);

/**
 * Show payment details on the admin order screen and in admin emails.
 */
function sohag_mpay_details( $order ) {
	$trx = $order->get_meta( '_sohag_mpay_trx' );
	if ( ! $trx ) {
		return;
	}
	printf(
		'<p><strong>%s</strong><br>%s: %s<br>%s: %s<br>TrxID: <code>%s</code></p>',
		esc_html__( 'মোবাইল ব্যাংকিং পেমেন্ট', 'sohag-exclusive' ),
		esc_html__( 'মাধ্যম', 'sohag-exclusive' ),
		esc_html( $order->get_meta( '_sohag_mpay_method' ) ),
		esc_html__( 'প্রেরক', 'sohag-exclusive' ),
		esc_html( $order->get_meta( '_sohag_mpay_sender' ) ),
		esc_html( $trx )
	);
}
add_action( 'woocommerce_admin_order_data_after_billing_address', 'sohag_mpay_details' );

add_action(
	'woocommerce_email_after_order_table',
	function ( $order, $sent_to_admin, $plain_text ) {
		if ( ! $sent_to_admin || ! $order->get_meta( '_sohag_mpay_trx' ) ) {
			return;
		}
		if ( $plain_text ) {
			echo 'TrxID: ' . esc_html( $order->get_meta( '_sohag_mpay_trx' ) ) . ' (' . esc_html( $order->get_meta( '_sohag_mpay_method' ) ) . ', ' . esc_html( $order->get_meta( '_sohag_mpay_sender' ) ) . ")\n";
		} else {
			sohag_mpay_details( $order );
		}
	},
	10,
	3
);
