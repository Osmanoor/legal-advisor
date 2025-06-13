// src/features/correction/components/CorrectionEditor.tsx

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Button } from '@/components/ui/button';
import { Sparkle, Copy, Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3, Heading4, List, ListOrdered } from 'lucide-react';

// --- Toolbar Component ---
interface ToolbarProps {
  editor: Editor | null;
}

const RichTextToolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const { direction } = useLanguage();
  if (!editor) return null;

  const buttonClass = "p-2 rounded hover:bg-gray-100 disabled:opacity-50";
  const activeClass = "bg-gray-200 text-cta";

  return (
    <div className={`flex flex-wrap items-center gap-1 p-2 border-b border-inputTheme-border ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={`${buttonClass} ${editor.isActive('bold') ? activeClass : ''}`}><Bold size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`${buttonClass} ${editor.isActive('italic') ? activeClass : ''}`}><Italic size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${buttonClass} ${editor.isActive('underline') ? activeClass : ''}`}><UnderlineIcon size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`${buttonClass} ${editor.isActive('strike') ? activeClass : ''}`}><Strikethrough size={16} /></button>
      <div className="h-5 w-px bg-gray-200 mx-1"></div>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${buttonClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''}`}><Heading1 size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}><Heading2 size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${buttonClass} ${editor.isActive('heading', { level: 3 }) ? activeClass : ''}`}><Heading3 size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className={`${buttonClass} ${editor.isActive('heading', { level: 4 }) ? activeClass : ''}`}><Heading4 size={16} /></button>
      <div className="h-5 w-px bg-gray-200 mx-1"></div>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${buttonClass} ${editor.isActive('bulletList') ? activeClass : ''}`}><List size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${buttonClass} ${editor.isActive('orderedList') ? activeClass : ''}`}><ListOrdered size={16} /></button>
    </div>
  );
};

// --- Main Component ---
export type CorrectionProcessState = 'writing' | 'loadingCorrection' | 'loadingEnhancement' | 'corrected';

interface CorrectionEditorProps {
  state: CorrectionProcessState;
  onTextChange: (htmlContent: string) => void;
  initialContent?: string;
  resultContent?: string;
  onCopyResult: () => void;
}

export const CorrectionEditor: React.FC<CorrectionEditorProps> = ({
  state,
  onTextChange,
  initialContent = '',
  resultContent = '',
  onCopyResult,
}) => {
  const { t, direction } = useLanguage();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: t('correction.inputPlaceholder'),
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onTextChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none p-4 min-h-[300px] w-full text-right',
        dir: 'rtl',
      },
    },
  });

  React.useEffect(() => {
    if (editor && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent, false);
    }
  }, [initialContent, editor]);

  // Main container: It provides the white background and border for the writing state.
  // In the 'corrected' state, its background effectively becomes light green because the child div covers it.
  return (
    <div className="bg-white border border-inputTheme-border rounded-2xl shadow-lg min-h-[400px] flex flex-col overflow-hidden">
      {state === 'writing' && <RichTextToolbar editor={editor} />}

      <div className="flex-grow">
        {state === 'writing' && <EditorContent editor={editor} />}
        
        {(state === 'loadingCorrection' || state === 'loadingEnhancement') && (
          <div className="flex flex-col items-center justify-center h-full min-h-[350px]">
            <Sparkle className="w-12 h-12 text-cta animate-pulse mb-4" />
            <p className="text-text-on-light-strong font-medium text-lg" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
              {state === 'loadingCorrection' ? t('correction.correcting') : t('correction.enhancing')}
            </p>
          </div>
        )}

        {state === 'corrected' && (
          <div className="relative flex-grow bg-resultTheme-background p-4 h-full min-h-[350px]" dir="rtl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 text-cta hover:bg-cta/10 w-8 h-8"
              onClick={onCopyResult}
              aria-label={t('correction.copy')}
            >
              <Copy size={16} />
            </Button>
            <div
              className="prose prose-sm sm:prose-base max-w-none text-right"
              dangerouslySetInnerHTML={{ __html: resultContent }}
            />
          </div>
        )}
      </div>
    </div>
  );
};