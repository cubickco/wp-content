/**
 * Fetches and updates slider preview.
 *
 * Created based on <ServerSideRender>
 */

/**
 * External dependencies.
 */
const { isEqual } = lodash;

/**
 * WordPress dependencies.
 */
const {
	Component,
	RawHTML,
} = wp.element;
const { __, sprintf } = wp.i18n;
const { apiFetch } = wp;
const { addQueryArgs } = wp.url;

const {
	Placeholder,
	Spinner
} = wp.components;

export class RoyalSliderPreview extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			response: null,
			is_loading: true
		};
	}

	componentDidMount() {
		this.isStillMounted = true;
		this.fetch( this.props );
	}

	componentWillUnmount() {
		this.isStillMounted = false;
		this.destroyPreviousSlider();
	}

	componentDidUpdate( prevProps ) {
		if ( ! isEqual( prevProps, this.props ) ) {
			this.destroyPreviousSlider();
			this.fetch( this.props );
		}

		if ( !this.state.is_loading &&
			 this.state.response &&
			 !this.state.response.error) {
			this.initializeSlider();
		}
	}

	initializeSlider() {
		var el = ReactDOM.findDOMNode(this);
		if (!el) {
			return;
		}



		var slider = el.querySelector('.royalSlider');
		if (!slider) {
			return;
		}

		var options = {};
		if (slider.dataset.rsOptions) {
			options = slider.getAttribute('data-rs-options');
			if (options) {
				options = JSON.parse(options);
			}
		}

		if ( window.jQuery && window.jQuery.fn.royalSlider && options ) {
			window.jQuery(slider).royalSlider( options )
		}
	}

	/**
	 * JS-based grids need to be destroyed
	 * to avoid memory leaks.
	 * (unbinds resize and scroll events, etc.)
	 */
	destroyPreviousSlider() {
		var el = ReactDOM.findDOMNode(this);
		if (!el) {
			return;
		}

		var slider = el.querySelector('.royalSlider');
		if (!slider) {
			return;
		}

		if ( window.jQuery && window.jQuery.fn.royalSlider ) {
			window.jQuery(slider).royalSlider( 'destroy' ).remove();
		}
	}

	fetch( props ) {
		if ( null !== this.state.response ) {
			const newState = {
				is_loading: true
			};
			if ( this.state.response.error ||
				!this.state.response.length ) {
				newState.response = null;
			}

			this.setState( newState );
		}
		const { block, attributes = null } = props;

		const path = addQueryArgs( '/wp/v2/block-renderer/new-royalslider/slider', {
			context: 'edit',
			...( null !== attributes ? { attributes } : {} )
		} );

		return apiFetch({path}).then( ( response ) => {
				if ( this.isStillMounted && response && response.rendered ) {
					this.setState( {
						response: response.rendered,
						is_loading: false
					} );
				}
			} )
			.catch( ( error ) => {
				if ( this.isStillMounted ) {
					this.setState( { response: {
						error: true,
						errorMsg: error.message,
					} } );
				}
			} );
	}

	render() {
		const response = this.state.response;
		const is_loading = this.state.is_loading || this.props.attributes.is_loading;

		if ( ! response ) {
			return (
				<Placeholder><Spinner /></Placeholder>
			);
		} else if ( response.error ) {
			return (
				<Placeholder>{ 'Error loading block' }</Placeholder>
			);
		}

		return (
			<RawHTML
				style={{opacity: is_loading ? 0.5 : 1, pointerEvents: 'none'}}
				key="html">
				{ response }
			</RawHTML>
		);
	}
}

export default RoyalSliderPreview;
