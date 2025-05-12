// Clase base Movimiento
    function Movimiento(descripcion, monto) {
      if (!descripcion || isNaN(monto) || monto <= 0) {
        throw new Error("Datos inválidos para el movimiento.");
      }

      this.descripcion = descripcion;
      this.monto = Number(monto);
      this.fecha = new Date().toLocaleDateString();
      this.id = crypto.randomUUID();
    }

    Movimiento.prototype.getMontoConSigno = function () {
      return this.tipo === "egreso" ? -this.monto : this.monto;
    };

    Movimiento.prototype.getClaseCSS = function () {
      return this.tipo === "ingreso" ? "text-green-600" : "text-red-600";
    };

    Movimiento.prototype.formatearMonto = function () {
      const signo = this.getMontoConSigno() >= 0 ? "+" : "-";
      return `${signo}$${Math.abs(this.monto).toFixed(2)}`;
    };

    Movimiento.prototype.mostrarInformacion = function () {
      return `Fecha: ${this.fecha}, Descripción: ${this.descripcion}, Monto: ${this.formatearMonto()}, Tipo: ${this.tipo}`;
    };

    Movimiento.prototype.render = function () {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td class="px-4 py-2">${this.fecha}</td>
        <td class="px-4 py-2">${this.descripcion}</td>
        <td class="px-4 py-2 ${this.getClaseCSS()}">${this.formatearMonto()}</td>
        <td class="px-4 py-2">${this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1)}</td>
        <td class="px-4 py-2">
          <button class="eliminar bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded" data-id="${this.id}">🗑️</button>
        </td>
      `;
      return fila;
    };

    // Subclases
    function Ingreso(descripcion, monto) {
      Movimiento.call(this, descripcion, monto);
      this.tipo = "ingreso";
    }
    Ingreso.prototype = Object.create(Movimiento.prototype);
    Ingreso.prototype.constructor = Ingreso;

    function Egreso(descripcion, monto) {
      Movimiento.call(this, descripcion, monto);
      this.tipo = "egreso";
    }
    Egreso.prototype = Object.create(Movimiento.prototype);
    Egreso.prototype.constructor = Egreso;

    // Clase GestorFinanzas
    function GestorFinanzas() {
      this.movimientos = [];
    }

    GestorFinanzas.prototype.agregarMovimiento = function (movimiento) {
      this.movimientos.push(movimiento);
    };

    GestorFinanzas.prototype.eliminarMovimiento = function (id) {
      this.movimientos = this.movimientos.filter(mov => mov.id !== id);
    };

    GestorFinanzas.prototype.calcularBalance = function () {
      return this.movimientos.reduce((acc, mov) => acc + mov.getMontoConSigno(), 0);
    };

    // Clase VistaFinanzas
    function VistaFinanzas(formulario, tabla, balance) {
      this.formulario = formulario;
      this.tabla = tabla;
      this.balance = balance;
    }

    VistaFinanzas.prototype.mostrarMovimientos = function (movimientos) {
      this.tabla.innerHTML = "";
      movimientos.forEach(mov => {
        const fila = mov.render();
        this.tabla.appendChild(fila);
      });
    };

    VistaFinanzas.prototype.mostrarBalance = function (valor) {
      this.balance.textContent = `Balance: $${valor.toFixed(2)}`;
    };

    VistaFinanzas.prototype.limpiarFormulario = function () {
      this.formulario.reset();
    };

    VistaFinanzas.prototype.mostrarError = function (mensaje) {
      alert(mensaje);
    };

    // Instancias
    const gestor = new GestorFinanzas();
    const vista = new VistaFinanzas(
      document.getElementById("formulario"),
      document.getElementById("tabla-movimientos"),
      document.getElementById("balance")
    );

    // Función de actualización general
    function actualizarVista() {
      vista.mostrarMovimientos(gestor.movimientos);
      vista.mostrarBalance(gestor.calcularBalance());
    }

    // Eventos
    document.getElementById("formulario").addEventListener("submit", function (e) {
      e.preventDefault();
      const descripcion = this.descripcion.value.trim();
      const monto = Number(this.monto.value);
      const tipo = this.tipo.value;

      try {
        const nuevoMovimiento = tipo === "ingreso"
          ? new Ingreso(descripcion, monto)
          : new Egreso(descripcion, monto);

        gestor.agregarMovimiento(nuevoMovimiento);
        actualizarVista();
        vista.limpiarFormulario();
      } catch (error) {
        vista.mostrarError(error.message);
      }
    });

    document.getElementById("tabla-movimientos").addEventListener("click", function (e) {
      if (e.target.classList.contains("eliminar")) {
        const id = e.target.dataset.id;
        gestor.eliminarMovimiento(id);
        actualizarVista();
      }
    });
