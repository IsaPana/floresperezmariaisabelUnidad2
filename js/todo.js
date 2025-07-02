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
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Escribe una tarea antes de agregar.',
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false
      });
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
        Swal.fire({
          icon: 'success',
          title: 'Tarea agregada',
          toast: true,
          position: 'top-end',
          timer: 1500,
          showConfirmButton: false
        });
        input.value = '';
        cargarTareas();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar tarea',
          toast: true,
          position: 'top-end',
          timer: 1500,
          showConfirmButton: false
        });
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

    if (filtro === 'eliminadas') {
      fetch('todo.php?accion=eliminadas')
        .then(res => res.json())
        .then(data => {
          data.forEach(tarea => {
            const li = document.createElement('li');
            li.style.opacity = 0.6;
            li.style.textDecoration = 'line-through';
            li.innerHTML = `
              ${tarea.descripcion}
              <div>
                <img src="img/delete.png" alt="Eliminada" width="20">
              </div>`;
            lista.appendChild(li);
          });
        });
      return;
    }

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
          <button class="completar" onclick="completarTarea(${tarea.id})">
            <img src="img/check.png" alt="Completar" width="20">
          </button>
          <button class="eliminar" onclick="eliminarTarea(${tarea.id})">
            <img src="img/delete.png" alt="Eliminar" width="20">
          </button>
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
        Swal.fire({
          icon: 'success',
          title: 'Tarea completada',
          toast: true,
          position: 'top-end',
          timer: 1200,
          showConfirmButton: false
        });
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
            Swal.fire({
              icon: 'success',
              title: 'Tarea eliminada',
              toast: true,
              position: 'top-end',
              timer: 1500,
              showConfirmButton: false
            });
            cargarTareas();
          });
      }
    });
  };

  filtroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.filtro;
      if (tipo === 'eliminadas') {
        mostrarTareas('eliminadas');
      } else {
        cargarTareas();
        setTimeout(() => mostrarTareas(tipo), 200); 
      }
    });
  });

  modoBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    modoBtn.textContent = document.body.classList.contains('dark') ? 'Modo Claro' : 'Modo Oscuro';
  });

  cargarTareas();
});
