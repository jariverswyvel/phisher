import React, {Component} from 'react';
import {string, node, func, bool} from 'prop-types';
import './index.css';
import Confirm from '../Confirm';

class ActionButton extends Component {
    state = {
        showConfirm: false
    };

    componentDidMount() {
        const {confirm} = this.props;
        if (confirm) {
            window.addEventListener(`click`, this.handleCloseConfirm);
        }
    }

    componentWillUnmount() {
        const {confirm} = this.props;
        if (confirm) {
            window.removeEventListener(`click`, this.handleCloseConfirm);
        }
    }

    handleCloseConfirm = ({target}) => {
        const {showConfirm} = this.state;
        if (this.button && !this.button.contains(target) && showConfirm) {
            this.handleShowConfirm();
        }
    };

    handleShowConfirm = () => {
        const {showConfirm} = this.state;
        this.setState({showConfirm: !showConfirm});
    };

    render() {
        const {text, onClick, icon, confirm, className, blue, green, red} = this.props;
        const {showConfirm} = this.state;

        return (
            <div className="relative">
                <div
                    className={`button-action unselectable flex-center ${className} ${
                        blue ? `blue` : green ? `green` : red ? `red` : ``
                    }`}
                    onClick={confirm ? this.handleShowConfirm : onClick}
                    ref={node => (this.button = node)}>
                    <p>{icon}</p>
                    {text && <p>{text}</p>}
                </div>
                <Confirm onCancel={this.handleShowConfirm} onDelete={onClick} show={showConfirm} />
            </div>
        );
    }
}

ActionButton.propTypes = {
    text: string,
    onClick: func,
    icon: node,
    className: string,
    blue: bool,
    green: bool,
    red: bool,
    confirm: bool
};

ActionButton.defaultProps = {
    text: ``,
    onClick: () => false,
    icon: ``,
    className: ``,
    blue: false,
    green: false,
    red: false,
    confirm: false
};

export default ActionButton;
