/**
 * External dependencies
 */
import React, { Component } from 'react';

/**
 * Internal Dependencies
 */
import Main from 'components/main';
import Card from 'components/card';
import SectionHeader from 'components/section-header';

export default class HelloDollyPage extends Component {
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

