/* eslint-disable react/no-array-index-key */
import React from 'react';

import i18n from 'i18n';
import { IDataTable, DataTableItem, IDataTableColumn } from '../types';
import { Languages } from '../drivers/types';
import Styled from './styled';

const lang = Languages.English;
const Skeleton: React.FC = () => (
  <>
    <Styled.DataTableNotice>Loading shifts &hellip;</Styled.DataTableNotice>
    {Array.from({ length: 20 }).map((_, i) => (
      <Styled.DataTableRowSkeleton index={i} key={`dt_row_sklt_${i}`}>
        {Array.from({ length: 4 }).map((_, j) => (
          <Styled.DataTableColumnSkeleton key={`dt_col_sklt_${i}_${j}`} />
        ))}
      </Styled.DataTableRowSkeleton>
    ))}
  </>
);

const buildColumns = (): [string[], string[]] => {
  // create a column
  const availability: IDataTableColumn = {
    header: '',
    mapping: 'availability'
  };
  const name: IDataTableColumn = {
    header: i18n[lang].name,
    mapping: 'name'
  };
  const prioritization: IDataTableColumn = {
    header: '',
    mapping: 'prioritization'
  };
  const pla: IDataTableColumn = {
    header: `${i18n[lang].registration} / ${i18n[lang].plates} / ${i18n[lang].assignment}`,
    mapping: 'pla_checkin'
  };
  const buffer: IDataTableColumn = {
    header: i18n[lang].buffer,
    mapping: 'buffer'
  };
  const dlComment: IDataTableColumn = {
    header: i18n[lang].dl_comment,
    mapping: 'dl_comments'
  };

  // add the new column to the array
  const columns = [availability, name, prioritization, pla, buffer, dlComment];

  const headers = columns.map((column) => {
    return column.header;
  });
  const mappings = columns.map((column) => {
    return column.mapping;
  });

  return [headers, mappings];
};

function DataTable<T extends DataTableItem>({
  isLoading = false,
  items = [],
  currentShifts,
  onRowClick = function () {},
  onRenderCell,
  onRenderEmpty = () => null
}: IDataTable<T>): JSX.Element {
  const [headers, mappings] = buildColumns();

  const thead = React.useMemo(
    () => (
      <>
        {headers.map((header, i) => (
          <Styled.DataTableColumn key={`dt_h_${i}`}>
            {header}
          </Styled.DataTableColumn>
        ))}
      </>
    ),
    [headers]
  );

  const tbody = React.useMemo(
    () =>
      items?.length ? (
        <>
          {items.map((item, index) => (
            <Styled.DataTableRow
              onClick={() => onRowClick(item, index)}
              key={`dt_row_${index}`}
              index={index}
              currentShifts={currentShifts}
              offlineAlert={
                !!(
                  Number(item.driver_shift_total_unavailable_time) &&
                  Number(item.driver_shift_total_unavailable_time) > 1800
                )
              }
            >
              {mappings.map((prop, i) => (
                <Styled.DataTableColumn key={`dt_col_${i}`}>
                  {(() => {
                    if (onRenderCell) {
                      return onRenderCell(item, prop, index);
                    } else if (prop in item) {
                      return item[prop] as React.ReactChild;
                    }
                    return null;
                  })()}
                </Styled.DataTableColumn>
              ))}
            </Styled.DataTableRow>
          ))}
        </>
      ) : (
        onRenderEmpty()
      ),
    [items, mappings]
  );

  return (
    <Styled.DataTable currentShifts={currentShifts}>
      <Styled.DataTableHead currentShifts={currentShifts}>
        {thead}
      </Styled.DataTableHead>
      <Styled.DataTableBody>
        {isLoading ? <Skeleton /> : tbody}
      </Styled.DataTableBody>
    </Styled.DataTable>
  );
}

export default DataTable;
