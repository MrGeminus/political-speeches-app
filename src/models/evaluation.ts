export interface EvaluationResault {
    mostSpeeches: null | string;
    mostSecurity: null | string;
    leastWordy: null | string;
}

export interface CSVData {
    speaker: string,
    topic: string,
    date: Date,
    words: number
}
