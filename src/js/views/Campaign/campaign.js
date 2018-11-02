import React, {Component} from 'react';
import {objectOf, any, func, bool} from 'prop-types';
import {
    fetch_campaign,
    update_campaign,
    run_campaign,
    delete_campaign,
    search_targets,
    fetch_targets
} from '../../lib/phisherClient';
import './campaign.css';
import CampaignDetails from './CampaignDetails/campaignDetails';
import SectionHeader from '../../components/SectionHeader';
import ActionButton from '../../components/ActionButton';
import SmartInputButton from '../../components/SmartInputButton';

class Campaign extends Component {
    state = {
        campaign: null,
        buttonRunText: `Run`,
        popularTargets: [],
        update: false
    };

    componentDidMount() {
        this.fetchCampaign();
    }

    fetchCampaign = cb => {
        const {campaign_id} = this.props.match.params;
        fetch_campaign(campaign_id, ({campaign}) => {
            document.title = `Phisherman | ${campaign.name}`;
            this.setState({campaign}, () => cb && cb(campaign));
        });
    };

    runCampaign = () => {
        const {campaign_id} = this.props.match.params;
        const {updateProfile} = this.props;
        const {running} = this.state;
        if (!running) {
            this.setState({buttonRunText: `Running`, running: true}, () => {
                run_campaign(
                    campaign_id,
                    ({message}) =>
                        message === `Success` && updateProfile(() => this.setState({buttonRunText: `Run`, running: false}))
                );
            });
        }
    };

    fetchTargets = (query, selected, cb) => {
        if (query.length > 0 && query !== ` `) {
            search_targets(query, data => {
                if (data.message === `Success`) {
                    const suggestions = data.targets
                        .filter(target => selected.length === 0 || !selected.find(u => u._id === target._id))
                        .map(target => ({_id: target._id, name: target.name, email: target.email}));
                    cb(suggestions);
                } else cb([]);
            });
        } else cb([]);
    };

    updateTargets = assigned => {
        const {campaign} = this.state;
        campaign.targets = assigned;
        update_campaign(campaign, data => {
            if (data.message === `Success`) this.setState({campaign: {...campaign, targets: data.campaign.targets}});
        });
    };

    fetchPopularTargets = (selected, cb) => {
        fetch_targets(({message, targets}) => {
            if (message === `Success`) {
                const suggestions = targets
                    .filter(target => selected.length === 0 || !selected.find(u => u._id === target._id))
                    .map(target => ({_id: target._id, name: target.name, email: target.email}));
                cb(suggestions);
            } else cb([]);
        });
    };

    deleteCampaign = () => {
        const {campaign_id} = this.props.match.params;
        delete_campaign(campaign_id, ({message}) => {
            if (message === `Success`) this.props.history.push(`/`);
        });
    };

    updateCampaignName = (name, cb) => {
        const {campaign} = this.state;
        campaign.name = name;
        update_campaign(campaign, ({message}) => {
            if (message === `Success`)
                this.setState({campaign}, () => {
                    cb(name);
                });
            else cb(this.state.campaign.name);
        });
    };

    render() {
        const {campaign, buttonRunText, popularTargets, update} = this.state;
        const {darkTheme} = this.props;

        if (campaign) {
            return (
                <div className="campaign-container">
                    <div className="campaign-header">
                        <div className="campaign-header-title-module">
                            <SectionHeader
                                darkTheme={darkTheme}
                                fontawesome="fal fa-bullhorn"
                                title={campaign.name}
                                updateTitle={this.updateCampaignName}
                            />
                            <div className="campaign-header-module">
                                <i className="fal fa-envelope" />
                                <p className="unselectable">{campaign.module.name}</p>
                            </div>
                            <div className="campaign-header-module">
                                <i className="fal fa-users" />
                                <p className="unselectable">{campaign.targets.length}</p>
                            </div>
                            <SmartInputButton
                                className="target-smart-picker"
                                darkTheme={darkTheme}
                                generator={this.fetchTargets}
                                labelCount={4}
                                onUpdate={this.updateTargets}
                                placeholder="Name or e-mail"
                                selected={campaign.targets.map(target => ({
                                    _id: target._id,
                                    name: target.name,
                                    email: target.email
                                }))}
                                suggestionGenerator={this.fetchPopularTargets}
                                title="Add targets"
                                type="people"
                            />
                        </div>
                        <div className="campaign-actions">
                            <ActionButton
                                confirm
                                icon={<i className="fal fa-trash-alt" />}
                                onClick={this.deleteCampaign}
                                red
                                text="Delete"
                            />
                            <ActionButton
                                className="button-run"
                                green
                                icon={<i className="fas fa-play" />}
                                onClick={this.runCampaign}
                                text={buttonRunText}
                            />
                        </div>
                    </div>
                    <CampaignDetails campaign={campaign} refreshCampaign={this.fetchCampaign} />
                </div>
            );
        } else return null;
    }
}

Campaign.propTypes = {
    match: objectOf(any).isRequired,
    history: objectOf(any).isRequired,
    updateProfile: func.isRequired,
    darkTheme: bool
};

Campaign.defaultProps = {
    darkTheme: false
};

export default Campaign;
