<?php
require_once 'conexion/class.conexion.php';
require_once 'clases/Tarea.php';

$tarea = new Tarea();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_POST['accion'] === 'agregar') {
        $desc = $_POST['descripcion'] ?? '';
        echo $tarea->agregar($desc) ? 'ok' : 'error';
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['accion'])) {
    $accion = $_GET['accion'];
    if ($accion === 'obtener') {
        echo json_encode($tarea->obtenerTodas());
        exit;
    } elseif ($accion === 'completar') {
        echo $tarea->completar($_GET['id']) ? 'ok' : 'error';
        exit;
    } elseif ($accion === 'eliminar') {
        echo $tarea->eliminar($_GET['id']) ? 'ok' : 'error';
        exit;
    }
}

$tareas = $tarea->obtenerTodas();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>To-Do List</title>
  <link rel="stylesheet" href="css/todo.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
</head>
<body>
  <div class="container">
    <div class="modo-toggle">
      <button id="modoBtn">Cambiar modo</button>
    </div>

    <h1>Lista de Tareas</h1>

    <form id="formulario">
      <input type="text" id="tarea" placeholder="Escribe una nueva tarea...">
      <button type="submit">Agregar</button>
    </form>

    <div class="filtros">
      <button class="filtro" data-filtro="todas">Todas</button>
      <button class="filtro" data-filtro="completadas">Completadas</button>
      <button class="filtro" data-filtro="pendientes">Pendientes</button>
    </div>

    <ul id="lista"></ul>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="js/todo.js"></script>
</body>
</html>
