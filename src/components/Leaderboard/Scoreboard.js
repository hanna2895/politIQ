import React, { Component } from 'react';
import { db } from '../../firebase';
import moment from 'moment';
import './leaderboard.css';

class Scoreboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Democrat: 0,
      Republican: 0,
      Independent: 0,
    }
  }

  componentDidMount = () => {
    this.getScores()
  }

  getScores = async () => {
    await db.getScores()
      .then(response => {
        const data = response.val()
        this.getDemScores(data, 'Democrat')
        this.getDemScores(data, 'Republican')
        this.getDemScores(data, 'Independent')
      })
  }

  getDemScores = async (data, affiliation) => {
    const userScores = []
    await db.getUserByAffiliation(affiliation)
      .then(usernames => {
        usernames.forEach((user, i) => {
          const dateObject = data[usernames[i]]
          let quizDates = []
          let submitted = []
          if (dateObject !== undefined) {
            quizDates = Object.keys(dateObject)
            // submitted scores don't get counted in the original monthly score
            if (quizDates[quizDates.length -1] === 'submitted') {
              submitted = dateObject["submitted"]
              quizDates.pop()
            }
            if (quizDates[quizDates.length -1] === 'contested') {
              submitted = dateObject["contested"]
              quizDates.pop()
            }
          }
          let scoreCounter = 0;
          for (let j = 0; j < quizDates.length; j++) {
            if (quizDates[j] > moment().startOf('month').format('YYYY-MM-DD')) {
              if (data[usernames[i]][quizDates[j]]) {
                scoreCounter += data[usernames[i]][quizDates[j]]
              }
            }
          }
          // getting the submitted scores from the last month and adding them to the total user score
          if (submitted !== []) {
            const dates = Object.keys(submitted)
            for (let j = 0; j < dates.length; j++) {
              if (dates[j].slice(10) > moment().startOf('month').format('YYYY-MM-DD')) {
                scoreCounter += 1
              }
            }
          }
          userScores.push(scoreCounter)
        })
        const totalScore = userScores.reduce((a, b) => a + b, 0);
        this.setState({
          [affiliation]: totalScore
        })
      })
  }

  render() {
    return (
      <div className="scoreboardHolder">
        <h2>{moment().format('MMMM')} Scoreboard</h2>
        <div className="scoreboard">
          <div id="demScore">Democrats<br/> <span className="score">{this.state.Democrat}</span></div>
          <div id="repScore">Republicans<br/> <span className="score">{this.state.Republican}</span></div>
          <div id="indScore">Independents<br/> <span className="score">{this.state.Independent}</span></div>
        </div>
      </div>
    )
  }
}

export default Scoreboard;
