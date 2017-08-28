import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
// import CreditCardForm from 'blocks/credit-card-form';
import CheckoutData from 'components/data/checkout';
import SecurePaymentForm from 'my-sites/checkout/checkout/secure-payment-form';
// import { createPaygateToken } from 'lib/store-transactions';
import { curry } from 'lodash';
import { getStoredCards } from 'state/stored-cards/selectors';
import {
	isDomainOnlySite,
	getCurrentUserPaymentMethods
} from 'state/selectors';

// class StubbedComponent extends React.Component {
//     render() {
//         return <h1>Hi there</h1>;
//     }
// }

class PaymentNoSite extends React.Component {
    successCallback() {
        console.log("payment success!");
    }
    recordFormSubmitEvent() {
        console.log("form submit");
    }

    getCheckoutCompleteRedirectPath() {
        return null;
    }

    handleCheckoutCompleteRedirect() {
        console.log("checkout complete");
    }

	render() {

        // fake shopping cart
        /*
        'products' => '(array:cart_item) List of products available in the shopping cart',
            'total_cost' => '(string) Total cost of the shopping cart',
            'total_cost_display' => '(string) Total cost of the shopping cart in a readable format with currency.',
            'paid_for_fully_in_credits' => "(bool) Whether this cart will be paid for in full with the user's credits",
            'allowed_payment_methods' =>  '(array) List of payment methods that can be used to purchase this cart',
            */
        var cart = {
            products: {},
            total_cost: 10,
            total_cost_display: '$10',
            allowed_payment_methods: ['WPCOM_Billing_MoneyPress_Paygate', 'WPCOM_Billing_PayPal_Express']
        };

        // this.createPaygateToken = curry( createPaygateToken )( 'card_update' );
        // var apiParams = {
        //     purchaseId: 'ab12310873810273'
        // };

        // note product list = this.props.productsList.get()

        return (<div>
            <h1>Payment Details</h1>
                <SecurePaymentForm
                    cards={ this.props.cards }
                    selectedSite={ false }
                    cart={ cart }
                    redirectTo={ this.getCheckoutCompleteRedirectPath }
                    handleCheckoutCompleteRedirect={ this.handleCheckoutCompleteRedirect }
                />
        </div>);
	}
}

module.exports = connect(
	state => {
		// const selectedSiteId = getSelectedSiteId( state );

		return {
			cards: getStoredCards( state ),
			paymentMethods: getCurrentUserPaymentMethods( state ),
			// isDomainOnly: isDomainOnlySite( state, selectedSiteId ),
			// selectedSite: getSelectedSite( state ),
			// selectedSiteId,
			// selectedSiteSlug: getSelectedSiteSlug( state ),
		};
	},
	{
		// clearPurchases,
		// clearSitePlans,
		// fetchReceiptCompleted,
		// recordApplePayStatus,
		// requestSite,
		// loadTrackingTool
	}
)( localize( PaymentNoSite ) );