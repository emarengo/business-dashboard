import React from 'react';

import RadialProgress from './RadialProgress';
import Styled from './styled';
import { IKpiBox, IKpi } from './types';

const KpiBox: React.FC<IKpiBox> = ({ data }) => (
  <Styled.PerformanceKpiBox>
    {data.map((kpi: IKpi, index: number) => (
      <Styled.PerformanceKpi key={`kpi-${index + 1}`}>
        <RadialProgress
          value={kpi.value}
          measure={kpi.measure}
          percent={kpi.percent}
          status={kpi.status}
        />
        <Styled.PerformanceKpiCaption notice={kpi.notice}>
          {kpi.caption}
        </Styled.PerformanceKpiCaption>
      </Styled.PerformanceKpi>
    ))}
  </Styled.PerformanceKpiBox>
);

export default KpiBox;
