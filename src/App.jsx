import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  StickyNote,
  Sun,
  Trash2,
  X,
  Zap,
} from "lucide-react";

import "./App.css";

const initialProjects = [
  {
    id: 1,
    name: "Aeris",
    description: "Modern web experience built with React.",
    status: "Completed",
    icon: "A",
    accent: "blue",
  },
  {
    id: 2,
    name: "Sonara",
    description: "Premium audio product web application.",
    status: "Active",
    icon: "S",
    accent: "purple",
  },
  {
    id: 3,
    name: "Devspace",
    description: "Developer workspace and productivity app.",
    status: "Active",
    icon: "D",
    accent: "orange",
  },
];

const initialTasks = [
  {
    id: 1,
    title: "Finish Nexus dashboard",
    project: "Nexus",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Improve Sonara product cards",
    project: "Sonara",
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Deploy Aeris",
    project: "Aeris",
    priority: "Low",
    completed: true,
  },
  {
    id: 4,
    title: "Build responsive layout",
    project: "Nexus",
    priority: "High",
    completed: false,
  },
];

const initialNotes = [
  {
    id: 1,
    title: "V2 visual direction",
    text: "Sharper hierarchy, better spacing and a cleaner command-center feeling.",
  },
  {
    id: 2,
    title: "React practice",
    text: "Keep components reusable and build features instead of just watching tutorials.",
  },
];

const initialActivity = [
  {
    id: 1,
    text: "NEXUS workspace initialized",
    time: "Just now",
  },
  {
    id: 2,
    text: "Aeris marked as completed",
    time: "Today",
  },
  {
    id: 3,
    text: "Sonara product cards updated",
    time: "Yesterday",
  },
];

function getProjectProgress(project, tasks) {
  const projectTasks = tasks.filter(
    (task) => task.project === project.name
  );

  if (!projectTasks.length) return 0;

  const completed = projectTasks.filter(
    (task) => task.completed
  ).length;

  return Math.round((completed / projectTasks.length) * 100);
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [theme, setTheme] = useState(
    localStorage.getItem("nexus-theme") || "dark"
  );

  const [userName, setUserName] = useState(
    localStorage.getItem("nexus-username") || ""
  );

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("nexus-projects");
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("nexus-tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("nexus-notes");
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [activity, setActivity] = useState(() => {
    const saved = localStorage.getItem("nexus-activity");
    return saved ? JSON.parse(saved) : initialActivity;
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [toast, setToast] = useState("");

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  const [newTask, setNewTask] = useState({
    title: "",
    project: "Nexus",
    priority: "Medium",
  });

  const [newNote, setNewNote] = useState({
    title: "",
    text: "",
  });

  /* ---------------- LOCAL STORAGE ---------------- */

  useEffect(() => {
    localStorage.setItem("nexus-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("nexus-username", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("nexus-projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("nexus-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("nexus-notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(
      "nexus-activity",
      JSON.stringify(activity)
    );
  }, [activity]);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  /* ---------------- KEYBOARD ---------------- */

  useEffect(() => {
    const handleKeyboard = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }

      if (e.key === "Escape") {
        setSearchOpen(false);
        setShowProjectModal(false);
        setShowTaskModal(false);
        setShowNoteModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  /* ---------------- DATA ---------------- */

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const taskProgress = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const averageProgress = projects.length
    ? Math.round(
        projects.reduce(
          (sum, project) =>
            sum + getProjectProgress(project, tasks),
          0
        ) / projects.length
      )
    : 0;

  const activeProjects = projects.filter(
    (project) => project.status === "Active"
  ).length;

  const openTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const filteredSearch = useMemo(() => {
    if (!search.trim()) return [];

    const value = search.toLowerCase();

    return [
      ...projects
        .filter((project) =>
          `${project.name} ${project.description}`
            .toLowerCase()
            .includes(value)
        )
        .map((project) => ({
          type: "Project",
          name: project.name,
          page: "Projects",
        })),

      ...tasks
        .filter((task) =>
          `${task.title} ${task.project}`
            .toLowerCase()
            .includes(value)
        )
        .map((task) => ({
          type: "Task",
          name: task.title,
          page: "Tasks",
        })),

      ...notes
        .filter((note) =>
          `${note.title} ${note.text}`
            .toLowerCase()
            .includes(value)
        )
        .map((note) => ({
          type: "Note",
          name: note.title,
          page: "Notes",
        })),
    ].slice(0, 8);
  }, [search, projects, tasks, notes]);

  /* ---------------- HELPERS ---------------- */

  const notify = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const addActivity = (text) => {
    setActivity((prev) => [
      {
        id: Date.now(),
        text,
        time: "Just now",
      },
      ...prev,
    ]);
  };

  const navigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  /* ---------------- TASKS ---------------- */

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const addTask = (e) => {
    e.preventDefault();

    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now(),
      title: newTask.title,
      project: newTask.project,
      priority: newTask.priority,
      completed: false,
    };

    setTasks((prev) => [task, ...prev]);

    addActivity(`Added task "${task.title}"`);

    setNewTask({
      title: "",
      project: "Nexus",
      priority: "Medium",
    });

    setShowTaskModal(false);
    notify("Task added");
  };

  /* ---------------- PROJECTS ---------------- */

  const addProject = (e) => {
    e.preventDefault();

    if (!newProject.name.trim()) return;

    const project = {
      id: Date.now(),
      name: newProject.name,
      description:
        newProject.description || "New workspace project.",
      status: "Active",
      icon: newProject.name[0].toUpperCase(),
      accent: "blue",
    };

    setProjects((prev) => [...prev, project]);

    addActivity(`Created project "${project.name}"`);

    setNewProject({
      name: "",
      description: "",
    });

    setShowProjectModal(false);
    notify("Project created");
  };

  const deleteProject = (id) => {
    const project = projects.find(
      (item) => item.id === id
    );

    setProjects((prev) =>
      prev.filter((project) => project.id !== id)
    );

    addActivity(`Deleted ${project?.name || "project"}`);

    notify("Project deleted");
  };

  /* ---------------- NOTES ---------------- */

  const addNote = (e) => {
    e.preventDefault();

    if (!newNote.title.trim()) return;

    const note = {
      id: Date.now(),
      title: newNote.title,
      text: newNote.text,
    };

    setNotes((prev) => [note, ...prev]);

    addActivity(`Created note "${note.title}"`);

    setNewNote({
      title: "",
      text: "",
    });

    setShowNoteModal(false);
    notify("Note created");
  };

  /* ---------------- RESET ---------------- */

  const resetData = () => {
    setProjects(initialProjects);
    setTasks(initialTasks);
    setNotes(initialNotes);
    setActivity(initialActivity);
    setUserName("");

    localStorage.removeItem("nexus-projects");
    localStorage.removeItem("nexus-tasks");
    localStorage.removeItem("nexus-notes");
    localStorage.removeItem("nexus-activity");
    localStorage.removeItem("nexus-username");

    notify("Workspace reset");
  };

  /* ---------------- NAVIGATION ---------------- */

  const navigation = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      icon: FolderKanban,
    },
    {
      title: "Tasks",
      icon: CheckCircle2,
    },
    {
      title: "Notes",
      icon: StickyNote,
    },
    {
      title: "Analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="nexus">
      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-logo">
            <span />
          </div>

          <div>
            <strong>NEXUS</strong>
            <small>V2.0</small>
          </div>
        </div>

        <div className="workspace-card">
          <div className="avatar">
            {userName
              ? userName[0].toUpperCase()
              : "N"}
          </div>

          <div>
            <span>Workspace</span>
            <strong>
              {userName || "Personal"}
            </strong>
          </div>

          <ChevronDown size={15} />
        </div>

        <div className="nav">
          <p>COMMAND</p>

          {navigation.slice(0, 1).map((item) => (
            <NavButton
              key={item.title}
              item={item}
              active={activePage === item.title}
              onClick={() => navigate(item.title)}
            />
          ))}

          <p>WORKSPACE</p>

          {navigation.slice(1, 5).map((item) => (
            <NavButton
              key={item.title}
              item={item}
              active={activePage === item.title}
              onClick={() => navigate(item.title)}
            />
          ))}

          <p>SYSTEM</p>

          {navigation.slice(5).map((item) => (
            <NavButton
              key={item.title}
              item={item}
              active={activePage === item.title}
              onClick={() => navigate(item.title)}
            />
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span />
            All systems operational
          </div>

          <small>NEXUS V2 • COMMAND CENTER</small>
        </div>
      </aside>

      {/* MAIN */}

      <main className="main">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={19} />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <b>/</b>
            <strong>{activePage}</strong>
          </div>

          <div className="top-actions">
            <button
              className="search-button"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={16} />

              <span>Search anything...</span>

              <kbd>⌘ K</kbd>
            </button>

            <button
              className="icon-button"
              onClick={() =>
                notify("No new notifications")
              }
            >
              <Bell size={17} />
            </button>

            <button
              className="profile-button"
              onClick={() =>
                navigate("Settings")
              }
            >
              {userName
                ? userName[0].toUpperCase()
                : "N"}
            </button>
          </div>
        </header>

        <section className="content">
          {/* DASHBOARD */}

          {activePage === "Dashboard" && (
            <>
              <PageHeader
                eyebrow="PERSONAL COMMAND CENTER"
                title={`Good ${
                  new Date().getHours() < 12
                    ? "morning"
                    : new Date().getHours() < 18
                    ? "afternoon"
                    : "evening"
                }${
                  userName
                    ? `, ${userName}`
                    : ""
                }`}
                description="Your workspace at a glance. Keep moving."
              >
                <button
                  className="secondary-button"
                  onClick={() =>
                    navigate("Analytics")
                  }
                >
                  <BarChart3 size={16} />
                  Analytics
                </button>

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowTaskModal(true)
                  }
                >
                  <Plus size={17} />
                  New task
                </button>
              </PageHeader>

              <div className="hero-grid">
                <div className="hero">
                  <div className="hero-glow glow-one" />
                  <div className="hero-glow glow-two" />

                  <div className="hero-content">
                    <span className="hero-label">
                      <Sparkles size={13} />
                      COMMAND OVERVIEW
                    </span>

                    <h2>
                      Build.
                      <br />
                      Ship.
                      <span> Repeat.</span>
                    </h2>

                    <p>
                      One focused workspace for
                      projects, tasks and ideas.
                    </p>

                    <button
                      className="hero-action"
                      onClick={() =>
                        setShowProjectModal(true)
                      }
                    >
                      Start a project
                      <span>↗</span>
                    </button>
                  </div>

                  <div className="progress-orbit">
                    <div>
                      <strong>
                        {averageProgress}%
                      </strong>

                      <span>
                        AVG PROGRESS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="metrics">
                  <Metric
                    icon={<Zap />}
                    label="Task completion"
                    value={`${taskProgress}%`}
                    detail={`${completedTasks} completed`}
                  />

                  <Metric
                    icon={<FolderKanban />}
                    label="Active projects"
                    value={activeProjects}
                    detail={`${projects.length} total`}
                  />

                  <Metric
                    icon={<Activity />}
                    label="Open tasks"
                    value={openTasks}
                    detail="Needs attention"
                  />
                </div>
              </div>

              <SectionTitle
                eyebrow="WORKSPACE"
                title="Current focus"
                action="View all"
                onClick={() =>
                  navigate("Projects")
                }
              />

              <div className="project-grid">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    progress={getProjectProgress(
                      project,
                      tasks
                    )}
                  />
                ))}

                <button
                  className="add-project-card"
                  onClick={() =>
                    setShowProjectModal(true)
                  }
                >
                  <Plus size={22} />

                  <strong>
                    Start something new
                  </strong>

                  <span>
                    Create a project
                  </span>
                </button>
              </div>

              <div className="dashboard-grid">
                <div className="panel">
                  <PanelTitle
                    icon={<CheckCircle2 />}
                    title="Next up"
                    action="Tasks"
                    onClick={() =>
                      navigate("Tasks")
                    }
                  />

                  <div className="task-list">
                    {tasks
                      .filter(
                        (task) => !task.completed
                      )
                      .slice(0, 5)
                      .map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          onToggle={toggleTask}
                        />
                      ))}
                  </div>
                </div>

                <div className="panel">
                  <PanelTitle
                    icon={<Activity />}
                    title="Activity"
                    action="Analytics"
                    onClick={() =>
                      navigate("Analytics")
                    }
                  />

                  <ActivityList
                    activity={activity}
                  />
                </div>
              </div>
            </>
          )}

          {/* PROJECTS */}

          {activePage === "Projects" && (
            <>
              <PageHeader
                eyebrow="WORKSPACE"
                title="Projects"
                description="Everything you're building, in one place."
              >
                <button
                  className="primary-button"
                  onClick={() =>
                    setShowProjectModal(true)
                  }
                >
                  <Plus size={17} />
                  New project
                </button>
              </PageHeader>

              <div className="project-grid">
                {projects.map((project) => (
                  <div
                    className="project-card"
                    key={project.id}
                  >
                    <div className="project-card-top">
                      <ProjectIcon
                        project={project}
                      />

                      <button
                        className="dots"
                        onClick={() =>
                          deleteProject(
                            project.id
                          )
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <ProjectTitle
                      project={project}
                    />

                    <p>
                      {project.description}
                    </p>

                    <ProgressBar
                      progress={getProjectProgress(
                        project,
                        tasks
                      )}
                    />

                    <div className="project-footer">
                      <span>
                        {
                          tasks.filter(
                            (task) =>
                              task.project ===
                              project.name
                          ).length
                        }{" "}
                        linked tasks
                      </span>

                      <MoreHorizontal size={15} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TASKS */}

          {activePage === "Tasks" && (
            <TasksPage
              tasks={tasks}
              toggleTask={toggleTask}
              onAdd={() =>
                setShowTaskModal(true)
              }
            />
          )}

          {/* NOTES */}

          {activePage === "Notes" && (
            <>
              <PageHeader
                eyebrow="WORKSPACE"
                title="Notes"
                description="Capture ideas before they disappear."
              >
                <button
                  className="primary-button"
                  onClick={() =>
                    setShowNoteModal(true)
                  }
                >
                  <Plus size={17} />
                  New note
                </button>
              </PageHeader>

              <div className="notes-grid">
                {notes.map((note) => (
                  <article
                    className="note-card"
                    key={note.id}
                  >
                    <div className="note-mark">
                      <StickyNote size={15} />
                    </div>

                    <span>NOTE</span>

                    <h3>{note.title}</h3>

                    <p>{note.text}</p>

                    <button className="text-button">
                      Open note ↗
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}

          {/* ANALYTICS */}

          {activePage === "Analytics" && (
            <>
              <PageHeader
                eyebrow="INSIGHTS"
                title="Analytics"
                description="A clean read on your current momentum."
              />

              <div className="analytics-metrics">
                <Metric
                  icon={<BarChart3 />}
                  label="Average progress"
                  value={`${averageProgress}%`}
                  detail="Across all projects"
                />

                <Metric
                  icon={<CheckCircle2 />}
                  label="Task completion"
                  value={`${taskProgress}%`}
                  detail={`${completedTasks}/${tasks.length} complete`}
                />

                <Metric
                  icon={<Zap />}
                  label="High priority"
                  value={
                    tasks.filter(
                      (task) =>
                        task.priority ===
                          "High" &&
                        !task.completed
                    ).length
                  }
                  detail="Open items"
                />
              </div>

              <div className="analytics-grid">
                <div className="panel">
                  <PanelTitle
                    icon={<FolderKanban />}
                    title="Project completion"
                  />

                  <div className="analytics-list">
                    {projects.map((project) => {
                      const progress =
                        getProjectProgress(
                          project,
                          tasks
                        );

                      return (
                        <div
                          className="analytics-row"
                          key={project.id}
                        >
                          <div className="analytics-name">
                            <ProjectIcon
                              project={project}
                              small
                            />

                            <strong>
                              {project.name}
                            </strong>
                          </div>

                          <ProgressBar
                            progress={progress}
                          />

                          <b>{progress}%</b>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="panel">
                  <PanelTitle
                    icon={<Activity />}
                    title="Task distribution"
                  />

                  <Distribution
                    tasks={tasks}
                  />
                </div>
              </div>
            </>
          )}

          {/* SETTINGS */}

          {activePage === "Settings" && (
            <>
              <PageHeader
                eyebrow="SYSTEM"
                title="Settings"
                description="Tune your command center."
              />

              <div className="settings">
                <div className="setting">
                  <div>
                    <strong>
                      Appearance
                    </strong>

                    <span>
                      Choose the interface
                      theme.
                    </span>
                  </div>

                  <button
                    className="theme-switch"
                    onClick={() =>
                      setTheme(
                        theme === "dark"
                          ? "light"
                          : "dark"
                      )
                    }
                  >
                    {theme === "dark" ? (
                      <>
                        <Moon size={14} />
                        Dark
                      </>
                    ) : (
                      <>
                        <Sun size={14} />
                        Light
                      </>
                    )}
                  </button>
                </div>

                <div className="setting username-setting">
                  <div>
                    <strong>
                      Username
                    </strong>

                    <span>
                      This name appears across
                      your workspace.
                    </span>
                  </div>

                  <input
                    type="text"
                    maxLength={20}
                    value={userName}
                    placeholder="Enter your username..."
                    onChange={(e) =>
                      setUserName(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="setting">
                  <div>
                    <strong>
                      Local Storage
                    </strong>

                    <span>
                      Your Nexus data is stored
                      locally in this browser.
                    </span>
                  </div>

                  <span className="active-status">
                    <i />
                    Active
                  </span>
                </div>

                <div className="setting danger">
                  <div>
                    <strong>
                      Reset Workspace
                    </strong>

                    <span>
                      Restore all projects,
                      tasks and notes.
                    </span>
                  </div>

                  <button
                    className="danger-button"
                    onClick={resetData}
                  >
                    <Trash2 size={14} />
                    Reset Data
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* SEARCH */}

      {searchOpen && (
        <div
          className="overlay"
          onMouseDown={() =>
            setSearchOpen(false)
          }
        >
          <div
            className="search-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            <div className="search-input">
              <Search size={18} />

              <input
                autoFocus
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search projects, tasks, notes..."
              />

              <kbd>ESC</kbd>
            </div>

            <div className="search-results">
              {!search && (
                <div className="search-empty">
                  <Sparkles size={17} />
                  Search your entire workspace
                </div>
              )}

              {filteredSearch.map(
                (result, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(
                        result.page
                      );
                      setSearchOpen(false);
                      setSearch("");
                    }}
                  >
                    <span>
                      {result.type}
                    </span>

                    <strong>
                      {result.name}
                    </strong>
                  </button>
                )
              )}

              {search &&
                !filteredSearch.length && (
                  <div className="search-empty">
                    Nothing found.
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}

      {showProjectModal && (
        <Modal
          title="Create project"
          onClose={() =>
            setShowProjectModal(false)
          }
        >
          <form onSubmit={addProject}>
            <label>
              Project name

              <input
                autoFocus
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Aurora"
              />
            </label>

            <label>
              Description

              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    description:
                      e.target.value,
                  })
                }
                placeholder="What are you building?"
              />
            </label>

            <button className="primary-button full">
              <Plus size={16} />
              Create project
            </button>
          </form>
        </Modal>
      )}

      {/* TASK MODAL */}

      {showTaskModal && (
        <Modal
          title="Create task"
          onClose={() =>
            setShowTaskModal(false)
          }
        >
          <form onSubmit={addTask}>
            <label>
              Task

              <input
                autoFocus
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    title: e.target.value,
                  })
                }
                placeholder="What needs to happen?"
              />
            </label>

            <div className="form-grid">
              <label>
                Project

                <select
                  value={newTask.project}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      project:
                        e.target.value,
                    })
                  }
                >
                  <option>Nexus</option>

                  {projects.map(
                    (project) => (
                      <option
                        key={project.id}
                      >
                        {project.name}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                Priority

                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      priority:
                        e.target.value,
                    })
                  }
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>
            </div>

            <button className="primary-button full">
              <Plus size={16} />
              Add task
            </button>
          </form>
        </Modal>
      )}

      {/* NOTE MODAL */}

      {showNoteModal && (
        <Modal
          title="New note"
          onClose={() =>
            setShowNoteModal(false)
          }
        >
          <form onSubmit={addNote}>
            <label>
              Title

              <input
                autoFocus
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({
                    ...newNote,
                    title: e.target.value,
                  })
                }
                placeholder="Note title"
              />
            </label>

            <label>
              Content

              <textarea
                rows="5"
                value={newNote.text}
                onChange={(e) =>
                  setNewNote({
                    ...newNote,
                    text: e.target.value,
                  })
                }
                placeholder="Write something..."
              />
            </label>

            <button className="primary-button full">
              <StickyNote size={16} />
              Save note
            </button>
          </form>
        </Modal>
      )}

      {/* TOAST */}

      {toast && (
        <div className="toast">
          <Check size={15} />
          {toast}
        </div>
      )}

      {sidebarOpen && (
        <div
          className="mobile-backdrop"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function NavButton({
  item,
  active,
  onClick,
}) {
  const Icon = item.icon;

  return (
    <button
      className={`nav-button ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <Icon size={17} />
      <span>{item.title}</span>

      {active && <i />}
    </button>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <div className="page-header">
      <div>
        <span>{eyebrow}</span>

        <h1>{title}</h1>

        <p>{description}</p>
      </div>

      {children && (
        <div className="header-actions">
          {children}
        </div>
      )}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  action,
  onClick,
}) {
  return (
    <div className="section-title">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>

      <button
        className="text-button"
        onClick={onClick}
      >
        {action} ↗
      </button>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="metric">
      <div className="metric-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function ProjectIcon({
  project,
  small = false,
}) {
  return (
    <div
      className={`project-icon ${
        small ? "small" : ""
      } ${project.accent}`}
    >
      {project.icon}
    </div>
  );
}

function ProjectTitle({ project }) {
  return (
    <div className="project-title">
      <h3>{project.name}</h3>

      <span
        className={
          project.status === "Completed"
            ? "completed"
            : ""
        }
      >
        {project.status}
      </span>
    </div>
  );
}

function ProjectCard({
  project,
  progress,
}) {
  return (
    <div className="project-card">
      <div className="project-card-top">
        <ProjectIcon project={project} />

        <button className="dots">
          <MoreHorizontal size={17} />
        </button>
      </div>

      <ProjectTitle project={project} />

      <p>{project.description}</p>

      <ProgressBar progress={progress} />

      <div className="project-footer">
        <span>Updated recently</span>
        <span>↗</span>
      </div>
    </div>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="progress-area">
      <div className="progress-info">
        <span>Progress</span>
        <strong>{progress}%</strong>
      </div>

      <div className="progress-bar">
        <i
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

function PanelTitle({
  icon,
  title,
  action,
  onClick,
}) {
  return (
    <div className="panel-title">
      <div>
        <span>{icon}</span>
        <h3>{title}</h3>
      </div>

      {action && (
        <button
          className="text-button"
          onClick={onClick}
        >
          {action} ↗
        </button>
      )}
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
}) {
  return (
    <div
      className={`task-row ${
        task.completed ? "done" : ""
      }`}
    >
      <button
        className="task-check"
        onClick={() =>
          onToggle(task.id)
        }
      >
        {task.completed ? (
          <Check size={13} />
        ) : (
          <Circle size={14} />
        )}
      </button>

      <div>
        <strong>{task.title}</strong>
        <span>{task.project}</span>
      </div>

      <em
        className={`priority ${task.priority.toLowerCase()}`}
      >
        {task.priority}
      </em>
    </div>
  );
}

function ActivityList({
  activity,
}) {
  return (
    <div className="activity-list">
      {activity.slice(0, 5).map((item) => (
        <div
          className="activity-row"
          key={item.id}
        >
          <span />

          <div>
            <strong>{item.text}</strong>
            <small>{item.time}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

function TasksPage({
  tasks,
  toggleTask,
  onAdd,
}) {
  const [filter, setFilter] =
    useState("All");

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter(
          (task) =>
            task.priority === filter
        );

  return (
    <>
      <PageHeader
        eyebrow="WORKSPACE"
        title="Tasks"
        description="Turn plans into visible progress."
      >
        <button
          className="primary-button"
          onClick={onAdd}
        >
          <Plus size={17} />
          New task
        </button>
      </PageHeader>

      <div className="filters">
        {[
          "All",
          "High",
          "Medium",
          "Low",
        ].map((item) => (
          <button
            key={item}
            className={
              filter === item
                ? "filter active"
                : "filter"
            }
            onClick={() =>
              setFilter(item)
            }
          >
            {item}
          </button>
        ))}
      </div>

      <div className="panel">
        {filteredTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={toggleTask}
          />
        ))}
      </div>
    </>
  );
}

function Distribution({ tasks }) {
  const priorities = [
    "High",
    "Medium",
    "Low",
  ];

  return (
    <div className="distribution">
      {priorities.map((priority) => {
        const count =
          tasks.filter(
            (task) =>
              task.priority === priority
          ).length;

        return (
          <div
            className="distribution-row"
            key={priority}
          >
            <span>{priority}</span>

            <div>
              <i
                style={{
                  width: `${Math.min(
                    count * 25,
                    100
                  )}%`,
                }}
              />
            </div>

            <b>{count}</b>
          </div>
        );
      })}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}) {
  return (
    <div
      className="overlay"
      onMouseDown={onClose}
    >
      <div
        className="modal"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-header">
          <h2>{title}</h2>

          <button
            className="icon-button"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default App;