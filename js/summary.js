async function initBoard() {
  await loadTasks();
  countStatus();
}

function countStatus() {
  const statusDone = "done";
  const statustodo = "todo";
  const statuspriority = "priority";
  const statusawaitFeedback = "awaitFeedback";
  const statusinProgress = "inProgress";

  const done = tasks.filter((t) => t.status === statusDone);
  const todo = tasks.filter((t) => t.status === statustodo);
  const priority = tasks.filter((t) => t.status === statuspriority);
  const awaitFeedback = tasks.filter((t) => t.status === statusawaitFeedback);
  const inProgress = tasks.filter((t) => t.status === statusinProgress);

  document.getElementById("count-done").innerHTML = done.length;
  document.getElementById("count-todo").innerHTML = todo.length;
  document.getElementById("count-priority").innerHTML = priority.length;
  document.getElementById("count-awaitFeedback").innerHTML =
    awaitFeedback.length;
  document.getElementById("count-inProgress").innerHTML = inProgress.length;

  const totalTasks = tasks.length;
  document.getElementById("count-board").innerHTML = totalTasks;

  console.log(
    "done: " +
      done.length +
      ", todo: " +
      todo.length +
      ", priority: " +
      priority.length +
      ", awaitFeedback: " +
      awaitFeedback.length +
      ", inProgress: " +
      inProgress.length +
      ", total: " +
      totalTasks
  );
}
