const { sendEmail } = require('./notification');

function checkTarget(managementMetrics) {
    const target_type = managementMetrics.target.target_type;
    const percentage_alert = managementMetrics.target.percentage_alert;
    
    const sendTo = managementMetrics.email;
    const user = managementMetrics.username;
    
    let subject = `Task Management Alert: Your ${target_type.toLowerCase()} target is achieved`;
    
    let emailBody = `
    Dear ${user},
    
    Your ${target_type.toLowerCase()} target have reached ${percentage_alert}% of the specified Value. It's essential to monitor your goals to stay on your track.
    
    Consider reviewing your recent tasks and adjusting your target if necessary.
    
    Thank you for your commitment to HR well-being. We appreciate your trust in our Staff Management System.
    
    Best regards,
    Staff Management System
    `;
    
    if (target_type.toLowerCase() === "weekly") {
        const thisWeekPerformance = managementMetrics.task_metrics.performance_this_week;
        if (thisWeekPerformance >= percentage_alert) {
            sendEmail(sendTo, subject, emailBody);
        }
    }
    else if (target_type.toLowerCase() === "monthly") {
        const thisMonthPerformance = managementMetrics.task_metrics.performance_this_month;
        if (thisMonthPerformance >= percentage_alert) {
            sendEmail(sendTo, subject, emailBody);
        }
    }
    else if (target_type.toLowerCase() === "yearly") {
        const thisYearPerformance = managementMetrics.task_metrics.performance_this_year;
        if (thisYearPerformance >= percentage_alert) {
            sendEmail(sendTo, subject, emailBody);
        }
    }
}

module.exports = {
    checkTarget,
};
