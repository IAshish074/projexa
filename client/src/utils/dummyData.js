export const dummyUser = {
  id: 'u1',
  name: 'Ashish Kumar',
  email: 'ashish@example.com',
  role: 'admin', // or 'member'
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
};

export const teamMembers = [
  { id: 'u1', name: 'Ashish Kumar', role: 'Admin', email: 'ashish@example.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', status: 'online' },
  { id: 'u2', name: 'Jane Doe', role: 'Developer', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', status: 'offline' },
  { id: 'u3', name: 'John Smith', role: 'Designer', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', status: 'online' },
  { id: 'u4', name: 'Emily Chen', role: 'Product Manager', email: 'emily@example.com', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', status: 'away' },
];

export const dummyProjects = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Overhauling the corporate website with a modern look and better UX.',
    status: 'in-progress',
    progress: 65,
    dueDate: '2026-06-15',
    members: ['u1', 'u2', 'u3'],
  },
  {
    id: 'p2',
    name: 'Mobile App Development',
    description: 'Creating a new cross-platform mobile application for our services.',
    status: 'planning',
    progress: 20,
    dueDate: '2026-08-01',
    members: ['u1', 'u2', 'u4'],
  },
  {
    id: 'p3',
    name: 'Q3 Marketing Campaign',
    description: 'Planning and executing the Q3 marketing initiatives.',
    status: 'completed',
    progress: 100,
    dueDate: '2026-04-30',
    members: ['u3', 'u4'],
  }
];

export const dummyTasks = [
  {
    id: 't1',
    title: 'Design Mockups',
    description: 'Create initial design mockups for the homepage.',
    status: 'completed', // 'todo', 'in-progress', 'completed'
    priority: 'high', // 'low', 'medium', 'high'
    projectId: 'p1',
    assignee: 'u3',
    dueDate: '2026-05-10'
  },
  {
    id: 't2',
    title: 'Setup Backend Server',
    description: 'Initialize Node.js server with Express and MongoDB.',
    status: 'in-progress',
    priority: 'critical',
    projectId: 'p2',
    assignee: 'u2',
    dueDate: '2026-05-12'
  },
  {
    id: 't3',
    title: 'Write User Stories',
    description: 'Detail user stories for the new mobile app features.',
    status: 'todo',
    priority: 'medium',
    projectId: 'p2',
    assignee: 'u4',
    dueDate: '2026-05-15'
  },
  {
    id: 't4',
    title: 'Fix Navigation Bug',
    description: 'Resolve the responsive issue on the mobile menu.',
    status: 'todo',
    priority: 'high',
    projectId: 'p1',
    assignee: 'u1',
    dueDate: '2026-05-11'
  }
];

export const recentActivity = [
  { id: 1, user: 'Jane Doe', action: 'completed task', target: 'Design Mockups', time: '2 hours ago' },
  { id: 2, user: 'John Smith', action: 'commented on', target: 'Setup Backend Server', time: '4 hours ago' },
  { id: 3, user: 'Ashish Kumar', action: 'created project', target: 'Mobile App Development', time: '1 day ago' },
];
