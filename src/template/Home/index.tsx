import { useSession } from 'next-auth/client';
import { Wrapper } from '../../components/Wrapper';

export function HomeTemplate() {
  const [session] = useSession();

  return (
    <Wrapper>
      <h1>Olá {session?.user.name || 'visitante'}</h1>
    </Wrapper>
  );
}
