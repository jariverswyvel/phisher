import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {objectOf, any, func, bool} from 'prop-types';
import './campaignListItem.css';
import {millisToDays} from '../../../lib/helpers';
import {run_campaign, fetch_campaign} from '../../../lib/phisherClient';
import ActionButton from '../../../components/ActionButton';

class CampaignListItem extends Component {
    state = {
        campaign: this.props.campaign,
        runButtonText: `Run`
    };

    run = false;

    runCampaign = e => {
        e.preventDefault();
        e.stopPropagation();
        const {campaign} = this.state;
        const {fetchProfile} = this.props;
        if (!this.run) {
            this.setState({runButtonText: `Starting...`});
            run_campaign(campaign._id, ({message}) => {
                if (message === `Success`) {
                    fetchProfile();
                    this.run = true;
                    this.setState({runButtonText: `Started`});
                    fetch_campaign(campaign._id, ({campaign}) => {
                        this.setState({campaign}, () => {
                            setTimeout(() => {
                                this.run = false;
                                this.setState({runButtonText: `Run`});
                            }, 2000);
                        });
                    });
                }
            });
        }
    };

    render() {
        const {campaign, runButtonText} = this.state;
        const {darkTheme} = this.props;

        return (
            <li className="campaign-list-item-wrapper">
                <Link to={`/campaigns/${campaign._id}`}>
                    <div className={`campaign-list-item flex-center space-between ${darkTheme ? `dark-theme` : ``}`}>
                        <div className="campaign-list-item-name unselectable">
                            <p style={darkTheme ? {color: `white`} : {}}>{campaign.name}</p>
                        </div>
                        <div className="campaign-list-item-module flex-center">
                            <i className="fal fa-envelope" />
                            <p className="unselectable">{campaign.module.name}</p>
                        </div>
                        <div className="campaign-list-item-stats">
                            <p className="campaign-list-item-target-count unselectable">
                                Targets: <span>{campaign.targets.length}</span>
                            </p>
                            <p className="campaign-list-item-run-count unselectable">
                                Runs: <span>{campaign.runs.length}</span>
                            </p>
                        </div>
                        <div className="campaign-list-item-repeat flex-center">
                            <p className="campaign-list-item-repeat-count unselectable">
                                {campaign.repeat_count === 0 ? `forever` : campaign.repeat_count}
                            </p>
                            <p className="campaign-list-item-repeat-interval unselectable">
                                every {millisToDays(campaign.repeat_interval)} days
                            </p>
                        </div>
                        <div className="campaign-list-item-run flex-center">
                            <ActionButton
                                green
                                icon={<i className="fas fa-play" />}
                                onClick={this.runCampaign}
                                text={runButtonText}
                            />
                        </div>
                    </div>
                </Link>
            </li>
        );
    }
}

CampaignListItem.propTypes = {
    campaign: objectOf(any).isRequired,
    fetchProfile: func.isRequired,
    darkTheme: bool.isRequired
};

export default CampaignListItem;
