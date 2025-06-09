import React, { useState } from "react";
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Send,
  FileText,
  Timer
} from "lucide-react";

const Applications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const applications = [
    {
      id: 1,
      university: "Stanford University",
      program: "MS Computer Science",
      date: "Dec 15, 2024",
      daysLeft: 8,
      priority: "high",
      status: "in-progress",
      progress: 75,
      documents: {
        completed: 6,
        total: 8
      },
      applicationFee: "$90",
      logo: "🎓"
    },
    {
      id: 2,
      university: "MIT",
      program: "MS Artificial Intelligence",
      date: "Dec 20, 2024",
      daysLeft: 13,
      priority: "high",
      status: "submitted",
      progress: 100,
      documents: {
        completed: 8,
        total: 8
      },
      applicationFee: "$75",
      logo: "🏛️"
    },
    {
      id: 3,
      university: "Carnegie Mellon",
      program: "MS Software Engineering",
      date: "Jan 5, 2025",
      daysLeft: 29,
      priority: "medium",
      status: "draft",
      progress: 40,
      documents: {
        completed: 3,
        total: 8
      },
      applicationFee: "$85",
      logo: "🎓"
    },
    {
      id: 4,
      university: "University of Washington",
      program: "MS Data Science",
      date: "Jan 15, 2025",
      daysLeft: 39,
      priority: "medium",
      status: "under-review",
      progress: 100,
      documents: {
        completed: 8,
        total: 8
      },
      applicationFee: "$70",
      logo: "🏫"
    },
    {
      id: 5,
      university: "Georgia Tech",
      program: "MS Computer Science",
      date: "Feb 1, 2025",
      daysLeft: 56,
      priority: "low",
      status: "accepted",
      progress: 100,
      documents: {
        completed: 8,
        total: 8
      },
      applicationFee: "$80",
      logo: "🎓"
    },
    {
      id: 6,
      university: "UC Berkeley",
      program: "MS Computer Science",
      date: "Jan 20, 2025",
      daysLeft: 44,
      priority: "medium",
      status: "rejected",
      progress: 100,
      documents: {
        completed: 8,
        total: 8
      },
      applicationFee: "$95",
      logo: "🏛️"
    },
  ];

  const statusConfig = {
    "draft": { 
      color: "bg-gray-100 text-gray-800", 
      icon: FileText,
      label: "Draft" 
    },
    "in-progress": { 
      color: "bg-blue-100 text-blue-800", 
      icon: Clock,
      label: "In Progress" 
    },
    "submitted": { 
      color: "bg-purple-100 text-purple-800", 
      icon: Send,
      label: "Submitted" 
    },
    "under-review": { 
      color: "bg-amber-100 text-amber-800", 
      icon: Timer,
      label: "Under Review" 
    },
    "accepted": { 
      color: "bg-green-100 text-green-800", 
      icon: CheckCircle,
      label: "Accepted" 
    },
    "rejected": { 
      color: "bg-red-100 text-red-800", 
      icon: AlertTriangle,
      label: "Rejected" 
    },
  };

  const priorityConfig = {
    "high": "bg-red-50 border-red-500",
    "medium": "bg-amber-50 border-amber-500",
    "low": "bg-green-50 border-green-500"
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      draft: applications.filter(app => app.status === "draft").length,
      "in-progress": applications.filter(app => app.status === "in-progress").length,
      submitted: applications.filter(app => app.status === "submitted").length,
      "under-review": applications.filter(app => app.status === "under-review").length,
      accepted: applications.filter(app => app.status === "accepted").length,
      rejected: applications.filter(app => app.status === "rejected").length,
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              My Applications
            </h3>
            <p className="text-gray-600">
              Track and manage all your university applications
            </p>
          </div>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-90">Total</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">{stats.draft}</div>
            <div className="text-sm text-gray-600">Draft</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{stats["in-progress"]}</div>
            <div className="text-sm text-blue-600">In Progress</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">{stats.submitted}</div>
            <div className="text-sm text-purple-600">Submitted</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-amber-600">{stats["under-review"]}</div>
            <div className="text-sm text-amber-600">Under Review</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-sm text-green-600">Accepted</div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-red-600">Rejected</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="in-progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="under-review">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => {
          const StatusIcon = statusConfig[app.status as keyof typeof statusConfig].icon;
          return (
            <div
              key={app.id}
              className={`bg-white rounded-xl shadow-sm border-l-4 p-6 hover:shadow-md transition-all duration-300 ${
                priorityConfig[app.priority as keyof typeof priorityConfig]
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="flex items-start space-x-4 flex-1 mb-4 lg:mb-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                    {app.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">
                        {app.university}
                      </h4>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        statusConfig[app.status as keyof typeof statusConfig].color
                      }`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[app.status as keyof typeof statusConfig].label}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{app.program}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Application Progress</span>
                        <span className="text-sm font-medium text-gray-900">{app.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${app.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Deadline: </span>
                        <span className="font-medium text-gray-900">{app.date}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Documents: </span>
                        <span className="font-medium text-gray-900">
                          {app.documents.completed}/{app.documents.total}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fee: </span>
                        <span className="font-medium text-gray-900">{app.applicationFee}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-4">
                  <div className="text-right">
                    <div className={`font-bold text-xl ${
                      app.priority === "high" ? "text-red-600" :
                      app.priority === "medium" ? "text-amber-600" : "text-green-600"
                    }`}>
                      {app.daysLeft} days left
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {app.priority} Priority
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
                      {app.status === "draft" ? "Continue" : 
                       app.status === "in-progress" ? "Complete" :
                       app.status === "submitted" ? "Track" :
                       app.status === "under-review" ? "Check Status" :
                       app.status === "accepted" ? "View Offer" : "View Details"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredApplications.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Start your study abroad journey by creating your first application"
            }
          </p>
          <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
            Create New Application
          </button>
        </div>
      )}
    </div>
  );
};

export default Applications;