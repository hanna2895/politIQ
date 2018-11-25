import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { db } from '../../firebase';
import * as routes from '../../constants/routes';

import loadingGif from '../../loadingGif.gif';

import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import './quiz.css';

class QuizArchive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateArray: [],
      titleArray: []
    }
  }

  componentDidMount = () => {
    this.getQuizzesFromDb();
  }

  getQuizzesFromDb = async () => {
    await db.getQuizzes()
      .then(response => {
        const data = response.val();
        const dateArray = Object.keys(data);
        let titleArray = [];
        for (let i = 0; i < dateArray.length; i++) {
          let date = dateArray[i]
          const title = data[date]["quiz-title"]
          titleArray.push(title)
        }
        this.setState({
          dateArray: dateArray,
          titleArray: titleArray,
        })
      })
  }

  handleClick = (event) => {
    const id = event.target.parentNode.id;
    this.props.history.push('/quiz/' + id)
  }

  render() {
    const List = this.state.dateArray.map((date, i) => {
      let id = date;
      let title = this.state.titleArray[i]
      return (
        <TableRow id={date} key={id} className="tableItem">
          <TableCell onClick={this.handleClick}>
            {date}
          </TableCell>
          <TableCell onClick={this.handleClick} padding="none">
            {title}
          </TableCell>
          <TableCell onClick={this.handleClick} style={{ paddingLeft: '8vw'}}>
            --
          </TableCell>
        </TableRow>
      )
    })



    const isLoading = () => {
      if (this.state.dateArray.length === 0) {
        return (
          <div className="gifStyle">
            <img src={loadingGif} alt="loading gif"/>
          </div>
        )
      } else {
        return (
          <Table className="archive-table">
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: '66px'}} padding="default">
                  Quiz Date
                </TableCell>
                <TableCell style={{ minWidth: '85px'}} padding="none">
                  Quiz Title
                </TableCell>
                <TableCell style={{ minWidth: '40px'}} padding="default">
                  Your Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {List}
            </TableBody>
          </Table>
        )
      }
    }
    return (
      <Paper className="home archive-holder">
        <Helmet>
          <title>Quiz Archive | politIQ</title>
        </Helmet>
        <div className="archive-header">
          <Link to={routes.HOME} style={{ textDecoration: 'none' }}><Button variant="contained" color="primary">Home</Button></Link>
          <Link to={routes.LEADERBOARD} style={{ textDecoration: 'none' }}><Button variant="contained" color="primary">Leaderboard</Button></Link>
        </div>
        <div className="mobile-archive-header">
          <Link to={routes.HOME} style={{ textDecoration: 'none'}} className="mobile-back"><Button color="primary">Back</Button></Link>
          <h1 style={{ display: 'inline'}}>Past Quizzes</h1>
        </div>
        {isLoading()}
      </Paper>
    )
  }
}


export default withRouter(QuizArchive);