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
  const {language, setLanguage} = useLanguage();
  const [items, setItems] = useState<FileOrFolder[]>([]);
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeepSearch, setIsDeepSearch] = useState<boolean>(false);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: "1BmJ3pNwDU11OOAqSPpkFB6edXCcaaD9g", name: translations[language].root }
  ]);
  const BASE_URL = 'api';

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

  const handleDownload = async (fileId: string, fileName: string) => {
    setDownloadingFiles(prev => new Set(prev).add(fileId));
  
    try {
      // Get download URL from backend
      const response = await fetch(`${BASE_URL}/get-download-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_id: fileId }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get download URL');
      }
  
      const data = await response.json();
  
      // Create an invisible anchor element for download
      const link = document.createElement('a');
      link.href = data.url;
      link.setAttribute('download', data.name || fileName); // Use original filename if available
      link.setAttribute('target', '_blank'); // Open in new tab if browser blocks direct download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
    } catch (err) {
      console.error('Download error:', err);
      alert(translations[language].downloadError + (err instanceof Error ? `: ${err.message}` : ''));
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
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
                    {isFolder(item) ? (
                      <button
                        onClick={() => handleFolderClick(item)}
                        className="px-3 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 whitespace-nowrap"
                      >
                        {translations[language].openButton}
                      </button>
                    ) : (
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
                    )}
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