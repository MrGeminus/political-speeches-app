import { Request, Response } from 'express';
import { EvaluationResault, CSVData } from '../models/evaluation'
import { findPoliticianWithMostSpeechesInGivenYear, findPoliticianWithMostSpeechesOnGivenTopic, findPoliticianWithLowestWordCount } from '../services/evaluationService'
import papa, { ParseStepResult } from "papaparse";
import { createWriteStream, createReadStream, WriteStream } from 'fs';
import https from 'https';
import path from "path"


const evaluationController = (req: Request, res: Response<EvaluationResault>) => {
  if (!req.query.url) {
    return res.json({
      mostSpeeches: null,
      mostSecurity: null,
      leastWordy: null
    })
  }

  const urls = Array.isArray(req.query.url)
    ? req.query.url.map(url => String(url))
    : [String(req.query.url)];

  const completeData: CSVData[] = []
  let counter: number = 0;

  for (const url of urls) {
    const downloadCSVFile = (url: string, callback: (fileName: string) => void) => {
      const fileName: string = path.basename(url)
      const downloadRequest = https.get(url, (res) => {
        const fileStream: WriteStream = createWriteStream(fileName)
        res.pipe(fileStream)

        fileStream.on("error", (error: Error) => {
          console.log(error)
        })

        fileStream.on("close", () => {
          callback(fileName);
        })

        fileStream.on("finish", () => {
          fileStream.close()
        })
      })
    }

    const parseCSVFile = (fileName: string): void => {
      const file = createReadStream(fileName)
      papa.parse(file, {
        header: true,
        dynamicTyping: true,
        transformHeader: (header: string): string => {
          return header.trim().toLocaleLowerCase();
        },
        step: (row: ParseStepResult<CSVData>): void => {
          completeData.push(row.data)
          console.log(row)
        },
        complete: (): void => {
          counter++;
          console.log("All done!")
          evaluateCSVData();
        }
      })
    }
    downloadCSVFile(url, parseCSVFile)
  }

  const evaluateCSVData = (): Response<EvaluationResault> | void => {
    if (counter !== urls.length) return
    const mostSpeeches: string | null = findPoliticianWithMostSpeechesInGivenYear(completeData)
    const mostSecurity: string | null = findPoliticianWithMostSpeechesOnGivenTopic(completeData)
    const leastWordy: string | null = findPoliticianWithLowestWordCount(completeData)

    return res.json({
      mostSpeeches,
      mostSecurity,
      leastWordy
    })
  }
}

export default evaluationController;