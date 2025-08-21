-- =================================================================
-- DATOS DE EJEMPLO PARA PROBAR EL DETALLE DE VEHÍCULOS
-- =================================================================

-- Insertar marcas
INSERT INTO brands (name, sort_order, is_active) VALUES
('Toyota', 1, true),
('Honda', 2, true),
('Hyundai', 3, true),
('Nissan', 4, true),
('Volkswagen', 5, true);

-- Insertar modelos
INSERT INTO models (brand_id, name, sort_order, is_active) VALUES
(1, 'Corolla', 1, true),
(1, 'Camry', 2, true),
(1, 'RAV4', 3, true),
(2, 'Civic', 1, true),
(2, 'Accord', 2, true),
(2, 'CR-V', 3, true),
(3, 'Elantra', 1, true),
(3, 'Tucson', 2, true),
(3, 'i10', 3, true),
(4, 'Sentra', 1, true),
(4, 'Altima', 2, true),
(5, 'Jetta', 1, true),
(5, 'Tiguan', 2, true);

-- Insertar categorías
INSERT INTO categories (name, image_url, sort_order, is_active) VALUES
('Sedán', 'https://images.unsplash.com/photo-1549927681-0b673b922a77?w=400&h=300&fit=crop', 1, true),
('SUV', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', 2, true),
('Hatchback', 'https://images.unsplash.com/photo-1606152421802-db97b6c3c67a?w=400&h=300&fit=crop', 3, true),
('Pickup', 'https://images.unsplash.com/photo-1619976215213-bb4c1a04fa16?w=400&h=300&fit=crop', 4, true),
('Compacto', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop', 5, true);

-- Insertar colores
INSERT INTO colors (name, hex_code, sort_order, is_active) VALUES
('Blanco', '#FFFFFF', 1, true),
('Negro', '#000000', 2, true),
('Plata', '#C0C0C0', 3, true),
('Rojo', '#FF0000', 4, true),
('Azul', '#0000FF', 5, true),
('Gris', '#808080', 6, true);

-- Insertar GPS
INSERT INTO gps (name, price, sort_order, is_active) VALUES
('GPS Básico', 500, 1, true),
('GPS Premium', 800, 2, true),
('GPS Avanzado', 1200, 3, true);

-- Insertar concesionarios
INSERT INTO dealerships (name, handle, is_active) VALUES
('MOBA RENTING Central', 'moba-central', true),
('MOBA RENTING Norte', 'moba-norte', true),
('MOBA RENTING Sur', 'moba-sur', true);

-- Insertar vehículos de ejemplo
INSERT INTO vehicles (
    dealership_id, model_id, gps_id, color_id, category_id,
    vehicle_price, maintenance_price, soat_price, auto_parts_price, insurance_price,
    image_urls, mileage, year, fuel, edition, traction, condition, transmission,
    dealership_authorization, insurance_authorization
) VALUES
(1, 9, 2, 1, 5, 18500, 1200, 350, 800, 900, 
 ARRAY[
   'https://images.unsplash.com/photo-1549927681-0b673b922a77?w=800&h=500&fit=crop',
   'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop',
   'https://images.unsplash.com/photo-1606152421802-db97b6c3c67a?w=800&h=500&fit=crop'
 ], 
 15000, 2023, 'Gasoline', '1.0 L', 'FWD', 'Semi-New', 'Manual', true, true),

(1, 1, 1, 2, 1, 25000, 1500, 400, 1000, 1100,
 ARRAY[
   'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=500&fit=crop',
   'https://images.unsplash.com/photo-1619976215213-bb4c1a04fa16?w=800&h=500&fit=crop'
 ],
 8000, 2024, 'Gasoline', '1.8 L CVT', 'FWD', 'New', 'CVT', true, true),

(2, 6, 3, 3, 2, 32000, 1800, 450, 1200, 1300,
 ARRAY[
   'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=500&fit=crop',
   'https://images.unsplash.com/photo-1606152421802-db97b6c3c67a?w=800&h=500&fit=crop',
   'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop',
   'https://images.unsplash.com/photo-1549927681-0b673b922a77?w=800&h=500&fit=crop'
 ],
 25000, 2022, 'Gasoline', 'Touring', 'AWD', 'Semi-New', 'Automatic', true, true),

(3, 8, 2, 4, 2, 28000, 1600, 420, 1100, 1200,
 ARRAY[
   'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=500&fit=crop'
 ],
 18000, 2023, 'Gasoline', '2.0 CRDI', 'AWD', 'Semi-New', 'Automatic', true, true),

(1, 4, 1, 5, 1, 22000, 1400, 380, 950, 1050,
 ARRAY[
   'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=500&fit=crop',
   'https://images.unsplash.com/photo-1619976215213-bb4c1a04fa16?w=800&h=500&fit=crop',
   'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop'
 ],
 12000, 2024, 'Gasoline', 'Sport', 'FWD', 'New', 'Manual', true, true);
