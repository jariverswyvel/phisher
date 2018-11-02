import React, {Component} from 'react';
import {bool} from 'prop-types';
import SectionHeader from '../../components/SectionHeader';
import './targets.css';
import ActionButton from '../../components/ActionButton';
import {fetch_targets, create_target, update_target} from '../../lib/phisherClient';
import Target from './Target/target';
import {handleHideModalAnywhere, handleShowModal} from '../../lib/helpers';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {delete_target} from '../../lib/phisherClient';
import ModalTitle from '../../components/ModalTitle';

class Targets extends Component {
    state = {
        targets: [],
        showTargetModal: false
    };

    componentDidMount() {
        this.fetchTargets();
        document.title = `Phisherman | Targets`;
    }

    fetchTargets = () =>
        fetch_targets(({message, targets}) => message === `Success` && this.setState({targets: targets.sort(this.sortTargets)}));

    createTarget = e => {
        e.preventDefault();
        const {name, email, targets, address} = this.state;
        create_target(name, email, address, ({message, target, error}) => {
            if (message === `Success`) {
                this.setState({targets: [...targets, target].sort(this.sortTargets)});
                handleShowModal(`showTargetModal`, this);
            } else if (message === `Failed`) {
                console.log(error);
            }
        });
    };

    deleteTarget = id => {
        delete_target(id, ({message}) => {
            if (message === `Success`) {
                const {targets} = this.state;
                const filteredTargets = targets.filter(target => target._id !== id);
                this.setState({targets: filteredTargets});
            }
        });
    };

    sortTargets = (prev, next) => next.name.toLowerCase() < prev.name.toLowerCase();

    updateTarget = e => {
        e.preventDefault();
        const {selectedTarget, targets} = this.state;
        update_target(selectedTarget, ({message, target}) => {
            if (message === `Success`) {
                const filterdTargets = targets.filter(t => t._id !== target._id);
                this.setState({targets: [...filterdTargets, target].sort(this.sortTargets)});
                handleShowModal(`showTargetModal`, this);
            }
        });
    };

    selectTarget = selectedTarget =>
        this.setState({selectedTarget, address: null}, () => handleShowModal(`showTargetModal`, this));

    onChangeUpdate = ({target: {value, name}}) => {
        const {selectedTarget} = this.state;
        this.setState({selectedTarget: {...selectedTarget, [name]: value}});
    };

    onChangeUpdateAddress = ({target: {value, name}}) => {
        const {
            selectedTarget,
            selectedTarget: {address}
        } = this.state;

        this.setState({selectedTarget: {...selectedTarget, address: {...address, [name]: value}}});
    };

    onChangeAddress = ({target: {value, name}}) => {
        const {address} = this.state;
        this.setState({address: {...address, [name]: value}});
    };

    onChange = ({target: {value, name}}) => this.setState({[name]: value});

    handleOpenCreateModal = () =>
        this.setState({selectedTarget: null, address: null}, () => handleShowModal(`showTargetModal`, this));

    render() {
        const {targets, showTargetModal, selectedTarget} = this.state;
        const {darkTheme} = this.props;

        return (
            <div className="targets-container">
                <div className="flex-center space-between targets-header">
                    <SectionHeader fontawesome="fal fa-users" title="Targets" />
                    <ActionButton
                        icon={<i className="fal fa-plus" />}
                        onClick={this.handleOpenCreateModal}
                        text="Create target"
                    />
                </div>
                <ul className="target-list">
                    {targets.map(target => (
                        <Target
                            darkTheme={darkTheme}
                            deleteTarget={this.deleteTarget}
                            key={target._id}
                            selectTarget={this.selectTarget}
                            target={target}
                        />
                    ))}
                </ul>
                {showTargetModal && (
                    <div
                        className="modal-wrapper"
                        onClick={e => handleHideModalAnywhere(e, `showTargetModal`, this.modalContainer, this)}
                        ref={node => (this.modalContainer = node)}>
                        <form
                            className={`modal-content target-modal ${darkTheme ? `dark-theme` : ``}`}
                            onSubmit={selectedTarget ? this.updateTarget : this.createTarget}>
                            <ModalTitle icon={<i className="fal fa-address-card" />} title="Target" />
                            <Input
                                name="name"
                                onChange={selectedTarget ? this.onChangeUpdate : this.onChange}
                                title="Target name"
                                value={selectedTarget ? selectedTarget.name : undefined}
                            />
                            <Input
                                name="email"
                                onChange={selectedTarget ? this.onChangeUpdate : this.onChange}
                                title="Target email"
                                value={selectedTarget ? selectedTarget.email : undefined}
                            />
                            <ModalTitle icon={<i className="fal fa-map-marker-alt" />} title="Address" />
                            <Input
                                name="street"
                                onChange={selectedTarget ? this.onChangeUpdateAddress : this.onChangeAddress}
                                title="street"
                                value={selectedTarget && selectedTarget.address ? selectedTarget.address.street : undefined}
                            />
                            <div className="flex-center space-between">
                                <Input
                                    name="zipcode"
                                    onChange={selectedTarget ? this.onChangeUpdateAddress : this.onChangeAddress}
                                    rowSpan="double"
                                    title="zipcode"
                                    value={selectedTarget && selectedTarget.address ? selectedTarget.address.zipcode : undefined}
                                />

                                <Input
                                    name="number"
                                    onChange={selectedTarget ? this.onChangeUpdateAddress : this.onChangeAddress}
                                    rowSpan="triple"
                                    title="number"
                                    value={selectedTarget && selectedTarget.address ? selectedTarget.address.number : undefined}
                                />
                                <Input
                                    name="bus"
                                    onChange={selectedTarget ? this.onChangeUpdateAddress : this.onChangeAddress}
                                    rowSpan="quad"
                                    title="bus"
                                    value={selectedTarget && selectedTarget.address ? selectedTarget.address.bus : undefined}
                                />
                            </div>
                            <div className="flex-center space-between">
                                <Input
                                    name="city"
                                    onChange={selectedTarget ? this.onChangeUpdateAddress : this.onChangeAddress}
                                    rowSpan="double"
                                    title="city"
                                    value={selectedTarget && selectedTarget.address ? selectedTarget.address.city : undefined}
                                />
                                <Input
                                    name="country"
                                    onChange={selectedTarget ? this.onChangeUpdateAddress : this.onChangeAddress}
                                    rowSpan="double"
                                    title="country"
                                    value={selectedTarget && selectedTarget.address ? selectedTarget.address.country : undefined}
                                />
                            </div>
                            <Button title={selectedTarget ? `Update target` : `Create target`} />
                        </form>
                    </div>
                )}
            </div>
        );
    }
}

Targets.propTypes = {
    darkTheme: bool
};

Targets.defaultProps = {
    darkTheme: false
};

export default Targets;
