const { __ } = wp.i18n;
const { Component } = wp.element;
const { SelectControl } = wp.components;

import getRemoteRoyalSliders from './remote-get-sliders';

class RoyalSliderSelect extends Component {
	constructor(props) {
		super(...props);
		this.state = {
			sliders: null,
			loaded: false,
			slider_id: props.slider_id
		};

		this.onChange = this.onChange.bind( this );
	}

	onChange( value ) {
		this.setState({
			slider_id: value
		});

		this.props.onChange( value )
	}

	componentDidMount() {
		getRemoteRoyalSliders().then( sliders => {

			let state = {
				loaded: true,
				sliders: sliders
			};

			if ( !this.state.slider_id &&
				 sliders[0] &&
				 sliders[0].value ) {

				// if there is no selected slider, set first slider as a default
				state.slider_id = sliders[0].value;

				this.props.onChange( state.slider_id );
			}

			this.setState(state);
		});
	}

	render() {
		if (!this.state.sliders || !this.state.sliders.length) {
			if ( this.state.loaded) {
				return <p>{ 'No sliders available' }</p>;
			} else {
				return null;
			}
		}

		return (
			<SelectControl
				label="Select slider to display"
				value={ this.state.slider_id }
				options={ this.state.sliders }
				onChange={ this.onChange }
			/>
		)
	}
}

export default RoyalSliderSelect;
