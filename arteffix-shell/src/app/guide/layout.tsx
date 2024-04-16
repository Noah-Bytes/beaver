import GuideSteps from './components/steps';

interface InitLayoutProps {
  children: any;
}

export default function InitLayout({ children }: InitLayoutProps) {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <GuideSteps />
      {children}
    </div>
  );
}
