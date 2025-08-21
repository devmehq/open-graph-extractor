# Change Log

## v1.1.0 (Next Release)
### Major Improvements 🚀
- **Performance**: Significant codebase cleanup - removed 300+ lines of unused code
- **Caching**: Simplified tiny-lru integration for better performance
- **TypeScript**: Eliminated all `any` types, improved type safety
- **Architecture**: Converted from classes to functions for better tree-shaking
- **Documentation**: Complete README overhaul with accurate examples

### Breaking Changes
- Renamed `extractOpenGraphEnhanced` → `extractOpenGraphAsync` 
- Removed unused bulk processing auxiliary functions
- Removed browser-specific dependencies (jsdom, DOMPurify)
- Simplified cache API - direct tiny-lru usage

### New Features
- ✨ Single unified `extractOpenGraph` function with backward compatibility
- 🎯 Smart feature detection - async mode only when needed
- 🧹 Cleaner exports - reduced API surface by ~40%
- 📊 Better performance metrics and error handling
- 🔧 Enhanced development experience with Biome

### Fixes
- Fixed function naming conflicts and type issues
- Resolved all TypeScript compilation errors
- Maintained 100% test coverage (77/77 tests passing)
- Fixed media type handling for music tracks

## v1.0.4
- Added fallback itemProp thanks @markwcollins [#56](https://github.com/devmehq/open-graph-extractor/pull/56)
- Fixed test

## v1.0.1
- Update readme

## v1.0.0
- Initial release
