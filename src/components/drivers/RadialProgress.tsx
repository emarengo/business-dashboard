import React from 'react';

import Styled from './styled';
import { RadialProgressStatus, IRadialProgress } from './types';

const Colors = {
  [RadialProgressStatus.Good]: {
    offset: '#224f55',
    middle: '#1ca890',
    stop: '#1ca890'
  },
  [RadialProgressStatus.Bad]: {
    offset: '#ee5a23',
    middle: '',
    stop: '#f38258'
  }
};

const RadialProgress: React.FC<IRadialProgress> = ({
  status = RadialProgressStatus.Good,
  percent = 0,
  value = null,
  size = 70,
  measure = null
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [ctx, setCanvasContext] = React.useState<CanvasRenderingContext2D>();
  const _size = size + 4;
  let step = 0;

  const drawArc = (currentStep: number): void => {
    if (canvasRef.current && ctx) {
      const lineWidth = 1;
      const radius = _size / 2 - lineWidth - 2;
      const startAngle = (3 / 2) * Math.PI;
      const endAngle = startAngle + (2 * Math.PI * currentStep) / 100;
      const gradient = ctx.createLinearGradient(0, 0, _size, _size);

      if (Colors[status].offset)
        gradient.addColorStop(0, Colors[status].offset);
      if (Colors[status].middle)
        gradient.addColorStop(0.5, Colors[status].middle);
      if (Colors[status].stop) gradient.addColorStop(1, Colors[status].stop);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';

      // Clear canvas
      ctx.clearRect(0, 0, _size, _size);

      // Draw a small offset line
      ctx.beginPath();
      ctx.moveTo(_size / 2, 1);
      ctx.lineTo(_size / 2, 5);
      ctx.stroke();

      // Draw arc according to progress value
      ctx.beginPath();
      ctx.arc(_size / 2, _size / 2, radius, startAngle, endAngle);
      ctx.stroke();

      // Draw a dot at the end of the arc
      if (step < 100) {
        ctx.beginPath();
        const dotStartAngle = endAngle;
        const dotEndAngle = endAngle - ((1 / 2) * Math.PI) / 360;
        // Draw backwards
        ctx.arc(_size / 2, _size / 2, radius, dotStartAngle, dotEndAngle, true);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  };

  const animate = (): void => {
    if (step < parseInt(percent as string)) {
      // Increasing 'step' value will accelarate the animation
      step += 3;
      drawArc(step);
    }

    requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    animate();

    const cnv = canvasRef.current;

    return () => {
      if (cnv && ctx) {
        ctx.clearRect(0, 0, cnv.width, cnv.height);
      }
    };
    // eslint-disable-next-line
  }, [percent, value, status]);

  React.useEffect(() => {
    if (canvasRef.current) {
      const _cnv = canvasRef.current;
      const _ctx = _cnv.getContext('2d') as CanvasRenderingContext2D;

      // For retina screens
      _cnv.width = _size * window.devicePixelRatio;
      _cnv.height = _size * window.devicePixelRatio;
      _cnv.style.width = `${_size}px`;
      _cnv.style.height = `${_size}px`;
      _ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      setCanvasContext(_ctx);
    }
    // eslint-disable-next-line
  }, [canvasRef.current, _size]);

  return (
    <Styled.Progress size={size}>
      <Styled.ProgressLabel
        color={
          Colors[status].middle || Colors[status].stop || Colors[status].offset
        }
        value={value !== null ? value : percent}
        measure={measure}
        status={status}
      />
      <Styled.ProgressBar ref={canvasRef} width={_size} height={_size} />
    </Styled.Progress>
  );
};

export default RadialProgress;
