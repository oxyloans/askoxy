import React, { useState } from "react";
import {
  Award,
  Search,
  Filter,
  Plus,
  Calendar,
  DollarSign,
  Globe,
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  ExternalLink,
  Bookmark,
  Star,
  Users,
  TrendingUp
} from "lucide-react";

const Scholarships: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");

  const scholarships = [
    {
      id: 1,
      name: "Fulbright Scholarship",
      amount: "$25,000 - $45,000",
      fullAmount: true,
      deadline: "October 15, 2024",
      status: "applied",
      country: "USA",
      type: "Merit-based",
      level: "Graduate",
      field: "All Fields",
      duration: "1-2 years",
      description: "Prestigious international educational exchange program for graduate students, scholars, and professionals.",
      requirements: ["Bachelor's degree", "English proficiency", "Leadership experience"],
      benefits: ["Full tuition coverage", "Living stipend", "Health insurance", "Travel allowance"],
      applicants: "15,000+",
      acceptance: "12%",
      logo: "🇺🇸",
      difficulty: "Very High",
      featured: true
    },
    {
      id: 2,
      name: "Chevening Scholarship",
      amount: "Full Funding",
      fullAmount: true,
      deadline: "November 2, 2024",
      status: "under-review",
      country: "UK",
      type: "Merit-based",
      level: "Masters",
      field: "All Fields",
      duration: "1 year",
      description: "UK government's global scholarship programme for future leaders pursuing one-year master's degrees.",
      requirements: ["Bachelor's degree", "2+ years work experience", "English proficiency"],
      benefits: ["Full tuition fees", "Monthly stipend", "Return airfare", "Visa fees"],
      applicants: "65,000+",
      acceptance: "3%",
      logo: "🇬🇧",
      difficulty: "Very High",
      featured: true
    },
    {
      id: 3,
      name: "DAAD Scholarship",
      amount: "€12,000 - €15,000",
      fullAmount: false,
      deadline: "December 1, 2024",
      status: "eligible",
      country: "Germany",
      type: "Merit-based",
      level: "Graduate/PhD",
      field: "STEM, Engineering",
      duration: "1-2 years",
      description: "German Academic Exchange Service scholarships for international students in Germany.",
      requirements: ["Bachelor's degree", "German/English proficiency", "Academic excellence"],
      benefits: ["Monthly stipend", "Health insurance", "Study/research allowance"],
      applicants: "25,000+",
      acceptance: "15%",
      logo: "🇩🇪",
      difficulty: "High",
      featured: false
    },
    {
      id: 4,
      name: "Australia Awards",
      amount: "Full Funding",
      fullAmount: true,
      deadline: "April 30, 2025",
      status: "bookmarked",
      country: "Australia",
      type: "Development",
      level: "Masters/PhD",
      field: "Development Studies",
      duration: "2-4 years",
      description: "Australian government scholarships for developing country students to study in Australia.",
      requirements: ["Bachelor's degree", "Work experience", "Return commitment"],
      benefits: ["Full tuition", "Living allowance", "Health cover", "Return airfare"],
      applicants: "8,000+",
      acceptance: "25%",
      logo: "🇦🇺",
      difficulty: "High",
      featured: false
    },
    {
      id: 5,
      name: "Erasmus Mundus",
      amount: "€25,000 - €29,000",
      fullAmount: true,
      deadline: "January 15, 2025",
      status: "eligible",
      country: "Europe",
      type: "Joint Degree",
      level: "Masters",
      field: "Various",
      duration: "2 years",
      description: "EU-funded international master's programmes with study periods in multiple European countries.",
      requirements: ["Bachelor's degree", "English proficiency", "Motivation letter"],
      benefits: ["Full scholarship", "Travel costs", "Installation costs"],
      applicants: "12,000+",
      acceptance: "20%",
      logo: "🇪🇺",
      difficulty: "High",
      featured: false
    },
    {
      id: 6,
      name: "Gates Cambridge Scholarship",
      amount: "Full Funding",
      fullAmount: true,
      deadline: "December 3, 2024",
      status: "eligible",
      country: "UK",
      type: "Merit-based",
      level: "Graduate/PhD",
      field: "All Fields",
      duration: "1-4 years",
      description: "Prestigious scholarship for outstanding students from outside the UK to study at Cambridge.",
      requirements: ["Exceptional academic record", "Leadership potential", "Commitment to improving others' lives"],
      benefits: ["Full tuition", "Living allowance", "Airfare", "Discretionary funding"],
      applicants: "5,000+",
      acceptance: "2%",
      logo: "🎓",
      difficulty: "Extremely High",
      featured: true
    },
    {
      id: 7,
      name: "Commonwealth Scholarship",
      amount: "Full Funding",
      fullAmount: true,
      deadline: "December 15, 2024",
      status: "eligible",
      country: "UK",
      type: "Development",
      level: "PhD",
      field: "All Fields",
      duration: "3 years",
      description: "Scholarships for students from Commonwealth countries to pursue PhD studies in the UK.",
      requirements: ["Master's degree", "Research proposal", "Development impact potential"],
      benefits: ["Full tuition", "Stipend", "Airfare", "Thesis grant"],
      applicants: "3,500+",
      acceptance: "30%",
      logo: "🏛️",
      difficulty: "Medium",
      featured: false
    },
    {
      id: 8,
      name: "Vanier Canada Graduate Scholarships",
      amount: "CAD $50,000/year",
      fullAmount: false,
      deadline: "November 1, 2024",
      status: "eligible",
      country: "Canada",
      type: "Merit-based",
      level: "PhD",
      field: "All Fields",
      duration: "3 years",
      description: "Canada's premier doctoral scholarship program for world-class doctoral students.",
      requirements: ["Nominated by institution", "Exceptional research potential", "Leadership skills"],
      benefits: ["Annual stipend", "Research support"],
      applicants: "2,000+",
      acceptance: "8%",
      logo: "🍁",
      difficulty: "Very High",
      featured: true
    }
  ];

  const statusConfig = {
    applied: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "Applied" },
    "under-review": { color: "bg-amber-100 text-amber-800", icon: AlertTriangle, label: "Under Review" },
    eligible: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Eligible" },
    bookmarked: { color: "bg-purple-100 text-purple-800", icon: Bookmark, label: "Bookmarked" },
    awarded: { color: "bg-emerald-100 text-emerald-800", icon: Award, label: "Awarded" },
    rejected: { color: "bg-red-100 text-red-800", icon: AlertTriangle, label: "Rejected" }
  };

  const difficultyConfig = {
    "Extremely High": { color: "text-red-600", bg: "bg-red-50" },
    "Very High": { color: "text-red-500", bg: "bg-red-50" },
    "High": { color: "text-orange-500", bg: "bg-orange-50" },
    "Medium": { color: "text-yellow-600", bg: "bg-yellow-50" },
    "Low": { color: "text-green-600", bg: "bg-green-50" }
  };

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.field.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || scholarship.status === filterStatus;
    const matchesCountry = filterCountry === "all" || scholarship.country === filterCountry;
    return matchesSearch && matchesStatus && matchesCountry;
  });

  const getStatusStats = () => {
    return {
      total: scholarships.length,
      applied: scholarships.filter(s => s.status === "applied").length,
      "under-review": scholarships.filter(s => s.status === "under-review").length,
      eligible: scholarships.filter(s => s.status === "eligible").length,
      bookmarked: scholarships.filter(s => s.status === "bookmarked").length,
      awarded: scholarships.filter(s => s.status === "awarded").length,
    };
  };

  const stats = getStatusStats();
  const featuredScholarships = scholarships.filter(s => s.featured);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Scholarship Opportunities
            </h3>
            <p className="text-gray-600">
              Discover funding opportunities to support your education abroad
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200 transition-colors">
              <Star className="w-4 h-4" />
              <span>Featured</span>
            </button>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
              <Search className="w-4 h-4" />
              <span>Find More</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-90">Available</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{stats.applied}</div>
            <div className="text-sm text-blue-600">Applied</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-amber-600">{stats["under-review"]}</div>
            <div className="text-sm text-amber-600">Under Review</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{stats.eligible}</div>
            <div className="text-sm text-green-600">Eligible</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">{stats.bookmarked}</div>
            <div className="text-sm text-purple-600">Bookmarked</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-emerald-600">{stats.awarded || 0}</div>
            <div className="text-sm text-emerald-600">Awarded</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search scholarships..."
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
              <option value="eligible">Eligible</option>
              <option value="applied">Applied</option>
              <option value="under-review">Under Review</option>
              <option value="bookmarked">Bookmarked</option>
              <option value="awarded">Awarded</option>
            </select>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="all">All Countries</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Germany">Germany</option>
              <option value="Australia">Australia</option>
              <option value="Europe">Europe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Scholarships */}
      {featuredScholarships.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-6 h-6 text-amber-500 fill-current" />
            <h3 className="text-xl font-bold text-gray-900">Featured Scholarships</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredScholarships.map((scholarship) => {
              const StatusIcon = statusConfig[scholarship.status as keyof typeof statusConfig].icon;
              return (
                <div key={scholarship.id} className="bg-white rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl">{scholarship.logo}</div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      statusConfig[scholarship.status as keyof typeof statusConfig].color
                    }`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[scholarship.status as keyof typeof statusConfig].label}
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{scholarship.name}</h4>
                  <div className="text-sm text-gray-600 mb-2">{scholarship.country}</div>
                  <div className="font-bold text-violet-600 mb-3">{scholarship.amount}</div>
                  <button className="w-full bg-amber-400 text-gray-900 py-2 rounded-lg hover:bg-amber-500 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scholarships List */}
      <div className="space-y-4">
        {filteredScholarships.map((scholarship) => {
          const StatusIcon = statusConfig[scholarship.status as keyof typeof statusConfig].icon;
          const difficultyStyle = difficultyConfig[scholarship.difficulty as keyof typeof difficultyConfig];
          
          return (
            <div
              key={scholarship.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                    {scholarship.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-bold text-gray-900 text-xl">
                            {scholarship.name}
                          </h4>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            statusConfig[scholarship.status as keyof typeof statusConfig].color
                          }`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[scholarship.status as keyof typeof statusConfig].label}
                          </div>
                          {scholarship.featured && (
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">{scholarship.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-gray-600 font-medium">AMOUNT</span>
                        </div>
                        <div className="font-bold text-gray-900">{scholarship.amount}</div>
                        {scholarship.fullAmount && (
                          <div className="text-xs text-green-600 font-medium">Full Funding</div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-gray-600 font-medium">DEADLINE</span>
                        </div>
                        <div className="font-bold text-gray-900 text-sm">{scholarship.deadline}</div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Globe className="w-4 h-4 text-purple-600" />
                          <span className="text-xs text-gray-600 font-medium">COUNTRY</span>
                        </div>
                        <div className="font-bold text-gray-900">{scholarship.country}</div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs text-gray-600 font-medium">LEVEL</span>
                        </div>
                        <div className="font-bold text-gray-900 text-sm">{scholarship.level}</div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-red-600" />
                          <span className="text-xs text-gray-600 font-medium">DIFFICULTY</span>
                        </div>
                        <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${difficultyStyle.bg} ${difficultyStyle.color}`}>
                          {scholarship.difficulty}
                        </div>
                      </div>
                    </div>

                    {/* Additional Info Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{scholarship.applicants} applicants</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{scholarship.acceptance} acceptance rate</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{scholarship.duration}</span>
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {scholarship.field}
                      </div>
                    </div>

                    {/* Requirements and Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">Requirements</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {scholarship.requirements.slice(0, 3).map((req, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">Benefits</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {scholarship.benefits.slice(0, 3).map((benefit, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 lg:w-48">
                  <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <div className="flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      <Bookmark className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                      <ExternalLink className="w-4 h-4" />
                      <span>Apply</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredScholarships.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No scholarships found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters to find more opportunities.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setFilterCountry("all");
            }}
            className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Scholarships;