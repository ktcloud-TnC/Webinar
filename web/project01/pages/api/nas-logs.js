// pages/api/nas-logs.js
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';

const naslogDirectory = path.join(__dirname, '../../../n1/logs/all');

function getTodayLogPattern() {
    const today = moment().tz('Asia/Seoul').format('YYYYMMDD');
    return path.join(naslogDirectory, `all-access-${today}.log`);
}

export default function handler(req, res) {
    const logPath = getTodayLogPattern();

    if (fs.existsSync(logPath)) {
        const logContent = fs.readFileSync(logPath, 'utf8');
        res.status(200).send(logContent);
    } else {
        res.status(404).json({ message: 'The log file for today does not exist.' });
    }
}
