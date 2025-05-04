// Importa `defineStore` da biblioteca Pinia, que é usada para gerenciar o estado global da aplicação.
import { defineStore } from 'pinia';

// Importa `authService`, que provavelmente contém funções para autenticação (login, busca de usuário, etc.).
import { authService } from '@/services/authService';

// Define uma store chamada `useAuthStore` para gerenciar a autenticação dos usuários.
export const useAuthStore = defineStore('auth', {
  // O `state` define as variáveis reativas da store.
  state: () => ({
    // Armazena os dados do usuário logado. Se estiver no navegador (`process.client`), tenta recuperar do localStorage.
    user: process.client ? JSON.parse(localStorage.getItem('user') || 'null') : null,

    // Armazena o token de acesso do usuário. Se estiver no navegador, busca no localStorage.
    accessToken: process.client ? localStorage.getItem('accessToken') : null,

    // Armazena mensagens de erro de autenticação.
    errorMessage: ''
  }),

  // Define ações que podem modificar o estado da store.
  actions: {
    // Função assíncrona para realizar o login do usuário.
    async login(email: string, password: string, router: any) {
      try {
        // Chama o serviço de autenticação para obter os tokens de acesso.
        const data = await authService.login(email, password);

        // Atualiza o estado da store com o token de acesso.
        this.accessToken = data.access;

        // Se estiver rodando no cliente (navegador), armazena os tokens no localStorage.
        if (process.client) {
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
        }

        // Busca os dados do usuário autenticado usando o token.
        const user = await authService.fetchUserData(data.access, email);

        // Se o usuário não for encontrado, lança um erro.
        if (!user) {
          throw new Error('Usuário não encontrado.');
        }

        // Atualiza o estado da store com os dados do usuário.
        this.user = user;

        // Se estiver no navegador, armazena os dados do usuário no localStorage.
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Redireciona o usuário para a página apropriada com base no seu papel (admin ou usuário comum).
        router.push(user.role === 'admin' ? '/admin/' : '/users/');
      } catch (error: any) {
        // Captura qualquer erro e salva a mensagem no estado da store.
        this.errorMessage = error.message;
      }
    },

    // Função para realizar o logout do usuário.
    logout() {
      // Limpa os dados do usuário na store.
      this.user = null;
      this.accessToken = null;

      // Se estiver rodando no navegador, remove os tokens e os dados do usuário do localStorage.
      if (process.client) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  }
});
