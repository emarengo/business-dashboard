import React, { useEffect, useState } from 'react';

import Styled from './styled';

import { getDayOfWeek, formatDM, getNodeData, monthGenerator } from './utils';

const MonthlyNodes = ({ handleOnClick, data }) => {
  const [currentActive, setCurrentActive] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [selectedActiveId, setSelectedActiveId] = useState(true);
  const NUMBER_OF_WEEKS = 4;
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
    // Build the last 4 weeks of the month.
    const weekArray = monthGenerator(NUMBER_OF_WEEKS);
    let weekOfMonth = 0;

    const historyNodes = [];
    weekArray.forEach(item => {
      const childNodes = [];
      const weekDay = item.subNodes[0];
      const isCurrentDate = weekOfMonth === 4;
      // Find and store each day's versions
      item.subNodes.forEach(i => {
        if (getNodeData(data, i)?.versions) {
          const versions = getNodeData(data, i).versions;

          versions.map(({ id, fullDate, date, hour }) => {
            const isSelectedNode = id === selectedId;
            const isActive = id === currentActive.id;
            const dateAttribute = `${formatDM(i)} / ${hour}`;
            const versionFullDate = isActive
              ? ` ${getDayOfWeek(i)} ${fullDate} ${hour}`
              : `${getDayOfWeek(i)} ${date} / ${hour}`;

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
      });

      // Build all nodes
      if (!isCurrentDate) {
        historyNodes.push(
          <Styled.ParentNode
            data-testid={`${getDayOfWeek(weekDay)}-${weekOfMonth + 1}`}
            key={`${weekDay}`}
            day={`${getDayOfWeek(weekDay)} ${weekDay}`}
            isCurrentDate={isCurrentDate}
            isWeekNode
          >
            {childNodes}
          </Styled.ParentNode>
        );
      } else {
        historyNodes.push(
          <Styled.CurrentNode
            key={`${currentActive.date}`}
            data-testid="currentNode"
            isActiveNode={selectedActiveId}
            date={currentActive.date}
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
      weekOfMonth += 1;
    });

    return historyNodes;
  };

  return renderNodes();
};

export default MonthlyNodes;
