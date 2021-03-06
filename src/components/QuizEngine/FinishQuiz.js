import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton
} from "react-share";

import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon
} from "react-share";

import {
  QUIZ_ARCHIVE,
  LEADERBOARD,
  SIGN_UP,
  SUBMIT_QUESTION
} from "../../constants/routes";
import NextAvailableQuizButton from "./NextAvailableQuizButton";
import { trackEvent } from "../../utils/googleAnalytics";

// change this back into stateless component

const getHref = () => {
  return window.location.href.toString();
};

class FinishQuiz extends Component {
  componentDidMount() {
    trackEvent("Quizzes", "Quiz Completed", "QUIZ_COMPLETE");
  }
  shouldComponentUpdate(nextProps) {
    if (nextProps === this.props) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { uid, score, toggleContest } = this.props;
    let quizLength = 5;

    const scoreDisplay =
      <center style={{ marginTop: "2vh", marginBottom: "2vh", color: "rgb(239, 188, 77)", fontWeight: "bold" }}>
        Your score: {score} out of {quizLength} points.
      </center>
    if (uid !== "") {
      return (
        <div className="finish-quiz">
          {scoreDisplay}
          <div className="finish-quiz-buttons">
            <NextAvailableQuizButton
              renderNextQuiz={this.props.renderNextQuiz}
              date={this.props.date}
              uid={uid}
            />
            <Link to={QUIZ_ARCHIVE} style={{ textDecoration: "none" }}>
              <Button
                color="primary"
                variant="contained"
                className="end-button"
              >
                See Previous Quizzes
              </Button>
            </Link>
            <Link to={LEADERBOARD} style={{ textDecoration: "none" }}>
              <Button
                color="primary"
                variant="contained"
                className="end-button"
              >
                View Leaderboard
              </Button>
            </Link>
            <Button
              color="primary"
              variant="contained"
              onClick={toggleContest}
              disabled={Object.keys(this.props.quiz).length === 0 && this.props.quiz.constructor === Object}
              className="end-button"
            >
              Contest a Question
            </Button>
            <Link to={SUBMIT_QUESTION} style={{ textDecoration: "none" }}>
              <Button
                color="primary"
                variant="contained"
                className="end-button"
              >
                Submit Your Own Question
              </Button>{" "}
            </Link>
          </div>
          {/* <MediaQuery maxWidth={415}> */}
          <h3 style={{ textAlign: "center", marginTop: "2vh" }}>
            Share Your Score:
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "2vh",
              width: "70%",
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "200px"
            }}
          >
            <FacebookShareButton
              url={getHref()}
              className="shareable"
              quote={`I scored ${score} out of ${quizLength} points on today's quiz! Click here to see how you rank up!`}
            >
              <FacebookIcon round={true} size={32} />
            </FacebookShareButton>
            <LinkedinShareButton
              url={getHref()}
              className="shareable"
              title="Can you beat my score?"
              description={`I got ${score} out of ${quizLength} points on today's quiz. Click here to see how you rank up!`}
            >
              <LinkedinIcon round={true} size={32} />
            </LinkedinShareButton>
            <TwitterShareButton
              url={getHref()}
              title="Can you beat my score?"
              className="shareable"
            >
              <TwitterIcon round={true} size={32} />
            </TwitterShareButton>
            <WhatsappShareButton
              url={getHref()}
              className="shareable"
              title="Can you beat my score?"
            >
              <WhatsappIcon round={true} size={32} />
            </WhatsappShareButton>
            <EmailShareButton
              url={getHref()}
              className="shareable"
              subject="Can you beat my score?"
              body={`I scored ${score} out of ${quizLength} points on today's quiz. Click here to see how you rank up!`}
            >
              <EmailIcon round={true} size={32} />
            </EmailShareButton>
          </div>
          {/* </MediaQuery> */}
        </div>
      );
    } else {
      return (
        <div className="finish-quiz">
          {scoreDisplay}
          <div style={{ width: "50%", textAlign: "center" }} className="finish-quiz-buttons">
            <Link to={SIGN_UP} style={{ fontSize: "2em", textDecoration: "none" }}>
              <Button
                style={{ fontSize: "20px" }}
                color="primary"
                variant="contained"
              >
                Sign up to save score - it's free and easy!
              </Button>
            </Link>
            <span style={{ fontSize: "1.4em", margin: "0.6em", fontWeight: "bolder", color: "black" }}>Must have a profile in order to:</span>

            <span style={{ fontSize: "1.3em", margin: "0.5em", fontWeight: "bolder", color: "#7D3EAD" }}>-win regular cash prizes</span>
            <span style={{ fontSize: "1.3em", margin: "0.5em", fontWeight: "bolder", color: "#7D3EAD" }}>-submit or contest questions</span>
            <span style={{ fontSize: "1.3em", margin: "0.5em", fontWeight: "bolder", color: "#7D3EAD" }}>-view updated leaderboard</span>
            <span style={{ fontSize: "1.3em", margin: "0.5em", fontWeight: "bolder", color: "#7D3EAD" }}>-access old quizzes</span>
          </div>
        </div>
      );
    }
  }
}

export default FinishQuiz;
