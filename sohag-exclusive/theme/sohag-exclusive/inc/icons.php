<?php
/**
 * Inline SVG icons (stroke icons use currentColor).
 *
 * @package Sohag_Exclusive
 */

defined( 'ABSPATH' ) || exit;

function sohag_icon( $name ) {
	$stroke = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">%s</svg>';
	$fill   = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">%s</svg>';

	$icons = array(
		'search'   => array( $stroke, '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>' ),
		'user'     => array( $stroke, '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>' ),
		'bag'      => array( $stroke, '<path d="M5 8h14l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20.5z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>' ),
		'menu'     => array( $stroke, '<path d="M4 7h16M4 12h16M4 17h10"/>' ),
		'close'    => array( $stroke, '<path d="M6 6l12 12M18 6 6 18"/>' ),
		'home'     => array( $stroke, '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>' ),
		'grid'     => array( $stroke, '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>' ),
		'cash'     => array( $stroke, '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>' ),
		'truck'    => array( $stroke, '<path d="M2.5 6.5h11v9h-11z"/><path d="M13.5 9.5h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>' ),
		'heart'    => array( $stroke, '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>' ),
		'refresh'  => array( $stroke, '<path d="M20 11a8 8 0 0 0-14.3-4.5L4 8.5"/><path d="M4 4v4.5h4.5"/><path d="M4 13a8 8 0 0 0 14.3 4.5l1.7-2"/><path d="M20 20v-4.5h-4.5"/>' ),
		'shield'   => array( $stroke, '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>' ),
		'phone'    => array( $stroke, '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>' ),
		'mail'     => array( $stroke, '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/>' ),
		'pin'      => array( $stroke, '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>' ),
		'clock'    => array( $stroke, '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' ),
		'facebook' => array( $fill, '<path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21z"/>' ),
		'instagram'=> array( $stroke, '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/>' ),
		'whatsapp' => array( $fill, '<path d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 5-1.3A9.8 9.8 0 1 0 12 2.2zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z"/>' ),
		'messenger'=> array( $fill, '<path d="M12 2.5C6.6 2.5 2.5 6.4 2.5 11.6c0 2.7 1.1 5.1 3 6.7v3.2l3-1.7c1.1.3 2.3.5 3.5.5 5.4 0 9.5-3.9 9.5-9.1S17.4 2.5 12 2.5zm1 12.2-2.4-2.6-4.7 2.6 5.2-5.5 2.5 2.6 4.6-2.6z"/>' ),
		'check'    => array( $stroke, '<path d="m5 12.5 4.5 4.5L19 7.5"/>' ),
	);

	if ( ! isset( $icons[ $name ] ) ) {
		return '';
	}
	return sprintf( $icons[ $name ][0], $icons[ $name ][1] );
}
