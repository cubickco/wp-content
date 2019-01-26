<?php if (!defined('FW')) {
	die('Forbidden');
}

$options = array(
	'demo_text'   => array(
			'label'   => __('Demo text label', 'fw'),
			'desc'    => __('Demo text description', 'fw'),
			'help'    => __('Demo text help', 'fw'),
			'type'    => 'text'
	),
	'demo_edit' => array(
		'type'  => 'wp-editor',
    'teeny' => true,
    'reinit'  => true,
    'label' => __('Content', 'fw'),
    'desc'  => __('Description', 'fw'),
	)
);