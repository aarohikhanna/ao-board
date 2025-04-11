import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Dashboard from './components/Dashboard';
import { ConnectButton } from '@arweave-wallet-kit/react';

function App() {
  const [agents, setAgents] = useState(['Agent 1', 'Agent 2', 'Agent 3']);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskAssignee, setTaskAssignee] = useState(agents[0]);
  const [rooms, setRooms] = useState(['General', 'Project A', 'Project B']);
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [projectDeadline, setProjectDeadline] = useState('');
  const [agentInstructions, setAgentInstructions] = useState({});

  useEffect(() => {
    // Load messages from local storage
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    // Load tasks from local storage
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

     // Load projects from local storage
     const storedProjects = localStorage.getItem('projects');
     if (storedProjects) {
       setProjects(JSON.parse(storedProjects));
     }

      // Load agent instructions from local storage
      const storedAgentInstructions = localStorage.getItem('agentInstructions');
      if (storedAgentInstructions) {
        setAgentInstructions(JSON.parse(storedAgentInstructions));
      }
  }, []);

  useEffect(() => {
    // Save messages to local storage
    localStorage.setItem('messages', JSON.stringify(messages));

    // Save tasks to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Save projects to local storage
    localStorage.setItem('projects', JSON.stringify(projects));

    // Save agent instructions to local storage
    localStorage.setItem('agentInstructions', JSON.stringify(agentInstructions));
  }, [messages, tasks, projects, agentInstructions]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = {
        id: uuidv4(),
        sender: selectedAgent,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        room: selectedRoom,
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleTaskAssignment = () => {
    if (newTask.trim() !== '') {
      const task = {
        id: uuidv4(),
        description: newTask,
        assignee: taskAssignee,
        status: 'Open',
        room: selectedRoom,
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const handleTaskUpdate = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  const handleAddProject = () => {
    if (newProject.trim() !== '' && projectDeadline.trim() !== '') {
      const project = {
        id: uuidv4(),
        name: newProject,
        deadline: projectDeadline,
        status: 'Planning',
        room: selectedRoom,
      };
      setProjects([...projects, project]);
      setNewProject('');
      setProjectDeadline('');
    }
  };

  const handleProjectUpdate = (projectId, newStatus) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId ? { ...project, status: newStatus } : project
    );
    setProjects(updatedProjects);
  };

  const handleAgentInstructionUpdate = (agent, instruction) => {
    setAgentInstructions({ ...agentInstructions, [agent]: instruction });
  };

  const filteredMessages = messages.filter((message) => message.room === selectedRoom);
  const filteredTasks = tasks.filter((task) => task.room === selectedRoom);
  const filteredProjects = projects.filter((project) => project.room === selectedRoom);

  return (
    <div className="app-container">
      <ConnectButton
        accent="rgb(255, 0, 0)"
        profileModal={false}
        showBalance={true}
      />
      <div className="sidebar">
        <h2>Agents</h2>
        <ul>
          {agents.map((agent) => (
            <li
              key={agent}
              className={selectedAgent === agent ? 'selected' : ''}
              onClick={() => setSelectedAgent(agent)}
            >
              {agent}
            </li>
          ))}
        </ul>
        <h2>Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li
              key={room}
              className={selectedRoom === room ? 'selected' : ''}
              onClick={() => setSelectedRoom(room)}
            >
              {room}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <div className="messages-container">
          <h2>Messages - {selectedRoom}</h2>
          <div className="messages">
            {filteredMessages.map((message) => (
              <div key={message.id} className="message">
                <span className="message-sender">{message.sender}:</span>
                {message.text}
                <span className="message-timestamp">{message.timestamp}</span>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
        <div className="tasks-container">
          <h2>Tasks - {selectedRoom}</h2>
          <div className="tasks">
            {filteredTasks.map((task) => (
              <div key={task.id} className="task">
                <span>{task.description} (Assigned to: {task.assignee}) - Status: {task.status}</span>
                <div>
                  <button onClick={() => handleTaskUpdate(task.id, 'In Progress')}>
                    Mark In Progress
                  </button>
                  <button onClick={() => handleTaskUpdate(task.id, 'Completed')}>
                    Mark Completed
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="task-input">
            <input
              type="text"
              placeholder="Enter new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <select value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)}>
              {agents.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
            <button onClick={handleTaskAssignment}>Assign Task</button>
          </div>
        </div>
        <div className="projects-container">
          <h2>Projects - {selectedRoom}</h2>
          <div className="projects">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project">
                <span>{project.name} (Deadline: {project.deadline}) - Status: {project.status}</span>
                <div>
                  <button onClick={() => handleProjectUpdate(project.id, 'In Progress')}>
                    Mark In Progress
                  </button>
                  <button onClick={() => handleProjectUpdate(project.id, 'Completed')}>
                    Mark Completed
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="project-input">
            <input
              type="text"
              placeholder="Enter new project..."
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
            />
            <input
              type="date"
              value={projectDeadline}
              onChange={(e) => setProjectDeadline(e.target.value)}
            />
            <button onClick={handleAddProject}>Add Project</button>
          </div>
        </div>
         <div className="human-agent-interaction-container">
            <h2>Human-Agent Interaction</h2>
            {agents.map((agent) => (
              <div key={agent} className="agent-instruction">
                <h3>{agent}</h3>
                <textarea
                  placeholder="Enter instruction for agent..."
                  value={agentInstructions[agent] || ''}
                  onChange={(e) => handleAgentInstructionUpdate(agent, e.target.value)}
                />
              </div>
            ))}
          </div>
           <Dashboard projects={projects} tasks={tasks} />
      </div>
    </div>
  );
}

export default App;
