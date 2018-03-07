// autosave calls actions.edit with all 'edits'

// whats the significance and difference between
// rawContent and edits?

postEditorState: {
	[ siteId ] : {
		[ postId ] : {
			rawContent: {},
			isPublished: false,
			isAutosaving: false,
			isNew: false,
			loading: {
				pending: false,
				error: null,
			},
			autosave: {
				pending: false,

			},
			previewUrl: '???',
			transientUploads: {
				[ transientUploadId? ] : {}
			},
			edits: {
				[ prop ]: value
				// title
				// content
				// excerpt
				// slug
				// etc...
				// clean out after saving
			}
		}
	}
}


// normalizePost should be called inside a memoized selector...
// possible to do this on a per key basis? beneficial to do so?

