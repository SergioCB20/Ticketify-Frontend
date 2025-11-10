# API: Crear Administrador

## Endpoint
```
POST /api/admin/admins
```

## Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

## Permisos Requeridos
- Solo usuarios con rol `SUPER_ADMIN` pueden crear nuevos administradores

## Request Body
```json
{
  "email": "nuevo.admin@ticketify.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phoneNumber": "+51 999 999 999",  // Opcional
  "role": "SUPPORT_ADMIN",           // SUPER_ADMIN | SUPPORT_ADMIN | SECURITY_ADMIN | CONTENT_ADMIN
  "documentType": "DNI",             // DNI | CE | Pasaporte
  "documentId": "12345678"
}
```

## Response Success (201 Created)
```json
{
  "id": "uuid-here",
  "email": "nuevo.admin@ticketify.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phoneNumber": "+51 999 999 999",
  "isActive": true,
  "roles": ["SUPPORT_ADMIN"],
  "createdAt": "2025-11-09T10:30:00Z",
  "lastLogin": null
}
```

## Response Error (400 Bad Request)
```json
{
  "message": "El email ya está registrado",
  "errors": {
    "email": "Este correo ya está en uso"
  }
}
```

## Response Error (403 Forbidden)
```json
{
  "message": "No tienes permisos para realizar esta acción"
}
```

## Validaciones del Backend

1. **Email**:
   - Formato válido de email
   - No debe existir en la base de datos (ni como usuario normal ni como admin)

2. **Password**:
   - Mínimo 8 caracteres
   - Debe ser hasheado antes de guardar (bcrypt o similar)

3. **Role**:
   - Debe ser uno de los valores permitidos
   - Solo SUPER_ADMIN puede crear otros SUPER_ADMIN

4. **DocumentId**:
   - Debe ser único en la base de datos

## Ejemplo de Implementación (Python/FastAPI)

```python
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter()

class CreateAdminRequest(BaseModel):
    email: EmailStr
    password: str
    firstName: str
    lastName: str
    phoneNumber: Optional[str] = None
    role: str  # Enum: SUPER_ADMIN, SUPPORT_ADMIN, SECURITY_ADMIN, CONTENT_ADMIN
    documentType: str  # Enum: DNI, CE, Pasaporte
    documentId: str

@router.post("/admin/admins", status_code=status.HTTP_201_CREATED)
async def create_admin(
    data: CreateAdminRequest,
    current_admin: Admin = Depends(get_current_admin)
):
    # 1. Verificar que el usuario actual es SUPER_ADMIN
    if "SUPER_ADMIN" not in current_admin.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo SUPER_ADMIN puede crear administradores"
        )
    
    # 2. Verificar que el email no existe
    existing_user = await get_user_by_email(data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # 3. Verificar que el documento no existe
    existing_doc = await get_user_by_document(data.documentId)
    if existing_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El documento ya está registrado"
        )
    
    # 4. Validar contraseña
    if len(data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña debe tener al menos 8 caracteres"
        )
    
    # 5. Hashear la contraseña
    hashed_password = hash_password(data.password)
    
    # 6. Crear el administrador
    new_admin = Admin(
        email=data.email,
        password=hashed_password,
        firstName=data.firstName,
        lastName=data.lastName,
        phoneNumber=data.phoneNumber,
        roles=[data.role],
        documentType=data.documentType,
        documentId=data.documentId,
        isActive=True,
        userType="ADMIN"
    )
    
    # 7. Guardar en la base de datos
    await db.save(new_admin)
    
    # 8. Retornar el administrador creado (sin la contraseña)
    return {
        "id": new_admin.id,
        "email": new_admin.email,
        "firstName": new_admin.firstName,
        "lastName": new_admin.lastName,
        "phoneNumber": new_admin.phoneNumber,
        "isActive": new_admin.isActive,
        "roles": new_admin.roles,
        "createdAt": new_admin.createdAt,
        "lastLogin": new_admin.lastLogin
    }
```

## Notas Adicionales

- El administrador creado debe tener `isActive=true` por defecto
- El administrador recién creado NO debe tener `lastLogin` hasta que inicie sesión
- Considera enviar un email de bienvenida con las credenciales (opcional)
- Considera permitir que el nuevo admin cambie su contraseña en el primer login (opcional)
