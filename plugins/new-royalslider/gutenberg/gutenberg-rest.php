<?php

if( !defined('WPINC') ) exit('No direct access permitted');

class NewRoyalSlider_Gutenberg_Rest {

    function __construct() {
	    register_rest_route( 'royalslider/v1', '/sliders', array(
	        'methods'  => WP_REST_Server::READABLE,
	        'callback' => array($this, 'get_sliders_list'),
	        'permission_callback' => array($this, 'check_permissions')
	    ) );
    }

    public function get_sliders_list() {
    	global $wpdb;
		$table = NewRoyalSliderMain::get_sliders_table_name();

		$qstr = "
			SELECT id, name FROM $table WHERE active=1  AND type!='gallery'
		";
		$res = $wpdb->get_results( $qstr , ARRAY_A );

        $sliders = array();

        if( is_array($res) ) {
            foreach ($res as $slider_data) {
            	if ( empty($slider_data['id']) ) {
            		continue;
            	}

            	$id = (int)$slider_data['id'];

            	if ($id > 0) {
            		if ( isset($slider_data['name']) ) {
	            		$name = $slider_data['name'] . ' #' . $id;
	            	} else {
	            		$name = '#' . $id;
	            	}

	            	$sliders[] = array(
	            		'value' => $id,
	            		'label' => $name
	            	);
            	}
            }
        }

        echo json_encode($sliders);

        die();
    }

    public function check_permissions() {
    	// Restrict endpoint to only users who have the edit_posts capability.
	    if ( ! current_user_can( 'edit_posts' ) ) {
	        return new WP_Error( 'rest_forbidden', 'No access', array( 'status' => 401 ) );
	    }

	    return true;
    }

}