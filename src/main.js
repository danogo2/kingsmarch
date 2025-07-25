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
  rankElementsMap: new Map(),
  // skill.tier.[minWage, maxWage]
  wageTableWages: {
    fa: {
      s: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      a: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      b: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      c: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      d: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      e: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      f: { 1: [], 2: [], 3: [], 4: [], 5: [] },
    },
    sm: {
      s: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      a: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      b: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      c: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      d: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      e: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      f: { 1: [], 2: [], 3: [], 4: [], 5: [] },
    },
    mi: {
      s: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      a: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      b: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      c: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      d: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      e: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      f: { 1: [], 2: [], 3: [], 4: [], 5: [] },
    },
    sh: {
      s: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      a: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      b: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      c: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      d: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      e: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      f: { 1: [], 2: [], 3: [], 4: [], 5: [] },
    },
    di: {
      s: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      a: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      b: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      c: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      d: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      e: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      f: { 1: [], 2: [], 3: [], 4: [], 5: [] },
    },
    ma: {
      s: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      a: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      b: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      c: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      d: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      e: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      f: { 1: [], 2: [], 3: [], 4: [], 5: [] },
    },
  },
  wageTableActiveSkill: 'fa',
};

function calculateWorkersFromDB(data) {
  const { workers, skills } = data;
  state.workers = workers;
  state.skills = skills;
  for (let worker of state.workers) {
    // fa,sn,mi,sh,di,ma
    for (let [skillName, outputs] of Object.entries(state.skills)) {
      const tier = worker[skillName];
      // Worker Check State Setup
      const bestScore = state.bestScores[skillName];
      if (tier === 0) continue;
      const currentWorkerScore = calculateScore(
        skillName,
        worker.w,
        outputs[tier]
      );
      worker[`score-${skillName}`] = currentWorkerScore;
      if (currentWorkerScore > bestScore) {
        state.bestScores[skillName] = currentWorkerScore;
        state.bestWorkers[skillName] = worker;
      }
    }
  }
}

// WORKER CHECK ELEMENT
function createRankElementsMap() {
  const rankElementsArr = [...document.querySelectorAll('.rank')];
  for (let rankEl of rankElementsArr) {
    state.rankElementsMap.set(rankEl.dataset.skill, {
      letterEl: rankEl.querySelector('.letter'),
      percentageEl: rankEl.querySelector('.percentage'),
    });
  }
}

function calculateScore(skillName, wage, output) {
  if (
    skillName === 'fa' ||
    skillName === 'sm' ||
    skillName === 'mi' ||
    skillName === 'sh'
  ) {
    return output / wage;
  } else if (skillName === 'di' || skillName === 'ma') {
    return output[0] / output[1] / wage;
  }
}

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
  return {
    rank,
    percentageScore: Number((ratio * 100).toFixed()),
    html: `<img class="img-rank" src="/kingsmarch/rank_${rank}_204x314.png" alt="rank ${rank}">`,
  };
}

function updateRank(skillName) {
  const enteredWorkerSkillObj = state.enteredWorker.skills[skillName];
  const tier = enteredWorkerSkillObj.tier;
  if (tier === null) return;
  const score = enteredWorkerSkillObj.score;
  const { rank, percentageScore, html } = getRank(
    score,
    state.bestScores[skillName]
  );
  state.rankElementsMap.get(skillName).letterEl.innerHTML = html;
  state.rankElementsMap.get(
    skillName
  ).percentageEl.textContent = `${percentageScore}%`;
}

function updateRanks() {
  for (let skillName of Object.keys(state.skills)) {
    updateRank(skillName);
  }
}

function resetRank(skillName) {
  const enteredWorkerSkillObj = state.enteredWorker.skills[skillName];
  enteredWorkerSkillObj.score = 0;
  state.rankElementsMap.get(skillName).letterEl.textContent = '';
  state.rankElementsMap.get(skillName).percentageEl.textContent = '';
}

function resetRanks() {
  for (let skillName of Object.keys(state.skills)) {
    resetRank(skillName);
  }
}

function setWorkerCheckEventListeners() {
  const inputsContainer = document.querySelector('.worker-check');
  inputsContainer.addEventListener('change', event => {
    const target = event.target;
    switch (target.type) {
      case 'number':
        const enteredValue = Number(target.value);
        if (enteredValue <= 0) {
          target.value = '';
          state.enteredWorker.w = null;
          resetRanks();
        } else {
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
        }
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
        updateRank(skillName);
        break;
    }
  });
}

function setupWorkerCheck() {
  createRankElementsMap();
  setWorkerCheckEventListeners();
}

function getSkillFullName() {
  switch (state.wageTableActiveSkill) {
    case 'fa':
      return 'Farming';
    case 'sm':
      return 'Smelting';
    case 'mi':
      return 'Mining';
    case 'sh':
      return 'Shipping';
    case 'di':
      return 'Disenchanting';
    case 'ma':
      return 'Mapping';
  }
}

// WORKERS WAGE TABLE
function setupWageTable() {
  // Wage Table State Setup
  for (let worker of state.workers) {
    const currentWorkerWage = worker.w;
    for (let skillName of Object.keys(state.skills)) {
      const currentSkilllScore = worker[`score-${skillName}`];
      const currentSkillRank = getRank(
        currentSkilllScore,
        state.bestScores[skillName]
      ).rank.toLowerCase();
      const currentSkillTier = worker[skillName];
      if (currentSkillTier === 0) continue;
      const minMaxWage =
        state.wageTableWages[skillName][currentSkillRank][currentSkillTier];
      if (!minMaxWage.length) {
        minMaxWage[0] = currentWorkerWage;
        minMaxWage[1] = currentWorkerWage;
      } else if (currentWorkerWage < minMaxWage[0]) {
        minMaxWage[0] = currentWorkerWage;
      } else if (currentWorkerWage > minMaxWage[1]) {
        minMaxWage[1] = currentWorkerWage;
      }
    }
  }
}

function resetWageTableView() {
  const wageRangeEls = [...document.querySelectorAll('.wage-range')];
  for (let wageRangeEl of wageRangeEls) {
    wageRangeEl.textContent = '';
  }
}

function updateWageTableView() {
  resetWageTableView();
  // update wages html
  for (let [rank, tiersObject] of Object.entries(
    state.wageTableWages[state.wageTableActiveSkill]
  )) {
    for (let [tier, minMaxArr] of Object.entries(tiersObject)) {
      if (minMaxArr.length) {
        document.querySelector(
          `.${rank}t${tier}`
        ).textContent = `${minMaxArr[0]}-${minMaxArr[1]}`;
      }
    }
  }
}

function setWageTableEventListeners() {
  document
    .querySelector('.wage-table-skills')
    .addEventListener('click', event => {
      const target = event.target;
      if (target.classList.contains('wage-table-skill')) {
        document
          .querySelector(`.btn-${state.wageTableActiveSkill}`)
          .classList.remove('btn--active');
        state.wageTableActiveSkill = target.dataset.skill;
        document
          .querySelector(`.btn-${state.wageTableActiveSkill}`)
          .classList.add('btn--active');
        document.querySelector('.wage-table-skill-header').textContent =
          getSkillFullName();

        updateWageTableView();
      }
    });
}

function main() {
  calculateWorkersFromDB(data);
  setupWorkerCheck();
  setupWageTable();
  updateWageTableView();
  setWageTableEventListeners();
}

window.onload = main;
