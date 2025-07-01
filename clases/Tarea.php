<?php
require_once __DIR__ . '/../conexion/class.conexion.php';

class Tarea {
    private $db;

    public function __construct() {
        $this->db = new Conexion();
    }

    // Agregar tarea
    public function agregar($descripcion) {
        $stmt = $this->db->prepare("INSERT INTO tareas (descripcion) VALUES (?)");
        $stmt->bind_param("s", $descripcion);
        return $stmt->execute();
    }

    // Obtener todas las tareas
    public function obtenerTodas() {
        $result = $this->db->query("SELECT * FROM tareas ORDER BY fecha_creacion DESC");
        $tareas = [];
        while ($fila = $result->fetch_assoc()) {
            $tareas[] = $fila;
        }
        return $tareas;
    }

    // Marcar tarea como completada
    public function completar($id) {
        $stmt = $this->db->prepare("UPDATE tareas SET completada = 1 WHERE id = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    // Eliminar tarea
    public function eliminar($id) {
        $stmt = $this->db->prepare("DELETE FROM tareas WHERE id = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>
