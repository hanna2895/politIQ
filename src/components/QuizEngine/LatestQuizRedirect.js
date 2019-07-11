import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import getMostRecentQuizId from '../../utils/mostRecentQuizId';
import LoadingGif from '../../loadingGif.gif';

class LatestQuizRedirect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latest: ""
        }
    }

    componentDidMount() {
        this.getMostRecent()
    }
    
    getMostRecent = async () => {
        await getMostRecentQuizId()
            .then(response => {
                this.setState({
                    latest: response,
                })
            })
    }

    render () {
        return (
            <>
                {this.state.latest === "" 
                    ? <img src={LoadingGif} alt="loading" style={{ marginTop: '30vh', marginBottom: '30vh' }}/>
                    : <Redirect to={this.state.latest} />
                }
            </>
        )
    }
}

export default LatestQuizRedirect;