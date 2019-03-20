import moment from 'moment';
import { db } from '../firebase';

let scoreData;

const getMostRecentQuizId = async () => {
    if (localStorage.hasOwnProperty('authUser')) {
        const uid = JSON.parse(localStorage.authUser).uid
        db.getScoresByUid(uid)
            .then(response => {
                scoreData = response.val()
            })
            const reply = await getMostRecentQuizIdForUser(scoreData)
            return reply;
    } else {
        const response = await getMostRecentQuizIdForUser()
        return response;
    }

}

const getMostRecentQuizIdForUser = async () => {
    const quizId = await db.getQuizzes()
        .then(response => {
            const data = response.val();
            const allDates = Object.keys(data);
            const dateArray = allDates.filter(date => date < moment().format('YYYY-MM-DDTHH:mm'))
            let counter = 1;
            let mostRecent = dateArray[dateArray.length-counter]
            if (scoreData) {
                while(scoreData[mostRecent && counter < dateArray.length]) {
                    counter++;
                    mostRecent = dateArray[dateArray.length-counter]
                    if (scoreData[mostRecent === undefined]) {
                        console.log('this is breaking')
                        break;
                    }
                }
                if (counter === dateArray.length && Object.keys(scoreData).indexOf(mostRecent) !== -1) {
                    const id = "No Available Quizzes";
                    return id;
                } else {
                    const id = "quiz/" + mostRecent;
                    return id;
                }
            } else {
                const id = "quiz/" + mostRecent;
                return id;
            }
        })
    return quizId;
}

export default getMostRecentQuizId;