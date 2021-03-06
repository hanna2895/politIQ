import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import moment from "moment";
import * as routes from "../../constants/routes";

import loadingGif from "../../loadingGif.gif";

import Paper from "@material-ui/core/Paper";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TablePaginationActions from "./TablePaginationActions";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Close from "@material-ui/icons/Close";
import Modal from "@material-ui/core/Modal";
import "./quiz.css";
import bg from "../StaticPages/politiq-bg2.jpg";
import AuthUserContext from "../Auth/AuthUserContext";
import { db } from "../../firebase";

import QuizContext from "../context/quizContext";

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

class QuizArchiveBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateArray: [],
      titleArray: [],
      scoreObject: {},
      rowsPerPage: 10,
      page: 0,
      loading: true,
      selectedMonth: moment()
        .startOf("month")
        .format("YYYY-MM-DDTHH:mm"),
      modalOpen: false
    };
  }

  componentDidMount = () => {
    this.createMonthOptionsArray();
    // check for logged in user so that it can check if the user already ahas a score for that quiz
    if (this.props.authUser) {
      const userObject = this.props.authUser;
      const uid = userObject.uid;
      this.setState({
        signedInUser: uid
      });
    }
    this.setState({
      selectedMonth: moment()
        .startOf("month")
        .format("YYYY-MM-DDTHH:mm")
    });
    this.getQuizzesFromDb();
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      if (this.props.authUser) {
        this.setState({
          signedInUser: this.props.authUser.uid
        });

        // important for [last page, next page] macro.  Otherwise get quizzes runs twice also
        if (prevState !== this.state) this.getQuizzesFromDb();
      }
    }
  }

  createMonthOptionsArray = () => {
    let date = moment().format("YYYY-MM-DDTHH:mm");
    let monthsArray = [];
    // for every month that is greater than April 2019, push those values into an array
    while (date >= "2019-04-01T00:00") {
      monthsArray.push(
        moment(date)
          .startOf("month")
          .format("YYYY-MM-DDTHH:mm")
      );
      date = moment(date)
        .subtract(1, "month")
        .format("YYYY-MM-DDTHH:mm");
    }
    this.setState({
      monthsArray
    });
  };

  dateFilter = date => {
    if (
      this.state.selectedMonth ===
      moment()
        .startOf("month")
        .format("YYYY-MM-DDTHH:mm")
    ) {
      // dates that are less than the current date
      // dates that are greater than the start of the current month
      return (
        date < moment().format("YYYY-MM-DDTHH:mm") &&
        date >
        moment()
          .startOf("month")
          .format("YYYY-MM-DDTHH:mm")
      );
    } else {
      // dates that are greater than the start of the selected month
      // dates that are less than the end of the selected month
      return (
        date >
        moment(this.state.selectedMonth)
          .startOf("month")
          .format("YYYY-MM-DDTHH:mm") &&
        date <
        moment(this.state.selectedMonth)
          .add(1, "month")
          .format("YYYY-MM-DDTHH:mm")
      );
    }
  };

  // user should be able to select a month for a dropdown and then retrieve the quizzes for that month.
  // the default on page load will be the current month
  getQuizzesFromDb = async () => {

    let quizzes;
    // Context hasn't populated yet, (page reloaded), so get quizzes from database
    await db.getQuizzes().then(res => {
      quizzes = res.val();
    });
    // }
    const allDates = Object.keys(quizzes);

    const dateArray = allDates.filter(date => this.dateFilter(date));

    if (dateArray.length === 0) {
      this.setState({
        noQuizzes: true,
        loading: false,
        dateArray: [],
        titleArray: [],
        page: 0
      });
      return;
    }

    let titleArray = [];
    for (let i = 0; i < dateArray.length; i++) {
      let date = dateArray[i];
      const title = quizzes[date]["quiz-title"];
      titleArray.push(title);
    }
    this.setState({
      dateArray: dateArray.reverse(),
      titleArray: titleArray.reverse(),
      loading: false,
      page: 0
    });

    if (this.state.signedInUser) {
      this.getTheLoggedInUsersScores();
    }

    window.scrollTo(0, 0);
  };

  getTheLoggedInUsersScores = () => {
    console.log("getting user scores");
    const uid = this.state.signedInUser;
    if (uid === "") {
      return;
    }
    // the scores should already be in local storage so you don't have to make a db call here
    const scores = JSON.parse(localStorage.getItem("userScoreData")).data;

    if (scores === null) {
      return;
    }

    this.setState({
      scoreObject: scores
    });
  };

  handleClick = event => {
    const id = event.target.parentNode.id;
    this.props.history.push("/quiz/" + id);
  };

  handleArchiveClick = event => {
    const id = event.target.parentNode.id;
    this.props.history.push("/archived/" + id);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: event.target.value
    });
  };

  handleChangeMonth = month => {
    this.setState({
      selectedMonth: month
    });
    this.getQuizzesFromDb();
  };

  handleQuizClick = (event, score) => {
    const thisMonth = moment()
      .startOf("month")
      .format("YYYY-MM-DDTHH:mm");

    // if it's the current month and the score is zero, play quiz
    if (this.state.selectedMonth === thisMonth && score === "--") {
      this.handleClick(event);
      // if it's the preivous month and the score is zero, play quiz
    } else if (this.state.selectedMonth !== thisMonth && score === "--") {
      this.handleClick(event);
      // if it's the previous month and the score is not zero, view quiz
    } else if (this.state.selectedMonth !== thisMonth && score !== "--") {
      this.handleArchiveClick(event);
      // if it's the current month and the score is not zero, do nothing
    } else {
      this.setState({
        modalOpen: true
      });
      // return null;
    }
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };

  render() {
    const { dateArray, titleArray, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, dateArray.length - page * rowsPerPage);

    const List = dateArray
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((date, i) => {
        let newTitleArray = titleArray.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        );
        let id = date;
        let shortDate = date.slice(0, 10);
        let title = newTitleArray[i];
        let score;

        if (Object.keys(this.state.scoreObject).includes(date)) {
          score = this.state.scoreObject[date];
        } else {
          score = "--";
        }

        return (
          <TableRow
            id={date}
            key={id}
            className={score !== "--" ? "taken" : "tableItem"}
          >
            <TableCell
              onClick={event => {
                this.handleQuizClick(event, score);
              }}
            >
              {shortDate}
            </TableCell>
            <TableCell
              onClick={event => this.handleQuizClick(event, score)}
              padding="none"
            >
              {title}
            </TableCell>
            <TableCell
              onClick={event => this.handleQuizClick(event, score)}
              style={{ paddingLeft: "8vw" }}
            >
              {score}
            </TableCell>
          </TableRow>
        );
      });

    const isLoading = () => {
      if (this.state.loading === true) {
        return (
          <div className="gifStyle">
            <img src={loadingGif} alt="loading gif" />
          </div>
        );
      } else if (
        this.state.dateArray.length === 0 &&
        this.state.selectedMonth ===
        moment()
          .startOf("month")
          .format("YYYY-MM-DDTHH:mm")
      ) {
        return (
          <>
            <p>
              There are no quizzes available for this month yet! Check back
              later to play or select a previous month to take older quizzes and
              boost your politIQ.
            </p>
            <img
              src={bg}
              style={{ width: "60%", marginLeft: "auto", marginRight: "auto" }}
              alt="play politIQ"
            />
            <div className="viewOlder">
              <p className="olderDescription">
                View quizzes from previous months:{" "}
              </p>
              <Select
                native
                value={this.state.selectedMonth}
                onChange={event => this.handleChangeMonth(event.target.value)}
                style={{ height: "6vh" }}
                input={
                  <OutlinedInput
                    name="month"
                    fullWidth
                    id={"selectedMonth"}
                    style={{ height: "6vh" }}
                    labelWidth={0}
                  />
                }
              >
                {this.state.monthsArray &&
                  this.state.monthsArray.map((month, i) => (
                    <option value={month} key={month}>
                      {moment(month).format("MMMM")}
                    </option>
                  ))}
              </Select>
              <Button
                className="olderButton"
                variant="contained"
                color="primary"
                onClick={this.getQuizzesFromDb}
              >
                View
              </Button>
            </div>
          </>
        );
      } else {
        return (
          <div>
            <Table className="archive-table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: "66px" }} padding="default">
                    Quiz Date
                  </TableCell>
                  <TableCell style={{ minWidth: "85px" }} padding="none">
                    Quiz Title
                  </TableCell>
                  <TableCell style={{ minWidth: "40px" }} padding="default">
                    Your Score
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {List}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePaginationActions
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={3}
                    count={
                      dateArray.length === undefined ? 0 : dateArray.length
                    }
                    rowsPerPage={rowsPerPage}
                    page={page}
                    selectprops={{
                      native: true
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
            {Object.keys(this.state.scoreObject).length !==
              this.state.dateArray.length ? null : (
                <p className="archive-warning">
                  You have taken all of the available quizzes. Check back tomorrow
                  for the latest challenge!
                </p>
              )}
            <hr style={{ marginBottom: "5vh", marginTop: "3vh" }} />
            <div className="viewOlder">
              <p className="olderDescription">
                View quizzes from previous months:{" "}
              </p>
              <Select
                native
                value={this.state.selectedMonth}
                onChange={event => this.handleChangeMonth(event.target.value)}
                style={{ height: "6vh" }}
                input={
                  <OutlinedInput
                    name="month"
                    fullWidth
                    id={"selectedMonth"}
                    style={{ height: "6vh" }}
                    labelWidth={0}
                  />
                }
              >
                {this.state.monthsArray &&
                  this.state.monthsArray.map((month, i) => (
                    <option value={month} key={month}>
                      {moment(month).format("MMMM")}
                    </option>
                  ))}
              </Select>
              <Button
                className="olderButton"
                variant="contained"
                color="primary"
                onClick={this.getQuizzesFromDb}
              >
                View
              </Button>
            </div>
          </div>
        );
      }
    };

    return (
      <Paper className="home archive-holder">
        <Helmet>
          <title>Quiz Archive | politIQ trivia</title>
        </Helmet>
        <div className="archive-header">
          <Link to={routes.HOME} style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">
              Home
            </Button>
          </Link>
          <Link to={routes.LEADERBOARD} style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">
              Leaderboard
            </Button>
          </Link>
        </div>
        <div className="mobile-archive-header">
          <Link
            to={routes.HOME}
            style={{ textDecoration: "none" }}
            className="mobile-back"
          >
            <Button color="primary">Back</Button>
          </Link>
          <h1 style={{ display: "inline" }}>
            {moment(this.state.selectedMonth).format("MMMM")} Quizzes
          </h1>
          {moment().format("MMMM") !==
            moment(this.state.selectedMonth).format("MMMM") ? (
              <p id="archive-disclaimer">
                You may take past quizzes to boost your politIQ, but they will not
                affect your rankings for this month.
              </p>
            ) : null}
        </div>
        {isLoading()}
        <Modal
          aria-labelledby="Nice Try!"
          aria-describedby="You can't view ths quiz right now"
          open={this.state.modalOpen}
          onClose={this.toggleModal}
          className="archive-modal"
        >
          <Paper>
            <Close
              style={{ float: "right", padding: "1vh", display: "block" }}
              onClick={this.toggleModal}
            />
            <h3>Nice try!</h3>
            <p>
              You've already taken this quiz! We can't let you view it again
              while this month's contest is ongoing. You'll be able to review
              the quiz (and the correct answers!) next month!
            </p>
          </Paper>
        </Modal>
      </Paper>
    );
  }
}

//defined the context, which contains all the quizzes

const QuizArchive = ({ history }) => (
  <AuthUserContext.Consumer>
    {authUser => <QuizArchiveBase authUser={authUser} history={history} />}
  </AuthUserContext.Consumer>
);

export default withRouter(QuizArchive);
