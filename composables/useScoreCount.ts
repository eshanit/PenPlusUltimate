import type IEvalScore from "@/interfaces/IEvalScore";

export interface ScoreCount {
    zero: number;
    one: number;
    two: number;
    three: number;
}

export function useScoreCount(data: any[]): ScoreCount {
    // Initialize with zeros
    const scoreCount: ScoreCount = {
        zero: 0,
        one: 0,
        two: 0,
        three: 0
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
                case 0:
                    scoreCount.zero++;
                    break;
                case 1:
                    scoreCount.one++;
                    break;
                case 2:
                    scoreCount.two++;
                    break;
                case 3:
                    scoreCount.three++;
                    break;
                default:
                    // Handle scores outside expected range
                    console.warn('Score outside expected range (0-3):', score);
                    break;
            }
        }
    });

    return scoreCount;
}