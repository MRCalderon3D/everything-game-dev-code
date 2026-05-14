export class Storage {
    static getHighScores() {
        try {
            const data = localStorage.getItem('pacmanai_highscores');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    static addHighScore(score) {
        const scores = Storage.getHighScores();
        scores.push({ score, date: new Date().toISOString() });
        scores.sort((a, b) => b.score - a.score);
        const top10 = scores.slice(0, 10);
        try {
            localStorage.setItem('pacmanai_highscores', JSON.stringify(top10));
        } catch (e) { /* storage full */ }
        return top10;
    }

    static isHighScore(score) {
        const scores = Storage.getHighScores();
        if (scores.length < 10) return true;
        return score > scores[scores.length - 1].score;
    }
}
