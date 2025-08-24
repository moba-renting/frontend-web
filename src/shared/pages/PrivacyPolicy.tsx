import React, { useState, useEffect } from "react";
import { supabase } from "../../core/services/supabase";

const PrivacyPolicy: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('site_content')
          .select('privacy_policy')
          .eq('id', 1)
          .single();

        if (error) {
          throw error;
        }

        if (data?.privacy_policy) {
          setContent(data.privacy_policy);
        }
      } catch (err) {
        console.error('Error fetching privacy policy:', err);
        setError('Error al cargar las políticas de privacidad');
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  // Función para convertir Markdown básico a HTML
  const parseMarkdown = (markdown: string): string => {
    return markdown
      // Títulos
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-800 mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium text-gray-700 mb-2 mt-4">$1</h3>')
      
      // Texto en cursiva
      .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-600">$1</em>')
      
      // Texto en negrita
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-gray-900">$1</strong>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Listas con números
      .replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-4">$1</li>')
      
      // Listas con guiones
      .replace(/^-\s+(.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      
      // Blockquotes
      .replace(/^>\s+(.*$)/gim, '<blockquote class="border-l-4 border-orange-500 pl-4 my-3 bg-orange-50 p-3 rounded-r-lg"><p class="text-gray-700 font-medium">$1</p></blockquote>')
      
      // Líneas horizontales
      .replace(/^---$/gim, '<hr class="border-gray-300 my-6">')
      
      // Párrafos (líneas que no son títulos, listas o blockquotes)
      .replace(/^(?!<[h|l|b|h])(.+)$/gim, '<p class="text-gray-700 leading-tight">$1</p>')
      
      // Saltos de línea
      .replace(/\n/g, '<br/>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: parseMarkdown(content) 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
