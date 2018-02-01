/** @format */
/**
 * External dependencies
 */
import React from 'react';

import NestedSidebarLink from '../../nested-sidebar-link';
import NestedSidebarParentLink from '../../nested-sidebar-parent-link';

export const SettingsExample = () => (
	<div style={ { background: 'rgba(200,0,0,0.5)' } }>
		<h4>Settings</h4>
		<NestedSidebarParentLink>Back</NestedSidebarParentLink>
		<NestedSidebarLink route="settings/domains">Domains</NestedSidebarLink>
		<NestedSidebarLink route="settings/discussion">Discussion</NestedSidebarLink>
	</div>
);

export default SettingsExample;
