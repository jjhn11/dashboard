import { defineStore } from "pinia";
import backend from "@/config/axios.js";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
    const user = ref ({
        id: null,
        email: null,
        name: null,
        lastName: null,
        imageProfile: null,
        
    });

    const isAuthenticated = computed(() => !!user.value.id);

    return {
        user,
        isAuthenticated,
    };
});