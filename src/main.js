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
    w: 0,
    skills: {
      fa: { tier: null, score: 0 },
      sm: { tier: null, score: 0 },
      mi: { tier: null, score: 0 },
      sh: { tier: null, score: 0 },
      di: { tier: null, score: 0 },
      ma: { tier: null, score: 0 },
    },
  },
};

function getRank(score, bestScore) {
  const ratio = score / bestScore;
  let rank;
  if (ratio >= 0.9) {
    rank = 'S';
  } else if (ratio < 0.9 && ratio >= 0.8) {
    rank = 'A';
  } else if (ratio < 0.8 && ratio >= 0.7) {
    rank = 'B';
  } else if (ratio < 0.7 && ratio >= 0.6) {
    rank = 'C';
  } else if (ratio < 0.6 && ratio >= 0.5) {
    rank = 'D';
  } else if (ratio < 0.5 && ratio >= 0.4) {
    rank = 'E';
  } else {
    rank = 'F';
  }
  return rank;
}

function calculateWorkersFromDB(data) {
  const { workers, skills } = data;
  state.skills = skills;
  for (let worker of workers) {
    // fa,sn,mi,sh,di,ma
    for (let [skill, outputs] of Object.entries(state.skills)) {
      const tier = worker[skill];
      const bestScore = state.bestScores[skill];
      const currentWorkerScore = outputs[tier] / worker.w;
      if (currentWorkerScore > bestScore)
        state.bestScores[skill] = currentWorkerScore;
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
  const rank = getRank(score, state.bestScores[skillName]);
  rankEl.textContent = rank;
}

function setEventListeners() {
  const inputsContainer = document.querySelector('.worker');
  inputsContainer.addEventListener('change', event => {
    const target = event.target;
    switch (target.type) {
      case 'number':
        state.enteredWorker.w = Number(target.value);
        // update scores for all skills
        for (let [skillName, skillObj] of Object.entries(
          state.enteredWorker.skills
        )) {
          if (skillObj.tier === null) continue;
          skillObj.score =
            state.skills[skillName][skillObj.tier] / state.enteredWorker.w;
        }
        updateRanks();
        break;
      case 'radio':
        const skillName = `${target.name[0]}${target.name[1]}`;
        const tier = Number(target.value);
        state.enteredWorker.skills[skillName].tier = tier;
        // update score for skill with changed tier
        state.enteredWorker.skills[skillName].score =
          state.skills[skillName][tier] / state.enteredWorker.w;
        updateRank(document.querySelector(`.rank[data-skill=${skillName}]`));
        break;
    }
    console.log(state);
  });
}

function main() {
  calculateWorkersFromDB(data);
  setEventListeners();
}

window.onload = main;
