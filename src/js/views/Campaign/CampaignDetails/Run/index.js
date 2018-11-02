import React, {Component} from 'react';
import {objectOf, any, bool, func} from 'prop-types';
import './index.css';
import {formatDateTextual} from '../../../../lib/helpers';
import ActionButton from '../../../../components/ActionButton';
import {delete_run} from '../../../../lib/phisherClient';

class Run extends Component {
    state = {
        showDetail: false
    };

    openRun = ({target}) => {
        const {showDetail} = this.state;
        if (!this.deleteDiv.contains(target)) this.setState({showDetail: !showDetail});
    };

    deleteRun = () => {
        const {run, updateCampaign} = this.props;
        delete_run(run._id, ({message}) => {
            if (message === `Success`) updateCampaign();
        });
    };

    render() {
        const {showDetail} = this.state;
        const {run, campaign, darkTheme} = this.props;
        return (
            <div className="run-list-item-wrapper" onClick={this.openRun}>
                <div className={`run-list-item flex-center ${darkTheme ? `dark-theme` : ``}`}>
                    <div className="run-list-item-date">
                        <p className="unselectable">{formatDateTextual(run.created_on)}</p>
                    </div>
                    <div className="run-list-item-module">
                        <i className="fal fa-envelope" />
                        <p className="unselectable">{campaign.module.name}</p>
                    </div>
                    <div className="run-list-item-stats">
                        <p className="run-list-item-target-count unselectable">
                            Targets: <span>{run.targets.length}</span>
                        </p>
                    </div>
                    <div className="run-list-item-stats">
                        <p className="run-list-item-target-count unselectable">
                            Opened: <span>{run.opened.length}</span>
                        </p>
                    </div>
                    <div className="run-list-item-stats">
                        <p className="run-list-item-target-count unselectable">
                            Clicked: <span>{run.clicked.length}</span>
                        </p>
                    </div>
                    {/* <div className="run-list-item-stats">
                        <p className="run-list-item-target-count unselectable">
                            Downloaded: <span>{run.downloaded.length}</span>
                        </p>
                    </div> */}
                    <div className="run-list-item-options" ref={node => (this.deleteDiv = node)}>
                        <ActionButton
                            confirm
                            icon={<i className="fal fa-trash-alt" />}
                            onClick={this.deleteRun}
                            red
                            text="Delete"
                        />
                    </div>
                </div>
                {showDetail && (
                    <div className={`run-list-item-details ${darkTheme ? `dark-theme-light-bg` : ``}`}>
                        <div className="run-details-targets" />
                        <div className="run-details-targets" />
                        <div className="run-details-targets">
                            <ul className="run-details-target-list">
                                {run.targets.map(target => (
                                    <li key={target._id}>
                                        <p>{target.name}</p>
                                        <p>{target.email}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="run-details-opened">
                            <ul className="run-details-target-list">
                                {run.opened.map(target => (
                                    <li key={target._id}>
                                        <p>{target.name}</p>
                                        <p>{target.email}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="run-details-clicked">
                            <ul className="run-details-target-list">
                                {run.clicked.map(target => (
                                    <li key={target._id}>
                                        <p>{target.name}</p>
                                        <p>{target.email}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="run-details-targets" />
                    </div>
                )}
            </div>
        );
    }
}

Run.propTypes = {
    run: objectOf(any).isRequired,
    campaign: objectOf(any).isRequired,
    updateCampaign: func.isRequired,
    darkTheme: bool.isRequired
};

export default Run;
