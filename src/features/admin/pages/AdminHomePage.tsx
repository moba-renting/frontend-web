import React, { useState, useEffect } from "react";
import { supabase } from "../../../core/services/supabase";
import { MdEdit, MdSave, MdAdd, MdDelete, MdUpload } from "react-icons/md";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState<{
    heroBanners: boolean;
    b2bBenefits: boolean;
    b2cBenefits: boolean;
    faqs: boolean;
  }>({
    heroBanners: false,
    b2bBenefits: false,
    b2cBenefits: false,
    faqs: false
  });

  // Estados para edición por sección
  const [editModes, setEditModes] = useState<{
    heroBanners: boolean;
    b2bBenefits: boolean;
    b2cBenefits: boolean;
    faqs: boolean;
  }>({
    heroBanners: false,
    b2bBenefits: false,
    b2cBenefits: false,
    faqs: false
  });

  // Estados para edición de FAQs
  const [editedFaqs, setEditedFaqs] = useState<FAQ[]>([]);
  const [newFaq, setNewFaq] = useState<FAQ>({ question: "", answer: "" });

  // Estados para archivos
  const [heroBannerFiles, setHeroBannerFiles] = useState<FileList | null>(null);
  const [b2bBenefitsFile, setB2bBenefitsFile] = useState<File | null>(null);
  const [b2cBenefitsFile, setB2cBenefitsFile] = useState<File | null>(null);

  const API_BASE_URL = `${import.meta.env.VITE_FUNCTIONS_URL || "http://localhost:8000/api/v1"}/home-page`;

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
      setEditedFaqs(data?.faqs || []);
    } catch (error) {
      console.error('Error fetching config:', error);
      setError('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  // Función para alternar modo de edición por sección
  const toggleEditMode = (section: keyof typeof editModes) => {
    setEditModes(prev => ({
      ...prev,
      [section]: !prev[section]
    }));

    // Limpiar archivos al salir del modo edición
    if (editModes[section]) {
      setHeroBannerFiles(null);
      setB2bBenefitsFile(null);
      setB2cBenefitsFile(null);
      if (section === 'faqs') {
        setEditedFaqs(config?.faqs || []);
        setNewFaq({ question: "", answer: "" });
      }
    }
  };

  // Función para guardar FAQs
  const saveFaqs = async () => {
    try {
      setUploading(prev => ({ ...prev, faqs: true }));
      setError(null);

      const { error } = await supabase
        .from('home_page_config')
        .update({ faqs: editedFaqs })
        .eq('id', 1);

      if (error) throw error;

      setConfig(prev => prev ? { ...prev, faqs: editedFaqs } : null);
      setEditModes(prev => ({ ...prev, faqs: false }));
      setSuccess('FAQs actualizados exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving FAQs:', error);
      setError('Error al guardar las FAQs');
    } finally {
      setUploading(prev => ({ ...prev, faqs: false }));
    }
  };

  // Función para subir imágenes de hero banner
  const uploadHeroBannerImages = async () => {
    if (!heroBannerFiles || heroBannerFiles.length === 0) return;

    try {
      setUploading(prev => ({ ...prev, heroBanners: true }));
      setError(null);

      const formData = new FormData();
      Array.from(heroBannerFiles).forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${API_BASE_URL}/hero-banner`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Error al subir las imágenes de hero banner');
      }

      const result = await response.json();
      setSuccess(result.message || 'Imágenes de hero banner subidas exitosamente');
      setHeroBannerFiles(null);
      
      // Recargar configuración para obtener las nuevas URLs actualizadas por el backend
      await fetchConfig();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error uploading hero banner images:', error);
      setError(error instanceof Error ? error.message : 'Error al subir las imágenes de hero banner');
    } finally {
      setUploading(prev => ({ ...prev, heroBanners: false }));
    }
  };

  // Función para subir imagen B2B
  const uploadB2bBenefitsImage = async () => {
    if (!b2bBenefitsFile) return;

    try {
      setUploading(prev => ({ ...prev, b2bBenefits: true }));
      setError(null);

      const formData = new FormData();
      formData.append('image', b2bBenefitsFile);

      const response = await fetch(`${API_BASE_URL}/b2b-benefits`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Error al subir la imagen B2B');
      }

      const result = await response.json();
      setSuccess(result.message || 'Imagen B2B subida exitosamente');
      setB2bBenefitsFile(null);
      
      // Recargar configuración para obtener la nueva URL actualizada por el backend
      await fetchConfig();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error uploading B2B image:', error);
      setError(error instanceof Error ? error.message : 'Error al subir la imagen B2B');
    } finally {
      setUploading(prev => ({ ...prev, b2bBenefits: false }));
    }
  };

  // Función para subir imagen B2C
  const uploadB2cBenefitsImage = async () => {
    if (!b2cBenefitsFile) return;

    try {
      setUploading(prev => ({ ...prev, b2cBenefits: true }));
      setError(null);

      const formData = new FormData();
      formData.append('image', b2cBenefitsFile);

      const response = await fetch(`${API_BASE_URL}/b2c-benefits`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Error al subir la imagen B2C');
      }

      const result = await response.json();
      setSuccess(result.message || 'Imagen B2C subida exitosamente');
      setB2cBenefitsFile(null);
      
      // Recargar configuración para obtener la nueva URL actualizada por el backend
      await fetchConfig();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error uploading B2C image:', error);
      setError(error instanceof Error ? error.message : 'Error al subir la imagen B2C');
    } finally {
      setUploading(prev => ({ ...prev, b2cBenefits: false }));
    }
  };

  const removeBannerUrl = (index: number) => {
    if (!config) return;

    // Actualizar directamente en Supabase y luego recargar
    const updateBanners = async () => {
      try {
        const newUrls = config.hero_banner_urls.filter((_, i) => i !== index);
        
        const { error } = await supabase
          .from('home_page_config')
          .update({ hero_banner_urls: newUrls })
          .eq('id', 1);

        if (error) throw error;
        
        await fetchConfig();
        setSuccess('Banner eliminado exitosamente');
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error('Error removing banner:', error);
        setError('Error al eliminar el banner');
      }
    };

    updateBanners();
  };

  const addFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    setEditedFaqs(prev => [...prev, { ...newFaq }]);
    setNewFaq({ question: "", answer: "" });
  };

  const removeFaq = (index: number) => {
    setEditedFaqs(prev => prev.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setEditedFaqs(prev => {
      const newFaqs = [...prev];
      newFaqs[index] = { ...newFaqs[index], [field]: value };
      return newFaqs;
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
              <p className="text-gray-600 mt-2">Gestiona el contenido de la página principal por secciones</p>
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
          {/* Hero Banner Images */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Imágenes de Banner Principal</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Las imágenes se suben a Cloudinary y las URLs se actualizan automáticamente en la base de datos
                </p>
              </div>
              <button
                onClick={() => toggleEditMode('heroBanners')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
              >
                <MdEdit className="size-4" />
                {editModes.heroBanners ? 'Cancelar' : 'Editar'}
              </button>
            </div>
            
            {/* Mostrar imágenes actuales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config?.hero_banner_urls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={url}
                      alt={`Hero Banner ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x225/f3f4f6/9ca3af?text=Imagen+no+disponible';
                      }}
                    />
                  </div>
                  {editModes.heroBanners && (
                    <button
                      onClick={() => removeBannerUrl(index)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                      title="Eliminar banner"
                    >
                      <MdDelete className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Sección de subida de archivos */}
            {editModes.heroBanners && (
              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold text-gray-700">Subir Nuevas Imágenes de Banner</h3>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccionar imágenes (múltiples archivos permitidos)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setHeroBannerFiles(e.target.files)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {heroBannerFiles && heroBannerFiles.length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {heroBannerFiles.length} archivo(s) seleccionado(s)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={uploadHeroBannerImages}
                    disabled={!heroBannerFiles || heroBannerFiles.length === 0 || uploading.heroBanners}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                  >
                    <MdUpload className="size-4" />
                    {uploading.heroBanners ? "Subiendo..." : "Subir Imágenes"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* B2B Benefits Image */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Imagen de Beneficios B2B</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Imagen para la sección de beneficios dirigida a empresas
                </p>
              </div>
              <button
                onClick={() => toggleEditMode('b2bBenefits')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
              >
                <MdEdit className="size-4" />
                {editModes.b2bBenefits ? 'Cancelar' : 'Editar'}
              </button>
            </div>
            
            {/* Mostrar imagen actual */}
            <div className="aspect-video max-w-md bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={config?.b2b_benefits_url}
                alt="Beneficios B2B"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x225/f3f4f6/9ca3af?text=Imagen+B2B';
                }}
              />
            </div>

            {/* Sección de subida de archivo */}
            {editModes.b2bBenefits && (
              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold text-gray-700">Subir Nueva Imagen B2B</h3>
                <div className="flex gap-3 items-end">
                  <div className="flex-1 max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccionar imagen
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setB2bBenefitsFile(e.target.files?.[0] || null)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {b2bBenefitsFile && (
                      <p className="text-sm text-gray-600 mt-1">
                        Archivo seleccionado: {b2bBenefitsFile.name}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={uploadB2bBenefitsImage}
                    disabled={!b2bBenefitsFile || uploading.b2bBenefits}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                  >
                    <MdUpload className="size-4" />
                    {uploading.b2bBenefits ? "Subiendo..." : "Subir Imagen"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* B2C Benefits Image */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Imagen de Beneficios B2C</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Imagen para la sección de beneficios dirigida a clientes individuales
                </p>
              </div>
              <button
                onClick={() => toggleEditMode('b2cBenefits')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
              >
                <MdEdit className="size-4" />
                {editModes.b2cBenefits ? 'Cancelar' : 'Editar'}
              </button>
            </div>
            
            {/* Mostrar imagen actual */}
            <div className="aspect-video max-w-md bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={config?.b2c_benefits_url}
                alt="Beneficios B2C"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x225/f3f4f6/9ca3af?text=Imagen+B2C';
                }}
              />
            </div>

            {/* Sección de subida de archivo */}
            {editModes.b2cBenefits && (
              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold text-gray-700">Subir Nueva Imagen B2C</h3>
                <div className="flex gap-3 items-end">
                  <div className="flex-1 max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccionar imagen
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setB2cBenefitsFile(e.target.files?.[0] || null)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {b2cBenefitsFile && (
                      <p className="text-sm text-gray-600 mt-1">
                        Archivo seleccionado: {b2cBenefitsFile.name}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={uploadB2cBenefitsImage}
                    disabled={!b2cBenefitsFile || uploading.b2cBenefits}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                  >
                    <MdUpload className="size-4" />
                    {uploading.b2cBenefits ? "Subiendo..." : "Subir Imagen"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Preguntas Frecuentes</h2>
              <div className="flex gap-2">
                {editModes.faqs && (
                  <button
                    onClick={saveFaqs}
                    disabled={uploading.faqs}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                  >
                    <MdSave className="size-4" />
                    {uploading.faqs ? "Guardando..." : "Guardar FAQs"}
                  </button>
                )}
                <button
                  onClick={() => toggleEditMode('faqs')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                >
                  <MdEdit className="size-4" />
                  {editModes.faqs ? 'Cancelar' : 'Editar'}
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {(editModes.faqs ? editedFaqs : config?.faqs || []).map((faq: FAQ, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  {editModes.faqs ? (
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

              {editModes.faqs && (
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
