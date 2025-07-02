<?php
require_once __DIR__ . '/../conexion/class.conexion.php';

class Tarea {
    private $db;

    public function __construct() {
        $this->db = new Conexion();
    }

    public function agregar($descripcion) {
        $stmt = $this->db->prepare("INSERT INTO tareas (descripcion, completada, eliminado) VALUES (?, 0, 0)");
        $stmt->bind_param("s", $descripcion);
        return $stmt->execute();
    }

    public function obtenerTodas() {
        $result = $this->db->query("SELECT * FROM tareas WHERE eliminado = 0 ORDER BY fecha_creacion DESC");
        $tareas = [];
        while ($fila = $result->fetch_assoc()) {
            $tareas[] = $fila;
        }
        return $tareas;
    }

    public function obtenerEliminadas() {
        $result = $this->db->query("SELECT * FROM tareas WHERE eliminado = 1 ORDER BY fecha_creacion DESC");
        $tareas = [];
        while ($fila = $result->fetch_assoc()) {
            $tareas[] = $fila;
        }
        return $tareas;
    }

    // Marcar tarea como completada
    public function completar($id) {
        $stmt = $this->db->prepare("UPDATE tareas SET completada = 1 WHERE id = ? AND eliminado = 0");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    // Eliminar tarea (marcar como eliminada)
    public function eliminar($id) {
        $stmt = $this->db->prepare("UPDATE tareas SET eliminado = 1 WHERE id = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>
