import React from 'react';

import Paper from '@material-ui/core/Paper';

const About = () => {
  return (
    <Paper className="about-holder">
      <div className="heading">
        <h1>About Us</h1>
        <h2>Fixing politics through friendly competition</h2>
      </div>
      <div className="text">
        <p>Its no secret that a healthy democracy relies on an informed citizenry. However, in the past 10 years (during which I’ve developed into the avid news consumer that I am today), I’ve grown frustrated by the increasing amount of misleading information and fact-free arguments that now dominate our political conversation, whether its on cable news or at the dinner table. People on both ends of the political spectrum have become dangerously misinformed, albeit increasingly firm in their beliefs. This is a problem.</p>

        <p>Ignorance is bred by a lack of exposure to information, especially that which challenges one’s beliefs. Without expanding the conversation and escaping our echo chambers, it is impossible for Americans of all backgrounds to have an honest debate with ideological opponents and better understand the political landscape as a whole.</p>

        <p>So, in an effort to mitigate partisan polarization and improve dialogue, I created this site as a platform for generating a common consensus of political realities through a friendly competition. I mean, everyone, regardless of political affiliation, loves a fun and informative game, right?</p>

        <p>If you agree, or simply want to spread the word about an easy way to win some money, invite your friends and foes alike to join politIQ!</p>
      </div>
    </Paper>
  );
}

export default About;