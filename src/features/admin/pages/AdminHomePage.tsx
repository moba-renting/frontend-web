import React, { useState, useEffect } from "react";
import { supabase } from "../../../core/services/supabase";
import { MdEdit, MdSave, MdCancel, MdAdd, MdDelete } from "react-icons/md";

interface HomePageConfig {
  id: number;
  hero_banner_urls: string[];
  b2b_benefits_url: string;
  b2c_benefits_url: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

interface FAQ {
  question: string;
  answer: string;
}

const AdminHomePage: React.FC = () => {
  const [config, setConfig] = useState<HomePageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados para edición
  const [editedConfig, setEditedConfig] = useState<HomePageConfig | null>(null);
  const [newBannerUrl, setNewBannerUrl] = useState("");
  const [newFaq, setNewFaq] = useState<FAQ>({ question: "", answer: "" });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('home_page_config')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      setConfig(data);
      setEditedConfig(data);
    } catch (error) {
      console.error('Error fetching config:', error);
      setError('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedConfig) return;

    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from('home_page_config')
        .update({
          hero_banner_urls: editedConfig.hero_banner_urls,
          b2b_benefits_url: editedConfig.b2b_benefits_url,
          b2c_benefits_url: editedConfig.b2c_benefits_url,
          faqs: editedConfig.faqs
        })
        .eq('id', 1);

      if (error) throw error;

      setConfig(editedConfig);
      setEditMode(false);
      setSuccess('Configuración guardada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving config:', error);
      setError('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedConfig(config);
    setEditMode(false);
    setNewBannerUrl("");
    setNewFaq({ question: "", answer: "" });
    setError(null);
  };

  const addBannerUrl = () => {
    if (!newBannerUrl.trim() || !editedConfig) return;

    setEditedConfig({
      ...editedConfig,
      hero_banner_urls: [...editedConfig.hero_banner_urls, newBannerUrl.trim()]
    });
    setNewBannerUrl("");
  };

  const removeBannerUrl = (index: number) => {
    if (!editedConfig) return;

    setEditedConfig({
      ...editedConfig,
      hero_banner_urls: editedConfig.hero_banner_urls.filter((_, i) => i !== index)
    });
  };

  const updateBannerUrl = (index: number, value: string) => {
    if (!editedConfig) return;

    const newUrls = [...editedConfig.hero_banner_urls];
    newUrls[index] = value;
    setEditedConfig({
      ...editedConfig,
      hero_banner_urls: newUrls
    });
  };

  const addFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim() || !editedConfig) return;

    setEditedConfig({
      ...editedConfig,
      faqs: [...editedConfig.faqs, { ...newFaq }]
    });
    setNewFaq({ question: "", answer: "" });
  };

  const removeFaq = (index: number) => {
    if (!editedConfig) return;

    setEditedConfig({
      ...editedConfig,
      faqs: editedConfig.faqs.filter((_, i) => i !== index)
    });
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    if (!editedConfig) return;

    const newFaqs = [...editedConfig.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setEditedConfig({
      ...editedConfig,
      faqs: newFaqs
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Cargando configuración...</div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-red-600">Error al cargar la configuración</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuración del Home Page</h1>
              <p className="text-gray-600 mt-2">Gestiona el contenido de la página principal</p>
            </div>
            <div className="flex gap-3">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                >
                  <MdEdit className="size-4" />
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                  >
                    <MdSave className="size-4" />
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                  >
                    <MdCancel className="size-4" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mx-6 mt-4 rounded">
            {success}
          </div>
        )}

        <div className="p-6 space-y-8">
          {/* Hero Banner URLs */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">URLs de Banner Principal</h2>
            <div className="space-y-3">
              {(editMode ? editedConfig : config)?.hero_banner_urls.map((url, index) => (
                <div key={index} className="flex gap-3 items-center">
                  {editMode ? (
                    <>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateBannerUrl(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                      <button
                        onClick={() => removeBannerUrl(index)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition"
                      >
                        <MdDelete className="size-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 bg-gray-50 px-3 py-2 rounded-md border">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {url}
                      </a>
                    </div>
                  )}
                </div>
              ))}
              
              {editMode && (
                <div className="flex gap-3 items-center border-t pt-3">
                  <input
                    type="url"
                    value={newBannerUrl}
                    onChange={(e) => setNewBannerUrl(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nueva URL de banner"
                  />
                  <button
                    onClick={addBannerUrl}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition"
                  >
                    <MdAdd className="size-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* B2B Benefits URL */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">URL de Beneficios B2B</h2>
            {editMode ? (
              <input
                type="url"
                value={editedConfig?.b2b_benefits_url || ""}
                onChange={(e) => setEditedConfig(prev => prev ? { ...prev, b2b_benefits_url: e.target.value } : null)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com/beneficios-b2b.jpg"
              />
            ) : (
              <div className="bg-gray-50 px-3 py-2 rounded-md border">
                <a href={config.b2b_benefits_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {config.b2b_benefits_url}
                </a>
              </div>
            )}
          </div>

          {/* B2C Benefits URL */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">URL de Beneficios B2C</h2>
            {editMode ? (
              <input
                type="url"
                value={editedConfig?.b2c_benefits_url || ""}
                onChange={(e) => setEditedConfig(prev => prev ? { ...prev, b2c_benefits_url: e.target.value } : null)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com/beneficios-b2c.jpg"
              />
            ) : (
              <div className="bg-gray-50 px-3 py-2 rounded-md border">
                <a href={config.b2c_benefits_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {config.b2c_benefits_url}
                </a>
              </div>
            )}
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              {(editMode ? editedConfig : config)?.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  {editMode ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(index, 'question', e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                          placeholder="Pregunta"
                        />
                        <button
                          onClick={() => removeFaq(index)}
                          className="ml-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition"
                        >
                          <MdDelete className="size-4" />
                        </button>
                      </div>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Respuesta"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}

              {editMode && (
                <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-gray-700">Nueva Pregunta Frecuente</h3>
                  <input
                    type="text"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Pregunta"
                  />
                  <textarea
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Respuesta"
                  />
                  <button
                    onClick={addFaq}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                  >
                    <MdAdd className="size-4" />
                    Agregar FAQ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
