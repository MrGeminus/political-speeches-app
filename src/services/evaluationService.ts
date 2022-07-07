import { CSVData } from '../models/evaluation'


const findPoliticianWithMostSpeechesInGivenYear = (data: CSVData[], year: number = 2013): string | null => {
    const speechesFromGivenYear: CSVData[] = data.filter(row => new Date(row.date).getFullYear() === year)
    if (!speechesFromGivenYear.length) return null
    interface speakers {
        [key: string]: string[]
    }
    let speakers: speakers = {}
    speechesFromGivenYear.forEach(row => {
        if (speakers[row.speaker] && !speakers[row.speaker].includes(row.topic)) {
            speakers[row.speaker].push(row.topic)
        }
        if (!speakers[row.speaker]) {
            speakers[row.speaker] = [row.topic]
        }
    })
    return Object.entries(speakers).sort(([, a], [, b]) => { return b.length - a.length })[0][0]
}

const findPoliticianWithMostSpeechesOnGivenTopic = (data: CSVData[], topic: string = 'internal security'): string | null => {
    const speakerByTopic: CSVData[] = data.filter(row => row.topic.toLocaleLowerCase() === topic)
    if (!speakerByTopic.length) return null
    interface speakers {
        [key: string]: number
    }
    let speakers: speakers = {}
    speakerByTopic.forEach(row => {
        if (speakers[row.speaker]) {
            speakers[row.speaker] = + 1
        }
        else {
            speakers[row.speaker] = 1
        }
    })
    return Object.entries(speakers).sort(([, a], [, b]) => { return b - a })[0][0]
}

const findPoliticianWithLowestWordCount = (data: CSVData[]): string | null => {
    interface speakers {
        [key: string]: number
    }
    let speakers: speakers = {}
    data.forEach(row => {
        if (speakers[row.speaker]) {
            speakers[row.speaker] += row.words
        }
        if (!speakers[row.speaker]) {
            speakers[row.speaker] = row.words
        }
    })
    return Object.entries(speakers).sort(([, a], [, b]) => { return a - b })[0][0]
}

export { findPoliticianWithMostSpeechesInGivenYear, findPoliticianWithMostSpeechesOnGivenTopic, findPoliticianWithLowestWordCount }