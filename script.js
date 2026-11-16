const list = document.getElementById('taskList');
const count = document.getElementById('count');
const progress = document.getElementById('progress');
const score = document.getElementById('score');
const ring = document.getElementById('scoreRing');
const insight = document.getElementById('insightText');
const form = document.getElementById('addForm');
const input = document.getElementById('newTask');

document.getElementById('today').textContent = new Intl.DateTimeFormat('en', {
  weekday: 'short', month: 'short', day: 'numeric'
}).format(new Date());

function updateDashboard() {
  const tasks = [...list.querySelectorAll('.task')];
  const completed = tasks.filter(task => task.querySelector('input').checked).length;
  const total = tasks.length;
  const percent = total ? Math.round(completed / total * 100) : 0;
  count.textContent = `${completed}/${total}`;
  progress.style.width = `${percent}%`;
  score.textContent = `${percent}%`;
  ring.style.background = `conic-gradient(var(--accent) ${percent * 3.6}deg, #293438 0deg)`;
  insight.textContent = percent === 100
    ? 'Everything is complete. Amazing work — keep your momentum going!'
    : percent >= 60
      ? 'You are making great progress. Just a little more to go.'
      : percent > 0
        ? 'Nice start. Every completed step moves you forward.'
        : 'Start with one small step. Your progress will appear here.';
  tasks.forEach(task => task.classList.toggle('done', task.querySelector('input').checked));
}

list.addEventListener('change', updateDashboard);
form.addEventListener('submit', event => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  const label = document.createElement('label');
  label.className = 'task';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  const span = document.createElement('span');
  span.textContent = value;
  label.append(checkbox, span);
  list.appendChild(label);
  input.value = '';
  updateDashboard();
});
updateDashboard();

function showPlanner() {
    document.getElementById("planner").scrollIntoView({
        behavior: "smooth"
    });
}

console.log("TravelVista homepage loaded successfully!");
