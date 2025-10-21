export const users = [
  // Customer Users
  {
    id: 1,
    email: "john.doe@example.com",
    password: "customer123",
    name: "John Doe",
    type: "customer",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
  },
  {
    id: 2,
    email: "sarah.wilson@example.com",
    password: "customer123",
    name: "Sarah Wilson",
    type: "customer",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, City, State 12345",
  },
  {
    id: 3,
    email: "mike.chen@example.com",
    password: "customer123",
    name: "Mike Chen",
    type: "customer",
    phone: "+1 (555) 345-6789",
    address: "789 Pine Rd, City, State 12345",
  },
  {
    id: 4,
    email: "emma.davis@example.com",
    password: "customer123",
    name: "Emma Davis",
    type: "customer",
    phone: "+1 (555) 456-7890",
    address: "321 Elm St, City, State 12345",
  },
  {
    id: 5,
    email: "david.brown@example.com",
    password: "customer123",
    name: "David Brown",
    type: "customer",
    phone: "+1 (555) 567-8901",
    address: "654 Maple Dr, City, State 12345",
  },

  // Admin/Operation Users
  {
    id: 6,
    email: "admin@rdphoto.com",
    password: "admin123",
    name: "Admin User",
    type: "admin",
    phone: "+1 (555) 999-9999",
    address: "RD Photo Studio, 123 Photo Street, City, State 12345",
  },
  {
    id: 7,
    email: "photographer@rdphoto.com",
    password: "photographer123",
    name: "Sarah Johnson",
    type: "operation",
    phone: "+1 (555) 888-8888",
    address: "RD Photo Studio, 123 Photo Street, City, State 12345",
  },
  {
    id: 8,
    email: "editor@rdphoto.com",
    password: "editor123",
    name: "Mike Chen",
    type: "operation",
    phone: "+1 (555) 777-7777",
    address: "RD Photo Studio, 123 Photo Street, City, State 12345",
  },
];

// Helper function to find user by email and password
export const authenticateUser = (email, password) => {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
};

// Helper function to get user by ID
export const getUserById = (id) => {
  return users.find((user) => user.id === id);
};

// Helper function to get all users
export const getAllUsers = () => {
  return users;
};

// Helper function to get all customers
export const getAllCustomers = () => {
  return users.filter((user) => user.type === "customer");
};

// Helper function to get all operation users
export const getAllOperationUsers = () => {
  return users.filter((user) => user.type === "operation" || user.type === "admin");
};
