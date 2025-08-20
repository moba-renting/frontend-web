# Feature: Vehicles

Este feature contiene toda la funcionalidad relacionada con la gestión y visualización de vehículos.

## Estructura

```
src/features/vehicles/
├── components/          # Componentes reutilizables
│   ├── VehicleFilters.tsx   # Sidebar de filtros
│   ├── VehicleList.tsx      # Lista de vehículos con paginación
│   └── index.ts             # Exportaciones del módulo
├── pages/              # Páginas principales
│   └── VehiclesListPage.tsx # Página principal de listado
├── types/              # Tipos TypeScript compartidos
│   └── index.ts        # Interfaces y tipos
```

## Componentes

### VehicleFilters
- **Propósito**: Renderiza todos los filtros disponibles (marca, modelo, categoría, año, kilometraje, etc.)
- **Características**:
  - Filtros dinámicos basados en datos disponibles
  - Filtros personalizados con inputs de rango
  - Aplicación diferida con botones "Aplicar"
  - Manejo de conflictos (marca vs modelo)

### VehicleList
- **Propósito**: Muestra la lista de vehículos con paginación
- **Características**:
  - Grid responsivo de tarjetas de vehículos
  - Paginación con controles de navegación
  - Estados de carga y vacío
  - Formateo de precios

### VehiclesListPage
- **Propósito**: Página principal que coordina filtros, listado y estado de la URL
- **Características**:
  - Manejo de query parameters para filtros compartibles
  - Integración con Supabase para datos
  - Estados locales para filtros personalizados
  - Coordinación entre componentes

## Tipos Compartidos

Las interfaces están centralizadas en `/types/index.ts`:
- `Vehicle`: Estructura de un vehículo
- `Filters`: Objeto de filtros activos
- `AvailableFilters`: Filtros disponibles dinámicamente
- `FilterOption` y `RangeFilterOption`: Opciones de filtro

## Funcionalidades

1. **Filtrado Avanzado**: Múltiples criterios con lógica de negocio
2. **Query Parameters**: URLs compartibles con estado de filtros
3. **Paginación**: Navegación eficiente de grandes listas
4. **Filtros Personalizados**: Rangos de año y kilometraje con aplicación diferida
5. **Responsive Design**: Adaptable a diferentes tamaños de pantalla
6. **Integración Supabase**: Funciones optimizadas para filtrado y paginación

## Uso

```tsx
import { VehiclesListPage } from './features/vehicles/pages';

// En tu router
<Route path="/vehicles" element={<VehiclesListPage />} />
```
