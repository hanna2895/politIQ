import React, { Component } from 'react';
import moment from 'moment';

import { db } from '../../firebase';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import loadingGif from '../../loadingGif.gif';
import './leaderboard.css';

class WeeklyLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      rankedScores: {},
    }
  }

  componentDidMount = () => {
    this.weeklyLeaders();
  }

  weeklyLeaders = async () => {
    const userScores = []
    await db.getScores()
      .then(response => {
        const data = response.val()
        const usernames = Object.keys(data)
        usernames.forEach((user, i) => {
          db.getDisplayNames(usernames[i])
            .then(response => {
              // get all the scores within the last week from this data array
              const quizDates = Object.keys(data[usernames[i]])
              const lastWeek = []
              let scoreCounter = 0;
              for (let j = 0; j < quizDates.length; j++) {
                if (quizDates[j] > moment().startOf('week').format('YYYY-MM-DD')) {
                  lastWeek.push(quizDates[j])
                  if (data[usernames[i]][quizDates[j]]) {
                    scoreCounter += data[usernames[i]][quizDates[j]]
                  }
                }
              }
              userScores.push({
                username: response.val().displayName,
                score: scoreCounter,
              })
              const rankedScores = userScores.sort(function(a,b){
                return a.score - b.score
              })
              const rankReverse = rankedScores.reverse()
              this.setState({
                rankedScores: rankReverse,
                isLoaded: true,
              })
            })
        })
      })
  }

  render() {
    let rankingArray = [];
    if (Array.isArray(this.state.rankedScores)) {
      const ranking = this.state.rankedScores;
      const result = ranking.map((stat, i) => {
        return [stat.username, stat.score]
      });
      rankingArray = [...result]
    }

    const renderWeeklyLeaders = rankingArray.map((stat, i) => {
      return (
        <TableRow key={i}>
          <TableCell style={{ width: '30px'}} padding="default">
            {i + 1}.
          </TableCell>
          <TableCell style={{ width: '50px'}} padding="none">
            {stat[0]}
          </TableCell>
          <TableCell>
            {stat[1]}
          </TableCell>
        </TableRow>
      )
    })

    const isLoading = () => {
      if (!this.state.isLoaded) {
        return (
          <img src={loadingGif} alt="loadingGif" className="leaderboard-mobile-loading"/>
        )
      } else {
        return (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: '30px'}} padding="default">
                  Ranking
                </TableCell>
                <TableCell style={{ minWidth: '50px' }} padding="none">
                  User
                </TableCell>
                <TableCell style={{ minWidth: '30px'}} padding="default">
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderWeeklyLeaders}
            </TableBody>
          </Table>
        )
      }
    }

    return (
      <div>
        {isLoading()}
      </div>
    )
  }
}

export default WeeklyLeaderboard;
