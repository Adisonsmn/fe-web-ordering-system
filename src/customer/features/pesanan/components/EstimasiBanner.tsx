import { Clock } from 'lucide-react';
import type { FC } from 'react';

interface EstimasiBannerProps {
  estimasiMenit: number | null;
}

const EstimasiBanner: FC<EstimasiBannerProps> = ({ estimasiMenit }) => {
  if (estimasiMenit === null || estimasiMenit === undefined) {
    return null;
  }

  return (
    <div className="bg-[rgba(49,102,105,0.15)] border border-[rgba(49,102,105,0.2)] flex flex-col gap-3 overflow-clip p-[17px] relative rounded-xl w-full">
      <div className="flex gap-3 items-center">
        <Clock className="text-[#003032] w-5 h-5" />
        <div className="font-sans font-medium text-[#003032] text-[16px]">
          Estimasi siap dalam ~{estimasiMenit} menit
        </div>
      </div>

      {/* Thin Progress Bar Animation */}
      <div className="bg-[#eee] h-1.5 relative rounded-full w-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 w-1/3 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(118, 171, 174, 0) 0%, rgba(118, 171, 174, 0.4) 50%, rgba(118, 171, 174, 0) 100%), linear-gradient(90deg, rgb(49, 102, 105) 0%, rgb(49, 102, 105) 100%)',
          }}
        />
      </div>
    </div>
  );
};

export default EstimasiBanner;
