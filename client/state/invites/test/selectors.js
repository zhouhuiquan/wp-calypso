/** @format */
/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	isRequestingInvitesForSite,
	getPendingInvitesForSite,
	getAcceptedInvitesForSite,
	isRequestingResend,
	getNumberOfInvitesFoundForSite,
	didResendSucceed,
} from '../selectors';

describe( 'selectors', () => {
	describe( '#isRequestingInvitesForSite()', () => {
		test( 'should return true when requesting invites', () => {
			const state = {
				invites: {
					requesting: {
						12345: false,
						67890: true,
					},
				},
			};
			expect( isRequestingInvitesForSite( state, 67890 ) ).to.equal( true );
		} );

		test( 'should return false when request is complete', () => {
			const state = {
				invites: {
					requesting: {
						12345: false,
						67890: true,
					},
				},
			};
			expect( isRequestingInvitesForSite( state, 12345 ) ).to.equal( false );
		} );

		test( 'should return false when invites have not been requested', () => {
			const state = {
				invites: {
					requesting: {},
				},
			};
			expect( isRequestingInvitesForSite( state, 12345 ) ).to.equal( false );
		} );
	} );

	describe( '#getPendingInvitesForSite()', () => {
		test( 'should return invites when pending invites exist for site', () => {
			const state = {
				invites: {
					items: {
						12345: {
							pending: [
								{
									key: '123456asdf789',
									role: 'follower',
									isPending: true,
									user: {
										login: 'chicken',
										email: false,
										name: 'Pollo',
										avatar_URL:
											'https://2.gravatar.com/avatar/eba3ff8480f481053bbd52b2a08c6136?s=96&d=identicon&r=G',
									},
								},
							],
							accepted: [],
						},
					},
				},
			};
			expect( getPendingInvitesForSite( state, 12345 ) ).to.eql(
				state.invites.items[ 12345 ].pending
			);
		} );

		test( 'should return an empty array if no pending invites for site', () => {
			const state = {
				invites: {
					items: {
						12345: {
							pending: [],
							accepted: [
								{
									key: 'jkl789asd12345',
									role: 'subscriber',
									isPending: false,
									user: {
										login: 'grilledchicken',
										email: false,
										name: 'Pollo Asado',
										avatar_URL:
											'https://2.gravatar.com/avatar/eba3ff8480f481053bbd52b2a08c6136?s=96&d=identicon&r=G',
									},
								},
							],
						},
					},
				},
			};
			expect( getPendingInvitesForSite( state, 12345 ) ).to.eql( [] );
		} );

		test( 'should return null if no invites for site', () => {
			const state = {
				invites: {
					items: {},
				},
			};
			expect( getPendingInvitesForSite( state, 12345 ) ).to.equal( null );
		} );
	} );

	describe( '#getAcceptedInvitesForSite()', () => {
		test( 'should return invites when accepted invites exist for site', () => {
			const state = {
				invites: {
					items: {
						12345: {
							pending: [],
							accepted: [
								{
									key: 'jkl789asd12345',
									role: 'subscriber',
									isPending: false,
									user: {
										login: 'grilledchicken',
										email: false,
										name: 'Pollo Asado',
										avatar_URL:
											'https://2.gravatar.com/avatar/eba3ff8480f481053bbd52b2a08c6136?s=96&d=identicon&r=G',
									},
								},
							],
						},
					},
				},
			};
			expect( getAcceptedInvitesForSite( state, 12345 ) ).to.eql(
				state.invites.items[ 12345 ].accepted
			);
		} );

		test( 'should return an empty array if no accepted invites for site', () => {
			const state = {
				invites: {
					items: {
						12345: {
							pending: [
								{
									key: '123456asdf789',
									role: 'follower',
									isPending: true,
									user: {
										login: 'chicken',
										email: false,
										name: 'Pollo',
										avatar_URL:
											'https://2.gravatar.com/avatar/eba3ff8480f481053bbd52b2a08c6136?s=96&d=identicon&r=G',
									},
								},
							],
							accepted: [],
						},
					},
				},
			};
			expect( getAcceptedInvitesForSite( state, 12345 ) ).to.eql( [] );
		} );

		test( 'should return null if no invites for site', () => {
			const state = {
				invites: {
					items: {},
				},
			};
			expect( getAcceptedInvitesForSite( state, 12345 ) ).to.equal( null );
		} );
	} );

	describe( '#isRequestingResend()', () => {
		test( 'should return true when requesting resend', () => {
			const state = {
				invites: {
					requestingResend: {
						12345: { '123456asdf789': 'success' },
						67890: { '789lkjh123456': 'requesting' },
					},
				},
			};
			expect( isRequestingResend( state, 67890, '789lkjh123456' ) ).to.equal( true );
		} );

		test( 'should return false when resend request is complete', () => {
			const state = {
				invites: {
					requestingResend: {
						12345: { '123456asdf789': 'success' },
						67890: { '789lkjh123456': 'requesting' },
					},
				},
			};
			expect( isRequestingResend( state, 12345, '123456asdf789' ) ).to.equal( false );
		} );

		test( 'should return false when resend has not been requested', () => {
			const state = {
				invites: {
					requestingResend: {},
				},
			};
			expect( isRequestingResend( state, 12345, '9876asdf54321' ) ).to.equal( false );
		} );
	} );

	describe( '#getNumberOfInvitesFoundForSite()', () => {
		test( 'should return null when count is unknown', () => {
			const state = {
				invites: {
					counts: {},
				},
			};
			expect( getNumberOfInvitesFoundForSite( state, 12345 ) ).to.equal( null );
		} );

		test( 'should return the number found when count is known', () => {
			const state = {
				invites: {
					counts: {
						12345: 678,
					},
				},
			};
			expect( getNumberOfInvitesFoundForSite( state, 12345 ) ).to.equal( 678 );
		} );
	} );

	describe( '#didResendSucceed()', () => {
		test( 'should return true for successful resends', () => {
			const state = {
				invites: {
					requestingResend: {
						12345: { '123456asdf789': 'success' },
						67890: { '789lkjh123456': 'requesting' },
						34567: { asdf987654321: 'failure' },
					},
				},
			};
			expect( didResendSucceed( state, 12345, '123456asdf789' ) ).to.equal( true );
		} );

		test( 'should return false when a resend is pending', () => {
			const state = {
				invites: {
					requestingResend: {
						12345: { '123456asdf789': 'success' },
						67890: { '789lkjh123456': 'requesting' },
						34567: { asdf987654321: 'failure' },
					},
				},
			};
			expect( didResendSucceed( state, 67890, '789lkjh123456' ) ).to.equal( false );
		} );

		test( 'should return false when a resend is failure', () => {
			const state = {
				invites: {
					requestingResend: {
						12345: { '123456asdf789': 'success' },
						67890: { '789lkjh123456': 'requesting' },
						34567: { asdf987654321: 'failure' },
					},
				},
			};
			expect( didResendSucceed( state, 34567, 'asdf987654321' ) ).to.equal( false );
		} );

		test( 'should return false when resend has not been requested', () => {
			const state = {
				invites: {
					requestingResend: {},
				},
			};
			expect( didResendSucceed( state, 12345, '9876asdf54321' ) ).to.equal( false );
		} );
	} );
} );
