import React from "react";
import PropTypes from "prop-types";
import ReactComponent from "apparena-patterns-react/_patterns/react-utils/component";
import Button from "apparena-patterns-react/_patterns/00-atoms/button/button";
import styles from "./button.scss";
import cx from "classnames";

export default class SurveyAnswerButton extends ReactComponent {
    static propTypes = {
        answerText: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        showResults: PropTypes.bool.isRequired,
        answerCount: PropTypes.number.isRequired,
        highestAnswerCount: PropTypes.number.isRequired,
        highlight: PropTypes.bool,
    };

    static defaultProps = {
        highlight: false,
    };

    getInitState() {
        return {
            resultsWidth: 0
        };
    }

    /**
     * Resize the result bar to fit within the button and be proportional to all votes.
     */
    resizeResult() {
        if (this.props.showResults === true && this.state.resultsWidth === 0) {
            setTimeout(() => {
                this.setState({
                    resultsWidth: (this.props.answerCount / this.props.highestAnswerCount) * 100,
                });
            }, 20);
        }
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        this.resizeResult();
    }

    componentDidMount() {
        this.resizeResult();
    }

    /**
     * It doesn't make sense to render buttons when the results should be shown. Thus the result bars consist of
     * pure divs. This allows for more flexible designs.
     */
    renderResults() {
        return (
            <div className={cx(styles.resultBackgroundBar, this.props.highlight && styles.resultHighlight)}>
                <span className={styles.resultNumber}>
                    {this.props.answerText}: {this.props.answerCount}
                </span>
                <div className={styles.resultBar} style={{width: `${this.state.resultsWidth}%`}} />
            </div>
        );
    }

    render() {
        return (
            <div className={styles.relative}>
                {this.props.showResults === false ? (
                    <Button
                        className={styles.button}
                        onClick={this.props.onClick}
                    >
                        {this.props.answerText}
                    </Button>
                ) : this.renderResults()}
            </div>
        );
    }
}