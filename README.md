# [Qrisys2:](https://github.com/JSnow11/Qrisys2/projects/1)

## Deploy
### Carga de Roles, Users y Permisos
* `ts-node seeds/index.ts`

### Local
* Dependencias:

  Instalar node 12.6
```
  cd <PROJECT_DIR>/src/
  npm install

  cd <PROJECT_DIR>/src/frontend/src
  npm install
```

* Iniciar frontend:
  `cd <PROJECT_DIR>/src/frontend/src`
  `npm run start`

* Iniciar backend:
  `cd <PROJECT_DIR>/src/`
  `ts-node server.ts`

### Server
* Conectar mediante `ssh` al server: `ssh root@5b158f7.online-server.cloud`
* Descargar o subir el proyecto, preferiblemente usando **git**
* Configurar .env y config.js con la ip del server
* Desplegar backend y frontend con `ts-node server.ts` y `npm run start` 

