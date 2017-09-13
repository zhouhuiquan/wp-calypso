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
		return (
			<Main className="example__main">
				<SectionHeader label="Example Calypso Extension!">🐑</SectionHeader>
				<Card>
					<p>
						This is an example extension for Calypso!
					</p>
				</Card>
			</Main>
		);
	}
}

function mapStateToProps( state ) {
	return {};
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

