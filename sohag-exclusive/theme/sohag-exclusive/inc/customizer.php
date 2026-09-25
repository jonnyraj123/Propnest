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
			'title'    => __( 'Sohag Exclusive Settings', 'sohag-exclusive' ),
			'priority' => 25,
		)
	);

	$sections = array(
		'sohag_contact' => array(
			'title'  => __( 'Contact & Social', 'sohag-exclusive' ),
			'fields' => array(
				'phone'     => array( __( 'Phone number', 'sohag-exclusive' ), 'text', 'sanitize_text_field' ),
				'whatsapp'  => array( __( 'WhatsApp number with country code (e.g. 8801712345678)', 'sohag-exclusive' ), 'text', 'sanitize_text_field' ),
				'email'     => array( __( 'Email', 'sohag-exclusive' ), 'email', 'sanitize_email' ),
				'address'   => array( __( 'Address', 'sohag-exclusive' ), 'text', 'sanitize_text_field' ),
				'facebook'  => array( __( 'Facebook page URL', 'sohag-exclusive' ), 'url', 'esc_url_raw' ),
				'messenger' => array( __( 'Messenger link (leave empty to build it from the Facebook URL)', 'sohag-exclusive' ), 'url', 'esc_url_raw' ),
				'instagram' => array( __( 'Instagram URL', 'sohag-exclusive' ), 'url', 'esc_url_raw' ),
			),
		),
		'sohag_home'    => array(
			'title'  => __( 'Homepage', 'sohag-exclusive' ),
			'fields' => array(
				'announcement' => array( __( 'Announcement bar (one message per line)', 'sohag-exclusive' ), 'textarea', 'sanitize_textarea_field' ),
				'hero_script'  => array( __( 'Hero — script line', 'sohag-exclusive' ), 'text', 'sanitize_text_field' ),
				'hero_title'   => array( __( 'Hero — title (wrap a word in <em> to make it gold)', 'sohag-exclusive' ), 'text', 'sohag_sanitize_inline_html' ),
				'hero_text'    => array( __( 'Hero — description', 'sohag-exclusive' ), 'textarea', 'sanitize_textarea_field' ),
				'about'        => array( __( 'Footer — about text', 'sohag-exclusive' ), 'textarea', 'sanitize_textarea_field' ),
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
				'label'   => __( 'Hero image / banner', 'sohag-exclusive' ),
				'section' => 'sohag_home',
			)
		)
	);
}
add_action( 'customize_register', 'sohag_customize_register' );

function sohag_sanitize_inline_html( $value ) {
	return wp_kses( $value, array( 'em' => array(), 'strong' => array(), 'br' => array() ) );
}
