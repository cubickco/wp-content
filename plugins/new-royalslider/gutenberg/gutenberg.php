<?php

if( !defined('WPINC') ) exit('No direct access permitted');

class NewRoyalSliderGutenberg {

    function __construct() {

    	$dist_url = NEW_ROYALSLIDER_PLUGIN_URL . 'gutenberg/dist/';

		wp_register_script(
			'new-royalslider-gutenberg-admin',
			$dist_url . 'blocks.build.js',
			array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-components', 'wp-editor' )
		);

		// wp_register_style(
		// 	'new-royalslider-gutenberg-admin',
		// 	$dist_url . 'blocks.editor.build.css',
		// 	array( 'wp-blocks' )
		// );

		register_block_type( 'new-royalslider/slider', array(
	        'editor_script' => 'new-royalslider-gutenberg-admin',
	       // 'editor_style' => 'new-royalslider-gutenberg-admin',

	        'render_callback' => array($this, 'render_slider'),

            'attributes' => array(
                'slider_id' => array(
                	'type' => 'string'
                ),
            )
	    ));

	    add_action( 'admin_enqueue_scripts', array( $this, 'print_admin_assets' ) );
    }

    public function print_admin_assets() {
    	$current_screen = get_current_screen();
    	if (
    		 ( method_exists($current_screen, 'is_block_editor') &&
    		   $current_screen->is_block_editor() ) ||
		     ( function_exists('is_gutenberg_page') &&
		          is_gutenberg_page() )
		   ) {
			global $new_royalSlider;
			$new_royalSlider->load_all = true;
			$new_royalSlider->find_and_register_scripts();

			wp_register_script( 'new-royalslider-main-js', NEW_ROYALSLIDER_PLUGIN_URL . 'lib/royalslider/jquery.royalslider.min.js', array('jquery'), NEW_ROYALSLIDER_WP_VERSION, 'all' );
			wp_enqueue_script('new-royalslider-main-js');
		}
    }

    public function render_slider($attributes) {
    	if ( empty($attributes['slider_id']) ) {
    		return;
    	}

    	$id = (int)$attributes['slider_id'];

    	$out = do_shortcode('[new_royalslider id="'.$id.'"]');
    	if ( isset(NewRoyalSliderMain::$sliders_init_code[$id]) ) {
	    	// print <script> with init code
	    	$out .= '<script type="text/javascript">';
	    	$out .= 'jQuery(document).ready(function($){';
	    		$out .= NewRoyalSliderMain::$sliders_init_code[$id];
	    	$out .= '});';
	    	$out .= '</script>';

			unset(NewRoyalSliderMain::$sliders_init_code[$id]);
    	}

    	return $out;
    }
}