/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find, map, omit, orderBy, pick, slice, uniq } from 'lodash';

/**
 * Internal dependencies
 */
import { bumpStat, composeAnalytics, recordTracksEvent } from 'state/analytics/actions';
import { getSiteCommentsTree } from 'state/selectors';
import { COMMENTS_PER_PAGE, NEWEST_FIRST } from '../constants';

export const commentsManager = CommentList => {
	class CommentsManager extends Component {
		static propTypes = {
			changePage: PropTypes.func,
			comments: PropTypes.array,
			page: PropTypes.number,
			siteId: PropTypes.number,
			status: PropTypes.string,
		};

		state = {
			isBulkEdit: false,
			persistedComments: [],
			selectedComments: [],
			sortOrder: NEWEST_FIRST,
		};

		componentWillReceiveProps( nextProps ) {
			const { siteId, status, changePage } = this.props;
			const totalPagesOfComments = this.getTotalPagesOfComments();
			if ( ! this.isRequestedPageValid() && totalPagesOfComments > 1 ) {
				return changePage( totalPagesOfComments );
			}
			if ( siteId !== nextProps.siteId || status !== nextProps.status ) {
				this.setState( {
					isBulkEdit: false,
					persistedComments: [],
					selectedComments: [],
					sortOrder: NEWEST_FIRST,
				} );
			}
		}

		areAllCommentsSelected = () =>
			this.state.selectedComments.length &&
			this.state.selectedComments.length === this.getPageOfComments( this.props.page ).length;

		changePage = page => {
			this.props.recordChangePage( page, this.getTotalPagesOfComments() );
			this.clearSelectedComments();
			this.props.changePage( page );
		};

		clearSelectedComments = () => this.setState( { selectedComments: [] } );

		getComments = () => uniq( [ ...this.state.persistedComments, ...this.props.comments ] );

		getOrderedComments = () => orderBy( this.getComments(), null, this.state.sortOrder );

		getPageOfComments = page => {
			const startingIndex = ( page - 1 ) * COMMENTS_PER_PAGE;
			return slice( this.getOrderedComments(), startingIndex, startingIndex + COMMENTS_PER_PAGE );
		};

		getTotalCommentsCount = () => this.getComments().length;

		getTotalPagesOfComments = () => Math.ceil( this.getComments().length / COMMENTS_PER_PAGE );

		isCommentPersisted = commentId => -1 !== this.state.persistedComments.indexOf( commentId );

		isCommentSelected = commentId => !! find( this.state.selectedComments, { commentId } );

		isRequestedPageValid = () => this.getTotalPagesOfComments() >= this.props.page;

		removeFromPersistedComments = commentId =>
			this.setState( ( { persistedComments } ) => ( {
				persistedComments: persistedComments.filter( c => c !== commentId ),
			} ) );

		setSortOrder = sortOrder => () => {
			this.setState( { sortOrder } );
			this.changePage( 1 );
		};

		toggleBulkEdit = () => {
			this.setState( ( { isBulkEdit } ) => ( { isBulkEdit: ! isBulkEdit } ) );
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
			if ( this.areAllCommentsSelected() ) {
				this.clearSelectedComments();
			}
			this.setState( { selectedComments } );
		};

		updatePersistedComments = ( commentId, isUndo ) => {
			if ( isUndo ) {
				this.removeFromPersistedComments( commentId );
			} else if ( ! this.isCommentPersisted( commentId ) ) {
				this.setState( ( { persistedComments } ) => ( {
					persistedComments: persistedComments.concat( commentId ),
				} ) );
			}
		};

		render() {
			const props = omit( this.props, [ 'changePage', 'comments' ] );
			const state = pick( this.state, [ 'isBulkEdit', 'selectedComments', 'sortOrder' ] );
			return (
				<CommentList
					{ ...props }
					{ ...state }
					areAllCommentsSelected={ this.areAllCommentsSelected() }
					changePage={ this.changePage }
					clearSelectedComments={ this.clearSelectedComments }
					comments={ this.getPageOfComments( this.props.page ) }
					isCommentSelected={ this.isCommentSelected }
					removeFromPersistedComments={ this.removeFromPersistedComments }
					setSortOrder={ this.setSortOrder }
					toggleBulkEdit={ this.toggleBulkEdit }
					toggleCommentSelected={ this.toggleCommentSelected }
					toggleSelectAllComments={ this.toggleSelectAllComments }
					totalCommentsCount={ this.getTotalCommentsCount() }
					updatePersistedComments={ this.updatePersistedComments }
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
