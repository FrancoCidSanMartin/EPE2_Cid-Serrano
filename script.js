// Función para cargar los datos desde el archivo JSON
document.addEventListener('DOMContentLoaded', function() {
    // Cargar el archivo JSON
    fetch('Lista.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            // Guardar los datos originales para poder filtrar más tarde
            // Los datos están dentro de la propiedad "Listado de Productos"
            window.productosData = data["Listado de Productos"];
            
            // Cargar los datos en la tabla
            cargarTablaProductos(window.productosData);
            
            // Llenar los selectores de filtros
            llenarFiltros(window.productosData);
            
            // Configurar el evento del botón de filtro
            document.getElementById('filterButton').addEventListener('click', filtrarProductos);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar los datos: ' + error.message);
        });
});

// Función para cargar los datos en la tabla
function cargarTablaProductos(productos) {
    const tableBody = document.getElementById('productosBody');
    tableBody.innerHTML = '';
    
    productos.forEach(producto => {
        const row = document.createElement('tr');
        
        // Crear las celdas para cada propiedad del producto según la estructura del JSON
        row.innerHTML = `
            <td>${producto.IdProducto || '-'}</td>
            <td>${producto.NombreProducto || '-'}</td>
            <td>${producto.Proveedor || '-'}</td>
            <td>${producto.Categoría || '-'}</td>
            <td>${producto.CantidadPorUnidad || '-'}</td>
            <td>${producto.PrecioUnidad || '0'}</td>
            <td>${producto.UnidadesEnExistencia || '0'}</td>
            <td>${producto.UnidadesEnPedido || '0'}</td>
            <td>${producto.NivelNuevoPedido || '0'}</td>
            <td>${producto.Suspendido || '0'}</td>
            
        `;
        
        tableBody.appendChild(row);
    });
}

// Función para llenar los selectores de filtros
function llenarFiltros(productos) {
    const proveedorSelect = document.getElementById('proveedorFilter');
    const categoriaSelect = document.getElementById('categoriaFilter');
    
    // Obtener proveedores únicos
    const proveedores = [...new Set(productos.map(item => item.Proveedor))].filter(Boolean).sort();
    
    // Obtener categorías únicas
    const categorias = [...new Set(productos.map(item => item.Categoría))].filter(Boolean).sort();
    
    // Llenar el selector de proveedores
    proveedores.forEach(proveedor => {
        const option = document.createElement('option');
        option.value = proveedor;
        option.textContent = proveedor;
        proveedorSelect.appendChild(option);
    });
    
    // Llenar el selector de categorías
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        categoriaSelect.appendChild(option);
    });
}

// Función para filtrar productos
function filtrarProductos() {
    const proveedorSeleccionado = document.getElementById('proveedorFilter').value;
    const categoriaSeleccionada = document.getElementById('categoriaFilter').value;
    
    // Filtrar los productos según las selecciones
    let productosFiltrados = window.productosData;
    
    if (proveedorSeleccionado) {
        productosFiltrados = productosFiltrados.filter(producto => 
            producto.Proveedor === proveedorSeleccionado
        );
    }
    
    if (categoriaSeleccionada) {
        productosFiltrados = productosFiltrados.filter(producto => 
            producto.Categoría === categoriaSeleccionada
        );
    }
    
    // Actualizar la tabla con los productos filtrados
    cargarTablaProductos(productosFiltrados);
}