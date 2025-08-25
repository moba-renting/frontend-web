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
            className="prose prose-lg max-w-none
              [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-4 [&_h1]:mt-6
              [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-800 [&_h2]:mb-3 [&_h2]:mt-6
              [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-gray-700 [&_h3]:mb-2 [&_h3]:mt-4
              [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4
              [&_strong]:font-semibold [&_strong]:text-gray-900
              [&_em]:italic [&_em]:text-gray-600
              [&_ul]:my-4 [&_ul]:pl-6 [&_ul]:list-disc
              [&_ol]:my-4 [&_ol]:pl-6 [&_ol]:list-decimal
              [&_li]:my-1 [&_li]:text-gray-700
              [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:bg-orange-50 
              [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:my-6 [&_blockquote]:italic
              [&_blockquote_p]:m-0 [&_blockquote_p]:text-orange-800
              [&_a]:text-orange-600 [&_a]:underline [&_a:hover]:text-orange-700"
            dangerouslySetInnerHTML={{ 
              __html: content 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
