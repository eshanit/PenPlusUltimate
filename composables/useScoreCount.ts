import type IEvalScore from "@/interfaces/IEvalScore";

export interface ScoreCount {
    one: number;
    two: number;
    three: number;
    four: number;
    five: number;
}

export function useScoreCount(data: any[]): ScoreCount {
    // Initialize with zeros
    const scoreCount: ScoreCount = {
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0
    };

    if (!data || !Array.isArray(data)) {
        return scoreCount;
    }

    // Count the scores
    data.forEach(item => {
        let score: any;
        
        // Handle different possible data structures
        if (typeof item === 'number') {
            score = item;
        } else if (typeof item === 'object' && item !== null) {
            // Try common property names
            score = item.score || item.value || item.Score || item.Value;
        } else if (typeof item === 'string') {
            score = parseInt(item, 10);
        }
        
        // Only process if we have a valid score
        if (score !== undefined && score !== null && !isNaN(score)) {
            const scoreNum = Number(score);
            
            switch (scoreNum) {
                case 1:
                    scoreCount.one++;
                    break;
                case 2:
                    scoreCount.two++;
                    break;
                case 3:
                    scoreCount.three++;
                    break;
                case 4:
                    scoreCount.four++;
                    break;
                case 5:
                    scoreCount.five++;
                    break;
                default:
                    // Handle scores outside expected range
                    console.warn('Score outside expected range (1-5):', score);
                    break;
            }
        }
    });

    return scoreCount;
}