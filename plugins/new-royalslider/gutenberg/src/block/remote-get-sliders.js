const { apiFetch } = wp;

// cache sliders (fetch only once per page)
let royalSliders = null;

export default function getRemoteRoyalSliders() {
	if (royalSliders) {
		return(Promise.resolve(royalSliders));
	}

	return apiFetch({ path: '/royalslider/v1/sliders' } ).then( sliders => {
		royalSliders = sliders;
		return royalSliders;
	});
}