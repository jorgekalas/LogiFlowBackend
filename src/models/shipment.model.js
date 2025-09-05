export class Shipment {
  constructor({ id, client, origin, destination, status }) {
    this.id = id || Date.now().toString(); //es una forma rápida de asignar un ID único para cada momento del tiempo, hasta que lo veamos en la base de datos como autoincremental
    this.client = client;
    this.origin = origin;
    this.destination = destination;
    this.status = status || "pendiente";
  }
}