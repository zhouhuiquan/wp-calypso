/** @format */

/**
 * External dependencies
 */
import React from 'react';
import Gridicon from 'gridicons';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import CompactCard from 'components/card/compact';
import CardHeading from 'components/card-heading';
import Button from 'components/button';

const ActionCard = ( {
	headerText,
	mainText,
	buttonPrimary,
	buttonText,
	buttonIcon,
	buttonTarget,
	buttonHref,
	buttonOnClick,
} ) => (
	<CompactCard className="action-card">
		<div className="action-card__main">
			<CardHeading tagName="h2" size={ 21 }>
				{ headerText }
			</CardHeading>
			<p>{ mainText }</p>
		</div>
		<div className="action-card__button-container">
			<Button
				primary={ buttonPrimary }
				href={ buttonHref }
				target={ buttonTarget }
				onClick={ buttonOnClick }
			>
				{ buttonText } { buttonIcon && <Gridicon icon={ buttonIcon } /> }
			</Button>
		</div>
	</CompactCard>
);

ActionCard.propTypes = {
	headerText: PropTypes.string.isRequired,
	mainText: PropTypes.string.isRequired,
	buttonPrimary: PropTypes.bool,
	buttonText: PropTypes.string.isRequired,
	buttonIcon: PropTypes.string,
	buttonOnClick: PropTypes.func,
	buttonHref: PropTypes.string,
	buttonTarget: PropTypes.string,
};

export default ActionCard;
