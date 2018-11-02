import React, {Component, Fragment} from 'react';
import {string, number, func, bool, arrayOf, any} from 'prop-types';
import './index.css';
import SmartPeople from './SmartPeople';
import SmartLabel from './SmartLabel';

class SmartInputButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popOpen: false,
            selected: this.props.selected,
            suggestions: this.props.suggestions,
            value: this.props.value
        };
    }

    componentDidMount() {
        window.addEventListener(`click`, this.handleClose);
        const {selected, suggestionGenerator} = this.props;
        suggestionGenerator(selected, suggestions => this.setState({suggestions}));
    }

    componentDidUpdate() {
        const {clear, update, suggestions, selected} = this.props;
        if (clear) this.setState({popOpen: false, selected: [], suggestions, value: ``});
        if (update) this.setState({suggestions: suggestions.filter(suggestion => !selected.find(s => s._id === suggestion._id))});
    }

    componentWillUnmount() {
        window.removeEventListener(`click`, this.handleClose);
    }

    handleClose = ({target}) => {
        if (
            (this.smart_input_pop &&
                this.smart_input_wrapper &&
                (!this.smart_input_pop.contains(target) && !this.smart_input_wrapper.contains(target))) ||
            target === this.smart_input_wrapper
        )
            this.unPop();
    };

    onChange = ({target: {value}}) => {
        const {generator} = this.props;
        const {selected} = this.state;
        generator(value, selected, suggestions => {
            if (suggestions.length === 0 && (value === `` || value === ` ` || !value))
                suggestions = this.props.suggestions.filter(suggestion => !selected.find(s => s._id === suggestion._id));
            this.setState({suggestions});
        });
        this.setState({value});
    };

    handleKeyPress = e => e.key === `Enter` && this.props.onEnter();

    unPop = () => {
        this.setState({popOpen: false});
    };

    togglePop = () => {
        const {popOpen} = this.state;
        this.setState({popOpen: !popOpen});
    };

    generateLabel() {
        const {type} = this.props;
        switch (type) {
            case `people`:
                return <i className="unselectable fas fa-user-plus" />;
            default:
                return <i className="unselectable fas fa-user-plus" />;
        }
    }

    addAssignee = person => {
        const {onUpdate, suggestionGenerator} = this.props;
        const {selected} = this.state;
        const newSelected = !selected.find(p => p._id === person._id) ? [...selected, person] : selected;

        suggestionGenerator(newSelected, suggestions => {
            this.setState(
                {
                    selected: newSelected,
                    suggestions
                },
                () => onUpdate(newSelected)
            );
        });
    };

    removeAssignee = id => {
        const {onUpdate, suggestionGenerator} = this.props;
        const {selected} = this.state;
        const newSelected = selected.filter(person => person._id !== id);
        suggestionGenerator(newSelected, suggestions => {
            this.setState(
                {
                    selected: newSelected,
                    suggestions
                },
                () => onUpdate(newSelected)
            );
        });
    };

    smartGenerateLabel = () => {
        const {title, labelCount, darkTheme} = this.props;
        const {selected} = this.state;
        if (selected.length === 1) {
            return (
                <Fragment>
                    <div className="smart-input-label" onClick={this.togglePop} title={title}>
                        {this.generateLabel()}
                    </div>
                    <div className="smart-labels">
                        {selected.map(user => (
                            <SmartLabel darkTheme={darkTheme} key={user._id} name={user.name} picture={user.picture} />
                        ))}
                    </div>
                </Fragment>
            );
        } else if (selected.length > 1 && selected.length <= labelCount) {
            return (
                <Fragment>
                    <div className="smart-input-label" onClick={this.togglePop} title={title}>
                        {this.generateLabel()}
                    </div>
                    <div className="smart-labels">
                        {selected.map(user => (
                            <SmartLabel darkTheme={darkTheme} hideText key={user._id} name={user.name} picture={user.picture} />
                        ))}
                    </div>
                </Fragment>
            );
        } else if (selected.length > labelCount) {
            const selected_to_show = selected.slice(0, labelCount);
            const selected_count_not_shown = selected.length - selected_to_show.length;
            return (
                <Fragment>
                    <div className="smart-input-label" onClick={this.togglePop} title={title}>
                        {this.generateLabel()}
                    </div>
                    <div className="smart-labels">
                        {selected_to_show.map(user => (
                            <SmartLabel darkTheme={darkTheme} hideText key={user._id} name={user.name} picture={user.picture} />
                        ))}
                        <li className="smart-label-item-wrapper flex-center">
                            <div className="label-image unselectable">
                                <p>+{selected_count_not_shown}</p>
                            </div>
                        </li>
                    </div>
                </Fragment>
            );
        } else {
            return (
                <div className="smart-input-label" onClick={this.togglePop} title={title}>
                    {this.generateLabel()}
                    <p className="unselectable">{title}</p>
                </div>
            );
        }
    };

    render() {
        const {showError, name, placeholder, className, darkTheme} = this.props;
        const {popOpen, value, suggestions, selected} = this.state;

        return (
            <div className={`smart-input-wrapper ${className}`} ref={node => (this.smart_input_wrapper = node)}>
                <div className="smart-label-wrapper">{this.smartGenerateLabel()}</div>
                {popOpen ? (
                    <div
                        className={`smart-input-pop animate-pop ${darkTheme ? `dark-theme` : ``}`}
                        ref={node => (this.smart_input_pop = node)}>
                        <input
                            autoComplete="off"
                            className={`${darkTheme ? `dark-theme-light-bg` : ``} ${
                                showError ? `form-input error-input` : `form-input`
                            }`}
                            name={name}
                            onChange={this.onChange}
                            onKeyPress={this.handleKeyPress}
                            placeholder={placeholder}
                            spellCheck="off"
                            type="text"
                            value={value}
                        />

                        <div className="smart-suggestions" ref={node => (this.smart_input_pop_suggestions = node)}>
                            {suggestions.length > 0 && <div className="smart-suggestions-title">Suggested</div>}
                            <div className="smart-suggestions-people">
                                <ul>
                                    {suggestions.map(suggestion => (
                                        <SmartPeople
                                            addAssignee={this.addAssignee}
                                            darkTheme={darkTheme}
                                            key={suggestion._id}
                                            person={suggestion}
                                            picture={suggestion.picture}
                                        />
                                    ))}
                                </ul>
                            </div>
                            {selected.length > 0 && <div className="smart-suggestions-title">Assigned</div>}
                            <div className="smart-suggestions-people-selected">
                                <ul>
                                    {selected.map(suggestion => (
                                        <SmartPeople
                                            darkTheme={darkTheme}
                                            key={suggestion._id}
                                            person={suggestion}
                                            picture={suggestion.picture}
                                            removable
                                            removeAssignee={this.removeAssignee}
                                        />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

SmartInputButton.propTypes = {
    clear: bool,
    update: bool,
    title: string.isRequired,
    placeholder: string,
    type: string,
    name: string,
    showError: bool,
    value: string,
    onEnter: func,
    generator: func,
    suggestionGenerator: func,
    onUpdate: func,
    suggestions: arrayOf(any),
    labelCount: number,
    className: string,
    darkTheme: bool,
    selected: arrayOf(any)
};

SmartInputButton.defaultProps = {
    clear: false,
    update: false,
    placeholder: ``,
    type: `text`,
    name: `people`,
    value: ``,
    showError: false,
    onEnter: () => false,
    onUpdate: () => false,
    generator: () => [],
    suggestionGenerator: () => [],
    suggestions: [],
    labelCount: 3,
    className: ``,
    darkTheme: false,
    selected: []
};

export default SmartInputButton;
