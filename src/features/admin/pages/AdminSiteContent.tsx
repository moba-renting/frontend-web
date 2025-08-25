import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent, useEditorState, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import { supabase } from "../../../core/services/supabase";

interface SiteContent {
  id: number;
  terms_and_conditions: string;
  privacy_policy: string;
}

// Hook personalizado para el editor
function useContentEditor(content: string, onUpdate: (html: string) => void, isEditable: boolean, isLoading: boolean = false) {
  const editor = useEditor({
    extensions: [
      TextStyleKit, 
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-orange-600 underline hover:text-orange-700',
        },
      }),
    ],
    content: content || undefined,
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
    editable: isEditable,
    autofocus: false,
  }, [!isLoading]); // Solo recrear cuando termine de cargar

  // Actualizar la propiedad editable cuando cambie
  React.useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [editor, isEditable]);

  return editor;
}

// Componente Toolbar simplificado
function EditorToolbar({ editor }: { editor: Editor | null }) {
  const editorState = useEditorState({
    editor,
    selector: ctx => ({
      isBold: ctx.editor?.isActive('bold') ?? false,
      isItalic: ctx.editor?.isActive('italic') ?? false,
      isHeading1: ctx.editor?.isActive('heading', { level: 1 }) ?? false,
      isHeading2: ctx.editor?.isActive('heading', { level: 2 }) ?? false,
      isHeading3: ctx.editor?.isActive('heading', { level: 3 }) ?? false,
      isParagraph: ctx.editor?.isActive('paragraph') ?? false,
      isBulletList: ctx.editor?.isActive('bulletList') ?? false,
      isOrderedList: ctx.editor?.isActive('orderedList') ?? false,
      isBlockquote: ctx.editor?.isActive('blockquote') ?? false,
      isLink: ctx.editor?.isActive('link') ?? false,
    }),
  });

  if (!editor) return null;

  // Función helper para mantener el foco
  const executeCommand = (command: () => void) => {
    command();
    // Pequeño delay para asegurar que el comando se ejecute antes de enfocar
    setTimeout(() => {
      editor.commands.focus();
    }, 10);
  };

  // Función para insertar/editar enlaces
  const handleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);

    // Si se cancela o está vacío, quitar el enlace
    if (url === null) {
      return;
    }

    // Si está vacío, quitar el enlace
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Actualizar el enlace
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-t-md p-2 bg-gray-50 flex flex-wrap gap-2">
      {/* Títulos */}
      <button
        onClick={() => executeCommand(() => editor.chain().focus().setParagraph().run())}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
          editorState?.isParagraph ? 'bg-gray-200' : 'bg-white'
        }`}
        title="Párrafo Normal"
      >
        P
      </button>
      <button
        onClick={() => executeCommand(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 font-bold ${
          editorState?.isHeading1 ? 'bg-gray-200' : 'bg-white'
        }`}
        title="Título Principal"
      >
        H1
      </button>
      <button
        onClick={() => executeCommand(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 font-semibold ${
          editorState?.isHeading2 ? 'bg-gray-200' : 'bg-white'
        }`}
        title="Subtítulo"
      >
        H2
      </button>
      <button
        onClick={() => executeCommand(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 font-medium ${
          editorState?.isHeading3 ? 'bg-gray-200' : 'bg-white'
        }`}
        title="Subtítulo Menor"
      >
        H3
      </button>
      
      <div className="border-l border-gray-300 h-6 mx-2"></div>
      
      {/* Formato de texto */}
      <button
        onClick={() => executeCommand(() => editor.chain().focus().toggleBold().run())}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 font-bold ${
          editorState?.isBold ? 'bg-gray-200' : 'bg-white'
        }`}
        title="Negrita"
      >
        B
      </button>
      <button
        onClick={() => executeCommand(() => editor.chain().focus().toggleItalic().run())}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 italic ${
          editorState?.isItalic ? 'bg-gray-200' : 'bg-white'
        }`}
        title="Cursiva"
      >
        I
      </button>
      <button
        onClick={handleLink}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
          editorState?.isLink ? 'bg-gray-200' : 'bg-white'
        }`}
        title="Insertar/Editar enlace"
      >
        🔗 Link
      </button>
      
      <div className="border-l border-gray-300 h-6 mx-2"></div>
      
      {/* Listas */}
      <button
        onClick={() => executeCommand(() => editor.chain().focus().toggleBulletList().run())}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
          editorState?.isBulletList ? 'bg-gray-200' : 'bg-white'
        }`}
        title="Lista con viñetas"
      >
        • Lista
      </button>
      <button
        onClick={() => executeCommand(() => editor.chain().focus().toggleOrderedList().run())}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
          editorState?.isOrderedList ? 'bg-gray-200' : 'bg-white'
        }`}
        title="Lista numerada"
      >
        1. Lista
      </button>
      
      <div className="border-l border-gray-300 h-6 mx-2"></div>
      
      {/* Otros */}
      <button
        onClick={() => executeCommand(() => editor.chain().focus().toggleBlockquote().run())}
        className={`px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
          editorState?.isBlockquote ? 'bg-gray-200' : 'bg-white'
        }`}
        title="Cita"
      >
        💬 Cita
      </button>
    </div>
  );
}

// Componente reutilizable para el editor con toolbar
function ContentEditor({ 
  editor, 
  isEditMode, 
  onToggleEdit, 
  title
}: {
  editor: Editor | null;
  isEditMode: boolean;
  onToggleEdit: () => void;
  title: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-700">{title}</label>
        <button
          onClick={onToggleEdit}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors"
        >
          {isEditMode ? '👁️ Vista Final' : '✏️ Editar'}
        </button>
      </div>
      
      <div>
        {isEditMode && <EditorToolbar editor={editor} />}
        <div className={`border border-gray-300 ${isEditMode ? 'rounded-b-md' : 'rounded-md'} min-h-[500px] bg-white overflow-hidden`}>
          <EditorContent 
            editor={editor}
            className="focus:outline-none 
              [&_.ProseMirror]:outline-none 
              [&_.ProseMirror]:font-system 
              [&_.ProseMirror]:p-6 
              [&_.ProseMirror]:min-h-[500px] 
              [&_.ProseMirror]:text-base 
              [&_.ProseMirror]:leading-relaxed 
              [&_.ProseMirror]:text-gray-700
              [&_.ProseMirror_h1]:text-3xl 
              [&_.ProseMirror_h1]:font-bold 
              [&_.ProseMirror_h1]:text-gray-900 
              [&_.ProseMirror_h1]:mt-6 
              [&_.ProseMirror_h1]:mb-4 
              [&_.ProseMirror_h1]:leading-tight
              [&_.ProseMirror_h2]:text-2xl 
              [&_.ProseMirror_h2]:font-semibold 
              [&_.ProseMirror_h2]:text-gray-900 
              [&_.ProseMirror_h2]:mt-5 
              [&_.ProseMirror_h2]:mb-3 
              [&_.ProseMirror_h2]:leading-snug
              [&_.ProseMirror_h3]:text-xl 
              [&_.ProseMirror_h3]:font-semibold 
              [&_.ProseMirror_h3]:text-gray-900 
              [&_.ProseMirror_h3]:mt-4 
              [&_.ProseMirror_h3]:mb-2 
              [&_.ProseMirror_h3]:leading-normal
              [&_.ProseMirror_p]:mb-4 
              [&_.ProseMirror_p]:text-gray-700 
              [&_.ProseMirror_p]:leading-relaxed
              [&_.ProseMirror_strong]:font-semibold 
              [&_.ProseMirror_strong]:text-gray-900
              [&_.ProseMirror_em]:italic 
              [&_.ProseMirror_em]:text-gray-600
              [&_.ProseMirror_ul]:my-4 
              [&_.ProseMirror_ul]:pl-6 
              [&_.ProseMirror_ul]:list-disc
              [&_.ProseMirror_ol]:my-4 
              [&_.ProseMirror_ol]:pl-6 
              [&_.ProseMirror_ol]:list-decimal
              [&_.ProseMirror_li]:my-1 
              [&_.ProseMirror_li]:text-gray-700 
              [&_.ProseMirror_li]:list-item
              [&_.ProseMirror_blockquote]:border-l-4 
              [&_.ProseMirror_blockquote]:border-orange-500 
              [&_.ProseMirror_blockquote]:bg-orange-50 
              [&_.ProseMirror_blockquote]:px-6 
              [&_.ProseMirror_blockquote]:py-4 
              [&_.ProseMirror_blockquote]:my-6 
              [&_.ProseMirror_blockquote]:italic
              [&_.ProseMirror_blockquote_p]:m-0 
              [&_.ProseMirror_blockquote_p]:text-orange-800
              [&_.ProseMirror_a]:text-orange-600 
              [&_.ProseMirror_a]:underline 
              [&_.ProseMirror_a:hover]:text-orange-700"
          />
        </div>
      </div>
    </div>
  );
}

const AdminSiteContent: React.FC = () => {
  const [content, setContent] = useState<SiteContent>({
    id: 1,
    terms_and_conditions: "",
    privacy_policy: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');
  const [isEditMode, setIsEditMode] = useState<{terms: boolean, privacy: boolean}>({
    terms: false,
    privacy: false
  });

  // Editores usando el hook personalizado
  const termsEditor = useContentEditor(
    content.terms_and_conditions,
    (html) => setContent(prev => ({ ...prev, terms_and_conditions: html })),
    isEditMode.terms,
    loading
  );

  const privacyEditor = useContentEditor(
    content.privacy_policy,
    (html) => setContent(prev => ({ ...prev, privacy_policy: html })),
    isEditMode.privacy,
    loading
  );

  const fetchSiteContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Error fetching site content:', error);
        setError('Error al cargar el contenido del sitio');
        return;
      }

      // Usar contenido HTML directamente
      setContent(data);
    } catch (err) {
      console.error('Error fetching site content:', err);
      setError('Error al cargar el contenido del sitio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteContent();
  }, [fetchSiteContent]);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const { error } = await supabase
        .from('site_content')
        .update({
          terms_and_conditions: content.terms_and_conditions,
          privacy_policy: content.privacy_policy
        })
        .eq('id', 1);

      if (error) throw error;

      setSuccess('Contenido guardado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving site content:', err);
      setError('Error al guardar el contenido');
    } finally {
      setSaving(false);
    }
  }, [content.terms_and_conditions, content.privacy_policy]);

  const toggleEditMode = useCallback((field: 'terms' | 'privacy') => {
    setIsEditMode(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Contenido del Sitio
        </h1>
        <p className="text-gray-600">
          Gestiona los términos y condiciones y las políticas de privacidad del sitio web.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('terms')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'terms'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Términos y Condiciones
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'privacy'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Políticas de Privacidad
            </button>
          </nav>
        </div>
      </div>

      {/* Content Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeTab === 'terms' && (
          <ContentEditor
            editor={termsEditor}
            isEditMode={isEditMode.terms}
            onToggleEdit={() => toggleEditMode('terms')}
            title="Términos y Condiciones"
          />
        )}

        {activeTab === 'privacy' && (
          <ContentEditor
            editor={privacyEditor}
            isEditMode={isEditMode.privacy}
            onToggleEdit={() => toggleEditMode('privacy')}
            title="Políticas de Privacidad"
          />
        )}

        {/* Tips */}
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-1">💡 Editor completamente visual:</h3>
          <div className="text-xs text-blue-700">
            <p>• <strong>Vista Final:</strong> Ves exactamente cómo se verá en el sitio web (modo por defecto)</p>
            <p>• <strong>Editar:</strong> Escribe y formatea directamente como en Word - sin código visible</p>
            <p>• <strong>Herramientas:</strong> Selecciona texto y usa los botones para dar formato instantáneo</p>
            <p>• <strong>Alterna:</strong> Cambia entre "Editar" y "Vista Final" cuando quieras</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end items-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSiteContent;
