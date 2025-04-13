# HeroesApp - Gestión de Super Héroes (Angular 18)

Aplicación para administración de héroes desarrollada con Angular 18.2 y Docker.

## 🚀 Primeros Pasos

### Requisitos
- **Docker** (v24+) y **Docker Compose**
- **Node.js** v20+ (para desarrollo)
- **Angular CLI** v18.2.18 (`npm install -g @angular/cli`)

### Ejecución con Docker
```bash
# Con Docker Compose 
docker-compose up -d

# De forma manual
docker build -t heroes-app .
docker run -d -p 80:80 heroes-app # Corre en localhost
```

### 🌟 Características Técnicas
- Angular 18.2 con Signals
- Angular Material 18.2.14 para UI
- Testing con Jasmine/Karma
- SSR configurado con @angular/ssr
- Docker con soporte para SSR
- RxJS 7.8 para manejo de estados

### 🧱 Stack 
- Angular 18.2.0	
- Angular Material 18.2.14 
- Angular SSR 18.2.18	
- RxJS 7.8.0 
- Node.js 20+	

### Scripts 
```bash
# Desarrollo
npm start  # Ejecutar: ng serve

# Para instalar dependencias
npm install

# Build producción
npm run build

# Tests con cobertura
npm test  # Ejecutar: ng test --code-coverage
```