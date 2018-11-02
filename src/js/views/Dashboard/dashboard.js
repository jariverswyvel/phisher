import React, {Component} from 'react';
import './dashboard.css';
import {objectOf, any} from 'prop-types';
import {fetch_campaigns, fetch_profile, create_campaign, fetch_modules} from '../../lib/phisherClient';
import CampaignListItem from './CampaignListItem/campaignListItem';
import SectionHeader from '../../components/SectionHeader';
import {Consumer} from '../../contexts/phisherContext';
import ActionButton from '../../components/ActionButton';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import ModalTitle from '../../components/ModalTitle';
import {handleHideModalAnywhere, handleShowModal} from '../../lib/helpers';

class Dashboard extends Component {
    state = {
        campaigns: [],
        user: null,
        showCampaignCreateModal: false,
        newCampaignName: ``,
        newCampaignModule: ``,
        modules: []
    };

    componentDidMount() {
        fetch_campaigns(({message, campaigns}) => message === `Success` && this.setState({campaigns}));
        fetch_modules(
            ({message, modules}) =>
                message === `Success` && modules.length > 0 && this.setState({modules, newCampaignModule: modules[0]._id})
        );
        document.title = `Phisherman | Dashboard`;
        this.fetchProfile();
    }

    createCampaign = e => {
        e.preventDefault();
        const {newCampaignName, newCampaignModule} = this.state;
        create_campaign(newCampaignName, newCampaignModule, [], ({message, campaign}) => {
            if (message === `Success`) {
                handleShowModal(`showCampaignCreateModal`, this);
                this.setState({showCampaignCreateModal: false, newCampaignModule: ``, newCampaignName: ``}, () => {
                    this.props.history.push(`/campaigns/${campaign._id}`);
                });
            } else {
                // Show error
            }
        });
    };

    onChange = ({target: {value, name}}) => this.setState({[name]: value});

    fetchProfile = () => fetch_profile(({message, user}) => message === `Success` && this.setState({user}));

    render() {
        const {campaigns, modules, user, newCampaignName, newCampaignModule, showCampaignCreateModal} = this.state;
        if (user) {
            return (
                <Consumer>
                    {({fetchProfile, darkTheme}) => (
                        <div className="dashboard-container">
                            <div className="campaign-list-items-header">
                                <SectionHeader fontawesome="fal fa-bullhorn" />
                                <ActionButton
                                    icon={<i className="fal fa-plus" />}
                                    onClick={() => handleShowModal(`showCampaignCreateModal`, this)}
                                    text="Create campaign"
                                />
                            </div>
                            <ul className="campaign-list">
                                {campaigns.map(campaign => (
                                    <CampaignListItem
                                        campaign={campaign}
                                        darkTheme={darkTheme}
                                        fetchProfile={fetchProfile}
                                        key={campaign._id}
                                    />
                                ))}
                            </ul>
                            {showCampaignCreateModal && (
                                <div
                                    className="modal-wrapper"
                                    onClick={e =>
                                        handleHideModalAnywhere(e, `showCampaignCreateModal`, this.modalContainer, this)
                                    }
                                    ref={node => (this.modalContainer = node)}>
                                    <form
                                        className={`modal-content campaign-new-modal ${darkTheme ? `dark-theme` : ``}`}
                                        onSubmit={this.createCampaign}>
                                        <ModalTitle icon={<i className="fal fa-bullhorn" />} title="Campaign" />
                                        <Input
                                            name="newCampaignName"
                                            onChange={this.onChange}
                                            title="Campaign name"
                                            value={newCampaignName}
                                        />
                                        <Select
                                            name="newCampaignModule"
                                            onChange={this.onChange}
                                            title="Mail module"
                                            value={newCampaignModule}>
                                            {modules.map(mmodule => (
                                                <option key={mmodule._id} value={mmodule._id}>
                                                    {mmodule.name}
                                                </option>
                                            ))}
                                        </Select>
                                        <Button title="Create campaign" />
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </Consumer>
            );
        } else return null;
    }
}

Dashboard.propTypes = {
    history: objectOf(any).isRequired
};

export default Dashboard;
