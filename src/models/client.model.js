export class Client {
  constructor({ id, name, email, phone }) {
    this.id = id || Date.now().toString();
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}
