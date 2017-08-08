/** @format */
/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { map, get, last, uniqBy, size, filter, takeRight, reverse } from 'lodash';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';

/***
 * Internal dependencies
 */
import Gravatar from 'components/gravatar';
import { getDateSortedPostComments } from 'state/comments/selectors';

const MAX_GRAVATARS_TO_DISPLAY = 10;

class ConversationCaterpillarComponent extends React.Component {
	static propTypes = {
		blogId: PropTypes.number.isRequired,
		postId: PropTypes.number.isRequired,
		comments: PropTypes.array.isRequired,
	};

	render() {
		const { comments, translate } = this.props;
		const commentCount = size( comments );

		// Only display authors with a gravatar, and only display each author once
		const uniqueAuthors = uniqBy( map( comments, 'author' ), 'ID' );
		const displayedAuthors = takeRight(
			filter( uniqueAuthors, 'avatar_URL' ),
			MAX_GRAVATARS_TO_DISPLAY
		);
		const lastAuthorName = get( last( displayedAuthors ), 'name' );
		const gravatarSmallScreenThreshold = MAX_GRAVATARS_TO_DISPLAY / 2;

		// At the moment, we just show authors for the entire comments array
		return (
			<div className="conversation-caterpillar">
				<div className="conversation-caterpillar__gravatars">
					{ map( reverse( displayedAuthors ), ( author, index ) => {
						return (
							<Gravatar
								className={ classNames( 'conversation-caterpillar__gravatar', {
									'is-hidden-on-small-screens': index >= gravatarSmallScreenThreshold,
								} ) }
								key={ author.ID }
								user={ author }
								size={ 32 }
								aria-hidden="true"
							/>
						);
					} ) }
				</div>
				<button
					className="conversation-caterpillar__count"
					title={
						commentCount > 1
							? translate( 'View comments from %(commenterName)s and %(count)d more', {
									args: {
										commenterName: lastAuthorName,
										count: commentCount - 1,
									},
								} )
							: translate( 'View comment from %(commenterName)s', {
									args: {
										commenterName: lastAuthorName,
									},
								} )
					}
				>
					{ commentCount > 1
						? translate( '%(commenterName)s and %(count)d more', {
								args: {
									commenterName: lastAuthorName,
									count: commentCount - 1,
								},
							} )
						: translate( '%(commenterName)s commented', {
								args: {
									commenterName: lastAuthorName,
								},
							} ) }
				</button>
			</div>
		);
	}
}

export const ConversationCaterpillar = localize( ConversationCaterpillarComponent );

const ConnectedConversationCaterpillar = connect( ( state, ownProps ) => {
	return {
		comments: getDateSortedPostComments( state, ownProps.blogId, ownProps.postId ),
	};
} )( ConversationCaterpillar );

export default ConnectedConversationCaterpillar;
