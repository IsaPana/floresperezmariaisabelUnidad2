<?php
class Conexion extends mysqli {
    private $host = 'localhost';
    private $user = 'root';
    private $pass = '';
    private $db = 'list';

    public function __construct() {
        parent::__construct($this->host, $this->user, $this->pass, $this->db);

        if ($this->connect_error) {
            die("Error de conexión: " . $this->connect_error);
        }
    }
}