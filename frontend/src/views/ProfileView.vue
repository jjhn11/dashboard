<template>
  <div class="profile-container">
    <v-container class="profile-content">
      <!-- Profile Photo and Basic Info -->
      <div class="profile-header text-center mb-8">
        <div class="profile-photo-container">
          <v-avatar size="120" class="profile-photo">
            <v-img 
              :src="userProfile.photo || defaultPhoto" 
              :alt="userProfile.name"
              cover
            />
            <div class="online-indicator"></div>
          </v-avatar>
        </div>
        
        <h2 class="text-h5 font-weight-bold mt-4 mb-1">
          {{ userProfile.username }}
        </h2>
        <p class="text-body-1 text-medium-emphasis mb-1">
          {{ userProfile.email }}
        </p>
      </div>

      <!-- Personal Information Section -->
      <div class="info-section">
        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="text-h6 font-weight-medium">Información Personal</h3>
          <v-btn 
            variant="text" 
            color="primary" 
            @click="toggleEdit"
            class="edit-btn"
          >
            <v-icon class="mr-1">{{ isEditing ? 'mdi-close' : 'mdi-pencil' }}</v-icon>
            {{ isEditing ? 'Cancelar' : 'Editar' }}
          </v-btn>
        </div>

        <v-form ref="profileForm" v-model="isFormValid">
          <!-- Username -->
          <div class="info-field mb-4">
            <label class="field-label">Nombre de Usuario</label>
            <v-text-field
              v-model="editableProfile.username"
              :readonly="!isEditing"
              :variant="isEditing ? 'outlined' : 'plain'"
              density="compact"
              :rules="[rules.required]"
              class="profile-input"
              hide-details="auto"
            />
          </div>

          <!-- First Name -->
          <div class="info-field mb-4">
            <label class="field-label">Nombres</label>
            <v-text-field
              v-model="editableProfile.firstName"
              :readonly="!isEditing"
              :variant="isEditing ? 'outlined' : 'plain'"
              density="compact"
              :rules="[rules.required]"
              class="profile-input"
              hide-details="auto"
            />
          </div>

          <!-- Last Name -->
          <div class="info-field mb-4">
            <label class="field-label">Apellidos</label>
            <v-text-field
              v-model="editableProfile.lastName"
              :readonly="!isEditing"
              :variant="isEditing ? 'outlined' : 'plain'"
              density="compact"
              :rules="[rules.required]"
              class="profile-input"
              hide-details="auto"
            />
          </div>

          <!-- Gender -->
          <div class="info-field mb-4">
            <label class="field-label">Género</label>
            <v-select
              v-model="editableProfile.gender"
              :items="genderOptions"
              :readonly="!isEditing"
              :variant="isEditing ? 'outlined' : 'plain'"
              density="compact"
              :rules="[rules.required]"
              class="profile-input"
              hide-details="auto"
            />
          </div>

          <!-- Birthday -->
            <div class="info-field mb-4">
                <label class="field-label">Fecha de Nacimiento</label>
                <v-text-field
                v-model="editableProfile.birthday"
                :readonly="!isEditing"
                :variant="isEditing ? 'outlined' : 'plain'"
                density="compact"
                type="date"
                :rules="[rules.required]"
                class="profile-input"
                hide-details="auto"
                />
            </div>

          <!-- Description -->
            <div class="info-field mb-4">
                <label class="field-label">Descripción</label>
                <v-textarea
                v-model="editableProfile.description"
                :readonly="!isEditing"
                :variant="isEditing ? 'outlined' : 'plain'"
                density="compact"
                :rules="[rules.required]"
                class="profile-input"
                hide-details="auto"
                rows="1"
                auto-grow
                />
            </div>

          

          <!-- Email (Read only) -->
          <div class="info-field mb-6">
            <label class="field-label">Correo Electrónico</label>
            <v-text-field
              v-model="userProfile.email"
              readonly
              variant="plain"
              density="compact"
              class="profile-input email-field"
              hide-details
            />
          </div>

          <!-- Action Buttons -->
          <div v-if="isEditing" class="action-buttons d-flex ga-3">
            <v-btn
              color="primary"
              variant="flat"
              @click="saveProfile"
              :loading="isSaving"
              :disabled="!isFormValid"
              class="flex-1"
            >
              <v-icon class="mr-2">mdi-content-save</v-icon>
              Guardar
            </v-btn>
            <v-btn
              color="error"
              variant="outlined"
              @click="cancelEdit"
              class="flex-1"
            >
              Cancelar
            </v-btn>
          </div>
        </v-form>
        
        <!-- Logout Section -->
        <div class="logout-section mt-6 pt-6" style="border-top: 1px solid #e0e0e0;">
          <v-btn
            color="error"
            variant="outlined"
            @click="logout"
            :loading="isLoggingOut"
            block
            class="logout-btn"
          >
            <v-icon class="mr-2">mdi-logout</v-icon>
            Cerrar Sesión
          </v-btn>
        </div>
      </div>
    </v-container>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessMessage"
      color="success"
      timeout="3000"
      location="top"
    >
      <v-icon class="mr-2">mdi-check-circle</v-icon>
      Perfil actualizado correctamente
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showErrorMessage"
      color="error"
      timeout="5000"
      location="top"
    >
      <v-icon class="mr-2">mdi-alert-circle</v-icon>
      {{ errorMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import backend from '@/config/axios.js'

const router = useRouter()
const userStore = useUserStore()

// Component state
const isEditing = ref(false)
const isSaving = ref(false)
const isLoggingOut = ref(false)
const isFormValid = ref(false)
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const errorMessage = ref('')
const profileForm = ref(null)

// Default profile photo
const defaultPhoto = 'https://cdn.vuetifyjs.com/images/john.jpg'

// Gender options
const genderOptions = ['Masculino', 'Femenino', 'Otro']

// User profile data
const userProfile = reactive({
  username: 'johndoe',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  gender: 'Masculino',
    birthday: '1990-01-01',
  description: 'Software Engineer',
  photo: ''
})

// Editable profile copy
const editableProfile = reactive({
  username: 'johndoe',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
    gender: 'Masculino',
    birthday: '1990-01-01',
  description: 'Software Engineer',
  photo: ''
})

// Validation rules
const rules = {
  required: value => !!value || 'Este campo es requerido'
}

// Computed properties
const fullName = computed(() => {
  return `${editableProfile.firstName} ${editableProfile.lastName}`.trim()
})

// Methods
async function logout() {
  isLoggingOut.value = true
  try {
    // Call logout endpoint
    await backend.post('/auth/logout', {}, { withCredentials: true })
    
    // Clear user store completely
    usuarioStore.clearUser()
    
    // Clear any local storage if used
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear local profile data
    Object.assign(userProfile, {
      name: '',
      studentId: '',
      firstName: '',
      lastName: '',
      career: '',
      email: '',
      photo: '',
      id: null
    })
    
    Object.assign(editableProfile, {
      studentId: '',
      firstName: '',
      lastName: '',
      career: ''
    })
    
    console.log('Logout completo: datos locales limpiados')
    
    // Redirect to login
    router.replace({ name: 'login' })
    
  } catch (error) {
    console.error('Error during logout:', error)
    errorMessage.value = 'Error al cerrar sesión'
    showErrorMessage.value = true
  } finally {
    isLoggingOut.value = false
  }
}

function toggleEdit() {
  if (isEditing.value) {
    cancelEdit()
  } else {
    startEdit()
  }
}

function startEdit() {
  isEditing.value = true
  // Copy current data to editable version
  editableProfile.studentId = userProfile.studentId
  editableProfile.firstName = userProfile.firstName
  editableProfile.lastName = userProfile.lastName
  editableProfile.career = userProfile.career
}

function cancelEdit() {
  isEditing.value = false
  // Reset editable data
  editableProfile.studentId = userProfile.studentId
  editableProfile.firstName = userProfile.firstName
  editableProfile.lastName = userProfile.lastName
  editableProfile.career = userProfile.career
}

async function saveProfile() {
  if (!isFormValid.value) return

  isSaving.value = true
  try {
    // Create user data for update
    const userData = {
      control: editableProfile.studentId,
      nombres: editableProfile.firstName,
      apellidos: editableProfile.lastName,
      carrera: editableProfile.career
    }

    // Check if user exists and update or create
    const response = await backend.put(`/usuarios/current`, userData, {
      withCredentials: true
    })

    // Update local profile data
    userProfile.studentId = editableProfile.studentId
    userProfile.firstName = editableProfile.firstName
    userProfile.lastName = editableProfile.lastName
    userProfile.career = editableProfile.career
    userProfile.name = fullName.value

    // Update store if needed
    .updateProfile(userProfile)

    isEditing.value = false
    showSuccessMessage.value = true

  } catch (error) {
    console.error('Error saving profile:', error)
    errorMessage.value = 'Error al guardar el perfil. Intenta nuevamente.'
    showErrorMessage.value = true
  } finally {
    isSaving.value = false
  }
}

async function loadProfile() {
  
}

// Lifecycle
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  min-height: 100vh;
}

.profile-content {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 24px;
}

.profile-photo-container {
  position: relative;
  display: inline-block;
}

.profile-photo {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.online-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background-color: #4caf50;
  border: 3px solid white;
  border-radius: 50%;
}

.info-section {
  padding-top: 24px;
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #424242;
  margin-bottom: 4px;
}

.info-field {
  margin-bottom: 16px;
}

.profile-input {
  font-weight: 500;
}

.profile-input :deep(.v-field--variant-plain .v-field__field) {
  padding-left: 0;
}

.profile-input :deep(.v-field--variant-plain .v-field__input) {
  font-weight: 500;
  color: #1976d2;
}

.email-field :deep(.v-field__input) {
  color: #666;
}

.edit-btn {
  text-transform: none;
  font-weight: 500;
}

.action-buttons {
  margin-top: 24px;
  gap: 12px;
}

.flex-1 {
  flex: 1;
}

.logout-section {
  margin-top: 24px;
  padding-top: 24px;
}

.logout-btn {
  text-transform: none;
  font-weight: 500;
  height: 48px;
}

/* Responsive design */
@media (max-width: 600px) {
  .profile-container {
    padding: 8px;
  }
  
  .profile-content {
    padding: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .v-btn {
    width: 100%;
  }
}
</style>
