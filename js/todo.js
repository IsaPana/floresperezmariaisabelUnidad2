document.addEventListener('DOMContentLoaded', function () {
  const formulario = document.getElementById('formulario');
  const input = document.getElementById('tarea');
  const lista = document.getElementById('lista');
  const filtroBtns = document.querySelectorAll('.filtro');
  const modoBtn = document.getElementById('modoBtn');

  let tareasGlobal = [];

  formulario.addEventListener('submit', function (e) {
    e.preventDefault();
    const descripcion = input.value.trim();
    if (descripcion === '') {
      Swal.fire('Escribe una tarea antes de agregar.', '', 'warning');
      return;
    }

    fetch('todo.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `accion=agregar&descripcion=${encodeURIComponent(descripcion)}`
    })
    .then(res => res.text())
    .then(res => {
      if (res === 'ok') {
        Swal.fire('Tarea agregada', '', 'success');
        input.value = '';
        cargarTareas();
      } else {
        Swal.fire('Error al agregar tarea', '', 'error');
      }
    });
  });

  function cargarTareas() {
    fetch('todo.php?accion=obtener')
      .then(res => res.json())
      .then(data => {
        tareasGlobal = data;
        mostrarTareas('todas');
      });
  }

  function mostrarTareas(filtro) {
    lista.innerHTML = '';
    const tareasFiltradas = tareasGlobal.filter(tarea => {
      if (filtro === 'completadas') return tarea.completada == 1;
      if (filtro === 'pendientes') return tarea.completada == 0;
      return true;
    });

    tareasFiltradas.forEach(tarea => {
      const li = document.createElement('li');
      li.className = tarea.completada == 1 ? 'completada' : '';
      li.innerHTML = `
        ${tarea.descripcion}
        <div>
          <button class="completar" onclick="completarTarea(${tarea.id})">✔</button>
          <button class="eliminar" onclick="eliminarTarea(${tarea.id})">✖</button>
        </div>`;
      
      li.addEventListener('mouseup', () => {
        li.classList.add('clicked');
        setTimeout(() => li.classList.remove('clicked'), 500);
      });

      lista.appendChild(li);
    });
  }

  window.completarTarea = function (id) {
    fetch(`todo.php?accion=completar&id=${id}`)
      .then(() => {
        Swal.fire('Tarea completada', '', 'success');
        cargarTareas();
      });
  };

  window.eliminarTarea = function (id) {
    Swal.fire({
      title: '¿Eliminar esta tarea?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`todo.php?accion=eliminar&id=${id}`)
          .then(() => {
            Swal.fire('Eliminada', '', 'success');
            cargarTareas();
          });
      }
    });
  };

  filtroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.filtro;
      mostrarTareas(tipo);
    });
  });

  modoBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    modoBtn.textContent = document.body.classList.contains('dark') ? 'Modo Claro' : 'Modo Oscuro';
  });

  cargarTareas();
});
