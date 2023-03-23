import Angle from '../lib/angle-format/angle-format.js';
import Commands from '../lib/commands.js';
import Skyfield from '../lib/skyfield.js';

const parseZone = (str) => {
    if (/^(utc|gmt)$/i.test(str)) return '+0000';
    str = str.replace(/^(utc|gmt)\b\s*/i, '');
    const [ sign ] = str.match(/^[-+]/);
    if (!sign) return null;
    const [ h, m = '00' ] = str.split(':').map(str => str.padStart(2, '0'));
    return sign + h + m;
};

const parseTime = (str) => {
    if (/^now$/i.test(str)) return Math.round(Date.now()/1000);
    str = str.replace(/-(\d)\b/g, '-0$1');
    str = str.replace(/ (\d)\b/g, ' 0$1');
    str = str.replace(/:(\d)\b/g, ':0$1');
    const [ date, time, zone = 'UTC' ] = str.split(/\s+/);
    const iso = date + 'T' + time + parseZone(zone);
    const datetime = new Date(iso);
    return Math.round(datetime/1000);
};

const timeUnits = {
    h: 3600,
    m: 60,
    s: 1,
};

const parseTimeLength = (str) => {
    const [, val, unit ] = str.toLowerCase().match(/^(\d+)\s*(\w+)$/) ?? [];
    const unitVal = timeUnits[unit];
    return Number(val)*unitVal;
};

const handleSyntaxError = async (msg) => {
    await msg.reply('Bad syntax');
};

Commands.add('get-gp-rep')
.splitArgs()
.setHandler(async (msg, args) => {
    if (args.length !== 4) return handleSyntaxError(msg);
    const names = args[0].split(/\s*\+\s*/);
    const startTime = parseTime(args[1]);
    const n = Number(args[2]);
    const interval = parseTimeLength(args[3]);
    if (isNaN(startTime) || isNaN(n) || isNaN(interval)) {
        return handleSyntaxError(msg);
    }
    const results = [...new Array(n)].map(_=>[]);
    for (let i=0; i<n; ++i) {
        const unixtime = startTime + interval*i;
        for (let name of names) {
            const path = Skyfield.buildPath(name, unixtime);
            if (!path) return handleSyntaxError(msg);
            const data = await Skyfield.get(path);
            results[i].push(data);
        }
    }
    let line1 = '';
    let line2 = '';
    for (let i=0; i<names.length; ++i) {
        if (i === 0) {
            line1 += ',' + names[i];
            line2 += 'Ra,Dec,Dist (m)';
        } else {
            line1 += ',,,' + names[i];
            line2 += ',Ra,Dec,Dist (m)';
        }
    }
    let csv = line1 + '\n' + line2 + '\n';
    for (const line of results) {
        csv += line.map(data => {
            const { ra, dec, dist } = data;
            return [
                Angle.hours.stringify(ra),
                Angle.degrees.stringify(dec),
                Math.round(dist),
            ];
        }).flat().join(',') + '\n';
    }
    msg.reply('```csv\n' + csv + '```');
});
