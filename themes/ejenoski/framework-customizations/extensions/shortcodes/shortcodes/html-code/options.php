<?php if (!defined('FW')) {
	die('Forbidden');
}

$options = array(
	'my_html'   => array(
		'type'  => 'html',
    'value' => 'default hidden value',
    'attr'  => array( 'class' => 'custom-class', 'data-foo' => 'bar' ),
    'label' => __('Label', 'fw'),
    'desc'  => __('Description', 'fw'),
    'help'  => __('Help tip', 'fw'),
	)
);