import React, {Component} from 'react';
import {objectOf, any, func} from 'prop-types';
import {Consumer} from '../../../contexts/phisherContext';
import './campaignDetails.css';
import Run from './Run';
import SectionHeader from '../../../components/SectionHeader';
import BarchartWithTimeline from '../../../components/Stats/BarchartWithTimeline';
import cobbe from '../../../../assets/svg/spider.svg';
import wittecobbe from '../../../../assets/svg/spider-white.svg';
import Barchart from '../../../components/Stats/Barchart';
import {formatDate} from '../../../lib/helpers';

export class CampaignDetails extends Component {
    state = {};

    calculateCampaignStats = () => {
        const {
            campaign: {runs}
        } = this.props;
        const runsTargets = runs.map(run => run.targets.length);
        const runsOpened = runs.map(run => run.opened.length);
        const runsClicked = runs.map(run => run.clicked.length);
        const totalMailSent = runsTargets.reduce((prev, next) => prev + next);
        const averageTargets = totalMailSent / runs.length;
        const averageOpened = runsOpened.reduce((prev, next) => prev + next) / runs.length;
        const averageClicked = runsClicked.reduce((prev, next) => prev + next) / runs.length;

        return {
            totalMailSent,
            averageTargets,
            averageOpened,
            averageClicked
        };
    };

    render() {
        const {campaign, refreshCampaign} = this.props;
        const {totalMailSent, averageClicked, averageOpened, averageTargets} = this.calculateCampaignStats();

        return (
            <Consumer>
                {({darkTheme}) => (
                    <div className="campaign-detail-container">
                        <div className={`campaign-detail-wrapper ${darkTheme ? `dark-theme` : ``}`}>
                            <div className={`campaign-info ${darkTheme ? `dark` : ``}`}>
                                <h2>
                                    Average <span>- {totalMailSent} mails sent</span>
                                </h2>
                                <Barchart
                                    data={[
                                        {
                                            average: `Average`,
                                            opened: parseFloat(averageOpened.toFixed(2)),
                                            clicked: parseFloat(averageClicked.toFixed(2)),
                                            targets: parseFloat(averageTargets.toFixed(2))
                                        }
                                    ]}
                                />
                            </div>

                            <div className={`campaign-stats ${darkTheme ? `dark` : ``}`}>
                                {campaign.runs.length > 0 ? (
                                    <BarchartWithTimeline
                                        data={campaign.runs
                                            .map(({created_on, clicked, opened}) => ({
                                                run: formatDate(created_on),
                                                clicked: clicked.length,
                                                opened: opened.length
                                            }))
                                            .reverse()}
                                    />
                                ) : (
                                    <div className="campaign-no-stats">
                                        <p className="unselectable">Calculating stats is difficult without data...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="campaign-detail-runs">
                            <SectionHeader fontawesome="fal fa-database" title={`Runs (${campaign.runs.length})`} />

                            {campaign.runs.length > 0 ? (
                                <ul className="run-list">
                                    {campaign.runs.map(run => (
                                        <Run
                                            campaign={campaign}
                                            darkTheme={darkTheme}
                                            key={run._id}
                                            run={run}
                                            updateCampaign={refreshCampaign}
                                        />
                                    ))}
                                </ul>
                            ) : (
                                <div className={`no-runs-text ${darkTheme ? `dark` : ``}`}>
                                    <div className="hide">
                                        Icons made by
                                        <a href="http://www.freepik.com" title="Freepik">
                                            Freepik
                                        </a>
                                        from
                                        <a href="https://www.flaticon.com/" title="Flaticon">
                                            www.flaticon.com
                                        </a>
                                        is licensed by
                                        <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">
                                            CC 3.0 BY
                                        </a>
                                    </div>
                                    <img className="no-runs-image" src={darkTheme ? wittecobbe : cobbe} />
                                    <p className="unselectable">It&apos;s a bit dusty around here... Run this campaign!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Consumer>
        );
    }
}

CampaignDetails.propTypes = {
    campaign: objectOf(any).isRequired,
    refreshCampaign: func.isRequired
};

export default CampaignDetails;
