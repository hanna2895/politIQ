import React from 'react';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import bg from './politIQ-bg.png';

import './Static.css';

const LandingPage = () =>
  <Paper className="home-holder">
    <h1 id="main">WELCOME TO POLIT<span id="iq">IQ</span></h1>
    <h2>WHERE YOU CAN ANSWER THE QUESTION: ARE YOU SMARTER THAN A <span id="rep">REPUBLICAN? </span><span id="dem">DEMOCRAT? </span><span id="ind">INDEPENDENT?</span></h2>

    <img src={bg} id="bg-image" alt="democrats and republicans face off"/>

    <Link to="/signup" style={{ textDecoration: 'none' }}><Button size="large" variant="contained" color="secondary" className="home-button" style={{ textTransform: 'none', fontSize: '20px', fontWeight: '300', letterSpacing: '0.5px'}}>Sign Up and Find Out</Button></Link>

    <div className="home-description">
      <h4> INTERESTED IN POLITICS AND CONSTANTLY CONSUMED BY THE NEWS?</h4>
      <p>Test your understanding of today’s political climate by answering as many questions as you can on a variety of topics related to national politics and global affairs. Then compare your score, or political IQ, with others to prove that you and your political party are the most informed.</p>
    </div>

    <div className="how-it-works">
      <h2>HOW <span id="it-works">IT WORKS</span></h2>
      <div className="icon-holder">
        <div className="icon-div">
          <i className="fas fa-user icon"></i>
          <h6>Create a Free Profile</h6>
          <p>Sign up and create your user profile, it’s very easy.</p>
        </div>
        <div className="icon-div">
          <i className="fas fa-pen-square icon"></i>
          <h6>Start Playing</h6>
          <p>Answer on your own time. New questions added daily and never expire.</p>
        </div>
        <div className="icon-div">
          <i className="fas fa-clipboard icon"></i>
          <h6>Increase Score</h6>
          <p><span style={{ fontWeight: 'bold' }}>1 point</span> for correct answers, <span style={{ fontWeight: 'bold' }}>0 points</span> for incorrect answers.</p>
        </div>
        <div className="icon-div">
          <i className="fas fa-gift icon"></i>
          <h6>Get Awarded</h6>
          <p>Players with highest scores eligible to compete in challenge for cash prize!</p>
        </div>
      </div>

      <Link to="/signup" style={{ textDecoration: 'none' }}><Button size="large" variant="contained" color="secondary" className="home-button" style={{ textTransform: 'none', fontSize: '20px', fontWeight: '300', letterSpacing: '0.5px'}}>Sign Up and Find Out</Button></Link>


    </div>

    <div className="home-description2">
      <h4>THINK <span style={{ color: "#a54ee8"}}>ITS BIASED?</span> CONTEST A QUESTION OR ADD ONE OF YOUR OWN AND WIN POINTS</h4>
      <p>If you believe the answer to a question is incorrect, then submit your argument (with a valid source) and you will receive an additional <span style={{ fontWeight: 'bold' }}>5 points</span> and the question will be fixed. If you wish to submit your own question to be included on the site, you can receive an additional <span style={{ fontWeight: 'bold' }}>3 points</span> (depending upon approval of its content and validity). All are welcome to contribute!</p>
    </div>

  </Paper>

export default LandingPage;