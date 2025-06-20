import React, { useState, useEffect } from "react";
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
  Timer,
  Loader2
} from "lucide-react";

interface Application {
  message: string | null;
  universityLink: string | null;
  courseName: string;
  duration: string;
  typesOfExams: string | null;
  cost: string | null;
  universityName: string;
  applicationId: string;
  intakeMonth: string;
  intakeYear: string;
  country: string | null;
  degree: string | null;
  tutionFee1styr: string | null;
  applicationFee: string | null;
  courseUrl: string | null;
  intake2: string | null;
  intake: string | null;
  intake3: string | null;
  universityLogo: string | null;
  address: string | null;
  universityCampusCity: string | null;
}

interface ApiResponse {
  data: Application[];
  count: number;
}
interface ApplicationsProps {
  onNavigate?: (tab: string) => void;
}

const Applications: React.FC<ApplicationsProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

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

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get userId from localStorage (try both 'userId' and 'customerId')
      const userId = localStorage.getItem('userId') || localStorage.getItem('customerId');
      
      if (!userId) {
        throw new Error('User ID not found in localStorage');
      }

      const baseUrl = 'https://meta.oxyloans.com/api';
      const url = `${baseUrl}/user-service/student/${userId}/applications-of-user?pageIndex=${pageIndex}&pageSize=${pageSize}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setApplications(data.data || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [pageIndex, pageSize]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.universityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.courseName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      draft: 0,
      "in-progress": 0,
      submitted: applications.length, // Assuming all fetched applications are submitted
      "under-review": 0,
      accepted: 0,
      rejected: 0,
    };
    return stats;
  };

  const stats = getStatusStats();

  const formatIntakeDate = (month: string, year: string) => {
    if (!month || !year) return 'N/A';
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  };

  const getUniversityLogo = (universityName: string) => {
    // Default university emoji based on name or return a generic one
    const logoMap: { [key: string]: string } = {
      'MIT': '🏛️',
      'Stanford': '🎓',
      'Harvard': '🏛️',
      'Oxford': '🏛️',
      'Cambridge': '🏛️',
    };
    
    for (const [name, logo] of Object.entries(logoMap)) {
      if (universityName.toLowerCase().includes(name.toLowerCase())) {
        return logo;
      }
    }
    return '🎓'; // Default logo
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Loader2 className="w-16 h-16 text-violet-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Applications</h3>
          <p className="text-gray-600">Please wait while we fetch your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Applications</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchApplications}
            className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              Track and manage all your university applications ({totalCount} total)
            </p>
          </div>
          {/* <button className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button> */}
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
            <button 
              onClick={fetchApplications}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <div
            key={app.applicationId}
            className="bg-white rounded-xl shadow-sm border-l-4 border-violet-500 p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="flex items-start space-x-4 flex-1 mb-4 lg:mb-0">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                  {app.universityLogo || getUniversityLogo(app.universityName)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {app.universityName}
                    </h4>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Send className="w-3 h-3 mr-1" />
                      Submitted
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{app.courseName}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Intake: </span>
                      <span className="font-medium text-gray-900">
                        {formatIntakeDate(app.intakeMonth, app.intakeYear)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration: </span>
                      <span className="font-medium text-gray-900">{app.duration || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fee: </span>
                      <span className="font-medium text-gray-900">
                        {app.applicationFee || app.tutionFee1styr || 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  {app.universityCampusCity && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Campus: </span>
                      <span className="font-medium text-gray-900">{app.universityCampusCity}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-4">
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    {app.intakeYear}
                  </div>
                  <div className="text-sm text-gray-600">
                    Application Year
                  </div>
                </div>

                {/* <div className="flex items-center space-x-2">
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
                    View Details
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>

     {filteredApplications.length === 0 && !loading && (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
      <p className="text-gray-600 mb-6">
        {searchTerm 
          ? "Try adjusting your search criteria"
          : "Start your study abroad journey by searching for universities"
        }
      </p>
      <button 
        onClick={() => onNavigate?.('universities')}
        className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
      >
        Search Universities
      </button>
    </div>
  )}

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount} applications
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                disabled={pageIndex === 0}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-violet-500 text-white rounded-lg">
                {pageIndex + 1}
              </span>
              <button
                onClick={() => setPageIndex(pageIndex + 1)}
                disabled={(pageIndex + 1) * pageSize >= totalCount}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;