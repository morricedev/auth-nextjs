import { GetServerSideProps } from 'next';
import { HomeTemplate } from '../templates/Home';

export default function Index() {
  return <HomeTemplate />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
