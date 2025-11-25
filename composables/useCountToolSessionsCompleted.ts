
export function useCountToolSessionsCompleted(tool: string, evaluationStats: any ) {

    const allCompleted = evaluationStats.completedEvaluations.filter((el: any) => {
        return el.tool == tool
    })

    const fourCompleted = evaluationStats.completed4Evals.filter((el: any) => {
        return el.tool == tool
    })

    const threeCompleted = evaluationStats.completed3Evals.filter((el: any) => {
        return el.tool == tool
    })

    const twoCompleted = evaluationStats.completed2Evals.filter((el: any) => {
        return el.tool == tool
    })

    const oneCompleted = evaluationStats.completed1Evals.filter((el: any) => {
        return el.tool == tool
    })

    return {
        //evaluations
        allCompletedCount: allCompleted.length,
        fourCompleted: fourCompleted.length,
        threeCompleted: threeCompleted.length,
        twoCompletedCount: twoCompleted.length,
        oneCompletedCount: oneCompleted.length,
        totalCompletedCount: oneCompleted.length + twoCompleted.length + threeCompleted.length + fourCompleted.length + allCompleted.length,
        //sessions
        totalCompletedSessions: oneCompleted.length + (2*twoCompleted.length) + (3*threeCompleted.length) + (4*fourCompleted.length) + (5*allCompleted.length)
    }
}