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
			return slice( this.getOrderedComments(), startingIndex, startingIndex + COMMENTS_PER_PAGE );
		};

		getTotalCommentsCount = () => this.getComments().length;

		getTotalPagesOfComments = () => Math.ceil( this.getComments().length / COMMENTS_PER_PAGE );

		isCommentSelected = commentId => !! find( this.state.selectedComments, { commentId } );

		isRequestedPageValid = () => this.getTotalPagesOfComments() >= this.props.page;

		isSelectedAllComments = () =>
			this.state.selectedComments.length &&
			this.state.selectedComments.length > this.getPageOfComments( this.props.page ).length;

		setSortOrder = sortOrder => () => {
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
			const props = omit( this.props, [ 'changePage', 'comments' ] );
			const state = pick( this.state, [ 'isBulkEdit', 'selectedComments', 'sortOrder' ] );
			return (
				<CommentList
					{ ...props }
					{ ...state }
					changePage={ this.changePage }
					clearSelectedComments={ this.clearSelectedComments }
					comments={ this.getPageOfComments( this.props.page ) }
					disableBulkEdit={ this.disableBulkEdit }
					enableBulkEdit={ this.enableBulkEdit }
					isSelectedAllComments={ this.isSelectedAllComments() }
					setSortOrder={ this.setSortOrder }
					toggleSelectAllComments={ this.toggleSelectAllComments }
					totalCommentsCount={ this.getTotalCommentsCount() }
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
