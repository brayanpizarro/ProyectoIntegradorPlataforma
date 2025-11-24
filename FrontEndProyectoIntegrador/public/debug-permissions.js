/**
 * SCRIPT DE DEBUG PARA PERMISOS
 * 
 * Cómo usar:
 * 1. Abre la consola del navegador (F12)
 * 2. Copia y pega este script completo
 * 3. Presiona Enter
 * 4. Verás un análisis completo de tu situación de permisos
 */

console.log('\n🔍 ========== DIAGNÓSTICO DE PERMISOS ==========\n');

// 1. VERIFICAR AUTENTICACIÓN
console.log('1️⃣ VERIFICACIÓN DE AUTENTICACIÓN:');
const tokens = {
  accesstoken: localStorage.getItem('accesstoken'),
  refreshtoken: localStorage.getItem('refreshtoken'),
  token: localStorage.getItem('token'), // legacy
};

if (tokens.accesstoken) {
  console.log('✅ Token de acceso encontrado:', tokens.accesstoken.substring(0, 50) + '...');
} else if (tokens.token) {
  console.log('⚠️ Token legacy encontrado:', tokens.token.substring(0, 50) + '...');
} else {
  console.log('❌ NO HAY TOKEN - Usuario no autenticado');
}

// 2. VERIFICAR USUARIO
console.log('\n2️⃣ VERIFICACIÓN DE USUARIO:');
const userStr = localStorage.getItem('user');

if (!userStr) {
  console.log('❌ NO HAY USUARIO guardado en localStorage');
} else {
  try {
    const user = JSON.parse(userStr);
    console.log('✅ Usuario encontrado:', user);
    console.log('\n📋 Detalles del usuario:');
    console.log('  - ID:', user.id);
    console.log('  - Email:', user.email);
    console.log('  - Nombres:', user.nombres);
    console.log('  - Apellidos:', user.apellidos);
    
    // 3. VERIFICAR ROL (CRÍTICO)
    console.log('\n3️⃣ VERIFICACIÓN DE ROL:');
    const roleProps = {
      'user.role': user.role,
      'user.rol': user.rol,
      'user.tipo': user.tipo,
    };
    
    console.table(roleProps);
    
    const detectedRole = user.role || user.rol || user.tipo;
    
    if (!detectedRole) {
      console.log('❌ NO SE DETECTÓ NINGÚN ROL - Este es el problema!');
      console.log('💡 Solución: El usuario debe tener una propiedad "role", "rol" o "tipo"');
    } else {
      console.log(`✅ Rol detectado: "${detectedRole}"`);
      
      // 4. VERIFICAR PERMISOS
      console.log('\n4️⃣ VERIFICACIÓN DE PERMISOS:');
      const isAdmin = detectedRole === 'admin';
      const isTutor = detectedRole === 'tutor';
      const isInvitado = detectedRole === 'invitado';
      
      console.log(`  - ¿Es Admin? ${isAdmin ? '✅ SÍ' : '❌ NO'}`);
      console.log(`  - ¿Es Tutor? ${isTutor ? '✅ SÍ' : '❌ NO'}`);
      console.log(`  - ¿Es Invitado? ${isInvitado ? '✅ SÍ' : '❌ NO'}`);
      
      console.log('\n5️⃣ PERMISOS POR ACCIÓN:');
      const permissions = {
        'Acceder a Dashboard': '✅ Todos',
        'Ver Perfil': '✅ Todos',
        'Gestionar Usuarios': isAdmin ? '✅ SÍ' : '❌ NO',
        'Crear Estudiantes': (isAdmin || isTutor) ? '✅ SÍ' : '❌ NO',
        'Eliminar Estudiantes': isAdmin ? '✅ SÍ' : '❌ NO',
        'Crear Entrevistas': (isAdmin || isTutor) ? '✅ SÍ' : '❌ NO',
        'Ver Reportes': (isAdmin || isTutor) ? '✅ SÍ' : '❌ NO',
        'Exportar Datos': isAdmin ? '✅ SÍ' : '❌ NO',
      };
      
      console.table(permissions);
      
      // 6. DIAGNÓSTICO Y SOLUCIONES
      console.log('\n6️⃣ DIAGNÓSTICO:');
      
      if (!isAdmin && window.location.pathname === '/admin/usuarios') {
        console.log('⚠️ PROBLEMA DETECTADO:');
        console.log('   Estás intentando acceder a /admin/usuarios pero NO eres admin');
        console.log('   Por eso te redirige al dashboard');
        console.log('\n💡 SOLUCIONES:');
        console.log('   A) Pídele a un admin que cambie tu rol a "admin"');
        console.log('   B) Si deberías ser admin, verifica en el backend');
        console.log('   C) Ejecuta: fixUserRole("admin") para corregirlo temporalmente');
      } else if (isAdmin) {
        console.log('✅ TODO CORRECTO:');
        console.log('   Eres admin y deberías poder acceder a todas las rutas');
        console.log('   Si aún hay problemas, revisa la consola al navegar');
      } else {
        console.log('ℹ️ INFO:');
        console.log('   Tu rol actual es:', detectedRole);
        console.log('   Solo los admin pueden gestionar usuarios');
      }
    }
    
  } catch (error) {
    console.log('❌ ERROR al parsear usuario:', error);
  }
}

// 7. HERRAMIENTAS DE CORRECCIÓN
console.log('\n7️⃣ HERRAMIENTAS DISPONIBLES:');
console.log('  Ejecuta estas funciones en la consola si es necesario:\n');
console.log('  fixUserRole("admin")     - Cambiar rol a admin temporalmente');
console.log('  fixUserRole("tutor")     - Cambiar rol a tutor');
console.log('  fixUserRole("invitado")  - Cambiar rol a invitado');
console.log('  clearAndRestart()        - Limpiar todo y volver al login');
console.log('  showUserObject()         - Mostrar objeto usuario completo\n');

// Funciones helper
window.fixUserRole = function(newRole) {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.log('❌ No hay usuario para modificar');
    return;
  }
  
  const user = JSON.parse(userStr);
  user.role = newRole;
  user.rol = newRole; // Compatibilidad
  localStorage.setItem('user', JSON.stringify(user));
  
  console.log(`✅ Rol cambiado a: ${newRole}`);
  console.log('🔄 Recargando página...');
  
  setTimeout(() => location.reload(), 1000);
};

window.clearAndRestart = function() {
  console.log('🗑️ Limpiando localStorage...');
  localStorage.clear();
  console.log('🔄 Redirigiendo al login...');
  location.href = '/';
};

window.showUserObject = function() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.log('❌ No hay usuario');
    return;
  }
  console.log(JSON.parse(userStr));
};

console.log('\n✅ Diagnóstico completado. Lee los resultados arriba.\n');
console.log('===============================================\n');
