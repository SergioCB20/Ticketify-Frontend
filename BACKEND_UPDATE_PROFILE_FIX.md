# Solución al Error 422 en PUT /api/auth/profile

## Problema
El backend está rechazando la actualización del perfil con un error 422 (Unprocessable Entity), lo que significa que los datos enviados no cumplen con el formato esperado.

## Cambios Realizados en el Frontend

### 1. **Envío Selectivo de Campos**
Ahora solo se envían los campos que **realmente han cambiado**:

```typescript
// ANTES (❌ Problema)
const dataToUpdate = { ...formData } // Enviaba TODOS los campos

// DESPUÉS (✅ Solución)
const dataToUpdate: any = {}
if (formData.firstName !== user.firstName) dataToUpdate.firstName = formData.firstName
if (formData.lastName !== user.lastName) dataToUpdate.lastName = formData.lastName
// ... solo campos modificados
```

### 2. **Valores Null para Campos Vacíos**
Los campos opcionales vacíos ahora se envían como `null`:

```typescript
if (formData.phoneNumber !== user.phoneNumber) {
  dataToUpdate.phoneNumber = formData.phoneNumber || null
}
```

### 3. **Validación de Cambios**
Si no hay cambios, no se hace la petición:

```typescript
if (Object.keys(dataToUpdate).length === 0) {
  toast.info('No hay cambios para guardar')
  return
}
```

## Verificación del Backend

### El endpoint debe aceptar este formato:

**PUT /api/auth/profile**

**Request Body** (solo campos que cambian):
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "nuevo@email.com",
  "phoneNumber": "+51 999 999 999",
  "country": "Perú",
  "city": "Lima",
  "gender": "masculino",
  "profilePhoto": "data:image/webp;base64,UklGRiQAAABXRUJQ..."
}
```

### Validaciones que puede estar causando el 422:

1. **Email duplicado**: El email ya existe en otro usuario
2. **Formato de email**: No cumple con el formato esperado
3. **Longitud de campos**: Exceden el máximo permitido
4. **Campos requeridos**: Faltan campos obligatorios
5. **profilePhoto**: La imagen en base64 es demasiado grande (>5MB)
6. **Campos no permitidos**: Se están enviando campos que no se pueden actualizar

## Debugging en el Backend

### Ejemplo Python/FastAPI:

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, validator
from typing import Optional

class UpdateProfileRequest(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[EmailStr] = None
    phoneNumber: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    gender: Optional[str] = None
    profilePhoto: Optional[str] = None
    
    @validator('firstName', 'lastName')
    def validate_name_length(cls, v):
        if v is not None and (len(v) < 2 or len(v) > 50):
            raise ValueError('El nombre debe tener entre 2 y 50 caracteres')
        return v
    
    @validator('profilePhoto')
    def validate_photo_size(cls, v):
        if v is not None:
            # Verificar tamaño del base64 (aproximadamente)
            if len(v) > 7000000:  # ~5MB en base64
                raise ValueError('La imagen es demasiado grande (máximo 5MB)')
        return v

@router.put("/auth/profile")
async def update_profile(
    data: UpdateProfileRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        # Validar email único si se está cambiando
        if data.email and data.email != current_user.email:
            existing = await get_user_by_email(data.email)
            if existing:
                raise HTTPException(
                    status_code=400,
                    detail="El email ya está en uso"
                )
        
        # Actualizar solo campos presentes
        update_data = data.dict(exclude_unset=True)
        updated_user = await update_user(current_user.id, update_data)
        
        return updated_user
        
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
```

## Logs para Debugging

El frontend ahora muestra:
```javascript
console.log('Data to update:', dataToUpdate)
console.log('Number of fields to update:', Object.keys(dataToUpdate).length)
```

El backend debería loggear:
```python
logger.info(f"Updating profile for user {user.id}")
logger.info(f"Fields to update: {update_data.keys()}")
logger.debug(f"Update data: {update_data}")
```

## Posibles Soluciones

### 1. Si el error persiste con la imagen:

Reducir más la calidad de la imagen en el frontend:

```typescript
// En handleImageChange, cambiar:
const compressedBase64 = canvas.toDataURL('image/webp', 0.6) // Calidad 60%

// A:
const compressedBase64 = canvas.toDataURL('image/webp', 0.4) // Calidad 40%
```

### 2. Si el backend no acepta actualizaciones parciales:

Modificar el backend para aceptar campos opcionales con `exclude_unset=True` en Pydantic.

### 3. Si hay campos no permitidos:

Agregar lista blanca en el backend:

```python
ALLOWED_UPDATE_FIELDS = {
    'firstName', 'lastName', 'email', 'phoneNumber',
    'country', 'city', 'gender', 'profilePhoto'
}

update_data = {
    k: v for k, v in data.dict(exclude_unset=True).items()
    if k in ALLOWED_UPDATE_FIELDS
}
```

## Testing

Prueba actualizar un solo campo a la vez:

1. **Solo nombre**: `{ "firstName": "NuevoNombre" }`
2. **Solo email**: `{ "email": "nuevo@email.com" }`
3. **Solo teléfono**: `{ "phoneNumber": "+51 999 999 999" }`

Esto te ayudará a identificar qué campo está causando el problema.

## Verificación Rápida

Ejecuta esto en la consola del backend para ver qué está recibiendo:

```python
@router.put("/auth/profile")
async def update_profile(request: Request, ...):
    body = await request.json()
    print("=" * 50)
    print("RECEIVED DATA:")
    print(json.dumps(body, indent=2))
    print("=" * 50)
    # ... resto del código
```

Esto mostrará exactamente qué está enviando el frontend y por qué el backend lo rechaza.
