/**
 * Module variables
 *
 * @format
 */
const sections = [];

// this MUST be the first section for /read paths so subsequent sections under /read can override settings
sections.push( {
	name: 'reader',
	paths: [ '/', '/read' ],
	module: 'reader',
	secondary: true,
	group: 'reader',
} );

sections.push( {
	name: 'reader',
	paths: [ '/read/feeds/[^\\/]+/posts/[^\\/]+', '/read/blogs/[^\\/]+/posts/[^\\/]+' ],
	module: 'reader/full-post',
	secondary: false,
	group: 'reader',
} );

sections.push( {
	name: 'reader',
	paths: [ '/recommendations/posts' ],
	module: 'reader/recommendations',
	secondary: true,
	group: 'reader',
} );

sections.push( {
	name: 'reader',
	paths: [ '/recommendations' ],
	module: 'reader/recommendations',
	secondary: true,
	group: 'reader',
} );

sections.push( {
	name: 'reader',
	paths: [ '/discover' ],
	module: 'reader/discover',
	secondary: true,
	group: 'reader',
} );

sections.push( {
	name: 'reader',
	paths: [ '/following' ],
	module: 'reader/following',
	secondary: true,
	group: 'reader',
} );

sections.push( {
	name: 'reader',
	paths: [ '/tags', '/tag' ],
	module: 'reader/tag-stream',
	secondary: true,
	group: 'reader',
} );

sections.push( {
	name: 'reader',
	paths: [ '/activities' ],
	module: 'reader/liked-stream',
	secondary: true,
	group: 'reader',
} );

sections.push( {
	name: 'reader',
	paths: [ '/read/search' ],
	module: 'reader/search',
	secondary: true,
	group: 'reader',
} );

sections.push( {
	name: 'reader',
	paths: [ '/read/list' ],
	module: 'reader/list',
	secondary: true,
	group: 'reader',
} );

sections.push( {
	name: 'reader',
	paths: [ '/read/conversations' ],
	module: 'reader/conversations',
	secondary: true,
	group: 'reader',
} );

module.exports = sections;
