import React from "react";
import * as logActions from "../actions/log";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import ReactComponent from "apparena-patterns-react/_patterns/react-utils/component";
import styles from '../components/index.scss';
import AnswerButton from "../components/button";
import Branding from '../components/branding'

class HomeContainer extends ReactComponent {
  /**
   * Prepare the initial state for the widget.
   */
  getInitState() {
    this.onClose = ::this.onClose;
    return {
      data: {},
      showResults: false,
      votedAnswer: 0,
      buttons: [],
    };
  }

  componentDidMount() {
    this.props.page();
  }

  /**
   * Callback which persists a vote in the dynamo DB and transitions the widget from the voting screen
   * to the results page or the thank you page.
   * @param index int Index of the answer (1 through 4)
   * @param event SyntheticEvent The event that was fired by React
   */
  onAnswer(index, event) {
    this.props.addVote(index);

    this.setState({
      showResults: true,
      votedAnswer: index,
    });
  }

  /**
   * Prepares the data needed by the buttons and generates them.
   * Generated buttons are written into the current state.
   **/
  renderButton() {
    const props = this.props;
    const {config} = props;
    const highestAnswerCount = Object.keys(props).filter((prop) => {
      return prop.includes('Votes');
    }).reduce((prop, next) => {
      return Math.max(prop, props[next]);
    }, 0);

    return [1, 2, 3, 4].map((i) => {
      if (config[`answer_${i}_text`]) {
        return (
          <AnswerButton
            answerText={config[`answer_${i}_text`]}
            showResults={props.hasVoted || this.state.showResults}
            answerCount={props[`answer${i}Votes`]}
            highestAnswerCount={highestAnswerCount}
            highlight={props.votedAnswer === i || this.state.votedAnswer === i}
            key={i}
            onClick={this.onAnswer.bind(this, i)}
          />
        );
      } else {
        return null;
      }
    });
  }

  /**
   * Create a nice-looking animation when the user decides to close the widget.
   */
  onClose() {
    this._widget.style.opacity = 0;

    // Let the CSS transition play first then remove the DOM node
    setTimeout(() => {
      document.getElementById('root').remove();
    }, 510);
  }

  renderView() {
    if (this.state.showResults && this.props.config.final_page_select === 'thanks') {
      return (
        <div>
          <h2>{this.props.config.thankyou_page_content}</h2>
        </div>
      );
    }
    return this.renderButton();
  }

  /**
   * Brings the widget together and displays it in the frontend.
   */
  render() {
    const {config} = this.props;
    return (
      <div
        className={styles.widget}
        ref={(r) => {this._widget = r}}
      >
        <div
          className={styles.inner}
        >
          <span className={styles.closeButton} onClick={this.onClose}>x</span>
          <div className={styles.widgetContainer}>
            <h3>{config.survey_prompt}</h3>
            {this.renderView()}
          </div>
        </div>
        <Branding/>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    config: state.config,
    appId: state.appId,
    hasVoted: state.hasVoted,
    votedAnswer: state.votedAnswer,
  }),
  (dispatch) => ({
    ...bindActionCreators(logActions, dispatch)
  })
)(HomeContainer);
