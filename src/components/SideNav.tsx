import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import Styled from './styled';
import SvgIcons from './svgs';
import { ISideNav } from './types';

const CustomSideNav: React.FC<ISideNav> = ({
  home,
  location,
  isDriverPerformanceServiceEnabled
}) => {
  const isCurrentPage = (slug: string): boolean =>
    new RegExp(`^/?${slug}`).test(location.pathname) ||
    (slug === home && location.pathname === '/');

  return (
    <Styled.SideNav showLogo>
      <Link to="/shifts">
        <Styled.NavListItem isActive={isCurrentPage('shifts')}>
          <Styled.NavListItemIcon>
            <SvgIcons.Calendar />
          </Styled.NavListItemIcon>
        </Styled.NavListItem>
      </Link>
      <Link to="/vehicles">
        <Styled.NavListItem isActive={isCurrentPage('vehicles')}>
          <Styled.NavListItemIcon>
            <SvgIcons.Car />
          </Styled.NavListItemIcon>
        </Styled.NavListItem>
      </Link>
      {isDriverPerformanceServiceEnabled && (
        <Link to="/drivers">
          <Styled.NavListItem isActive={isCurrentPage('drivers')}>
            <Styled.NavListItemIcon>
              <SvgIcons.Wheel />
            </Styled.NavListItemIcon>
          </Styled.NavListItem>
        </Link>
      )}
      <Link to="/geofence/1">
        <Styled.NavListItem isActive={isCurrentPage('geofence')}>
          <Styled.NavListItemIcon>
            <SvgIcons.Map />
          </Styled.NavListItemIcon>
        </Styled.NavListItem>
      </Link>
      <Link to="/settings">
        <Styled.NavListItem isActive={isCurrentPage('settings')}>
          <Styled.NavListItemIcon>
            <SvgIcons.Gear />
          </Styled.NavListItemIcon>
        </Styled.NavListItem>
      </Link>
    </Styled.SideNav>
  );
};

export default withRouter(CustomSideNav);
