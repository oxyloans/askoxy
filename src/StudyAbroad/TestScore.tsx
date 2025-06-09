import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Save, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  X, 
  Trophy,
  Target,
  BarChart3,
  Loader2
} from 'lucide-react';

interface TestScore {
  actScore?: string;
  actTestDate?: string;
  duolingoScore?: string;
  duolingoTestDate?: string;
  gmatScore?: string;
  gmatTestDate?: string;
  greScore?: string;
  greTestDate?: string;
  ieltsScore?: string;
  ieltsTestDate?: string;
  pteScore?: string;
  pteTestDate?: string;
  satScore?: string;
  satTestDate?: string;
  toeflScore?: string;
  toeflTestDate?: string;
  userId?: string;
}

interface TestConfig {
  key: keyof TestScore;
  dateKey: keyof TestScore;
  label: string;
  description: string;
  maxScore: string;
  icon: string;
  color: string;
  bgColor: string;
}

const TestScores = () => {
  const [scores, setScores] = useState<TestScore>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDebug, setShowDebug] = useState<boolean>(false);

  const testConfigs: TestConfig[] = [
    {
      key: 'actScore',
      dateKey: 'actTestDate',
      label: 'ACT',
      description: 'American College Testing',
      maxScore: 'Max: 36',
      icon: '🎯',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'satScore',
      dateKey: 'satTestDate',
      label: 'SAT',
      description: 'Scholastic Assessment Test',
      maxScore: 'Max: 1600',
      icon: '📚',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      key: 'greScore',
      dateKey: 'greTestDate',
      label: 'GRE',
      description: 'Graduate Record Examination',
      maxScore: 'Max: 340',
      icon: '🏆',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      key: 'gmatScore',
      dateKey: 'gmatTestDate',
      label: 'GMAT',
      description: 'Graduate Management Admission Test',
      maxScore: 'Max: 800',
      icon: '💼',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      key: 'toeflScore',
      dateKey: 'toeflTestDate',
      label: 'TOEFL',
      description: 'Test of English as a Foreign Language',
      maxScore: 'Max: 120',
      icon: '🌍',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      key: 'ieltsScore',
      dateKey: 'ieltsTestDate',
      label: 'IELTS',
      description: 'International English Language Testing System',
      maxScore: 'Max: 9.0',
      icon: '🎓',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      key: 'pteScore',
      dateKey: 'pteTestDate',
      label: 'PTE',
      description: 'Pearson Test of English',
      maxScore: 'Max: 90',
      icon: '📝',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      key: 'duolingoScore',
      dateKey: 'duolingoTestDate',  
      label: 'Duolingo',
      description: 'Duolingo English Test',
      maxScore: 'Max: 160',
      icon: '🦜',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  // Get userId from localStorage
  const getUserId = (): string | null => {
    console.log('=== Checking localStorage for User ID ===');
    
    // Check all possible storage keys
    const possibleKeys = [
      'customerId', 'Customer_ID', 'customer_id', 'CUSTOMER_ID',
      'userId', 'USER_ID', 'user_id', 'User_ID',
      'studentId', 'STUDENT_ID', 'student_id', 'Student_ID',
      'id', 'ID'
    ];

    console.log('All localStorage items:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`${key}: ${localStorage.getItem(key)}`);
      }
    }

    for (const key of possibleKeys) {
      const value = localStorage.getItem(key);
      if (value && value.trim()) {
        console.log(`Found ID with key '${key}': ${value}`);
        return value.trim();
      }
    }
    
    console.log('No valid User ID found in localStorage');
    console.log('Available localStorage keys:', Object.keys(localStorage));
    return null;
  };

  // Fetch existing scores
  const fetchScores = async () => {
    const userId = getUserId();
    if (!userId) {
      setMessage({ type: 'error', text: 'User not logged in. Please login first.' });
      return;
    }

    console.log('Fetching scores for userId:', userId);
    setLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token') || localStorage.getItem('token');
      console.log('Using token:', token ? 'Token found' : 'No token found');
      
      const response = await fetch(`https://meta.oxyloans.com/api/user-service/student/getStudentScores/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Scores fetched successfully:', data);
        setScores(data);
      } else if (response.status === 404) {
        // User not found or no scores found yet - this is normal for new users
        console.log('No scores found (404) - setting empty scores for new user');
        setScores({});
        setMessage({ 
          type: 'success', 
          text: 'Welcome! No test scores found yet. You can start adding your scores using the Edit button.' 
        });
        setTimeout(() => setMessage(null), 5000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(`Failed to fetch scores: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
      // For 404 errors, still allow the user to add scores
      if (error instanceof Error && error.message.includes('404')) {
        setScores({});
        setMessage({ 
          type: 'success', 
          text: 'Welcome! No test scores found yet. You can start adding your scores using the Edit button.' 
        });
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: `Failed to load test scores: ${error instanceof Error ? error.message : 'Please try again.'}` });
      }
    } finally {
      setLoading(false);
    }
  };

  // Save scores
  const saveScores = async () => {
    const userId = getUserId();
    if (!userId) {
      setMessage({ type: 'error', text: 'User not logged in. Please login first.' });
      return;
    }

    console.log('Saving scores for userId:', userId);
    setSaving(true);
    
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token') || localStorage.getItem('token');
      console.log('Using token for save:', token ? 'Token found' : 'No token found');
      
      const payload = {
        ...scores,
        userId: userId
      };

      console.log('Payload being sent:', payload);

      const response = await fetch('https://meta.oxyloans.com/api/user-service/student/saveStudentScores', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('Save response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Scores saved successfully:', data);
        setScores(data);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Test scores saved successfully!' });
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save API Error:', errorData);
        
        if (response.status === 404) {
          setMessage({ 
            type: 'error', 
            text: `User not found in system. Please contact support. User ID: ${userId}` 
          });
        } else {
          throw new Error(`Failed to save scores: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error saving scores:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to save test scores: ${error instanceof Error ? error.message : 'Please try again.'}` 
      });
    } finally {
      setSaving(false);
    }
  };

  // Load scores on component mount
  useEffect(() => {
    fetchScores();
  }, []);

  // Handle input changes
  const handleInputChange = (field: keyof TestScore, value: string) => {
    setScores(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get completion stats
  const getStats = () => {
    const totalTests = testConfigs.length;
    const completedTests = testConfigs.filter(config => scores[config.key]?.trim()).length;
    const recentTests = testConfigs.filter(config => {
      const dateField = config.dateKey;
      const testDate = scores[dateField];
      if (!testDate) return false;
      
      const date = new Date(testDate);
      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      return date >= sixMonthsAgo;
    }).length;

    return { totalTests, completedTests, recentTests };
  };

  const stats = getStats();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your test scores...</p>
          </div>
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
              Test Scores
            </h3>
            <p className="text-gray-600">
              Manage your standardized test scores and dates
            </p>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Scores</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    fetchScores(); // Reset to original data
                  }}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button 
                  onClick={saveScores}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Debug Panel */}
        {showDebug && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h4 className="font-semibold text-yellow-800 mb-2">Debug Information</h4>
            <div className="text-sm space-y-1">
              <p><strong>Current User ID:</strong> {getUserId() || 'Not found'}</p>
              <p><strong>LocalStorage Keys:</strong> {Object.keys(localStorage).join(', ')}</p>
              <p><strong>Access Token:</strong> {localStorage.getItem('accessToken') || localStorage.getItem('access_token') || localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
              <p><strong>Current Scores:</strong> {JSON.stringify(scores, null, 2)}</p>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">{stats.completedTests}</div>
                <div className="text-sm opacity-90">Tests Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalTests - stats.completedTests}</div>
                <div className="text-sm text-blue-600">Tests Remaining</div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.recentTests}</div>
                <div className="text-sm text-green-600">Recent Tests (6mo)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Scores Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testConfigs.map((config) => (
          <div
            key={config.key}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center text-2xl`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-lg mb-1">
                    {config.label}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">{config.description}</p>
                  <p className="text-xs text-gray-500">{config.maxScore}</p>
                </div>
              </div>
              <div className="flex items-center">
                {scores[config.key] ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Score Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={scores[config.key] || ''}
                    onChange={(e) => handleInputChange(config.key, e.target.value)}
                    placeholder={`Enter ${config.label} score`}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                ) : (
                  <div className={`w-full px-3 py-2 bg-gray-50 rounded-lg font-medium ${
                    scores[config.key] ? config.color : 'text-gray-500'
                  }`}>
                    {scores[config.key] || 'Not recorded'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={scores[config.dateKey] ? scores[config.dateKey]?.split('T')[0] : ''}
                    onChange={(e) => {
                      const dateValue = e.target.value ? `${e.target.value}T00:00:00.000Z` : '';
                      handleInputChange(config.dateKey, dateValue);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-700 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{formatDate(scores[config.dateKey]) || 'Not set'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status indicator */}
            <div className="mt-4">
              {scores[config.key] && scores[config.dateKey] ? (
                <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
                  ✓ Complete - Score: {scores[config.key]} on {formatDate(scores[config.dateKey])}
                </div>
              ) : scores[config.key] ? (
                <div className="bg-amber-50 text-amber-700 px-3 py-2 rounded-lg text-sm font-medium">
                  ⚠ Missing test date
                </div>
              ) : (
                <div className="bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm">
                  No score recorded
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for no scores */}
      {stats.completedTests === 0 && !isEditing && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No test scores recorded yet</h3>
          <p className="text-gray-600 mb-6">
            Start by adding your standardized test scores to track your academic progress.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
          >
            Add Your First Test Score
          </button>
        </div>
      )}
    </div>
  );
};

export default TestScores;