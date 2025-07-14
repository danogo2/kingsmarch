import data from './workers.json';

const state = {
  bestScores: {
    fa: 0,
    sm: 0,
    mi: 0,
    sh: 0,
    di: 0,
    ma: 0,
  },
  enteredWorker: {
    w: null,
    skills: {
      fa: { tier: null, score: 0 },
      sm: { tier: null, score: 0 },
      mi: { tier: null, score: 0 },
      sh: { tier: null, score: 0 },
      di: { tier: null, score: 0 },
      ma: { tier: null, score: 0 },
    },
  },
  bestWorkers: {},
};

function getRank(score, bestScore) {
  const ratio = score / bestScore;
  let rank;
  if (ratio >= 0.95) {
    rank = 'S';
  } else if (ratio < 0.95 && ratio >= 0.9) {
    rank = 'A';
  } else if (ratio < 0.9 && ratio >= 0.8) {
    rank = 'B';
  } else if (ratio < 0.8 && ratio >= 0.7) {
    rank = 'C';
  } else if (ratio < 0.7 && ratio >= 0.6) {
    rank = 'D';
  } else if (ratio < 0.6 && ratio >= 0.5) {
    rank = 'E';
  } else {
    rank = 'F';
  }
  return { rank, percentageScore: Number((ratio * 100).toFixed()) };
}

function calculateScore(skill, wage, output) {
  if (skill === 'fa' || skill === 'sm' || skill === 'mi' || skill === 'sh') {
    return output / wage;
  } else if (skill === 'di' || skill === 'ma') {
    return output[0] / output[1] / wage;
  }
}

function calculateWorkersFromDB(data) {
  const { workers, skills } = data;
  state.skills = skills;
  for (let worker of workers) {
    // fa,sn,mi,sh,di,ma
    for (let [skill, outputs] of Object.entries(state.skills)) {
      const tier = worker[skill];
      const bestScore = state.bestScores[skill];
      const currentWorkerScore = calculateScore(skill, worker.w, outputs[tier]);
      if (currentWorkerScore > bestScore) {
        state.bestScores[skill] = currentWorkerScore;
        state.bestWorkers[skill] = worker;
      }
    }
  }
}

function updateRanks() {
  const rankElements = document.querySelectorAll('.rank');
  for (let rankEl of rankElements) {
    updateRank(rankEl);
  }
}

function updateRank(rankEl) {
  const skillName = rankEl.dataset.skill;
  const enteredWorkerSkillObj = state.enteredWorker.skills[skillName];
  const score = enteredWorkerSkillObj.score;
  const tier = enteredWorkerSkillObj.tier;
  if (tier === null) return;
  const { rank, percentageScore } = getRank(score, state.bestScores[skillName]);
  rankEl.textContent = rank;
  rankEl.nextElementSibling.textContent = `${percentageScore}%`;
}

function setEventListeners() {
  const inputsContainer = document.querySelector('.worker');
  inputsContainer.addEventListener('change', event => {
    const target = event.target;
    switch (target.type) {
      case 'number':
        const enteredValue = Number(target.value);
        if (enteredValue <= 0) {
          target.value = '';
          state.enteredWorker.w = null;
          return;
        }
        state.enteredWorker.w = enteredValue;
        // update scores for all skills
        for (let [skillName, skillObj] of Object.entries(
          state.enteredWorker.skills
        )) {
          if (skillObj.tier === null) continue;
          skillObj.score = calculateScore(
            skillName,
            state.enteredWorker.w,
            state.skills[skillName][skillObj.tier]
          );
        }
        updateRanks();
        break;
      case 'radio':
        const skillName = `${target.name[0]}${target.name[1]}`;
        const tier = Number(target.value);
        state.enteredWorker.skills[skillName].tier = tier;
        // update score for skill with changed tier
        if (state.enteredWorker.w === null) return;
        state.enteredWorker.skills[skillName].score = calculateScore(
          skillName,
          state.enteredWorker.w,
          state.skills[skillName][tier]
        );
        updateRank(document.querySelector(`.rank[data-skill=${skillName}]`));
        break;
    }
  });
}

function main() {
  calculateWorkersFromDB(data);
  setEventListeners();
}

window.onload = main;
