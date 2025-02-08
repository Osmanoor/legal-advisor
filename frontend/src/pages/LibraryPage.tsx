import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Languages, Folder, File, ChevronRight, ArrowLeft, Loader } from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { useLanguage } from '../LanguageContext';


interface FileOrFolder {
  mimeType: string;
  size?: string;
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

const LibraryPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [items, setItems] = useState<FileOrFolder[]>([]);
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeepSearch, setIsDeepSearch] = useState<boolean>(false);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: "", name: translations[language].root }
  ]);
  const [viewingFiles, setViewingFiles] = useState<Set<string>>(new Set());

  const BASE_URL = 'api/library';

  const isFolder = (item: FileOrFolder) =>
    item.mimeType === 'application/vnd.google-apps.folder';

  const loadFolderContents = async (folderId: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${BASE_URL}/list-folder-contents?folder_id=${folderId}`);
      if (response.ok) {
        const data: FileOrFolder[] = await response.json();
        setItems(data);
      } else {
        setError(translations[language].error);
      }
    } catch (err) {
      setError(translations[language].error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFolderContents(breadcrumbs[breadcrumbs.length - 1].id);
  }, [language]);

  const handleSearch = async () => {
    if (!query.trim()) {
      loadFolderContents(breadcrumbs[breadcrumbs.length - 1].id);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const currentFolderId = breadcrumbs[breadcrumbs.length - 1].id;
      const response = await fetch(
        `${BASE_URL}/search-files?query=${query}&folder_id=${currentFolderId}&recursive=${isDeepSearch}`
      );
      if (response.ok) {
        const data: FileOrFolder[] = await response.json();
        setItems(data);
      } else {
        setError(translations[language].error);
        setItems([]);
      }
    } catch (err) {
      setError(translations[language].error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderClick = async (folder: FileOrFolder) => {
    setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
    await loadFolderContents(folder.id);
  };

  const handleBreadcrumbClick = async (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    await loadFolderContents(newBreadcrumbs[newBreadcrumbs.length - 1].id);
  };


  const handleDownload = async (fileId: string, fileName: string) => {
    setDownloadingFiles(prev => new Set(prev).add(fileId));
  
    try {
      const response = await fetch(`${BASE_URL}/view-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_id: fileId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
  
      const data = await response.json();
  
      const binaryContent = atob(data.content);
      const bytes = new Uint8Array(binaryContent.length);
      for (let i = 0; i < binaryContent.length; i++) {
        bytes[i] = binaryContent.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert(translations[language].downloadError);
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };
  
  const handleView = async (fileId: string, fileName: string) => {
    setViewingFiles(prev => new Set(prev).add(fileId));
  
    try {
      const response = await fetch(`${BASE_URL}/view-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_id: fileId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
  
      const data = await response.json();
  
      const binaryContent = atob(data.content);
      const bytes = new Uint8Array(binaryContent.length);
      for (let i = 0; i < binaryContent.length; i++) {
        bytes[i] = binaryContent.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType });
      const blobUrl = URL.createObjectURL(blob);
      
      const viewerWindow = window.open(blobUrl, '_blank');
      if (viewerWindow) {
        viewerWindow.onload = () => {
          URL.revokeObjectURL(blobUrl);
        };
      }
    } catch (err) {
      console.error('View error:', err);
      alert(translations[language].viewError);
    } finally {
      setViewingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };
  
  const FileActions = ({ item }: { item: FileOrFolder }) => {
    const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
    const isViewable = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'text/plain',
      'text/html',
    ].includes(item.mimeType);
    
    if (isFolder) {
      return (
        <button
          onClick={() => handleFolderClick(item)}
          className="px-3 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 whitespace-nowrap"
        >
          {translations[language].openButton}
        </button>
      );
    }
  
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleDownload(item.id, item.name)}
          disabled={downloadingFiles.has(item.id)}
          className="px-3 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-800 disabled:cursor-wait whitespace-nowrap flex items-center gap-2"
        >
          {downloadingFiles.has(item.id) ? (
            <>
              <Loader className="animate-spin" size={16} />
              {translations[language].downloading}
            </>
          ) : (
            translations[language].downloadButton
          )}
        </button>
  
        {isViewable && (
          <button
            onClick={() => handleView(item.id, item.name)}
            disabled={viewingFiles.has(item.id)}
            className="px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-800 disabled:cursor-wait whitespace-nowrap flex items-center gap-2"
          >
            {viewingFiles.has(item.id) ? (
              <>
                <Loader className="animate-spin" size={16} />
                {translations[language].loading}
              </>
            ) : (
              translations[language].openButton
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition-colors"
          >
            {language === 'ar' ? "مجتمع المشتريات الحكومية" : "Government Procurement Community"}
          </Link>
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
          >
            <Languages size={20} />
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 mb-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <h1 className="text-3xl font-bold">{translations[language].libraryTitle}</h1>

          {/* Breadcrumb Navigation */}
          {breadcrumbs.length > 1 && (
            <div className="flex items-center gap-2 text-gray-400 overflow-x-auto">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.id}>
                  {index > 0 && <ChevronRight size={16} />}
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    className="hover:text-white transition-colors whitespace-nowrap"
                  >
                    {crumb.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={translations[language].searchPlaceholder}
                className="flex-1 px-4 py-2 border rounded-lg bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {translations[language].searchButton}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="deepSearch"
                checked={isDeepSearch}
                onChange={(e) => setIsDeepSearch(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="deepSearch" className="text-sm text-gray-300">
                {translations[language].deepSearchLabel}
              </label>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {error}
          </div>
        ) : items.length > 0 ? (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="p-6 border rounded-lg shadow-sm transition-shadow hover:shadow-md bg-slate-700/50 flex flex-col">
                <div className="flex items-start gap-4 h-full">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {isFolder(item) ? (
                      <Folder className="flex-shrink-0 text-yellow-400" size={24} />
                    ) : (
                      <File className="flex-shrink-0 text-blue-400" size={24} />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold" title={item.name}>
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {new Date(item.modifiedTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {/* Replace your existing button code with FileActions */}
                    <FileActions item={item} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {translations[language].noResults}
          </div>
        )}
      </main>
    </div>
  );
};

export default LibraryPage;