import React, { useEffect, useState } from 'react';

import Styled from './styled';

import { getDayOfWeek, formatDM, getNodeData, weekGenerator } from './utils';

const WeeklyNodes = ({ handleOnClick, data }) => {
  const [currentActive, setCurrentActive] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [selectedActiveId, setSelectedActiveId] = useState(true);

  const NUMBER_OF_DAYS = 7;

  useEffect(() => {
    if (data) {
      setSelectedId(null);
      setSelectedActiveId(true);
      const activeVersion = Object.values(data)
        .map(historyItem => historyItem.versions)
        .flat()
        .find(({ active }) => active);

      const fullDate = ` ${getDayOfWeek(activeVersion.fullDate)} ${
        activeVersion.fullDate
      } ${activeVersion.hour}`;
      setCurrentActive({ id: activeVersion.id, date: fullDate });
      handleOnClick({ id: activeVersion.id, isActive: true, date: fullDate });
    }
  }, [data]);

  const renderNodes = () => {
    let dayOfWeek = 0;
    const weekArray = weekGenerator(NUMBER_OF_DAYS);
    const historyNodes = [];
    weekArray.forEach(i => {
      // Find and store each day's version points.
      const childNodes = [];
      // let fullDate;
      const isCurrentDate = dayOfWeek === 7;

      if (getNodeData(data, i)?.versions) {
        const versions = getNodeData(data, i).versions;
        versions.map(({ id, fullDate, hour }) => {
          const isSelectedNode = id === selectedId;
          const isActive = id === currentActive.id;
          let dateAttribute = `${formatDM(i)} / ${hour}`;
          const versionFullDate = ` ${getDayOfWeek(i)} ${fullDate} ${hour}`;

          childNodes.push(
            <Styled.ChildNode
              key={id}
              data-testid={versionFullDate}
              className={isSelectedNode ? 'isSelected' : ''}
              onClick={() => {
                setSelectedId(id);
                setSelectedActiveId(false);
                handleOnClick({ id, isActive, date: versionFullDate });
              }}
              date={dateAttribute}
            />
          );
        });
      }

      // Build all nodes
      if (!isCurrentDate) {
        historyNodes.push(
          <Styled.ParentNode
            data-testid={getDayOfWeek(i)}
            day={getDayOfWeek(i)}
            key={i}
            isCurrentDate={isCurrentDate}
          >
            {childNodes}
          </Styled.ParentNode>
        );
      } else {
        historyNodes.push(
          <Styled.CurrentNode
            key={i}
            data-testid="currentNode"
            isActiveNode={selectedActiveId}
            onClick={() => {
              setSelectedId(null);
              setSelectedActiveId(true);
              handleOnClick({
                id: currentActive.id,
                isActive: true,
                date: currentActive.date
              });
            }}
          />
        );
      }
      dayOfWeek += 1;
    });

    return historyNodes;
  };

  return renderNodes();
};

export default WeeklyNodes;
