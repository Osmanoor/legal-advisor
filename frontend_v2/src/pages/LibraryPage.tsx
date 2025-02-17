// src/pages/LibraryPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { BreadcrumbNav } from '@/features/library/components/BreadcrumbNav';
import { SearchToolbar } from '@/features/library/components/SearchToolbar';
import { FileList } from '@/features/library/components/FileList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { FileOrFolder } from '@/types';
import { 
    useLibrary, 
    useLibrarySearch, 
    useFileDownload, 
    useFileView,
    downloadFile ,
    base64ToBlob,
  openFileInNewTab
  } from '@/hooks/api/useLibrary';

export default function LibraryPage() {
  const { t, language, setLanguage } = useLanguage();
  const [items, setItems] = useState<FileOrFolder[]>([]);
  const [query, setQuery] = useState('');
  const [isDeepSearch, setIsDeepSearch] = useState(false);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
  const [viewingFiles, setViewingFiles] = useState<Set<string>>(new Set());
  const [breadcrumbs, setBreadcrumbs] = useState([
    { id: "", name: t('library.root') }
  ]);

  const currentFolderId = breadcrumbs[breadcrumbs.length - 1].id;

  // Use React Query hooks
  const { 
    data: folderData,
    isLoading: isFolderLoading,
    error: folderError
  } = useLibrary(currentFolderId);

  const {
    data: searchData,
    isLoading: isSearching,
    error: searchError,
    refetch: refetchSearch
  } = useLibrarySearch(query, isDeepSearch);

  const fileDownload = useFileDownload();
  const fileView = useFileView();

  // Update items when folder data changes
  useEffect(() => {
    console.log('Folder data received:', folderData);
    if (folderData) { // Remove .data check since folderData is the array
        setItems(folderData);
      }
  }, [folderData]);

  // Update items when search data changes
  useEffect(() => {
    console.log('Search data received:', searchData);
    if (query && searchData) { // Remove .data check since searchData is the array
      setItems(searchData);
    }
  }, [query, searchData]);

  const handleSearch = () => {
    if (query.trim()) {
      refetchSearch();
    } else {
      // If search is cleared, show folder contents
      setItems(folderData || []);
    }
  };

  const handleFolderClick = async (folder: FileOrFolder) => {
    setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    setBreadcrumbs(prev => prev.slice(0, index + 1));
  };

  const handleFileDownload = async (file: FileOrFolder) => {
    try {
      setDownloadingFiles(prev => new Set(prev).add(file.id));
      const blob = await fileDownload.mutateAsync(file.id);
      downloadFile(blob, file.name);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.id);
        return newSet;
      });
    }
  };

  const handleFileView = async (file: FileOrFolder) => {
    try {
      setViewingFiles(prev => new Set(prev).add(file.id));
      const data = await fileView.mutateAsync(file.id);
      
      // Convert base64 to blob with correct mime type
      const blob = base64ToBlob(data.content, data.mimeType);
      
      // Open in new tab
      openFileInNewTab(blob);
    } catch (error) {
      console.error('View error:', error);
      alert(t('library.viewError'));
    } finally {
      setViewingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.id);
        return newSet;
      });
    }
  };

  console.log('Current items:', items); // Debug log

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white ${
      language === 'ar' ? 'text-right' : 'text-left'
    }`}>
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link 
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition-colors"
          >
            {t('procurement.communityName')}
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
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">{t('library.title')}</h1>

            {breadcrumbs.length > 1 && (
              <BreadcrumbNav
                items={breadcrumbs}
                onNavigate={handleBreadcrumbClick}
              />
            )}

            <SearchToolbar
              query={query}
              onQueryChange={setQuery}
              isDeepSearch={isDeepSearch}
              onDeepSearchChange={setIsDeepSearch}
              onSearch={handleSearch}
            />
          </div>

          {(isFolderLoading || isSearching) ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (folderError || searchError) ? (
            <Alert variant="destructive">
              <AlertDescription>
                {t('library.error')}
              </AlertDescription>
            </Alert>
          ) : items && items.length > 0 ? (
            <FileList
              items={items}
              onFolderClick={handleFolderClick}
              onFileDownload={handleFileDownload}
              onFileView={handleFileView}
              downloadingFiles={downloadingFiles}
              viewingFiles={viewingFiles}
            />
          ) : (
            <div className="text-center py-12 text-gray-400">
              {t('library.noResults')}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}