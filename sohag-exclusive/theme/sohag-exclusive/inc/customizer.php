<?php
/**
 * Customizer: Appearance → Customize → Sohag Exclusive.
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

function sohag_customize_register( $wp_customize ) {
	$wp_customize->add_panel(
		'sohag_panel',
		array(
			'title'    => __( 'Sohag Exclusive সেটিংস', 'sohag-exclusive' ),
			'priority' => 25,
		)
	);

	$sections = array(
		'sohag_contact' => array(
			'title'  => __( 'যোগাযোগ ও সোশ্যাল', 'sohag-exclusive' ),
			'fields' => array(
				'phone'     => array( __( 'ফোন নম্বর', 'sohag-exclusive' ), 'text', 'sanitize_text_field' ),
				'whatsapp'  => array( __( 'WhatsApp নম্বর (দেশের কোডসহ, যেমন 8801712345678)', 'sohag-exclusive' ), 'text', 'sanitize_text_field' ),
				'email'     => array( __( 'ইমেইল', 'sohag-exclusive' ), 'email', 'sanitize_email' ),
				'address'   => array( __( 'ঠিকানা', 'sohag-exclusive' ), 'text', 'sanitize_text_field' ),
				'facebook'  => array( __( 'Facebook পেজ লিংক', 'sohag-exclusive' ), 'url', 'esc_url_raw' ),
				'messenger' => array( __( 'Messenger লিংক (খালি রাখলে Facebook লিংক থেকে বানানো হবে)', 'sohag-exclusive' ), 'url', 'esc_url_raw' ),
				'instagram' => array( __( 'Instagram লিংক', 'sohag-exclusive' ), 'url', 'esc_url_raw' ),
			),
		),
		'sohag_home'    => array(
			'title'  => __( 'হোমপেজ', 'sohag-exclusive' ),
			'fields' => array(
				'announcement' => array( __( 'উপরের ঘোষণা বার (প্রতি লাইনে একটি বার্তা)', 'sohag-exclusive' ), 'textarea', 'sanitize_textarea_field' ),
				'hero_script'  => array( __( 'হিরো — স্ক্রিপ্ট লেখা', 'sohag-exclusive' ), 'text', 'sanitize_text_field' ),
				'hero_title'   => array( __( 'হিরো — শিরোনাম (<em> দিয়ে সোনালি শব্দ)', 'sohag-exclusive' ), 'text', 'sohag_sanitize_inline_html' ),
				'hero_text'    => array( __( 'হিরো — বর্ণনা', 'sohag-exclusive' ), 'textarea', 'sanitize_textarea_field' ),
				'about'        => array( __( 'ফুটারে ব্র্যান্ড পরিচিতি', 'sohag-exclusive' ), 'textarea', 'sanitize_textarea_field' ),
			),
		),
	);

	$priority = 10;
	foreach ( $sections as $section_id => $section ) {
		$wp_customize->add_section(
			$section_id,
			array(
				'title'    => $section['title'],
				'panel'    => 'sohag_panel',
				'priority' => $priority += 10,
			)
		);
		foreach ( $section['fields'] as $key => $field ) {
			$wp_customize->add_setting(
				'sohag_' . $key,
				array(
					'default'           => sohag_opt( $key ),
					'sanitize_callback' => $field[2],
				)
			);
			$wp_customize->add_control(
				'sohag_' . $key,
				array(
					'label'   => $field[0],
					'section' => $section_id,
					'type'    => $field[1],
				)
			);
		}
	}

	$wp_customize->add_setting(
		'sohag_hero_image',
		array(
			'default'           => SOHAG_URI . '/assets/img/banner.jpg',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			'sohag_hero_image',
			array(
				'label'   => __( 'হিরো ছবি / ব্যানার', 'sohag-exclusive' ),
				'section' => 'sohag_home',
			)
		)
	);
}
add_action( 'customize_register', 'sohag_customize_register' );

function sohag_sanitize_inline_html( $value ) {
	return wp_kses( $value, array( 'em' => array(), 'strong' => array(), 'br' => array() ) );
}
