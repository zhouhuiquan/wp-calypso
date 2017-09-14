
export function getLikes( rootState ) {
	const example = rootState.extensions.example;
	return example.likes;
}
