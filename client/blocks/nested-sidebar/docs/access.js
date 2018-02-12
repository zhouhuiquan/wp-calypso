// We would need to build a mapping of sidebar routes to their components + other details

import { has, get } from 'lodash';

import SettingsExample from './example-components/settings';
import DomainsExample from './example-components/domains';
import DiscussionExample from './example-components/discussion';
import DomainsManageExample from './example-components/domains-manage';
import DomainUpgradesExample from './example-components/domains-upgrades';

import MainSidebar from 'my-sites/sidebar/wrapper';

console.log( { MainSidebar})

const sidebarRouteData = {};

export const isValidRouteData = data => has( data, 'component' );

// returns object
export const getRouteData = route =>
	get( sidebarRouteData, route, {} );

export const getRouteComponent = route =>
	get( sidebarRouteData[ route ], 'component', null );


export const setRouteData = ( route, data ) =>
	isValidRouteData( data )
		? ( sidebarRouteData[ route ] = data ) && true
		: false;

// ==============
// This wouldn't normally be done here...
// This file is mostly just a hodge-podge version of what should be selectors, actions and implementations of those actions

// setRouteData(
// 	'test', {
// 		parent: null,
// 		something: 'else',
// 		component: MainSidebar,
// 	}
// );

// setRouteData(
// 	'settings', {
// 		parent: 'root',
// 		component: SettingsExample,
// 	}
// );

setRouteData(
	'settings/domains', {
		parent: 'settings',
		component: DomainsExample,
	}
);setRouteData(
	'settings/domains/manage', {
		parent: 'settings/domains',
		component: DomainsManageExample,
	}
);

setRouteData(
	'settings/domains/upgrades', {
		parent: 'settings/domains',
		component: DomainUpgradesExample,
	}
);

setRouteData(
	'settings/discussion', {
		parent: 'settings',
		component: DiscussionExample,
	}
);

// Only the key is held in state - component and parent should be get'ted from the lib or wherever