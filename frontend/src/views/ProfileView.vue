<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import backend from '@/config/axios.js'

const router = useRouter()
const userStore = useUserStore()

// Component state
const isEditing = ref(false)
const isLoggingOut = ref(false)
const isSaving = ref(false)
const isFormValid = ref(false)
const profileForm = ref(null)
const showErrorMessage = ref(false)
const showSuccessMessage = ref(false)
const errorMessage = ref('')

// Gender options
const genderOptions = ['Masculino', 'Femenino', 'Otro']

// User profile data
const userProfile = computed(() => userStore.user)

// Editable profile copy
const editableProfile = reactive({
  email: userProfile.value.email,
  firstName: userProfile.value.firstName,
  lastName: userProfile.value.lastName,
  phone: userProfile.value.phone,
  bio: userProfile.value.description,
  photoUrl: userProfile.value.photoUrl
});

// Validation rules
const rules = {
  required: value => !!value || 'Este campo es requerido'
}

// Methods
async function logout() {
    isLoggingOut.value = true
  await userStore.logout();
  router.push({ name: 'login' });
    isLoggingOut.value = false
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
}

function cancelEdit() {
  isEditing.value = false
  // Reset editable data
  editableProfile.email = userProfile.value.email;
  editableProfile.firstName = userProfile.value.firstName;
  editableProfile.lastName = userProfile.value.lastName;
  editableProfile.phone = userProfile.value.phone;
  editableProfile.bio = userProfile.value.bio;
}

async function saveProfile() {
  if (!isFormValid.value) return

    isSaving.value = true

    try {
        // Update user profile via API
        await userStore.updateProfile(editableProfile);
        showSuccessMessage.value = true
        isEditing.value = false
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Error al actualizar el perfil'
        showErrorMessage.value = true
    } finally {
        isSaving.value = false
    }
}

</script>

<template>
  <div class="profile-container">
    <v-container class="profile-content">
      <!-- Profile Photo and Basic Info -->
      <div class="profile-header text-center mb-8">
        <div class="profile-photo-container">
          <v-avatar size="120" class="profile-photo">
            <v-img 
              :src="userProfile.photoUrl" 
              :alt="userProfile.name"
              cover
            />
            <div class="online-indicator"></div>
          </v-avatar>
        </div>
        
        <h2 class="text-h5 font-weight-bold mt-4 mb-1">
          {{ userProfile.firstName }} {{ userProfile.lastName }}
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

          <!-- Bio -->
            <div class="info-field mb-4">
                <label class="field-label">Biografía</label>
                <v-textarea
                v-model="editableProfile.bio"
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
