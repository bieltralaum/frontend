// Define um serviço de autenticação contendo métodos para login e busca de dados do usuário.
export const authService = {
    // Método assíncrono para autenticar o usuário.
    async login(email: string, password: string) {
      // Obtém as configurações do Nuxt, incluindo a URL base da API.
      const config = useRuntimeConfig();
      const apiUrl = config.public.apiBaseUrl; // Definida no `.env` ou `nuxt.config.ts`.
  
      try {
        // Faz uma requisição POST para a API de autenticação.
        const response = await fetch(`${apiUrl}/auth/jwt/create/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }) // Envia os dados do usuário no corpo da requisição.
        });
  
        // Se a resposta não for bem-sucedida, lança um erro.
        if (!response.ok) {
          throw new Error('Login inválido! Verifique suas credenciais.');
        }
  
        // Retorna os dados da API (tokens de acesso e refresh).
        return await response.json();
      } catch (error: any) {
        // Captura e relança qualquer erro ocorrido durante a requisição.
        throw new Error(error.message);
      }
    },
  
    // Método assíncrono para buscar os dados do usuário autenticado.
    async fetchUserData(token: string, email: string) {
      // Obtém novamente a URL base da API a partir das configurações.
      const config = useRuntimeConfig();
      const apiUrl = config.public.apiBaseUrl;
  
      try {
        // Faz uma requisição GET para obter os dados do usuário.
        const response = await fetch(`${apiUrl}/usuario/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Inclui o token de acesso no cabeçalho.
            'Content-Type': 'application/json'
          }
        });
  
        // Se a resposta não for bem-sucedida, lança um erro.
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do usuário.');
        }
  
        // Converte a resposta para JSON.
        const userData = await response.json();
  
        // Retorna o usuário correspondente ao email informado ou `null` se não for encontrado.
        return userData.results.find((u: any) => u.email === email) || null;
      } catch (error: any) {
        // Captura e relança qualquer erro ocorrido na requisição.
        throw new Error(error.message);
      }
    }
  };
  