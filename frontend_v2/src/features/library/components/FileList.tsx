// src/features/library/components/FileList.tsx
import { Folder, File, Download, Eye } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileOrFolder } from "@/types";

interface FileListProps {
  items: FileOrFolder[];
  onFolderClick: (folder: FileOrFolder) => void;
  onFileDownload: (file: FileOrFolder) => void;
  onFileView: (file: FileOrFolder) => void;
  downloadingFiles: Set<string>;
  viewingFiles: Set<string>;
}

export function FileList({
  items,
  onFolderClick,
  onFileDownload,
  onFileView,
  downloadingFiles,
  viewingFiles,
}: FileListProps) {
  const { t } = useLanguage();
  
  console.log('FileList items:', items); // Debug log

  const isFolder = (item: FileOrFolder) =>
    item.mimeType === 'application/vnd.google-apps.folder';

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        {t('library.noResults')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        console.log('Rendering item:', item); // Debug log
        return (
          <Card key={item.id} className="p-6 bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {isFolder(item) ? (
                  <Folder className="flex-shrink-0 text-yellow-400" size={24} />
                ) : (
                  <File className="flex-shrink-0 text-blue-400" size={24} />
                )}
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {new Date(item.modifiedTime).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {isFolder(item) ? (
                  <Button
                    variant="secondary"
                    onClick={() => onFolderClick(item)}
                  >
                    {t('library.openButton')}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => onFileDownload(item)}
                      disabled={downloadingFiles.has(item.id)}
                    >
                      {downloadingFiles.has(item.id) ? (
                        <span>{t('library.downloading')}</span>
                      ) : (
                        <span>{t('library.downloadButton')}</span>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => onFileView(item)}
                      disabled={viewingFiles.has(item.id)}
                    >
                      {viewingFiles.has(item.id) ? (
                        <span>{t('library.loading')}</span>
                      ) : (
                        <span>{t('library.openButton')}</span>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}