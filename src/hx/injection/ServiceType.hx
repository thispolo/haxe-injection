package hx.injection;

enum ServiceType {
    Singleton(service : String);
    Transient(service : String);
}