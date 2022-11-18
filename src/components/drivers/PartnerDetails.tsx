import React from 'react';
import { Icons } from '@thebeatapp/beat-ui';

import Styled from 'components/drivers/styled';
import { IDetails } from 'components/drivers/types';

const PartnerDetails: React.FC<{ details: IDetails | null }> = ({
  details
}) => (
  <Styled.PerformancePartner>
    <Styled.PerformancePartnerPicture
      src={details?.avatar_link || ''}
      alt={`Partner's avatar`}
    />
    <Styled.PerformancePartnerHead>
      <Styled.PerformancePartnerTitle>
        {`${details?.driver_first_name || ''} ${
          details?.driver_last_name || ''
        }`.toLowerCase()}
      </Styled.PerformancePartnerTitle>
      <Styled.PerformancePartnerLink href={details?.driver_url} target="_blank">
        {details?.driver_id}
      </Styled.PerformancePartnerLink>
    </Styled.PerformancePartnerHead>
    <Styled.PerformancePartnerInfo>
      <Styled.PerformancePartnerInfoItem icon={Icons.taxi}>
        {details?.vehicle_plates}
      </Styled.PerformancePartnerInfoItem>
      <Styled.PerformancePartnerInfoItem icon={Icons.star}>
        {details?.overall_rating.toFixed(1)}
      </Styled.PerformancePartnerInfoItem>
    </Styled.PerformancePartnerInfo>
  </Styled.PerformancePartner>
);

export default PartnerDetails;
