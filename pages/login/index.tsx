// pages/login.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Input, Link } from '@heroui/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória')
});

type FormData = yup.InferType<typeof schema>;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return { props: {} };
};

const LoginPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    });

    if (result?.error) {
      alert(result.error);
    } else {
      router.push('/');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register('email')}
              fullWidth
              variant='flat'
              label="Email"
              placeholder="seu@email.com"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
          </div>
          
          <div className="space-y-2">
            <Input
              {...register('password')}
              type="password"
              fullWidth
              label="Senha"
              placeholder="••••••••"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
          </div>
          
          <Button 
            type="submit" 
            color="primary" 
            variant="flat"
            fullWidth 
            isLoading={isSubmitting}
            className="font-medium"
          >
            {isSubmitting ? 'Carregando...' : 'Entrar'}
          </Button>
          
          <div className="text-center text-sm text-default-600">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-sm">
              Cadastre-se
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;