# Changelog
## [3.0.0]
### Added
- Collections of the same dependency type can now be constructor-injected as Iterable
- The service provider itself can now be constructor-injected as a dependency
- It is possible to add already instanced dependencies to the collection
- The addProtected methods prevent dependencies of the same type being registered
### Changed
- The addSingleton/addTransient/addScoped methods have been moved out into extension classes
- Various name changes
### Fixed
- Dead Code Elimination breaking service resolution
## [2.1.0]
### Added
- Configuration builder
- Basic type parameter handling
### Changed
- Improved service binding
- Replaced examples with unit and integrated tests
## [2.0.0]
### Added
- Scoped services
- Service segregation
- Named bindings
- Destructable services
## [1.1.0]
### Added
- Transient services
## [1.0.0]
### Changed
- Provider creates instances rather than collection
## [0.0.0]
### Added
- Initial release