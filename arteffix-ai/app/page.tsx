import dynamic from 'next/dynamic';

const Terminal = dynamic(() => import('./components/terminal'), {
  ssr: false,
});

export default function Index() {
  return (
    <div>
      <Terminal />
    </div>
  );
}
