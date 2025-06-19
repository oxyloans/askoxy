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
  message: string | null;
  propertyId: string | null;
  uploadStatus: string;
  uploadedAt: number;
  userId: string;
}

interface ApiDocument {
  documentName: string;
  id: string;
  propertyId: string | null;
  documentPath: string;
  uploadStatus: string | null;
  userId: string;
  uploadedAt: number;
  message: string | null;
  documentType: string;
}

interface UploadData {
  documentType: string;
  file: File | null;
  userId: string;
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

  const [uploadData, setUploadData] = useState<UploadData>({
    documentType: '',
    file: null,
    userId: ''
  });

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

  const getUserId = () => {
    const customerId = localStorage.getItem('customerId') || localStorage.getItem('Customer_ID');
    if (customerId) {
      return customerId;
    }

    const userId = localStorage.getItem('userId') || localStorage.getItem('USER_ID') || localStorage.getItem('user_id');
    if (userId) {
      return userId;
    }
    
    return null;
  };

  const convertApiDocumentToDocument = (apiDoc: ApiDocument): Document => {
    const getFileFormat = (path: string, name: string): string => {
      const extension = path.split('.').pop() || name.split('.').pop() || 'unknown';
      return extension.toUpperCase();
    };

    const getStatus = (uploadStatus: string | null): string => {
      if (!uploadStatus) return 'pending';
      
      switch (uploadStatus.toLowerCase()) {
        case 'uploaded':
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

    const getApproximateFileSize = (documentPath: string): string => {
      return 'Unknown';
    };

    return {
      id: Date.now() + Math.random(), 
      name: apiDoc.documentName || apiDoc.documentType,
      type: apiDoc.documentType,
      status: getStatus(apiDoc.uploadStatus),
      uploadDate: new Date(apiDoc.uploadedAt).toISOString().split('T')[0],
      fileSize: getApproximateFileSize(apiDoc.documentPath),
      format: getFileFormat(apiDoc.documentPath, apiDoc.documentName),
      apiId: apiDoc.id,
      documentPath: apiDoc.documentPath
    };
  };

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

      const response = await fetch(`https://meta.oxyloans.com/api/user-service/student/getStudentDocuments?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status}`);
      }

      const result = await response.json();
      const apiDocuments: ApiDocument[] = Array.isArray(result) ? result : [];
      const convertedDocuments = apiDocuments.map(convertApiDocumentToDocument);
      
      convertedDocuments.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      setDocuments(convertedDocuments);

    } catch (error) {
      console.error('Error fetching documents:', error);
      setFetchError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async () => {
    setUploadError('');
    
    const userId = getUserId();
    if (!userId) {
      setUploadError('Please login first to upload documents.');
      return;
    }

    setUploadData(prev => ({
      ...prev,
      userId: userId
    }));

    if (!uploadData.file || !uploadData.documentType) {
      setUploadError('Please select document type and file.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (uploadData.file.size > maxSize) {
      setUploadError('File size must be less than 10MB.');
      return;
    }

    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const fileExtension = uploadData.file.name.toLowerCase().substring(uploadData.file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(fileExtension)) {
      setUploadError('Please upload only PDF, DOC, DOCX, JPG, JPEG, or PNG files.');
      return;
    }

    setUploading(true);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      
      formData.append('documentType', uploadData.documentType);
      formData.append('userId', userId);
      formData.append('fileType', 'kyc');
      formData.append('file', uploadData.file);

      const response = await fetch(`https://meta.oxyloans.com/api/user-service/student/uploadStudentDocuments`, {
        method: 'POST',
        body: formData,
      });

      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const responseText = await response.text();
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          result = {
            uploadStatus: response.ok ? 'UPLOADED' : 'FAILED',
            message: response.ok ? 'Document uploaded successfully' : responseText || 'Upload failed',
            documentName: uploadData.file.name,
            documentType: uploadData.documentType
          };
        }
      }

      if (!response.ok) {
        throw new Error(result?.message || `Upload failed with status ${response.status}`);
      }

      const newDocument: Document = {
        id: Date.now(),
        name: result.documentName || uploadData.file.name || uploadData.documentType,
        type: uploadData.documentType,
        status: response.ok ? 'completed' : 'pending',
        uploadDate: result.uploadedAt ? 
          new Date(result.uploadedAt).toISOString().split('T')[0] : 
          new Date().toISOString().split('T')[0],
        fileSize: uploadData.file ? `${(uploadData.file.size / (1024 * 1024)).toFixed(1)} MB` : '0 MB',
        format: uploadData.file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        apiId: result.id || 'pending',
        documentPath: result.documentPath || ''
      };

      setDocuments(prev => [newDocument, ...prev]);
      
      setUploadSuccess({
        documentName: result.documentName || uploadData.file.name,
        documentPath: result.documentPath || '',
        documentType: uploadData.documentType,
        id: result.id || 'unknown',
        message: result.message || 'Document uploaded successfully',
        propertyId: result.propertyId || null,
        uploadStatus: result.uploadStatus || 'UPLOADED',
        uploadedAt: result.uploadedAt || Date.now(),
        userId: userId
      });
      
      setUploadData({
        documentType: '',
        file: null,
        userId: userId
      });

      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(null);
        fetchDocuments();
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData(prev => ({
        ...prev,
        file: file
      }));
      
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

  const documentTypes = ['all', 'passport', 'resume', 'letter', 'statement', 'certificate', 'transcript'];
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

  const getFriendlyDocumentType = (type: string) => {
    const option = documentTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

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
                <p className="text-gray-600 mb-2">{uploadSuccess.message || 'Document uploaded successfully'}</p>
                <p className="text-sm text-gray-500 mb-2">Document ID: {uploadSuccess.id}</p>
                <p className="text-sm text-gray-500 mb-2">Type: {getFriendlyDocumentType(uploadSuccess.documentType)}</p>
                <p className="text-sm text-gray-500">Status: {uploadSuccess.uploadStatus}</p>
              </div>
            ) : (
              <div className="space-y-4">
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
                    Document Type * <span className="text-xs text-gray-500">(Required)</span>
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
                    Select File * <span className="text-xs text-gray-500">(Max 10MB - PDF, DOC, DOCX, JPG, JPEG, PNG)</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  {uploadData.file && (
                    <div className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg">
                      <p><strong>Selected:</strong> {uploadData.file.name}</p>
                      <p><strong>Size:</strong> {(uploadData.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <p><strong>Type:</strong> {uploadData.file.type || 'Binary'}</p>
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

      {/* Documents Display */}
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
                    <p className="text-sm text-gray-600 mb-2">{getFriendlyDocumentType(doc.type)}</p>
                    <div className="flex items-center space-x-2">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        <span className="ml-1 capitalize">{doc.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Upload Date</p>
                  <p className="text-sm font-medium text-gray-900">{doc.uploadDate}</p>
                </div>
                {/* <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">File Size</p>
                  <p className="text-sm font-medium text-gray-900">{doc.fileSize}</p>
                </div> */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Format</p>
                  <p className="text-sm font-medium text-gray-900">{doc.format}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Document ID</p>
                  <p className="text-sm font-medium text-gray-900">{doc.apiId || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  {/* <button className="flex items-center space-x-1 text-violet-600 hover:text-violet-700 text-sm font-medium transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button> */}
                  {doc.documentPath && (
                    <button 
                      onClick={() => {
                        if (doc.documentPath) {
                          const link = document.createElement('a');
                          link.href = doc.documentPath;
                          link.download = doc.name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }}
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
                {/* <div className="text-xs text-gray-500">
                  {doc.apiId && `ID: ${doc.apiId}`}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {documents.length > 0 && filteredDocuments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterType('all');
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