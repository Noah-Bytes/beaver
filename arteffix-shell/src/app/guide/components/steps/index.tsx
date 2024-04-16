'use client';
import { usePathname } from 'next/navigation';
import { Step, Stepper } from '../../../../components/material';

const STEP_CONFIG = ['/guide', '/guide/require', '/guide/discover'];

export default function GuideSteps() {
  const pathname = usePathname();

  return (
    <div className="w-[500px] mb-20">
      <Stepper activeStep={STEP_CONFIG.indexOf(pathname)}>
        {STEP_CONFIG.map((elem, index) => (
          <Step key={elem}>{index + 1}</Step>
        ))}
      </Stepper>
    </div>
  );
}
