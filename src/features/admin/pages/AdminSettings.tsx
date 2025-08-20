import React from "react";

const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuraciones</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gestiona las configuraciones generales del sistema
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Configuraciones del Sistema</h3>
          <div className="mt-5">
            <div className="text-center py-8">
              <p className="text-gray-500">Próximamente: Configuraciones adicionales del sistema</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
