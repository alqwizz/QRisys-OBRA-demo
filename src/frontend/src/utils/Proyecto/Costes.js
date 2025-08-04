export const daysFromTo = (from, to) => {
  var actualDay = from;
  var days = [];
  var dif = parseInt(getDif(from, to));
  while (dif > 0) {
    
      days.push(actualDay.getDate() + "/" + actualDay.getMonth());
    actualDay = new Date(
      actualDay.getFullYear(),
      actualDay.getMonth(),
      actualDay.getDate() + 1
    );
    dif--;
  }
  console.log(days)
  return days;
};

export const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

function getDif(from, to) {
  from = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  to = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  console.log((to.getTime() - from.getTime()) / (1000 * 3600 * 24) + 1);
  return (to.getTime() - from.getTime()) / (1000 * 3600 * 24) + 1;
}
var hoy = new Date();

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}
