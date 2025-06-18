import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, Globe, Star, Users, School, Building, CheckCircle, GraduationCap, Award, Percent, Clock, MapPin, TrendingUp, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import BASE_URL from "../Config";

// Type definitions
interface University {
  id: string;
  name: string;
  country: string;
  location: string;
  image: string;
  description: string;
  ranking?: string;
  programsCount?: number;
  intakes?: string[];
  tuitionFee?: string;
  offerRate?: string;
  scholarships?: string[];
  specialOffer?: string;
}

interface Course {
  courseName: string;
  duration: string | null;
  cost: string;
  typesOfExams: string;
  country: string | null;
  universityId: string | null;
  university: string | null;
  degree: string;
  tutionFee1styr: string;
  applicationFee: string;
  courseUrl: string;
  intake: string;
  intake2: string;
  intake3: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: University[];
  count: number;
}

const UniversitiesSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'qs-ranked' | 'offers-based'>('qs-ranked');
  const [qsRankedUniversities, setQsRankedUniversities] = useState<University[]>([]);
  const [offerUniversities, setOfferUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState<{ qs: boolean; offers: boolean }>({ qs: false, offers: false });
  const [error, setError] = useState<{ qs: string | null; offers: string | null }>({ qs: null, offers: null });
  const [showAllCards, setShowAllCards] = useState(false);
  const displayLimit = 6; // Show 6 initially, then show all 9

  // Fetch universities
  const fetchUniversities = useCallback(async (type: 'qs' | 'offers') => {
    try {
      setLoading(prev => ({ ...prev, [type]: true }));
      setError(prev => ({ ...prev, [type]: null }));

      const queryParams = new URLSearchParams({
        pageIndex: '0',
        pageSize: '9', // Always fetch 9 universities
        sortBy: type === 'qs' ? 'ranking' : 'offerRate',
      });

      const apiUrl = `${BASE_URL}/user-service/student/universities?${queryParams.toString()}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch universities (${response.status})`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.success === false) {
        throw new Error(data.message || 'Unable to load universities');
      }

      const universitiesData = data.data || [];
      
      const transformedUniversities = universitiesData.map((uni: any) => ({
        id: uni.id || uni._id,
        name: uni.name,
        country: uni.country,
        location: uni.location || `${uni.city || 'City'}, ${uni.country}`,
        image: uni.image || uni.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?w=300&h=200&fit=crop',
        description: uni.description || 'Discover world-class education opportunities at this prestigious institution.',
        ranking: uni.ranking,
        programsCount: uni.programsCount || Math.floor(Math.random() * 100) + 50,
        offerRate: uni.offerRate,
        scholarships: uni.scholarships || [],
        specialOffer: uni.specialOffer
      }));

      if (type === 'qs') {
        setQsRankedUniversities(transformedUniversities);
      } else {
        setOfferUniversities(transformedUniversities);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong while loading universities';
      setError(prev => ({ ...prev, [type]: errorMessage }));
      if (type === 'qs') {
        setQsRankedUniversities([]);
      } else {
        setOfferUniversities([]);
      }
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  }, []);

  useEffect(() => {
    fetchUniversities('qs');
    fetchUniversities('offers');
  }, [fetchUniversities]);

  const countryFlags: Record<string, string> = {
    USA: "🇺🇸",
    UK: "🇬🇧", 
    "United Kingdom": "🇬🇧",
    Germany: "🇩🇪",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
    France: "🇫🇷",
    Switzerland: "🇨🇭",
    Singapore: "🇸🇬",
    India: "🇮🇳",
    Netherlands: "🇳🇱",
    Sweden: "🇸🇪",
    Denmark: "🇩🇰",
    Norway: "🇳🇴",
    Finland: "🇫🇮",
    Japan: "🇯🇵",
    "South Korea": "🇰🇷",
    China: "🇨🇳",
    "New Zealand": "🇳🇿",
    Italy: "🇮🇹",
    Spain: "🇪🇸"
  };

  const handleViewAllClick = () => {
    navigate('/all-universities');
  };

  const handleViewPrograms = (university: University) => {
    navigate(`/university-courses/${university.id}`, { 
      state: { 
        universityName: university.name,
        universityId: university.id 
      } 
    });
  };

  const handleApplyNow = () => {
    navigate("/student-home");
  };

  const currentUniversities = activeTab === 'qs-ranked' ? qsRankedUniversities : offerUniversities;
  const currentLoading = activeTab === 'qs-ranked' ? loading.qs : loading.offers;
  const currentError = activeTab === 'qs-ranked' ? error.qs : error.offers;

  const displayedUniversities = showAllCards ? currentUniversities : currentUniversities.slice(0, displayLimit);

  const { ref, inView } = useInView({ triggerOnce: true });

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm animate-pulse">
          <div className="w-full h-52 bg-gray-200"></div>
          <div className="p-5 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="flex justify-between">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (currentLoading && currentUniversities.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-purple-500"></div>
              <h2 className="mx-4 text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-600">
                Top Universities
              </h2>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-purple-500"></div>
            </div>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
              Discover premier institutions offering world-class education and research opportunities.
            </p>
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-purple-500"></div>
            <h2 className="mx-4 text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-600">
              Top Universities
            </h2>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-purple-500"></div>
          </div>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            Discover premier institutions offering world-class education and research opportunities across the globe.
          </p>
        </div>

        {/* Statistics */}
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <Users size={40} className="text-purple-600 mb-3 mx-auto" />
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {inView && <CountUp end={5000} duration={3} />}+
            </div>
            <div className="text-gray-600 text-sm">Happy Students</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <School size={40} className="text-blue-600 mb-3 mx-auto" />
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {inView && <CountUp end={1000} duration={3} />}+
            </div>
            <div className="text-gray-600 text-sm">Partner Universities</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <Building size={40} className="text-green-600 mb-3 mx-auto" />
            <div className="text-3xl font-bold text-green-600 mb-1">
              {inView && <CountUp end={1500} duration={3} />}+
            </div>
            <div className="text-gray-600 text-sm">Study Programs</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <Globe size={40} className="text-orange-600 mb-3 mx-auto" />
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {inView && <CountUp end={25} duration={3} />}+
            </div>
            <div className="text-gray-600 text-sm">Study Destinations</div>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-2 rounded-2xl shadow-lg flex space-x-2 border">
            {[
              { key: "qs-ranked", label: "🏆 QS Ranked Universities", icon: TrendingUp },
              { key: "offers-based", label: "💰 Universities with Offers", icon: Award },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as "qs-ranked" | "offers-based");
                  setShowAllCards(false); // Reset to show limited cards when switching tabs
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Header & View All */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === "qs-ranked" ? "🏆 Top QS Ranked Universities" : "💰 Universities with Special Offers"}
            </h3>
            <p className="text-gray-600 text-sm">
              {activeTab === "qs-ranked" 
                ? "Globally recognized institutions with prestigious QS rankings"
                : "Universities offering exclusive scholarships and admission benefits"
              }
            </p>
          </div>
          <button
            onClick={handleViewAllClick}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Filter size={18} />
            Explore All Universities
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Error State */}
        {currentError && (
          <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100">
            <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6">{currentError}</p>
            <button 
              onClick={() => fetchUniversities(activeTab === 'qs-ranked' ? 'qs' : 'offers')} 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!currentError && currentUniversities.length === 0 && !currentLoading && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-gray-400 text-5xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Universities Found</h3>
            <p className="text-gray-600 mb-6">We couldn't find any universities for this category at the moment.</p>
            <button 
              onClick={handleViewAllClick}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
            >
              Explore All Universities
            </button>
          </div>
        )}

        {/* Universities Grid */}
        {!currentError && currentUniversities.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedUniversities.map((university, index) => (
                <div
                  key={university.id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col transform hover:-translate-y-2 hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={university.image}
                      alt={university.name}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=300&h=200&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="absolute top-4 left-4 space-y-2">
                      {university.specialOffer && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg animate-pulse">
                          🔥 {university.specialOffer}
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute top-4 right-4 space-y-2">
                      <div className="flex flex-col items-end gap-2">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 text-gray-700 shadow-sm text-xs font-medium">
                          {countryFlags[university.country] || '🏳️'} {university.country}
                        </span>
                        {university.ranking && (
                          <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-medium">
                            🏆 QS #{university.ranking}
                          </span>
                        )}
                        {university.offerRate && (
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-medium">
                            💚 {university.offerRate} Offers
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                        {university.name}
                      </h4>
                      
                      <div className="flex items-center text-purple-600 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{university.location}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {university.description}
                      </p>

                      <div className="space-y-3 mb-4">
                        {university.programsCount && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <GraduationCap className="w-4 h-4 text-purple-600" />
                              <span className="font-medium">{university.programsCount}+ Programs</span>
                            </div>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          </div>
                        )}

                        {university.tuitionFee && (
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700">
                              <span className="font-medium text-green-600">Tuition:</span> {university.tuitionFee}
                            </span>
                          </div>
                        )}

                        {university.intakes && university.intakes.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="flex flex-wrap gap-1">
                              {university.intakes.slice(0, 3).map((month) => (
                                <span
                                  key={month}
                                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium"
                                >
                                  {month}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {university.scholarships && university.scholarships.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {university.scholarships.slice(0, 2).map((sch) => (
                              <span
                                key={sch}
                                className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-md font-medium"
                              >
                                💰 {sch}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={handleApplyNow}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            {currentUniversities.length > displayLimit && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setShowAllCards(!showAllCards)}
                  className="bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 mx-auto shadow-sm hover:shadow-md"
                >
                  {showAllCards ? (
                    <>
                      Show Less Universities
                      <ChevronRight className="w-5 h-5 rotate-90 transition-transform duration-300" />
                    </>
                  ) : (
                    <>
                      Show {currentUniversities.length - displayLimit} More Universities
                      <ChevronRight className="w-5 h-5 -rotate-90 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* Popular Programs */}
        <div className="mt-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-8 rounded-2xl border border-purple-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🎓 Most Popular Study Programs
              </h3>
              <p className="text-gray-600 text-sm">
                Explore trending academic programs across our partner universities
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Business & Management", icon: "💼", count: "150+", universities: "45 Universities", color: "from-blue-500 to-cyan-500" },
              { name: "Computer Science", icon: "💻", count: "120+", universities: "38 Universities", color: "from-purple-500 to-pink-500" },
              { name: "Engineering", icon: "⚙️", count: "200+", universities: "52 Universities", color: "from-orange-500 to-red-500" },
              { name: "Medicine & Health", icon: "🏥", count: "80+", universities: "28 Universities", color: "from-green-500 to-emerald-500" },
              { name: "Arts & Design", icon: "🎨", count: "90+", universities: "32 Universities", color: "from-pink-500 to-rose-500" },
              { name: "Law", icon: "⚖️", count: "60+", universities: "25 Universities", color: "from-gray-600 to-gray-800" },
              { name: "Environmental Science", icon: "🌱", count: "70+", universities: "30 Universities", color: "from-green-400 to-blue-500" },
              { name: "Psychology", icon: "🧠", count: "85+", universities: "35 Universities", color: "from-indigo-500 to-purple-600" },
            ].map((program, i) => (
              <div
                key={i}
                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {program.icon}
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                  {program.name}
                </h4>
                <div className={`text-sm font-semibold bg-gradient-to-r ${program.color} bg-clip-text text-transparent mb-1`}>
                  {program.count} Courses
                </div>
                <p className="text-xs text-gray-500">{program.universities}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniversitiesSection;