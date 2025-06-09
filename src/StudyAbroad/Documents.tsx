import React, { useState, useEffect } from 'react';
import { FileText, Plus, Eye, Download, Search, Filter, Upload, Calendar, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';

interface Document {
  id: number;
  name: string;
  type: string;
  status: string;
  uploadDate: string;
  fileSize: string;
  format: string;
  score?: string;
  universities?: string;
  count?: string;
  required?: string;
  expires?: string;
  apiId?: string;
  documentPath?: string;
}

interface UploadResponse {
  documentName: string;
  documentPath: string;
  documentType: string;
  id: string;
  message: string;
  projectType: string;
  propertyId?: string;
  uploadStatus: string;
  uploadedAt: string;
  userId: string;
}

interface ApiDocument {
  documentName: string;
  id: string;
  propertyId: string | null;
  documentPath: string;
  uploadStatus: string | null;
  projectType: string | null;
  userId: string;
  uploadedAt: string;
  message: string | null;
  documentType: string;
}

interface UploadData {
  documentType: string;
  fileType: string;
  file: File | null;
}

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<UploadResponse | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>('');

  // Upload form state
  const [uploadData, setUploadData] = useState<UploadData>({
    documentType: '',
    fileType: 'kyc',
    file: null
  });

  // Documents data - will be populated from API
  const [documents, setDocuments] = useState<Document[]>([]);

  const documentTypeOptions = [
    { value: 'PASSPORTCOPY', label: 'Passport Copy' },
    { value: 'RESUME', label: 'Resume' },
    { value: 'LOR1', label: 'Letter of Recommendation 1' },
    { value: 'LOR2', label: 'Letter of Recommendation 2' },
    { value: 'LOR3', label: 'Letter of Recommendation 3' },
    { value: 'SOP', label: 'Statement of Purpose' },
    { value: 'MARKSHEETS', label: 'Mark Sheets' },
    { value: 'DEGREECERTIFICATE', label: 'Degree Certificate' },
    { value: 'WORKEXPERIENCELETTER', label: 'Work Experience Letter' },
    { value: 'EXTRACURRICULARCERTIFICATES', label: 'Extra Curricular Certificates' },
    { value: 'TRANSCRIPTS', label: 'Academic Transcripts' }
  ];

  // Get user ID helper function
  const getUserId = () => {
    console.log('Checking localStorage for Customer ID or User ID...');
    
    // Check for Customer ID or User ID directly
    const customerId = localStorage.getItem('customerId') || localStorage.getItem('Customer_ID');
    if (customerId) {
      console.log('Found Customer ID:', customerId);
      return customerId;
    }

    const userId = localStorage.getItem('userId') || localStorage.getItem('USER_ID') || localStorage.getItem('user_id');
    if (userId) {
      console.log('Found User ID:', userId);
      return userId;
    }
    
    console.log('No Customer ID or User ID found in localStorage');
    return null;
  };

  // Convert API document to internal document format
  const convertApiDocumentToDocument = (apiDoc: ApiDocument): Document => {
    // Extract file extension from document path for format
    const getFileFormat = (path: string, name: string): string => {
      const extension = path.split('.').pop() || name.split('.').pop() || 'unknown';
      return extension.toUpperCase();
    };

    // Determine status based on uploadStatus
    const getStatus = (uploadStatus: string | null): string => {
      if (!uploadStatus) return 'pending';
      
      switch (uploadStatus.toLowerCase()) {
        case 'success':
        case 'completed':
          return 'completed';
        case 'in-progress':
        case 'processing':
          return 'in-progress';
        default:
          return 'pending';
      }
    };

    // Calculate approximate file size (we don't have this from API, so we'll estimate or mark as unknown)
    const getApproximateFileSize = (documentPath: string): string => {
      // Since we don't have file size from API, we'll just return "Unknown"
      // In a real scenario, you might want to make a HEAD request to get file size
      return 'Unknown';
    };

    return {
      id: Date.now() + Math.random(), // Generate unique ID for React key
      name: apiDoc.documentName || apiDoc.documentType,
      type: apiDoc.documentType,
      status: getStatus(apiDoc.uploadStatus),
      uploadDate: apiDoc.uploadedAt ? new Date(apiDoc.uploadedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      fileSize: getApproximateFileSize(apiDoc.documentPath),
      format: getFileFormat(apiDoc.documentPath, apiDoc.documentName),
      apiId: apiDoc.id,
      documentPath: apiDoc.documentPath
    };
  };

  // Fetch documents from API
  const fetchDocuments = async () => {
    const userId = getUserId();
    
    if (!userId) {
      setFetchError('Please login first to view documents.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setFetchError('');

      console.log('Fetching documents for user:', userId);

      const response = await fetch('https://meta.oxyloans.com/api/user-service/student/getStudentDocuments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // For GET request with body (though uncommon), some implementations expect this
        body: JSON.stringify(userId)
      });

      console.log('Fetch response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status} ${response.statusText}`);
      }

      const apiDocuments: ApiDocument[] = await response.json();
      console.log('Fetched documents:', apiDocuments);

      // Convert API documents to internal format
      const convertedDocuments = apiDocuments.map(convertApiDocumentToDocument);
      
      // Sort by upload date (newest first)
      convertedDocuments.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

      setDocuments(convertedDocuments);

    } catch (error) {
      console.error('Error fetching documents:', error);
      setFetchError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async () => {
    // Clear previous errors
    setUploadError('');
    
    const userId = getUserId();
    console.log('Final ID for upload:', userId);

    // Validation checks
    if (!userId) {
      setUploadError('Please login first to upload documents.');
      return;
    }

    if (!uploadData.file || !uploadData.documentType) {
      setUploadError('Please select document type and file.');
      return;
    }

    // File size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (uploadData.file.size > maxSize) {
      setUploadError('File size must be less than 10MB.');
      return;
    }

    setUploading(true);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      
      // Add required fields to payload
      formData.append('documentType', uploadData.documentType);
      formData.append('fileType', uploadData.fileType || 'kyc'); // KYC or null
      formData.append('userId', userId);
      formData.append('file', uploadData.file);

      console.log('Uploading document:', {
        documentType: uploadData.documentType,
        fileType: uploadData.fileType || 'kyc',
        userId: userId,
        fileName: uploadData.file.name
      });

      const response = await fetch('https://meta.oxyloans.com/api/user-service/student/uploadStudentDocuments', {
        method: 'POST',
        body: formData,
        // Add headers if required
        headers: {
          // Don't set Content-Type for FormData, let browser set it with boundary
          'Accept': 'application/json',
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`Upload failed. Please try again.`);
      }

      const result = await response.json();
      console.log('Upload response:', result);
      
      // Validate response structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format from server');
      }

      // Add the new document to the list
      const newDocument: Document = {
        id: Date.now(), // Temporary ID
        name: result.documentName || uploadData.file.name || uploadData.documentType,
        type: uploadData.documentType,
        status: result.uploadStatus === 'SUCCESS' || result.uploadStatus === 'success' ? 'completed' : 'pending',
        uploadDate: result.uploadedAt ? new Date(result.uploadedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        fileSize: uploadData.file ? `${(uploadData.file.size / (1024 * 1024)).toFixed(1)} MB` : '0 MB',
        format: uploadData.fileType.toUpperCase(),
        apiId: result.id,
        documentPath: result.documentPath
      };

      setDocuments(prev => [newDocument, ...prev]);
      setUploadSuccess(result);
      
      // Reset form
      setUploadData({
        documentType: '',
        fileType: 'kyc',
        file: null
      });

      // Close modal after 3 seconds to give user time to read success message
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(null);
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData(prev => ({
        ...prev,
        file: file,
        fileType: 'kyc' // Only KYC or will be null if not applicable
      }));
      
      // Clear any previous errors
      setUploadError('');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesType = filterType === 'all' || doc.type.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const documentTypes = ['all', 'official', 'reference', 'essay', 'test', 'identity', 'financial'];
  const statusTypes = ['all', 'completed', 'in-progress', 'pending'];

  const getDocumentStats = () => {
    return {
      total: documents.length,
      completed: documents.filter(d => d.status === 'completed').length,
      'in-progress': documents.filter(d => d.status === 'in-progress').length,
      pending: documents.filter(d => d.status === 'pending').length,
    };
  };

  const stats = getDocumentStats();

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading documents...</h3>
          <p className="text-gray-600">Please wait while we fetch your documents.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading documents</h3>
          <p className="text-gray-600 mb-6">{fetchError}</p>
          <button
            onClick={fetchDocuments}
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
              My Documents
            </h3>
            <p className="text-gray-600">
              Manage and track your application documents
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={fetchDocuments}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <Search className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-90">Total Documents</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-amber-600">{stats['in-progress']}</div>
            <div className="text-sm text-amber-600">In Progress</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents..."
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
              {statusTypes.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload Document</h3>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadError('');
                  setUploadSuccess(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-green-700 mb-2">Upload Successful!</h4>
                <p className="text-gray-600 mb-2">{uploadSuccess.message}</p>
                <p className="text-sm text-gray-500 mb-2">Document ID: {uploadSuccess.id}</p>
                {uploadSuccess.documentPath && (
                  <p className="text-sm text-gray-500">Path: {uploadSuccess.documentPath}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Error Display */}
                {uploadError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-red-700">{uploadError}</div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type *
                  </label>
                  <select
                    value={uploadData.documentType}
                    onChange={(e) => setUploadData(prev => ({...prev, documentType: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="">Select document type</option>
                    {documentTypeOptions.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File * (Max 10MB)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  {uploadData.file && (
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Selected: {uploadData.file.name}</p>
                      <p>Size: {(uploadData.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadError('');
                      setUploadSuccess(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !uploadData.file || !uploadData.documentType}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documents Grid - Show message when no documents */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents uploaded yet</h3>
          <p className="text-gray-600 mb-6">
            Start by uploading your first document using the upload button above.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
          >
            Upload Your First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">
                      {doc.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{doc.type}</p>
                    <div className="flex items-center space-x-2">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        <span className="ml-1">{doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {doc.format} • {doc.fileSize}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Details */}
              <div className="space-y-2 mb-4">
                {doc.score && (
                  <div className="text-sm text-violet-600 font-medium bg-violet-50 px-3 py-1 rounded-lg">
                    {doc.score}
                  </div>
                )}
                {doc.universities && (
                  <div className="text-sm text-amber-600 font-medium bg-amber-50 px-3 py-1 rounded-lg">
                    {doc.universities}
                  </div>
                )}
                {doc.count && (
                  <div className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-lg">
                    {doc.count}
                  </div>
                )}
                {doc.required && (
                  <div className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded-lg">
                    {doc.required}
                  </div>
                )}
                {doc.expires && (
                  <div className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-lg">
                    {doc.expires}
                  </div>
                )}
              </div>

              {/* Upload Date */}
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => doc.documentPath && window.open(doc.documentPath, '_blank')}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button 
                  onClick={() => {
                    if (doc.documentPath) {
                      const link = document.createElement('a');
                      link.href = doc.documentPath;
                      link.download = doc.name;
                      link.click();
                    }
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200 transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State for filtered results */}
      {documents.length > 0 && filteredDocuments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filter criteria to find more documents.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setFilterType("all");
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

export default Documents;