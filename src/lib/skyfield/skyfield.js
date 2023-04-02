import http from 'http';

const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'];
const bodies = ['sun', 'moon'];
const stars = [
	'Alpheratz',
	'Ankaa',
	'Schedar',
	'Diphda',
	'Achernar',
	'Hamal',
	'Polaris',
	'Acamar',
	'Menkar',
	'Mirfak',
	'Aldebaran',
	'Rigel',
	'Capella',
	'Bellatrix',
	'Elnath',
	'Alnilam',
	'Betelgeuse',
	'Canopus',
	'Sirius',
	'Adhara',
	'Procyon',
	'Pollux',
	'Avior',
	'Suhail',
	'Miaplacidus',
	'Alphard',
	'Regulus',
	'Dubhe',
	'Denebola',
	'Gienah',
	'Acrux',
	'Gacrux',
	'Alioth',
	'Spica',
	'Alkaid',
	'Hadar',
	'Menkent',
	'Arcturus',
	'Rigil Kentaurus',
	'Kochab',
	'Zuben ubi',
	'Alphecca',
	'Antares',
	'Atria',
	'Sabik',
	'Shaula',
	'Rasalhague',
	'Eltanin',
	'Kaus Australis',
	'Vega',
	'Nunki',
	'Altair',
	'Peacock',
	'Deneb',
	'Enif',
	'Al Nair',
	'Fomalhaut',
	'Scheat',
	'Markab',
];
const hipMap = {
	677: /^alpheratz$/i,
	2081: /^ankaa$/i,
	3179: /^sc?hed[ai]r$/i,
	3419: /^diphda$/i,
	7588: /^achernar$/i,
	9884: /^hamal$/i,
	11767: /^polaris$/i,
	13847: /^acamar$/i,
	14135: /^menkar$/i,
	15863: /^mirfak$/i,
	21421: /^aldebaran$/i,
	24436: /^rigel$/i,
	24608: /^capella$/i,
	25336: /^bellatrix$/i,
	25428: /^elnath$/i,
	26311: /^alnilam$/i,
	27989: /^betelgeuse$/i,
	30438: /^canopus$/i,
	32349: /^sirius$/i,
	33579: /^adhara$/i,
	37279: /^procyon$/i,
	37826: /^pollux$/i,
	41037: /^avior$/i,
	44816: /^suhail$/i,
	45238: /^miaplacidus$/i,
	46390: /^alphard$/i,
	49669: /^regulus$/i,
	54061: /^dubhe$/i,
	57632: /^denebola$/i,
	59803: /^gienah$/i,
	60718: /^acrux$/i,
	61084: /^gacrux$/i,
	62956: /^alioth$/i,
	65474: /^spica$/i,
	67301: /^alkaid$/i,
	68702: /^hadar$/i,
	68933: /^menkent$/i,
	69673: /^arcturus$/i,
	71683: /^rig[ie]l\s+kent(\.|aurus)?$/i,
	72607: /^koch?ab$/i,
	72622: /^zuben('?\s*)(elgen)?ubi$/i,
	76267: /^alphecca$/i,
	80763: /^antares$/i,
	82273: /^atria$/i,
	84012: /^sabik$/i,
	85927: /^shaula$/i,
	86032: /^rasalhague$/i,
	87833: /^eltanin$/i,
	90185: /^kaus\s+aust(\.|ralis)?$/i,
	91262: /^vega$/i,
	92855: /^nunki$/i,
	97649: /^altair$/i,
	100751: /^peacock$/i,
	102098: /^deneb$/i,
	107315: /^enif$/i,
	109268: /^al\s*na'?ir$/i,
	113368: /^fomalhaut$/i,
	113881: /^scheat$/i,
	113963: /^markab$/i,
};

const getBodyPath = (name) => {
    const lower = name.toLowerCase();
    if (planets.includes(lower)) return '/planet/' + name;
    if (bodies.includes(lower)) return '/' + name;
    for (let hip in hipMap) {
        const regex = hipMap[hip];
        if (regex.test(name)) return '/hip/' + hip;
    }
    return null;
};

const promisifyReq = (url, config) => new Promise((done, fail) => {
    const chunks = [];
    const req = http.request(url, config, res => {
        res.on('error', fail);
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
            try {
                const json = Buffer.concat(chunks).toString('utf-8');
                const data = JSON.parse(json);
                done(data);
            } catch(err) {
                fail(err);
            }
        });
    });
    req.on('error', fail);
    req.end();
});

class RestCli {
    constructor(url) {
        this.url = url;
		this.planets = planets;
		this.stars = stars;
    }
    buildPath(name, unixtime) {
        const bodyPath = getBodyPath(name);
        if (!bodyPath) return null;
        const path = `/time/${unixtime}${bodyPath}`;
        return path;
    }
    get(path) {
        const url = this.url + path;
        return promisifyReq(url, {
            method: 'GET'
        });
    }
	justGet(name, unixtime) {
		return this.get(this.buildPath(name, unixtime));
	}
}

const Skyfield = new RestCli('http://127.0.0.1:25601');

export default Skyfield;
