<?php
/**
 * Manual UPI gateway: the customer pays to your UPI ID (Google Pay, PhonePe, Paytm, BHIM…)
 * and enters the 12-digit UTR / reference number. The order is placed "On hold" until you verify it.
 *
 * WooCommerce → Settings → Payments → "UPI (Google Pay / PhonePe / Paytm)".
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

class Sohag_UPI_Payment_Gateway extends WC_Payment_Gateway {

	/** @var string Text shown on the thank-you page and in emails. */
	public $instructions = '';

	public function __construct() {
		$this->id                 = 'sohag_upi';
		$this->method_title       = __( 'UPI (Google Pay / PhonePe / Paytm)', 'sohag-exclusive' );
		$this->method_description = __( 'Customer pays to your UPI ID and enters the UTR / reference number. Orders are placed "On hold" — check the payment in your UPI app, then mark the order "Processing".', 'sohag-exclusive' );
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
			'enabled'      => array(
				'title'   => __( 'Enable/Disable', 'sohag-exclusive' ),
				'type'    => 'checkbox',
				'label'   => __( 'Enable UPI payment', 'sohag-exclusive' ),
				'default' => 'no',
			),
			'title'        => array(
				'title'   => __( 'Title at checkout', 'sohag-exclusive' ),
				'type'    => 'text',
				'default' => __( 'Pay by UPI (Google Pay / PhonePe / Paytm)', 'sohag-exclusive' ),
			),
			'description'  => array(
				'title'   => __( 'Description at checkout', 'sohag-exclusive' ),
				'type'    => 'textarea',
				'default' => __( 'Pay the total to our UPI ID, then enter the 12-digit UTR / reference number from your UPI app.', 'sohag-exclusive' ),
			),
			'upi_id'       => array(
				'title'       => __( 'UPI ID', 'sohag-exclusive' ),
				'type'        => 'text',
				'description' => __( 'e.g. sohagexclusive@okaxis. The UPI option is hidden until this is set.', 'sohag-exclusive' ),
				'default'     => '',
			),
			'payee_name'   => array(
				'title'   => __( 'Payee name', 'sohag-exclusive' ),
				'type'    => 'text',
				'default' => 'Sohag Exclusive',
			),
			'qr_image'     => array(
				'title'       => __( 'UPI QR code image URL (optional)', 'sohag-exclusive' ),
				'type'        => 'text',
				'description' => __( 'Upload your QR code from the UPI app to Media → Add New and paste its URL here.', 'sohag-exclusive' ),
				'default'     => '',
			),
			'instructions' => array(
				'title'   => __( 'Message on thank-you page and email', 'sohag-exclusive' ),
				'type'    => 'textarea',
				'default' => __( 'We will verify your UPI payment and confirm your order shortly.', 'sohag-exclusive' ),
			),
		);
	}

	public function is_available() {
		return parent::is_available() && '' !== trim( (string) $this->get_option( 'upi_id' ) );
	}

	public function payment_fields() {
		$upi   = trim( (string) $this->get_option( 'upi_id' ) );
		$name  = (string) $this->get_option( 'payee_name', 'Sohag Exclusive' );
		$qr    = trim( (string) $this->get_option( 'qr_image' ) );
		$total = WC()->cart ? (float) WC()->cart->get_total( 'edit' ) : 0;
		// Standard UPI intent link — on phones it opens the customer's UPI app with the amount filled in.
		$intent = 'upi://pay?' . http_build_query(
			array(
				'pa' => $upi,
				'pn' => $name,
				'am' => number_format( $total, 2, '.', '' ),
				'cu' => 'INR',
				'tn' => 'Sohag Exclusive order',
			),
			'',
			'&',
			PHP_QUERY_RFC3986
		);
		?>
		<div class="sohag-upi">
			<?php if ( $this->description ) : ?>
				<p class="sohag-upi__desc"><?php echo esc_html( $this->description ); ?></p>
			<?php endif; ?>

			<div class="sohag-upi__info">
				<div class="sohag-upi__row">
					<span class="sohag-upi__label"><?php esc_html_e( 'UPI ID', 'sohag-exclusive' ); ?></span>
					<span class="sohag-upi__id" data-upi-id><?php echo esc_html( $upi ); ?></span>
					<button type="button" class="sohag-upi__copy" data-upi-copy><?php esc_html_e( 'Copy', 'sohag-exclusive' ); ?></button>
				</div>
				<div class="sohag-upi__row">
					<span class="sohag-upi__label"><?php esc_html_e( 'Amount', 'sohag-exclusive' ); ?></span>
					<strong><?php echo wp_kses_post( wc_price( $total ) ); ?></strong>
				</div>
				<?php if ( $qr ) : ?>
					<img class="sohag-upi__qr" src="<?php echo esc_url( $qr ); ?>" alt="<?php esc_attr_e( 'UPI QR code', 'sohag-exclusive' ); ?>" width="180" height="180" loading="lazy">
				<?php endif; ?>
				<a class="sohag-upi__app" href="<?php echo esc_url( $intent, array( 'upi' ) ); ?>"><?php esc_html_e( 'Open UPI app to pay', 'sohag-exclusive' ); ?></a>
				<ol>
					<li><?php esc_html_e( 'Pay the amount above to our UPI ID from any UPI app.', 'sohag-exclusive' ); ?></li>
					<li><?php esc_html_e( 'Copy the 12-digit UTR / UPI reference number from the payment receipt.', 'sohag-exclusive' ); ?></li>
					<li><?php esc_html_e( 'Enter it below and confirm your order.', 'sohag-exclusive' ); ?></li>
				</ol>
			</div>

			<p class="form-row form-row-wide">
				<label for="sohag_upi_utr"><?php esc_html_e( 'UTR / UPI reference number', 'sohag-exclusive' ); ?> <abbr class="required" title="required">*</abbr></label>
				<input id="sohag_upi_utr" class="input-text" type="text" inputmode="numeric" name="sohag_upi_utr" placeholder="e.g. 412345678901" autocomplete="off">
			</p>
		</div>
		<?php
	}

	protected function posted_utr() {
		// phpcs:ignore WordPress.Security.NonceVerification -- WooCommerce verifies the checkout nonce.
		$raw = isset( $_POST['sohag_upi_utr'] ) ? sanitize_text_field( wp_unslash( $_POST['sohag_upi_utr'] ) ) : '';
		return strtoupper( preg_replace( '/\s+/', '', $raw ) );
	}

	public function validate_fields() {
		if ( ! preg_match( '/^[A-Z0-9]{10,22}$/', $this->posted_utr() ) ) {
			wc_add_notice( __( 'Please enter the UTR / UPI reference number from your payment (usually 12 digits).', 'sohag-exclusive' ), 'error' );
			return false;
		}
		return true;
	}

	public function process_payment( $order_id ) {
		$order = wc_get_order( $order_id );
		$utr   = $this->posted_utr();

		$order->update_meta_data( '_sohag_upi_utr', $utr );
		$order->set_transaction_id( $utr );
		$order->save();

		/* translators: %s: UTR number. */
		$order->update_status( 'on-hold', sprintf( __( 'Awaiting UPI payment check — UTR: %s', 'sohag-exclusive' ), $utr ) );

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
		$gateways[] = 'Sohag_UPI_Payment_Gateway';
		return $gateways;
	}
);

/**
 * Show the UTR on the admin order screen and in admin emails.
 */
function sohag_upi_details( $order ) {
	$utr = $order->get_meta( '_sohag_upi_utr' );
	if ( $utr ) {
		printf( '<p><strong>%s</strong><br>UTR: <code>%s</code></p>', esc_html__( 'UPI payment', 'sohag-exclusive' ), esc_html( $utr ) );
	}
}
add_action( 'woocommerce_admin_order_data_after_billing_address', 'sohag_upi_details' );

add_action(
	'woocommerce_email_after_order_table',
	function ( $order, $sent_to_admin, $plain_text ) {
		if ( ! $sent_to_admin || ! $order->get_meta( '_sohag_upi_utr' ) ) {
			return;
		}
		if ( $plain_text ) {
			echo 'UPI UTR: ' . esc_html( $order->get_meta( '_sohag_upi_utr' ) ) . "\n";
		} else {
			sohag_upi_details( $order );
		}
	},
	10,
	3
);
