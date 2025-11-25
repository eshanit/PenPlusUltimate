import type ISession from "~/interfaces/ISession";
import type IFinalEvaluation from "~/interfaces/IFinalEvaluation";
import type IEvalScore from "~/interfaces/IEvalScore";

export function useImprovementsPerTool(toolsEvals: IFinalEvaluation[]) {

    const improvements = ref<{ tool: string; mentee: string; improvement: boolean | string }[]>([]);

    toolsEvals.forEach((evaluation: IFinalEvaluation) => {
        const tool = evaluation.tool;
        const menteeFullName = `${evaluation.mentee.firstname} ${evaluation.mentee.lastname}`;
        const sessions = evaluation.sessions;

        // Check if the tool is 'echo'
        if (tool === 'echo') {
            return; // Skip for 'echo'
        }

        // Calculate mean scores for sessions
        const sessionScores: { [key: string]: number } = {};
        let sessionCount = 0;

        for (const [sessionKey, session] of Object.entries(sessions)) {
            if (session && session.evalItemScores) {
                const scores = session.evalItemScores.map((item: IEvalScore) => parseFloat(item.score));
                const meanScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;

                sessionScores[sessionKey] = meanScore;
                sessionCount++;
            }
        }

        // Compare scores based on session count
        if (sessionCount < 2) {
            improvements.value.push({ tool, mentee: menteeFullName, improvement: '-' });
        } else {
            const lastSessionKey = `session_${sessionCount}`;
            const prevSessionKey = `session_${sessionCount - 1}`;
            const lastScore = sessionScores[lastSessionKey];
            const prevScore = sessionScores[prevSessionKey];

            if (lastScore === 3 && prevScore === 3) {
                improvements.value.push({ tool, mentee: menteeFullName, improvement: 'Max Score' });
            } else {
                improvements.value.push({ tool, mentee: menteeFullName, improvement: lastScore > prevScore });
            }
        }
    });

    return improvements.value;
}