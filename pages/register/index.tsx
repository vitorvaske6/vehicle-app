// pages/register.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Input, Link } from '@heroui/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { RegisterFormData } from '@/typings/types'; // Create this type file

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string()
    .required('Senha é obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres'),
  company: yup.string().required('Nome da empresa é obrigatório')
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

const RegisterPage = () => {
  const router = useRouter();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no registro');
      }

      router.push('/login');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Criar Conta</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register('name')}
              fullWidth
              label="Nome Completo"
              placeholder="Seu nome"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
          </div>

          <div className="space-y-2">
            <Input
              {...register('email')}
              fullWidth
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

          <div className="space-y-2">
            <Input
              {...register('company')}
              fullWidth
              label="Nome da Empresa"
              placeholder="Sua empresa"
              isInvalid={!!errors.company}
              errorMessage={errors.company?.message}
            />
          </div>
          
          <Button 
            type="submit" 
            color="primary" 
            fullWidth 
            isLoading={isSubmitting}
            className="font-medium"
          >
            {isSubmitting ? 'Registrando...' : 'Criar Conta'}
          </Button>
          
          <div className="text-center text-sm text-default-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-sm">
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;