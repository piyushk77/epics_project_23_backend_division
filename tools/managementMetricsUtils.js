const { DateTime } = require('luxon');

function calculateTaskMetrics(managementMetrics) {

  const currentDate = DateTime.local().setZone('Asia/Kolkata');
  const currentWeekStart = currentDate.startOf('week');
  const currentMonthStart = currentDate.startOf('month');
  const currentYearStart = currentDate.startOf('year');

  const thisWeekPerformance = calculatePerformanceInRange(managementMetrics.task_metrics.tasks, currentWeekStart, currentDate);
  const thisMonthPerformance = calculatePerformanceInRange(managementMetrics.task_metrics.tasks, currentMonthStart, currentDate);
  const thisYearPerformance = calculatePerformanceInRange(managementMetrics.task_metrics.tasks, currentYearStart, currentDate);
  const totalTasks = managementMetrics.task_metrics.tasks.reduce((total, task) => total + 1, 0);


  const weeklyPerformance = calculateWeeklyPerformance(managementMetrics.task_metrics.tasks, currentMonthStart, currentDate);

  const monthlyPerformance = calculateMonthlyPerformance(managementMetrics.task_metrics.tasks, currentYearStart, currentDate);

  return {
    thisWeekPerformance,
    thisMonthPerformance,
    thisYearPerformance,
    totalTasks,
    weeklyPerformance,
    monthlyPerformance,
  };
}

function calculatePerformanceInRange(Tasks, startDate, endDate) {
  let totalTasks = 0;
  let finishedTasks = 0;

  Tasks.forEach(task => {
    const inputDate = DateTime.fromFormat(task.date, "yyyy-MM-d");
    // Convert to IST
    const istDate = inputDate.setZone('Asia/Kolkata');

    if (istDate >= startDate && istDate <= endDate) {
      totalTasks++;
      if (task.status === "Finished") {
        finishedTasks++;
      }
    }
  });

  if (totalTasks === 0) {
    return 0; // Prevent division by zero
  }

  return finishedTasks * 100 / totalTasks;
}

const calculateWeeklyPerformance = async (Tasks, startDate, endDate) => {
  const tasks = Tasks
    .filter(task => {
      const inputDate = DateTime.fromFormat(task.date, "yyyy-MM-d");
      // Convert to IST
      const istDate = inputDate.setZone('Asia/Kolkata');
      return (istDate >= startDate && istDate <= endDate);
    });

  const weeklyTasks = {
    firstWeek: 0,
    secondWeek: 0,
    thirdWeek: 0,
    fourthWeek: 0,
    fifthWeek: 0,
  };

  let firstWeekTotal = 0;
  let secondWeekTotal = 0;
  let thirdWeekTotal = 0;
  let fourthWeekTotal = 0;
  let fifthWeekTotal = 0;

  tasks.forEach(task => {
    const taskDate = new Date(task.date);
    const formattedStartDate = new Date(startDate);
    const week = Math.ceil((taskDate.getDate() + formattedStartDate.getDay() - 1) / 7);
    switch (week) {
      case 1:
        if (task.status == "Finished") {
          ++weeklyTasks.firstWeek;
        }
        ++firstWeekTotal;
        break;
      case 2:
        if (task.status == "Finished") {
          ++weeklyTasks.secondWeek;
        }
        ++secondWeekTotal;
        break;
      case 3:
        if (task.status == "Finished") {
          ++weeklyTasks.thirdWeek;
        }
        ++thirdWeekTotal;
        break;
      case 4:
        if (task.status == "Finished") {
          ++weeklyTasks.fourthWeek;
        }
        ++fourthWeekTotal;
        break;
      case 5:
        if (task.status == "Finished") {
          ++weeklyTasks.fifthWeek;
        }
        ++fifthWeekTotal;
        break;
      default:
        break;
    }
  });

  // Calculate percentage for first week
  if (firstWeekTotal !== 0) {
    weeklyTasks.firstWeek = weeklyTasks.firstWeek * 100 / firstWeekTotal;
  } else {
    weeklyTasks.firstWeek = 0;
  }

  // Calculate percentage for second week
  if (secondWeekTotal !== 0) {
    weeklyTasks.secondWeek = weeklyTasks.secondWeek * 100 / secondWeekTotal;
  } else {
    weeklyTasks.secondWeek = 0;
  }

  // Calculate percentage for third week
  if (thirdWeekTotal !== 0) {
    weeklyTasks.thirdWeek = weeklyTasks.thirdWeek * 100 / thirdWeekTotal;
  } else {
    weeklyTasks.thirdWeek = 0;
  }

  // Calculate percentage for fourth week
  if (fourthWeekTotal !== 0) {
    weeklyTasks.fourthWeek = weeklyTasks.fourthWeek * 100 / fourthWeekTotal;
  } else {
    weeklyTasks.fourthWeek = 0;
  }

  // Calculate percentage for fifth week
  if (fifthWeekTotal !== 0) {
    weeklyTasks.fifthWeek = weeklyTasks.fifthWeek * 100 / fifthWeekTotal;
  } else {
    weeklyTasks.fifthWeek = 0;
  }

  return weeklyTasks;
};

const calculateMonthlyPerformance = async (Tasks, startDate, endDate) => {
  const tasks = Tasks
    .filter(task => {
      const inputDate = DateTime.fromFormat(task.date, "yyyy-MM-d");
      // Convert to IST
      const istDate = inputDate.setZone('Asia/Kolkata');
      return (istDate >= startDate && istDate <= endDate);
    });

  const monthlyTasks = {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
  };

  let janTotal = 0;
  let febTotal = 0;
  let marTotal = 0;
  let aprTotal = 0;
  let mayTotal = 0;
  let junTotal = 0;
  let julTotal = 0;
  let augTotal = 0;
  let sepTotal = 0;
  let octTotal = 0;
  let novTotal = 0;
  let decTotal = 0;

  tasks.forEach(task => {
    const month = new Date(task.date).getMonth();
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2024, month));
    switch (monthName.toLowerCase()) {
      case "january":
        if (task.status == "Finished") {
          ++monthlyTasks[monthName.toLowerCase()];
        }
        ++janTotal;
        break;
      case "february":
        if (task.status == "Finished") {
          ++monthlyTasks[monthName.toLowerCase()];
        }
        ++febTotal;
        break;
      case "march":
        if (task.status == "Finished") {
          ++monthlyTasks[monthName.toLowerCase()];
        }
        ++marTotal;
        break;
      case "april":
        if (task.status == "Finished") {
          ++monthlyTasks[monthName.toLowerCase()];
        }
        ++aprTotal;
        break;
      case "may":
        if (task.status == "Finished") {
          ++monthlyTasks[monthName.toLowerCase()];
        }
        ++mayTotal;
        break;
      case "june":
        if (task.status == "Finished") {
          ++monthlyTasks[monthName.toLowerCase()];
        }
        ++junTotal;
        break;
      case "july":
        if (task.status == "Finished") {
          ++monthlyTasks[monthName.toLowerCase()];
        }
        ++julTotal;
        break;
      case "august":
        if (task.status == "Finished") {
          ++monthlyTasks[monthName.toLowerCase()];
        }
        ++augTotal;
        break;
      case "september":
        if (task.status == "Finished") {
          ++monthlyTasks[monthName.toLowerCase()];
        }
        ++sepTotal;
        break;
      case "october":
        if (task.status == "Finished") {
          ++monthlyTasks[monthName.toLowerCase()];
        }
        ++octTotal;
        break;
      case "november":
        if (task.status == "Finished") {
          ++monthlyTasks[monthName.toLowerCase()];
        }
        ++novTotal;
        break;
      case "december":
        if (task.status == "Finished") {
          ++monthlyTasks[monthName.toLowerCase()];
        }
        ++decTotal;
        break;

      default:
        break;
    }
  });

  if (janTotal != 0) {
    monthlyTasks.january = monthlyTasks.january * 100 / janTotal;
  } else {
    monthlyTasks.january = 0;
  }

  if (febTotal != 0) {
    monthlyTasks.february = monthlyTasks.february * 100 / febTotal;
  } else {
    monthlyTasks.february = 0;
  }

  if (marTotal != 0) {
    monthlyTasks.march = monthlyTasks.march * 100 / marTotal;
  } else {
    monthlyTasks.march = 0;
  }

  if (aprTotal != 0) {
    monthlyTasks.april = monthlyTasks.april * 100 / aprTotal;
  } else {
    monthlyTasks.april = 0;
  }

  if (mayTotal != 0) {
    monthlyTasks.may = monthlyTasks.may * 100 / mayTotal;
  } else {
    monthlyTasks.may = 0;
  }

  if (junTotal != 0) {
    monthlyTasks.june = monthlyTasks.june * 100 / junTotal;
  } else {
    monthlyTasks.june = 0;
  }

  if (julTotal != 0) {
    monthlyTasks.july = monthlyTasks.july * 100 / julTotal;
  } else {
    monthlyTasks.july = 0;
  }

  if (augTotal != 0) {
    monthlyTasks.august = monthlyTasks.august * 100 / augTotal;
  } else {
    monthlyTasks.august = 0;
  }

  if (sepTotal != 0) {
    monthlyTasks.september = monthlyTasks.september * 100 / sepTotal;
  } else {
    monthlyTasks.september = 0;
  }

  if (octTotal != 0) {
    monthlyTasks.october = monthlyTasks.october * 100 / octTotal;
  } else {
    monthlyTasks.october = 0;
  }

  if (novTotal != 0) {
    monthlyTasks.november = monthlyTasks.november * 100 / novTotal;
  } else {
    monthlyTasks.november = 0;
  }

  if (decTotal != 0) {
    monthlyTasks.december = monthlyTasks.december * 100 / decTotal;
  } else {
    monthlyTasks.december = 0;
  }

  return monthlyTasks;
};


module.exports = {
  calculateTaskMetrics,
};