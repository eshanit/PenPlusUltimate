export function useFacilityMeans(completedEvals: any, facility: string) {

    const allEvaluations = completedEvals.filter((el: any) => {
        return (el.mentee.facility == facility)
    })
    let allScores = [];
    allScores = allEvaluations.map((el: any) => {
        return el.sessions
    })

    let allSessions = [];
    allSessions = allScores.map((el: any) => {
        return [
            el.session_1?.evalItemScores,
            el.session_2?.evalItemScores,
            el.session_3?.evalItemScores,
            el.session_4?.evalItemScores,
            el.session_5?.evalItemScores
        ].flat(2).filter(item => item != null)
    })

    // Flatten the array and map scores to numbers
    const flattenedScores = allSessions.flat().map((item: any) => parseFloat(item.score));

    // Calculate the sum and count of scores
    const totalScore = flattenedScores.reduce((sum: any, score: any) => sum + score, 0);
    const count = flattenedScores.length;

    // Calculate the mean score
    const meanScore = count > 0 ? (totalScore / count).toFixed(2) : "0.00";

    return meanScore

}