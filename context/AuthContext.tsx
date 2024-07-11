import api from '../conexionApi/axios';

interface RegistroData {
  nombre: string;
  email: string;
  contrasena: string;
}

// interface LoginData {
//   email: string;
//   contrasena: string;
// }

interface UserData {
  id: number;
  nombre: string;
  email: string;
  //Recuerdaaa agregar los datooos completoos del usuarioooo porfavor
}

export const registrarUsuario = async (data: RegistroData): Promise<UserData> => {
  try {
    const response = await api.post('/register', data);
    return response.data as UserData;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

// export const iniciarSesion = async (data: LoginData): Promise<UserData> => {
//   try {
//     const response = await api.post('/login', data);
//     return response.data as UserData;
//   } catch (error: any) {
//     throw new Error(error.response.data.message);
//   }
// };
