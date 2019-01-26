import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { default as edit } from './edit';

registerBlockType( 'new-royalslider/slider', {
	title: 'Royal Slider',
	icon: 'format-gallery',
	category: 'common',
	keywords: ['slider', 'gallery', 'image'],
	attributes: {
		slider_id: {
			type: 'string'
		}
	},
	edit: edit,
	save: function( props ) {
		return null;
	}
} );
