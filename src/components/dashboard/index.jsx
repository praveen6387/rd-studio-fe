"use client";

import { Users, Camera, CalendarDays, DollarSign, CheckCircle2 } from "lucide-react";
import DashboardPageLayout from "@/components/utils/DashboardPagelayout";

const StatCard = ({ icon, label, value, change }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change > 0 ? "text-green-600" : "text-red-600"}`}>
            {change > 0 ? "+" : ""}
            {change}% from last month
          </p>
        )}
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-gray-600 text-xl">{icon}</div>
      </div>
    </div>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="text-gray-600 text-sm">{activity.icon}</div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
            <p className="text-sm text-gray-500">{activity.description}</p>
            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UpcomingSessions = ({ sessions }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
    <div className="space-y-3">
      {sessions.map((session, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">{session.client}</p>
            <p className="text-sm text-gray-500">{session.type}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{session.date}</p>
            <p className="text-xs text-gray-500">{session.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PerformanceMetric = ({ label, value, target, status }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          status === "good"
            ? "bg-green-100 text-green-800"
            : status === "warning"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {status === "good" ? "On Track" : status === "warning" ? "Needs Attention" : "Behind"}
      </span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className="text-sm text-gray-500">/ {target}</span>
    </div>
    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${
          status === "good" ? "bg-green-500" : status === "warning" ? "bg-yellow-500" : "bg-red-500"
        }`}
        style={{ width: `${(value / target) * 100}%` }}
      ></div>
    </div>
  </div>
);

const DashboardIndex = () => {
  const recentActivities = [
    {
      icon: <Camera />,
      title: "Wedding Session Completed",
      description: "Sarah & John wedding photos uploaded",
      time: "2 hours ago",
    },
    {
      icon: <Users />,
      title: "New Client Registration",
      description: "Mike Johnson booked portrait session",
      time: "4 hours ago",
    },
    {
      icon: <CheckCircle2 />,
      title: "Photo Editing Complete",
      description: "Corporate event photos ready for delivery",
      time: "6 hours ago",
    },
    {
      icon: <CalendarDays />,
      title: "Session Scheduled",
      description: "Family portrait session confirmed for Friday",
      time: "1 day ago",
    },
  ];

  const upcomingSessions = [
    {
      client: "Emma Davis",
      type: "Portrait Session",
      date: "Tomorrow",
      time: "2:00 PM",
    },
    {
      client: "Robert Wilson",
      type: "Corporate Event",
      date: "Friday",
      time: "10:00 AM",
    },
    {
      client: "Lisa Chen",
      type: "Wedding",
      date: "Saturday",
      time: "3:00 PM",
    },
  ];

  return (
    <DashboardPageLayout title="Dashboard" description="Overview of your photography business">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Users />} label="Total Clients" value="1,247" change={12} />
        <StatCard icon={<Camera />} label="Sessions This Month" value="34" change={8} />
        <StatCard icon={<DollarSign />} label="Revenue" value="$12,450" change={-3} />
        <StatCard icon={<CalendarDays />} label="Upcoming Sessions" value="8" change={0} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>

        {/* Upcoming Sessions */}
        <div>
          <UpcomingSessions sessions={upcomingSessions} />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PerformanceMetric label="Client Satisfaction" value={4.8} target={5.0} status="good" />
        <PerformanceMetric label="Session Completion Rate" value={85} target={90} status="warning" />
        <PerformanceMetric label="Photo Delivery Time" value={3.2} target={4.5} status="warning" />
      </div>
    </DashboardPageLayout>
  );
};

export default DashboardIndex;
