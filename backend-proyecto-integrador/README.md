# Levantamiento del proyecto

## Para levantar del backend y base de datos
### En la raiz del proyecto (no en el backend o en el frontend)
```
docker compose up
```

## Para iniciar el frontend
### Dentro de la carpeta del frontend

```
npm run dev
```

## Para ingresar datos de ejemplo para la base de datos, poner lo siguiente en PostMan


```
{
    "username": "testadmin",
    "email": "admin@admin.cl",
    "password": "admin123",
    "nombre": "admin",
    "apellido": "nimda"
}
```

Despues, ingresando con el email y la contraseña muestran las demas vistas del frontend.

## Progreso de ambos servicios
Actualmente, el login esta funcional con el backend