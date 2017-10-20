/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { find, map, orderBy, pick, slice, uniq } from 'lodash';

/**
 * Internal dependencies
 */
import { bumpStat, composeAnalytics, recordTracksEvent } from 'state/analytics/actions';
import { getSiteCommentsTree } from 'state/selectors';
import { COMMENTS_PER_PAGE, NEWEST_FIRST } from '../constants';

export const commentsManager = CommentsComponent => {
	class CommentsManager extends Component {
		state = {
			isBulkEdit: false,
			persistedComments: [],
			selectedComments: [],
			sortOrder: NEWEST_FIRST,
		};

		changePage = page => {
			this.props.recordChangePage( page, this.getTotalPagesOfComments() );
			this.clearSelectedComments();
			this.props.changePage( page );
		};

		clearSelectedComments = () => this.setState( { selectedComments: [] } );

		disableBulkEdit = () => this.setState( { isBulkEdit: false, selectedComments: [] } );

		enableBulkEdit = () => this.setState( { isBulkEdit: true, selectedComments: [] } );

		getComments = () => uniq( [ ...this.state.persistedComments, ...this.props.comments ] );

		getOrderedComments = () => orderBy( this.getComments(), null, this.state.sortOrder );

		getPageOfComments = page => {
			const startingIndex = ( page - 1 ) * COMMENTS_PER_PAGE;
			return slice( this.getComments(), startingIndex, startingIndex + COMMENTS_PER_PAGE );
		};

		getTotalPagesOfComments = () => Math.ceil( this.getComments() / COMMENTS_PER_PAGE );

		isCommentSelected = commentId => !! find( this.state.selectedComments, { commentId } );

		isSelectedAllComments = () =>
			this.state.selectedComments.length &&
			this.state.selectedComments.length > this.getPageOfComments( this.props.page ).length;

		setSortOrder = sortOrder => {
			this.setState( { sortOrder } );
			this.changePage( 1 );
		};

		toggleCommentSelected = comment => {
			if ( this.isCommentSelected( comment.commentId ) ) {
				return this.setState( ( { selectedComments } ) => ( {
					selectedComments: selectedComments.filter(
						( { commentId } ) => comment.commentId !== commentId
					),
				} ) );
			}
			this.setState( ( { selectedComments } ) => ( {
				selectedComments: selectedComments.concat( comment ),
			} ) );
		};

		toggleSelectAllComments = selectedComments => {
			if ( this.isSelectedAllComments() ) {
				this.clearSelectedComments();
			}
			this.setState( { selectedComments } );
		};

		render() {
			return (
				<CommentsComponent
					{ ...this.props }
					{ ...pick( this.state, [ 'isBulkEdit', 'selectedComments' ] ) }
					clearSelectedComments={ this.clearSelectedComments }
					disableBulkEdit={ this.disableBulkEdit }
					enableBulkEdit={ this.enableBulkEdit }
					isSelectedAllComments={ this.isSelectedAllComments }
					toggleSelectAllComments={ this.toggleSelectAllComments }
				/>
			);
		}
	}

	const mapStateToProps = ( state, { siteId, status } ) => ( {
		comments: map( getSiteCommentsTree( state, siteId, status ), 'commentId' ),
	} );

	const mapDispatchToProps = dispatch => ( {
		recordChangePage: ( page, total ) =>
			dispatch(
				composeAnalytics(
					recordTracksEvent( 'calypso_comment_management_change_page', { page, total } ),
					bumpStat( 'calypso_comment_management', 'change_page' )
				)
			),
	} );

	return connect( mapStateToProps, mapDispatchToProps )( CommentsManager );
};

export default commentsManager;
