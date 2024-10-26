

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { DOMAIN_FRONT } from '../../../../../env';


async function saveUserToApi(user,account,profile,email) {
    try {
        //   console.log(user,account,profile,email);

      
            window.location.href = DOMAIN_FRONT + 'plataforma';
      
          
    //   // Aquí deberías hacer una solicitud POST a tu API para guardar los datos del usuario
    //   const response = await axios.post('http://tu-api.com/save-user', {
    //     name: user.name,
    //     email: user.email,
    //     // Puedes agregar más campos según los datos que quieras guardar
    //   });
  
    //   console.log('Usuario guardado en la API:', response.data);
    } catch (error) {
      console.error('Error al guardar el usuario en la API:', error);
      throw new Error('Error al guardar el usuario en la API');
    }
  }


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: '93758631439-hl50u4v91ffa1kqnd2ebti5h5uov8suc.apps.googleusercontent.com' as string,
            clientSecret: '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' as string,
        })], 
        callbacks: {
          async signIn({ user, account, profile, email, credentials }) {
            // await saveUserToApi(user,account,profile,email); // Llama a una función para guardar el usuario en tu API
            // return true;
            return DOMAIN_FRONT + 'plataforma'; // Aquí se define la URL a la que se redirigirá
          },
          async redirect({ url, baseUrl }) {
            return baseUrl;
          },
          async session({ session, token, user }) {
            return session;
          },
          async jwt({ token, user, account, profile, isNewUser }) {
            return token;
          }
        }
});


export { handler as GET , handler as POST};


