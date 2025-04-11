import React from 'react';

function Dashboard({ projects, tasks }) {
  // Calculate the number of projects in each status
  const projectStatusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  // Calculate the number of tasks in each status
  const taskStatusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  // Calculate upcoming deadlines
  const upcomingDeadlines = projects
    .filter(project => new Date(project.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3); // Show only the next 3 upcoming deadlines

  return (
    <div className="dashboard-container">
      <h2>Team Dashboard</h2>

      <div className="dashboard-section">
        <h3>Project Status</h3>
        <ul>
          {Object.entries(projectStatusCounts).map(([status, count]) => (
            <li key={status}>
              {status}: {count}
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section">
        <h3>Task Status</h3>
        <ul>
          {Object.entries(taskStatusCounts).map(([status, count]) => (
            <li key={status}>
              {status}: {count}
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section">
        <h3>Upcoming Deadlines</h3>
        <ul>
          {upcomingDeadlines.map(project => (
            <li key={project.id}>
              {project.name} - {project.deadline}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
