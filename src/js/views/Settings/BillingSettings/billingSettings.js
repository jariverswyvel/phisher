import React, {Component, Fragment} from 'react';
import Input from '../../../components/Input';
import {objectOf, any, func, bool} from 'prop-types';
import {buy_credits, fetch_packs, update_card, delete_card} from '../../../lib/phisherClient';
import Button from '../../../components/Button';
import creditCard from '../../../../assets/svg/credit-card.svg';
import creditCardDark from '../../../../assets/svg/credit-card-dark.svg';
import './billingSettings.css';
import Select from '../../../components/Select';
import Payment from './Payment/payment';
import Pack from './Pack/pack';
import ActionButton from '../../../components/ActionButton';
import {parserData, formatAmount} from '../../../lib/helpers';

class BillingSettings extends Component {
    state = {
        user: this.props.user,
        creditAmount: 50,
        buyTitle: `Buy credits`,
        selectedPack: null,
        packs: [],
        price: 0.5
    };

    componentDidMount() {
        const {user} = this.state;
        if (!user.card) {
            this.setState({
                user: {...user, card: {name: ``, exp_year: new Date().getFullYear(), exp_month: 1}}
            });
        }
        this.setState({user: {...user, payments: user.payments.sort(this.sortPayments)}});
        fetch_packs(({message, packs}) => message === `Success` && this.setState({packs: this.swap(packs.sort(this.sortPacks))}));
    }

    creditMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    creditYears = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    currentYear = new Date().getFullYear();
    processing = false;

    swap = arr => {
        const first = arr.shift();
        arr.push(first);
        return arr;
    };

    handleUpdateCard = e => {
        e.preventDefault();
        const {user} = this.state;
        update_card(user, data => console.log(data));
    };

    onChange = ({target: {value, name}}) => {
        const {
            user,
            user: {card}
        } = this.state;

        this.setState({user: {...user, card: {...card, [name]: value}}});
    };

    onChangeCreditAmount = ({target: {value, name}}) => {
        value = value.replace(/^((?!^[0-9]*$).)*$/g, ``);
        this.setState({[name]: value, selectedPack: null, price: 0.5});
    };

    buyCredits = e => {
        e.preventDefault();

        if (!this.processing) {
            const {creditAmount, user, selectedPack} = this.state;
            const {fetchProfile} = this.props;

            this.processing = true;

            this.setState({buyTitle: `Processing...`});

            buy_credits(creditAmount, selectedPack, ({message}) => {
                message === `Success` &&
                    fetchProfile(() => {
                        this.processing = false;
                        this.setState({
                            user: {...user, credits: user.credits + parseInt(creditAmount)},
                            creditAmount: 50,
                            selectedPack: null,
                            price: 0.5,
                            buyTitle: `Buy credits`
                        });
                    });
            });
        }
    };

    sortPayments = (prev, next) => new Date(next.created_on) - new Date(prev.created_on);

    sortPacks = (prev, next) => prev.credits - next.credits;

    showEditCard = () => {
        const {isEditingCreditcard} = this.state;
        this.setState({isEditingCreditcard: !isEditingCreditcard});
    };

    handlePackClick = (creditAmount, selectedPack, price) => this.setState({creditAmount, selectedPack, price});

    deleteCard = () => {
        delete_card(data => console.log(data));
    };

    render() {
        const {
            user,
            user: {card, credits, payments},
            buyTitle,
            creditAmount,
            isEditingCreditcard,
            packs,
            selectedPack,
            price
        } = this.state;

        const {fetchProfile, darkTheme} = this.props;

        if (user && card) {
            return (
                <Fragment>
                    <h2 className="active-settings-title">Credits</h2>
                    <section className="settings-section">
                        <form onSubmit={this.buyCredits}>
                            <div className="flex-center credits-settings">
                                <div className="available-credits">
                                    <i className="far fa-coins" />
                                    <span className="credits-amount" style={darkTheme ? {color: `white`} : {}}>
                                        {formatAmount(credits)}
                                    </span>
                                </div>
                            </div>
                            <ul className="pack-list">
                                {packs.map((pack, index) => (
                                    <Pack
                                        darkTheme={darkTheme}
                                        index={index}
                                        key={pack._id}
                                        onClick={this.handlePackClick}
                                        pack={pack}
                                    />
                                ))}
                            </ul>
                            <Input
                                name="creditAmount"
                                onChange={this.onChangeCreditAmount}
                                rowSpan="double"
                                title="Credit amount"
                                value={creditAmount}
                            />
                            <div className="credit-buy-confirm">
                                <Button onClick={this.buyCredits} title={buyTitle} />
                                <p className="credit-buy-total-price">
                                    Total: &euro;{selectedPack ? parserData(price) : parserData(creditAmount * price)}
                                </p>
                            </div>
                        </form>
                        <form className="credits-settings-container" onSubmit={e => this.handleUpdateCard(e, fetchProfile)}>
                            <h2 className="active-settings-title">Payment method</h2>

                            {/* <div className="credit-card pointer">
                                <i className="fas fa-plus-circle" /> Add a card
                            </div> */}
                            <div className="flex-start space-between">
                                <div className="credit-card" onClick={this.showEditCard}>
                                    <p className="credit-card-number">
                                        <span>XXXX</span>
                                        <span>XXXX</span>
                                        <span>XXXX</span>
                                        <span>{card.number}</span>
                                    </p>
                                    <p className="credit-card-expiry">
                                        <span>{card.exp_month}</span>
                                        <span className="credit-card-expiry-year">{card.exp_year}</span>
                                    </p>
                                    <p className="credit-card-name upper">{card.name}</p>
                                    <div className="credit-card-overlay pointer">
                                        <div className="credit-card-edit">
                                            <i className="fal fa-pencil" />
                                            <p>Edit</p>
                                        </div>
                                    </div>
                                    <img alt="" src={darkTheme ? creditCardDark : creditCard} />
                                </div>
                                <div className="delete-card-container">
                                    <ActionButton
                                        confirm
                                        icon={<i className="fal fa-trash-alt" />}
                                        onClick={this.deleteCard}
                                        red
                                        text="Delete"
                                    />
                                </div>
                            </div>
                            {isEditingCreditcard && (
                                <div className="credit-card-edit-input">
                                    <Input
                                        name="name"
                                        onChange={this.onChange}
                                        rowSpan="double"
                                        title="Name on card"
                                        value={card.name}
                                    />
                                    <div className="flex-center space-between">
                                        <Select
                                            name="exp_month"
                                            onChange={this.onChange}
                                            rowSpan="double"
                                            title="Expiry month"
                                            value={card.exp_month}>
                                            {this.creditMonths.map(month => (
                                                <option key={month} value={month}>
                                                    {month}
                                                </option>
                                            ))}
                                        </Select>
                                        <Select
                                            name="exp_year"
                                            onChange={this.onChange}
                                            rowSpan="double"
                                            title="Expiry year"
                                            value={card.exp_year}>
                                            {this.creditYears.map((year, index) => (
                                                <option key={index} value={this.currentYear + index}>
                                                    {this.currentYear + index}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                    <Button onClick={e => this.handleUpdateCard(e, fetchProfile)} title="Update payment method" />
                                </div>
                            )}
                        </form>
                        <div className="payment-history">
                            <h2 className="active-settings-title">Payment history</h2>
                            {payments && (
                                <ul>
                                    {payments.map(payment => (
                                        <Payment darkTheme={darkTheme} key={payment._id} payment={payment} />
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                </Fragment>
            );
        } else return null;
    }
}

BillingSettings.propTypes = {
    user: objectOf(any).isRequired,
    fetchProfile: func.isRequired,
    darkTheme: bool.isRequired
};

export default BillingSettings;
