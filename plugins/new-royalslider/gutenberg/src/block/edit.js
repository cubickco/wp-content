const { Component, Fragment } = wp.element;

const {
	InspectorControls
} = wp.editor;

const {
	PanelBody,
	IconButton,
	Toolbar,
	withNotices,
	Button,
	Placeholder,
	ServerSideRender,
} = wp.components;

import { default as RoyalSliderSelect } from './slider-select';

import { default as RoyalSliderPreview } from './slider-preview';


class RS_Edit_Component extends Component {
	constructor() {
		super( ...arguments );

		this.onSliderSelectChange = this.onSliderSelectChange.bind( this );
	}

	onSliderSelectChange(id) {
		this.props.setAttributes( {
			slider_id: id,
		} );
	}

	render() {
		const slider_id = this.props.attributes.slider_id;

		const inspector = (
			<InspectorControls>
				<PanelBody title={ 'Royal Slider' }>
					<RoyalSliderSelect
						slider_id={ slider_id }
						onChange={ this.onSliderSelectChange }
					/>
				</PanelBody>
			</InspectorControls>
		);

		if ( !slider_id ) {
			return (
				<Fragment>
					{ inspector }
					<Placeholder />
				</Fragment>
			);
		}

		return (
			<Fragment>
				{ inspector }
				<RoyalSliderPreview
			        block="new-royalslider/slider"
			        attributes={ {
			            slider_id: slider_id
			        } }
			    />
			</Fragment>
		);

	}
}

export default withNotices( RS_Edit_Component );