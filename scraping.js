const fs = require('fs')
const puppeteer = require('puppeteer');
const Candidates = require('./output.json');

const validCandidates = [];
const tseCandidatePageUrl = 'https://divulgacandcontas.tse.jus.br/divulga/#/candidato/2022/2040602022/{state}/{sq-cand}'
const candidateState = Candidates[0]['UF'].toLocaleLowerCase()

function filterCandidatesByPositionAndDeferral() {
    const validCandidatesTemp = Candidates
    .filter(candidate => candidate['CARGO']
    .includes('ESTADUAL') && candidate['DETALHE_SITUACAO_CAND'] === 'DEFERIDO');
    
    loopRequest(validCandidatesTemp);
}

async function loopRequest(candidates) {
    for(const [index, candidate] of candidates.entries()) {
        await getImageByCandidatesPageInTse(candidate);
    }
    convertCandidateListToJson(validCandidates);
}

async function getImageByCandidatesPageInTse(candidate) {
    const formattedUrl = formatUrlOfTseCandidatePage(tseCandidatePageUrl, candidate);    
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(formattedUrl, { waitUntil: "networkidle2" });
    const src = await page.$eval('img.dvg-cand-foto', el => el.src)
    if(src) includeImageUrlInCandidateObject(src, candidate);
    await browser.close();
}

function convertCandidateListToJson(candidates) {
    fs.writeFileSync(`candidatos-deputado-estadual-${candidateState}.json`, JSON.stringify(candidates, null, 4), 'utf-8', (err) => {
        if(err) console.log(err)
    })
}

function formatUrlOfTseCandidatePage(baseUrl, candidate) {
    return baseUrl
    .replace('{state}', candidate['UF'])
    .replace('{sq-cand}', candidate['SQ_CANDIDATO'])
}

function includeImageUrlInCandidateObject(src, candidate) {
    const newCandidateObject = {
            ...candidate,
            CAND_IMG: src
        }
        console.log(newCandidateObject)
        validCandidates.push(newCandidateObject);
}

filterCandidatesByPositionAndDeferral();