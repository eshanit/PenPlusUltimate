import { format } from 'date-fns';

interface Evaluation {
    evaluationID: string;
    searchIndex: string;
    evaluator: {
        id: string;
        firstname: string;
        lastname: string;
        username: string;
        searchIndex: string;
    };
    mentee: {
        firstname: string;
        lastname: string;
        gender: string;
        facility: string;
        district: string;
        profession: string;
        _id: string;
        _rev: string;
    };
    tool: string;
    sessions: {
        [key: string]: {
            evalDate: number;
            evalItemScores: { name: string; score: string }[];
            cardiacEval?: any;
        } | null;
    };
    _id: string;
    _rev: string;
}

export function useDownloadEvaluations(evaluations: Evaluation[]) {

        console.log(evaluations.length)
        const headers = [
            "Mentee Name", 
            "Mentee Surname", 
            "Gender", 
            "Profession", 
            "District", 
            "Facility", 
            "Evaluator Name", 
            "Eval Date", 
            "Tool",
            "Session", 
            "Code", 
            "Score"
        ];

        const rows = evaluations.flatMap(evaluation => {
            const mentee = evaluation.mentee;
            const evaluator = evaluation.evaluator;
            const sessions = evaluation.sessions;
            const tool = evaluation.tool;

            return Object.entries(sessions).flatMap(([sessionKey, session]) => {
                if (!session || tool == 'echo') return [];

                const evalDate = format(new Date(session.evalDate), 'dd-MM-yyyy');
                return session.evalItemScores.map(scoreItem => [
                    mentee.firstname,
                    mentee.lastname,
                    mentee.gender,
                    mentee.profession,
                    mentee.district,
                    mentee.facility,
                    `${evaluator.firstname} ${evaluator.lastname}`,
                    evalDate,
                    tool,
                    sessionKey,
                    scoreItem.name,
                    scoreItem.score
                ]);
            });
        });

        const csvContent = [
            headers.join(','), // Header row
            ...rows.map(row => row.join(',')) // Data rows
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'evaluations.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
}