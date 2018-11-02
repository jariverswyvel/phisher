import React, {Component} from 'react';
import {string, func, bool} from 'prop-types';
import './index.css';
import Input from '../Input';

class SectionHeader extends Component {
    state = {
        title: this.props.title,
        editable: false
    };

    updateTitle = ({target: {value}}) => {
        this.setState({title: value});
    };

    toggleEdit = () => {
        const {editable, title} = this.state;
        const {updateTitle} = this.props;
        if (editable && updateTitle) updateTitle(title, title => this.setState({title}));
        this.setState({editable: !editable});
    };

    render() {
        const {title, editable} = this.state;
        const {fontawesome, updateTitle, darkTheme} = this.props;

        return (
            <div className="section-list-header">
                <i className={`header-icon ${fontawesome}`} />
                {editable ? <Input onChange={this.updateTitle} value={title} /> : <h2>{this.props.title}</h2>}
                {updateTitle && (
                    <i
                        className={`edit-icon ${darkTheme ? `dark-icon` : ``}  ${
                            editable ? `editable fal fa-check` : `fal fa-pencil`
                        }`}
                        onClick={this.toggleEdit}
                    />
                )}
            </div>
        );
    }
}

SectionHeader.propTypes = {
    title: string,
    fontawesome: string.isRequired,
    updateTitle: func,
    darkTheme: bool
};

SectionHeader.defaultProps = {
    title: `Campaigns`,
    updateTitle: null,
    darkTheme: false
};

export default SectionHeader;
