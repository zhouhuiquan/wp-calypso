/**
 * External dependencies
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal Dependencies
 */
import Main from 'components/main';
import Card from 'components/card';
import SectionHeader from 'components/section-header';
import { errorNotice } from 'state/notices/actions';
import { fetchMyLikes } from 'example/state/likes/actions';
import { getLikes } from 'example/state/selectors/likes';

class ExamplePage extends Component {
	componentWillMount() {
		const { translate } = this.props;

		this.props.fetchMyLikes(
			errorNotice(
				translate( 'Sorry, couldn\'t fetch your likes.' )
			)
		);
	}

	render() {
		const { likesFound } = this.props;

		return (
			<Main className="example__main">
				<SectionHeader label="Example Calypso Extension!">🐑</SectionHeader>
				<Card>
					<p>
						This is an example extension for Calypso!
					</p>
					<span>Found { likesFound } likes</span>
				</Card>
			</Main>
		);
	}
}

function mapStateToProps( state ) {
	const likes = getLikes( state );
	const likesFound = likes && likes.found || 0;

	return {
		likesFound,
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			fetchMyLikes,
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( localize( ExamplePage ) );

